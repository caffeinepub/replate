import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Award } from "lucide-react";

export default function Recognition() {
  return (
    <section id="recognition" className="py-20 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <Card className="shadow-card border-border/50 overflow-hidden">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2 gap-0">
                {/* Left side - Icon & Title */}
                <div className="bg-primary text-primary-foreground p-8 md:p-12 flex flex-col justify-center items-center text-center">
                  <div className="w-20 h-20 rounded-full bg-primary-foreground/20 flex items-center justify-center mb-6">
                    <Award className="h-10 w-10" />
                  </div>
                  <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                    Recognition & Awards
                  </h2>
                  <div className="w-16 h-1 bg-primary-foreground/40" />
                </div>

                {/* Right side - Content */}
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <p className="text-xl md:text-2xl font-display font-medium text-foreground mb-8 text-balance">
                    Marketing is all about creating a change towards growth and
                    development.
                  </p>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-accent mt-2 shrink-0" />
                      <p className="text-base text-muted-foreground">
                        <span className="font-semibold text-foreground">
                          Top Gun Award 2024
                        </span>{" "}
                        - Tata Tele Business Services
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-accent mt-2 shrink-0" />
                      <p className="text-base text-muted-foreground">
                        <span className="font-semibold text-foreground">
                          425% Growth Achievement
                        </span>{" "}
                        - Demand Generation Excellence
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-accent mt-2 shrink-0" />
                      <p className="text-base text-muted-foreground">
                        <span className="font-semibold text-foreground">
                          Redmi Bazaar Pioneer
                        </span>{" "}
                        - Nationally recognized marketing initiative
                      </p>
                    </div>
                  </div>

                  <Button
                    size="lg"
                    className="w-full sm:w-auto group"
                    onClick={() => {
                      document
                        .querySelector("#contact")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    <span>Read More</span>
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
