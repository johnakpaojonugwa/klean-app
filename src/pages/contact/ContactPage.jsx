import Header from "@/components/layout/Header.jsx";
import Footer from "@/components/layout/Footer.jsx";
import ContactHero from "@/components/landing/ContactHero.jsx";
import ContactForm from "@/components/landing/ContactForm.jsx";

export default function Contact() {
    return (
        <div className="bg-white min-h-screen w-full">
            <Header />
            <main>
                <ContactHero />
                <ContactForm />
            </main>
            <Footer />
        </div>
    )
}