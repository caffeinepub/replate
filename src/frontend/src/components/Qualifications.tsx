import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";

const qualifications = [
  {
    degree: "PGDMC Marketing Communication",
    years: "2007-08",
    institution: "Symbiosis Institute of Business Management, Pune",
  },
  {
    degree: "MBA Marketing",
    years: "2004-06",
    institution: "Bharti Vidyapeeth, Pune",
  },
  {
    degree: "B.com Accounts",
    years: "1999-02",
    institution: "Ranchi University, Ranchi",
  },
];

export default function Qualifications() {
  return (
    <section id="qualifications" className="py-20 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
              Academic Qualifications
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto" />
          </div>

          {/* Qualifications List */}
          <div className="grid gap-6 md:gap-8">
            {qualifications.map((qual) => (
              <Card
                key={qual.degree}
                className="shadow-card border-border/50 hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6 md:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="shrink-0">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <GraduationCap className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div className="grow">
                      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-2">
                        <h3 className="font-display text-xl md:text-2xl font-semibold text-foreground">
                          {qual.degree}
                        </h3>
                        <span className="text-sm font-medium text-accent">
                          {qual.years}
                        </span>
                      </div>
                      <p className="text-base md:text-lg text-muted-foreground">
                        {qual.institution}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
