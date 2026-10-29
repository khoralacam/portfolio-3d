

import HeroSection from "@/components/sections/HeroSection";
import EngineeringSection from "@/components/sections/EngineeringSection";
import TechStackMatrix from "@/components/sections/TechStackMatrix";
import ProjectsSection from "@/components/sections/ProjectsSection";
import CodeLabSection from "@/components/sections/CodeLabSection";
import AiBackgroundLabSection from "@/components/sections/AiBackgroundLabSection";
import GamesSection from "@/components/sections/GamesSection";
import ContactSection from "@/components/sections/ContactSection";




export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#eab308] selection:text-black">
      {/* Hero Section */}
      <HeroSection />

      {/* Engineering / Architecture Section */}
      <EngineeringSection />
      <TechStackMatrix/>
      <ProjectsSection/>
      <CodeLabSection/>
      <AiBackgroundLabSection/>
      <GamesSection/>
      <ContactSection/>

      {/* Aage ke sections yahan aage aayenge */}
    </main>
  );
}