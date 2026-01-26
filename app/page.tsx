import Navbar from "./components/Navbar";
import NexusHero from "./components/NexusHero";
import FeatureSwitcher from "./components/FeatureSwitcher";

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      <NexusHero />
      <div className="max-w-8xl mx-auto">
        <FeatureSwitcher />
      </div>
    </main>
  );
}
