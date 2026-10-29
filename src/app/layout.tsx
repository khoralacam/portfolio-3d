import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import CustomCursor from "@/components/cursor/CustomCursor";
import LoadingScreen from "@/components/common/LoadingScreen";
import "./globals.css";

export const metadata = {
  title: "NAUSHAD",
  description: "Futuristic 3D Developer Portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-[#050505] text-white antialiased selection:bg-[#FFD600] selection:text-black">
        {/* Cinematic Loading Overlay */}
        <LoadingScreen />

        {/* Custom 3D Energy Trail Cursor */}
        <CustomCursor />

        {/* Fixed Futuristic Navbar */}
        <Navbar />

        {/* Main Content Pages */}
        <div className="pt-20">
          {children}
        </div>

        <Footer />
      </body>
    </html>
  );
}