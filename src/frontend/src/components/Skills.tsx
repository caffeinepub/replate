import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  DollarSign,
  Handshake,
  Heart,
  MapPin,
  Store,
  Target,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";

const skills = [
  {
    title: "Strategic Marketing Leadership",
    description:
      "Over 18 years leading B2C and B2B marketing strategies, driving growth and innovation across industries.",
    icon: Target,
  },
  {
    title: "Demand Generation Expertise",
    description:
      "Achieved 425% growth in 2023 and Top Gun Award in 2024 at Tata Tele Business Services.",
    icon: TrendingUp,
    highlight: true,
  },
  {
    title: "Retail Marketing & Digitization",
    description:
      "Led 66% retail digitization at Xiaomi and pioneered Redmi Bazaar, a nationally recognized marketing initiative.",
    icon: Store,
    highlight: true,
  },
  {
    title: "Partner Marketing & Enablement",
    description:
      "Enabled partners through digital transformation, social media activation, and personalized content marketing.",
    icon: Users,
  },
  {
    title: "Budget Optimization & Cost Efficiency",
    description:
      "Reduced marketing costs by 50% through innovative vendor management and cost-effective campaigns.",
    icon: DollarSign,
  },
  {
    title: "Influence & Stakeholder Management",
    description:
      "Persuaded internal and external stakeholders to support innovative marketing strategies.",
    icon: Handshake,
  },
  {
    title: "Team Leadership & Development",
    description:
      "Managed large cross-functional teams, fostering innovation and exceeding performance goals.",
    icon: Trophy,
  },
  {
    title: "Event & Exhibition Management",
    description:
      "Organized high-profile events, dealer meets, and trade shows, enhancing brand visibility and engagement.",
    icon: Calendar,
  },
  {
    title: "Geographic Market Expertise",
    description:
      "Extensive experience in Mumbai, Maharashtra, Hyderabad, Vishakhapatnam, and upcountry markets.",
    icon: MapPin,
  },
  {
    title: "Community Building",
    description:
      "Founder of World of Marketing, a dynamic marketing community with a presence on social platforms and offline events.",
    icon: Heart,
  },
];

export default function Skills() {
  return (
    <section id="experience" className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
              Key Skills & Competencies
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto" />
          </div>

          {/* Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {skills.map((skill) => {
              const Icon = skill.icon;
              return (
                <Card
                  key={skill.title}
                  className={`shadow-card border-border/50 hover:shadow-lg transition-all hover:-translate-y-1 ${
                    skill.highlight ? "ring-2 ring-accent/50 bg-accent/5" : ""
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div
                        className={`shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${
                          skill.highlight
                            ? "bg-accent text-accent-foreground"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="font-display text-lg md:text-xl leading-tight">
                        {skill.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {skill.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
