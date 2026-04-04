import Header from "@/components/layout/Header.jsx";
import Hero from "@/components/landing/Hero.jsx";
import How from "@/components/landing/How.jsx";
import About from "@/components/landing/About.jsx";
import Services from "@/components/landing/Services.jsx";
import Benefits from "@/components/landing/Benefits.jsx";
import Testimonials from "@/components/landing/Testimonials.jsx";
import Statistics from "@/components/landing/Statistics.jsx";
import Blog from "@/components/landing/Blog.jsx";
import Footer from "@/components/layout/Footer.jsx";

export default function Home() {
    return (
        <div className="min-h-screen w-full bg-white selection:bg-[#26C1C9] selection:text-white">
            <Header />
            <main>
                <Hero />
                <How />
                <About />
                <Services />
                <Statistics />
                <Benefits />
                <Testimonials />
                <div className="pb-20 bg-[#F8FAFC]">
                    <Blog />
                </div>
            </main>
            <Footer />
        </div>
    );
}