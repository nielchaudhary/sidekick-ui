import Navbar from "./components/Navbar";
import NexusHero from "./components/NexusHero";
import FeatureSwitcher from "./components/FeatureSwitcher";
import { WaitlistExperience } from "./components/WaitlistExperience";

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-black">
      <Navbar />
      <NexusHero />
      <div className="max-w-8xl mx-auto">
        <FeatureSwitcher />
      </div>
      <div className="mb-8 sm:mb-12 md:mb-16 lg:mb-20 xl:mb-24 2xl:mb-32">
        <WaitlistExperience />
      </div>
    </main>
  );
}
