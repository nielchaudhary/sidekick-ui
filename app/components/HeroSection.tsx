export default function HeroSection() {
  return (
    <section className="pt-20 pb-20 px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        {/* Headline */}
        <h1
          className="font-headline text-4xl md:text-4xl lg:text-5xl leading-tight tracking-tight text-black animate-fade-in-up"
          style={{ lineHeight: "1.1" }}
        >
          Your intelligent virtual sidekick
        </h1>

        {/* Description */}
        <p className="mt-8 text-lg md:text-xl text-gray-600 max-w-6xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200 font-semibold">
          Sidekick remembers what you said, why you said it, and what you decided. Ask anything—it gives you the data
          you need, with the context that matters.{" "}
          <span className="font-bold text-gray-800">Like a human sidekick that never forgets.</span>
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animation-delay-300">
          <button className="bg-black text-white font-medium px-6 py-2 rounded-xl hover:bg-gray-800 transition-colors text-base cursor-pointer">
            Join the Waitlist
          </button>
          <button className="text-gray-600 font-medium px-6 py-2 rounded-xl border cursor-pointer border-gray-200 hover:border-gray-300 hover:text-black transition-colors text-base">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}
