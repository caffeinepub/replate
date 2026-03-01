import { Link } from "@/lib/router";
import { Heart, Leaf, Mail, Phone } from "lucide-react";
import { SiFacebook, SiInstagram, SiX } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl overflow-hidden shadow-sm">
                <img
                  src="/assets/generated/replate-logo-transparent.dim_200x200.png"
                  alt="RePlate"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-display font-bold text-lg text-foreground">
                  RePlate
                </p>
                <p className="text-xs text-muted-foreground">
                  Leftovers → Lifesavers
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Connecting event hosts, NGOs, and volunteers to eliminate food
              waste and fight hunger across communities.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <SiFacebook className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <SiInstagram className="h-4 w-4" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="X (Twitter)"
              >
                <SiX className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <p className="font-semibold text-sm text-foreground mb-4">
              Platform
            </p>
            <ul className="space-y-2.5">
              {[
                { href: "/", label: "Home" },
                { href: "/about", label: "About Us" },
                { href: "/how-it-works", label: "How It Works" },
                { href: "/blog", label: "Blog" },
                { href: "/contact", label: "Contact" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Actions */}
          <div>
            <p className="font-semibold text-sm text-foreground mb-4">
              Quick Actions
            </p>
            <ul className="space-y-2.5">
              {[
                { href: "/register", label: "Donate Food" },
                { href: "/register", label: "Request Food" },
                { href: "/register", label: "Become a Volunteer" },
                { href: "/dashboard/admin", label: "Admin Panel" },
              ].map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="font-semibold text-sm text-foreground mb-4">
              Contact Us
            </p>
            <ul className="space-y-3">
              <li>
                <a
                  href="tel:9322653593"
                  className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Phone className="h-3.5 w-3.5 text-primary" />
                  </div>
                  +91 93226 53593
                </a>
              </li>
              <li>
                <a
                  href="mailto:aaryanhule1@gmail.com"
                  className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail className="h-3.5 w-3.5 text-primary" />
                  </div>
                  aaryanhule1@gmail.com
                </a>
              </li>
            </ul>

            {/* Environment badge */}
            <div className="mt-5 flex items-center gap-2 bg-primary/10 rounded-xl px-3 py-2">
              <Leaf className="h-4 w-4 text-primary shrink-0" />
              <span className="text-xs text-primary font-medium">
                Zero food waste initiative
              </span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} RePlate. All rights reserved.
            </p>
            <div className="flex items-center gap-3">
              <Link
                href="/privacy"
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                Privacy Policy
              </Link>
              <span className="text-muted-foreground text-xs">·</span>
              <Link
                href="/terms"
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                Terms & Conditions
              </Link>
            </div>
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            Built with <Heart className="h-3 w-3 text-red-500 fill-red-500" />{" "}
            using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors underline underline-offset-2"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
