export default function HeroSection() {
  return (
    <section className="pt-20 pb-20 px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        {/* Headline */}
        <h1
          className="font-headline text-4xl md:text-4xl lg:text-5xl leading-tight tracking-tight text-white animate-fade-in-up"
          style={{ lineHeight: "1.1" }}
        >
          Your intelligent virtual sidekick
        </h1>

        {/* Description */}
        <p
          className="mt-8 text-lg md:text-xl max-w-6xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200 font-semibold"
          style={{ color: "#A1A1AA" }}
        >
          Sidekick remembers what you said, why you said it, and what you decided. Ask anything—it gives you the data
          you need, with the context that matters.{" "}
          <span className="font-bold text-white">Like a human sidekick that never forgets.</span>
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animation-delay-300">
          <button
            className="text-white font-medium px-6 py-2 rounded-xl transition-all duration-200 text-base cursor-pointer"
            style={{
              background: "linear-gradient(90deg, #B34B71 0%, #8B2D5A 50%, #4A0404 100%)",
            }}
          >
            Join the Waitlist
          </button>
          <button
            className="font-medium px-6 py-2 rounded-xl cursor-pointer transition-colors text-base"
            style={{
              color: "#A1A1AA",
              border: "1px solid rgba(255, 255, 255, 0.12)",
            }}
          >
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}
