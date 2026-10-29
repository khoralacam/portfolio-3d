'use client';

import React, { useMemo, useEffect } from 'react';
import { Monitor, Tablet, Smartphone, RotateCw } from 'lucide-react';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';

export const LivePreview: React.FC = () => {
  const {
    files,
    activeFileId,
    previewVersion,
    viewportMode,
    setViewportMode,
    runProject,
    addLog,
  } = useWorkspaceStore();

  // Listen for console.log, console.error, and runtime errors from the sandboxed iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data || typeof data !== 'object') return;

      if (data.type === 'SANDBOX_LOG') {
        addLog(data.level || 'INFO', String(data.message));
      } else if (data.type === 'RUNTIME_ERROR') {
        addLog('ERROR', `Runtime Error: ${data.message}`);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [addLog]);

  const { srcDoc, isWebGLMode } = useMemo(() => {
    const fileList = Object.values(files).filter((f) => f.type === 'file');
    const activeFile = files[activeFileId];

    // 1. Find target HTML file (active .html file, or index.html, or any .html file)
    const htmlFile =
      (activeFile?.name.endsWith('.html') ? activeFile : undefined) ||
      fileList.find((f) => f.name === 'index.html') ||
      fileList.find((f) => f.name.endsWith('.html'));

    // 2. Gather all CSS files in workspace
    const cssContent = fileList
      .filter((f) => f.name.endsWith('.css'))
      .map((f) => f.content || '')
      .join('\n');

    // 3. Gather all JS/TS files in workspace (excluding starter Three.js if user wrote custom HTML)
    const jsFiles = fileList.filter(
      (f) => f.name.endsWith('.js') || f.name.endsWith('.ts')
    );

    const rawHtml = htmlFile?.content || '';
    // Strip accidental leading "// index.html" comment if present
    const cleanedHtml = rawHtml.replace(/^\/\/\s*.*\n/, '');

    // Check if the workspace is still using the starter Three.js WebGL canvas
    const usesStarterWebGL =
      cleanedHtml.includes('id="canvas-viewport"') &&
      Boolean(files['file-main-ts']);

    // Console bridge injected into every preview so console.log works in CONSOLE panel
    const consoleBridgeScript = `
      <script>
        (function() {
          const send = (level, args) => {
            try {
              const msg = Array.from(args).map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
              window.parent.postMessage({ type: 'SANDBOX_LOG', level, message: msg }, '*');
            } catch (e) {}
          };
          const origLog = console.log;
          const origWarn = console.warn;
          const origErr = console.error;
          console.log = function() { send('INFO', arguments); origLog.apply(console, arguments); };
          console.warn = function() { send('WARN', arguments); origWarn.apply(console, arguments); };
          console.error = function() { send('ERROR', arguments); origErr.apply(console, arguments); };
          window.addEventListener('error', function(e) {
            window.parent.postMessage({ type: 'RUNTIME_ERROR', message: e.message + ' (line ' + e.lineno + ')' }, '*');
          });
        })();
      </script>
    `;

    // CASE A: Starter Three.js WebGL Orb Mode
    if (usesStarterWebGL) {
      const mainTs = files['file-main-ts']?.content || '';
      const colorMatch = mainTs.match(/color:\s*(0x[0-9a-fA-F]+)/);
      const hexColor = colorMatch ? colorMatch[1] : '0xF5E642';

      return {
        isWebGLMode: true,
        srcDoc: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>${cssContent}</style>
  ${consoleBridgeScript}
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
</head>
<body>
  <canvas id="canvas-viewport"></canvas>
  <script>
    (function() {
      try {
        const canvas = document.getElementById('canvas-viewport');
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);

        const ringGeo = new THREE.RingGeometry(3.1, 3.13, 64);
        const ringMat = new THREE.MeshBasicMaterial({ color: ${hexColor}, side: THREE.DoubleSide, transparent: true, opacity: 0.2 });
        scene.add(new THREE.Mesh(ringGeo, ringMat));

        const geometry = new THREE.IcosahedronGeometry(2.3, 1);
        const wireframe = new THREE.WireframeGeometry(geometry);
        const lineMat = new THREE.LineBasicMaterial({ color: ${hexColor}, transparent: true, opacity: 0.85 });
        const orb = new THREE.LineSegments(wireframe, lineMat);
        scene.add(orb);

        const pointsMat = new THREE.PointsMaterial({ color: 0xFFFFFF, size: 0.09 });
        orb.add(new THREE.Points(geometry, pointsMat));

        camera.position.z = 6.2;

        window.addEventListener('resize', () => {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
        });

        function animate() {
          requestAnimationFrame(animate);
          orb.rotation.x += 0.004;
          orb.rotation.y += 0.007;
          renderer.render(scene, camera);
        }
        animate();
      } catch (err) {
        window.parent.postMessage({ type: 'RUNTIME_ERROR', message: err.message }, '*');
      }
    })();
  </script>
</body>
</html>`,
      };
    }

    // CASE B: Real Custom HTML / CSS / JS Execution Mode
    const customJsCode = jsFiles
      .filter((f) => f.id !== 'file-main-ts')
      .map((f) => f.content || '')
      .join('\n;\n');

    // If user wrote only a .js/.ts file without HTML, run the JS file directly
    if (!htmlFile && activeFile && (activeFile.name.endsWith('.js') || activeFile.name.endsWith('.ts'))) {
      return {
        isWebGLMode: false,
        srcDoc: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    body { background: #0d0d0d; color: #f5f5f5; font-family: 'JetBrains Mono', monospace; padding: 16px; }
  </style>
  ${consoleBridgeScript}
</head>
<body>
  <div id="app">Running ${activeFile.name}... Check Console output below.</div>
  <script>
    try {
      ${activeFile.content || ''}
    } catch (err) {
      console.error(err.message);
    }
  </script>
</body>
</html>`,
      };
    }

    // Standard HTML + CSS + JS injection
    const defaultDarkReset = `
      body {
        margin: 0;
        padding: 16px;
        background: #0d0d0d;
        color: #f5f5f5;
        font-family: system-ui, -apple-system, sans-serif;
      }
    `;

    let finalDoc = cleanedHtml;

    // If user wrote a full <!DOCTYPE html> or <html> document
    if (/<html[\s>]/i.test(finalDoc)) {
      if (/<\/head>/i.test(finalDoc)) {
        finalDoc = finalDoc.replace(
          /<\/head>/i,
          `<style>${defaultDarkReset}\n${cssContent}</style>${consoleBridgeScript}</head>`
        );
      } else {
        finalDoc = `${consoleBridgeScript}<style>${defaultDarkReset}\n${cssContent}</style>` + finalDoc;
      }

      if (customJsCode.trim()) {
        if (/<\/body>/i.test(finalDoc)) {
          finalDoc = finalDoc.replace(
            /<\/body>/i,
            `<script>\ntry {\n${customJsCode}\n} catch(err) { console.error(err.message); }\n</script></body>`
          );
        } else {
          finalDoc += `<script>\ntry {\n${customJsCode}\n} catch(err) { console.error(err.message); }\n</script>`;
        }
      }
    } else {
      // Partial HTML snippet
      finalDoc = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>${defaultDarkReset}\n${cssContent}</style>
  ${consoleBridgeScript}
</head>
<body>
  ${finalDoc}
  <script>
    try {
      ${customJsCode}
    } catch (err) {
      console.error(err.message);
    }
  </script>
</body>
</html>`;
    }

    return {
      isWebGLMode: false,
      srcDoc: finalDoc,
    };
  }, [files, activeFileId, previewVersion]);

  const widthClass =
    viewportMode === 'mobile'
      ? 'w-[375px]'
      : viewportMode === 'tablet'
      ? 'w-[768px]'
      : 'w-full';

  return (
    <section className="h-full bg-[#0d0d0d] flex flex-col justify-between font-mono select-none">
      {/* Top Preview Header */}
      <div className="h-9 bg-[#111111] border-b border-[#292929] px-3 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#36D399]" />
          <span className="font-bold text-[#F5F5F5]">LIVE PREVIEW</span>
          <span className="text-[#36D399]">
            {isWebGLMode ? '• 60 FPS' : '• DOM SANDBOX'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[#A3A3A3]">
          <button
            onClick={() => setViewportMode('desktop')}
            className={`p-1 rounded-sm ${
              viewportMode === 'desktop'
                ? 'text-[#FFD400] bg-[#1f1f1f]'
                : 'hover:text-[#F5F5F5]'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewportMode('tablet')}
            className={`p-1 rounded-sm ${
              viewportMode === 'tablet'
                ? 'text-[#FFD400] bg-[#1f1f1f]'
                : 'hover:text-[#F5F5F5]'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewportMode('mobile')}
            className={`p-1 rounded-sm ${
              viewportMode === 'mobile'
                ? 'text-[#FFD400] bg-[#1f1f1f]'
                : 'hover:text-[#F5F5F5]'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={runProject}
            title="Refresh Sandboxed Preview"
            className="p-1 hover:text-[#FFD400] ml-1"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Sandboxed Viewport Container */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-[#0d0d0d]">
        {isWebGLMode && (
          <div className="absolute top-3 left-3 z-10 bg-[#151515]/90 border border-[#292929] px-2.5 py-1.5 rounded-sm text-[11px] leading-tight pointer-events-none">
            <div className="text-[#FFD400] font-bold">RES: 544 × 604</div>
            <div className="text-[#A3A3A3]">VERTICES: 2,562</div>
          </div>
        )}

        <iframe
          key={previewVersion}
          title="Sandboxed Runtime Preview"
          sandbox="allow-scripts"
          srcDoc={srcDoc}
          className={`h-full ${widthClass} border-0 transition-all duration-200 bg-[#0d0d0d]`}
        />

        {isWebGLMode && (
          <div className="absolute bottom-2.5 right-3 z-10 text-[11px] text-[#A3A3A3] pointer-events-none">
            COORD: [0.00, 0.00, +6.20]
          </div>
        )}
      </div>
    </section>
  );
};

export default LivePreview;