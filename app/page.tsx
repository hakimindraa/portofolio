import Navbar from "@/app/components/Navbar";
import Hero from "@/app/components/Hero";
import About from "@/app/components/About";
import Services from "@/app/components/Services";
import Gallery from "@/app/components/Gallery";
import Contact from "@/app/components/Contact";
import Footer from "@/app/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Gallery />
      <Contact />
      <Footer />
    </>
  );
}
