import Header from "@/components/layout/Header.jsx";
import Footer from "@/components/layout/Footer.jsx";
import AboutHero from "@/components/landing/AboutHero.jsx";
import AboutContent from "@/components/landing/AboutContent.jsx";
import MeetTeam from "@/components/landing/MeetTeam";
import AboutTestimonials from "@/components/landing/AboutTest";

export default function About() {
  return (
    <div className="bg-white min-h-screen w-full">
      <Header />
      <main>
        <AboutHero />
        <AboutContent />
        <MeetTeam />
        <div className="pb-20 bg-[#F8FAFC]">
          <AboutTestimonials />
        </div>
      </main>
      <Footer />
    </div>
  );
}
