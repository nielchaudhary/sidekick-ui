"use client";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="relative py-24 md:py-32">
      {/* Top Border */}
      <div className="border-t border-gray-800"></div>

      {/* Footer Content */}
      <div className="max-w-8xl mx-auto px-6 pt-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-6 lg:mb-10 2xl:mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="font-medium text-lg mb-2 lg:mb-3 2xl:mb-4">Sidekick</div>
            <p className="text-sm text-[var(--text-secondary)] max-w-xs">
              Intelligent memory for people who can&apos;t afford to forget.{" "}
            </p>
          </div>

          {/* Services */}
          <div>
            <div className="label mb-2 lg:mb-3 2xl:mb-4">Services</div>
            <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  Product Design
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  App Development
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  AI Integration
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  Landing Pages
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <div className="label mb-2 lg:mb-3 2xl:mb-4">Company</div>
            <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  About
                </a>
              </li>

              <li>
                <a href="#pricing" className="hover:text-white transition-colors">
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <div className="label mb-2 lg:mb-3 2xl:mb-4">Connect</div>
            <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
              <li>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Twitter / X
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a href="mailto:hello@runtimelabs.dev" className="hover:text-white transition-colors">
                  Email
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Border */}

      {/* Bottom Bar */}
      <div className="max-w-8xl mx-auto px-6 pt-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-[var(--text-secondary)]">
            &copy; {currentYear} Sidekick. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm text-[var(--text-secondary)]">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
