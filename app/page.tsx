import Navbar from "./components/Navbar";
import NexusHero from "./components/NexusHero";
import FeatureSwitcher from "./components/FeatureSwitcher";

export default function Home() {
  return (
    <main className="min-h-screen w-full relative">
      {/* Crimson Depth Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "radial-gradient(125% 125% at 50% 10%, #000000 40%, #2b0707 100%)",
        }}
      />
      <div className="relative z-10">
        <Navbar />
        <NexusHero />
        <div className="max-w-8xl mx-auto">
          <FeatureSwitcher />
        </div>
      </div>
    </main>
  );
}
