export default function HeroSection() {
  return (
    <section className="pt-32 pb-20 px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        {/* Headline */}
        <h1
          className="font-headline text-4xl md:text-4xl lg:text-5xl leading-tight tracking-tight text-black animate-fade-in-up"
          style={{ lineHeight: "1.1" }}
        >
          Your intelligent virtual sidekick
        </h1>

        {/* Description */}
        <p className="mt-8 text-lg md:text-xl text-gray-600 max-w-6xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
          The thinking partner that remembers. For operators who make decisions under pressure, Sidekick holds your
          context, surfaces what&apos;s relevant, and helps you reason faster.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animation-delay-300">
          <button className="bg-black text-white font-medium px-8 py-3.5 rounded-lg hover:bg-gray-800 transition-colors text-base">
            Join the Waitlist
          </button>
          <button className="text-gray-600 font-medium px-8 py-3.5 rounded-lg border border-gray-200 hover:border-gray-300 hover:text-black transition-colors text-base">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}
