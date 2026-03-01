import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 -right-48 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-48 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Name */}
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-foreground animate-fade-in">
            Ashish Singh
          </h1>

          {/* Tagline */}
          <p className="text-xl sm:text-2xl md:text-3xl text-muted-foreground font-light max-w-3xl mx-auto animate-fade-in [animation-delay:200ms] opacity-0 [animation-fill-mode:forwards]">
            Generating demand in B2C, B2B, Partner and Retail Marketing.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 animate-fade-in [animation-delay:400ms] opacity-0 [animation-fill-mode:forwards]">
            <Button
              size="lg"
              className="text-base px-8 py-6"
              onClick={() => {
                document
                  .querySelector("#about")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Explore My Work
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-base px-8 py-6"
              onClick={() => {
                document
                  .querySelector("#contact")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Get In Touch
            </Button>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <ArrowDown className="h-6 w-6 text-muted-foreground" />
          </div>
        </div>
      </div>
    </section>
  );
}
