import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

export default function About() {
  return (
    <section id="about" className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
              Marketing Innovator & Growth Leader
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto" />
          </div>

          {/* Content */}
          <Card className="shadow-card border-border/50">
            <CardContent className="p-8 md:p-12 space-y-6">
              <p className="text-lg md:text-xl text-foreground/90 leading-relaxed">
                With over{" "}
                <span className="font-semibold text-primary">
                  18 years of experience
                </span>{" "}
                in B2C, B2B, retail digitization, and demand generation, Ashish
                Singh has driven marketing excellence across top brands like{" "}
                <span className="font-semibold">
                  Tata Tele Business Services, Xiaomi, LG, DishTV, MTS, Airtel,
                  Nitco Tiles, and Syntel Telecom
                </span>
                . He led transformative campaigns like Redmi Bazaar at Xiaomi,
                achieved{" "}
                <span className="font-bold text-accent">425% growth</span> in
                demand generation at Tata Tele, and was recognized with the{" "}
                <span className="font-bold text-accent">
                  Top Gun Award in 2024
                </span>
                . Ashish champions marketing without advertising, focusing on
                seamless, personalized customer experiences while fostering
                innovation and community building.
              </p>

              <p className="text-lg md:text-xl text-foreground/90 leading-relaxed">
                Ashish is also the founder of{" "}
                <span className="font-semibold text-primary">
                  World of Marketing
                </span>
                , a vibrant marketing community that connects professionals
                through social platforms, WhatsApp groups, and offline events.
              </p>

              <div className="pt-4">
                <a
                  href="https://theashishsingh.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors group"
                >
                  <span>Explore his journey at theashishsingh.com</span>
                  <ExternalLink className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
