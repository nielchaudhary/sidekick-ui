import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FeatureSwitcher from "./components/FeatureSwitcher";

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      <div className="max-w-8xl mx-auto">
        <HeroSection />
        <FeatureSwitcher />
      </div>
    </main>
  );
}
