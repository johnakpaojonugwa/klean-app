import Header from "@/components/layout/Header.jsx";
import Footer from "@/components/layout/Footer.jsx";
import ServicesHero from "@/components/landing/ServicesHero.jsx";
import ServicesGrid from "@/components/landing/ServicesGrid.jsx";

export default function Services() {
    return (
        <div className="bg-white min-h-screen w-full">
            <Header />
            <main>
                <ServicesHero />
                <ServicesGrid />
            </main>
            <Footer />
        </div>
    )
}