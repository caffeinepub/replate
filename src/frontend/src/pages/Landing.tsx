import { Button } from "@/components/ui/button";
import { usePlatformStats } from "@/hooks/useQueries";
import { Link } from "@/lib/router";
import {
  ArrowRight,
  CheckCircle,
  ChevronRight,
  Heart,
  Leaf,
  Package,
  Star,
  Truck,
  Users,
  Utensils,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

// Animated counter hook
function useCountUp(end: number, duration = 1500, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - (1 - progress) ** 3;
      setCount(Math.floor(ease * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration, start]);
  return count;
}

function StatCard({
  value,
  label,
  suffix = "",
  icon: Icon,
  delay = 0,
}: {
  value: number;
  label: string;
  suffix?: string;
  icon: React.ElementType;
  delay?: number;
}) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const count = useCountUp(value, 1800, visible);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.3 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="flex flex-col items-center text-center p-6"
    >
      <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <p className="font-display text-4xl font-bold text-foreground tabular-nums">
        {count.toLocaleString()}
        {suffix}
      </p>
      <p className="text-sm text-muted-foreground mt-1 font-medium">{label}</p>
    </motion.div>
  );
}

const howItWorks = [
  {
    step: "01",
    icon: Utensils,
    title: "Post Leftover Food",
    description:
      "Event hosts post details of surplus food — what it is, how much, where to pick it up, and how long it's fresh.",
    color: "bg-primary/10 text-primary",
  },
  {
    step: "02",
    icon: Truck,
    title: "Volunteer Picks Up",
    description:
      "Verified volunteers in your area see the post, accept the task, and collect the food from the event location.",
    color: "bg-secondary/10 text-secondary",
  },
  {
    step: "03",
    icon: Heart,
    title: "NGO Receives",
    description:
      "NGOs and orphanages receive fresh food delivered directly to their door. Hot meals, zero waste.",
    color: "bg-primary/10 text-primary",
  },
];

const features = [
  {
    icon: CheckCircle,
    title: "Real-time Tracking",
    desc: "Track every delivery from pickup to delivery with live status updates.",
  },
  {
    icon: Users,
    title: "Verified Network",
    desc: "All volunteers and NGOs are verified before joining the platform.",
  },
  {
    icon: Package,
    title: "Zero Waste Goal",
    desc: "We match surplus food with need in real-time, minimizing spoilage.",
  },
  {
    icon: Leaf,
    title: "CO₂ Impact",
    desc: "Every saved meal reduces food waste emissions. Track your impact.",
  },
];

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Wedding Planner",
    text: "We had 50kg of untouched food after a wedding. RePlate connected us with a volunteer in minutes. The food reached an orphanage the same night.",
    stars: 5,
  },
  {
    name: "Fr. Thomas D'Souza",
    role: "St. Joseph's Orphanage",
    text: "RePlate has been a blessing. We now receive fresh, nutritious food 3–4 times a week from events nearby. Our 120 children are better fed than ever.",
    stars: 5,
  },
  {
    name: "Arjun Mehta",
    role: "Volunteer",
    text: "I volunteer on weekends. The app makes it so easy to find pickup tasks near me. I've done 47 deliveries and it genuinely feels like making a difference.",
    stars: 5,
  },
];

export default function Landing() {
  const { data: stats } = usePlatformStats();

  const foodSaved = Number(stats?.totalFoodSaved ?? 0);
  const ngosServed = Number(stats?.totalNgosServed ?? 0);
  const deliveries = Number(stats?.totalDeliveriesCompleted ?? 0);
  const volunteers = Number(stats?.totalVolunteersActive ?? 0);

  return (
    <div className="overflow-x-hidden">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden hero-gradient">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/generated/hero-food-redistribution.dim_1200x600.jpg"
            alt="Community food sharing"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-semibold mb-6"
            >
              <Leaf className="h-3.5 w-3.5" />
              India's #1 Food Redistribution Platform
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-foreground leading-[1.05] mb-6"
            >
              Leftovers{" "}
              <span className="text-primary relative">
                →
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary/40 rounded-full" />
              </span>{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Lifesavers
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-10 max-w-xl"
            >
              RePlate connects wedding feasts, birthday parties, and corporate
              events with NGOs and orphanages that need food — powered by a
              community of passionate volunteers.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-wrap gap-3"
            >
              <Link href="/register">
                <Button
                  size="lg"
                  className="rounded-2xl h-12 px-6 text-base bg-primary hover:bg-primary/90 shadow-glow"
                >
                  <Utensils className="mr-2 h-4 w-4" />
                  Donate Food
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-2xl h-12 px-6 text-base border-secondary text-secondary hover:bg-secondary/10"
                >
                  <Heart className="mr-2 h-4 w-4" />
                  Need Food
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="lg"
                  variant="ghost"
                  className="rounded-2xl h-12 px-6 text-base"
                >
                  <Users className="mr-2 h-4 w-4" />
                  Volunteer
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Floating cards */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="absolute right-8 top-1/3 hidden lg:block"
        >
          <div className="glass-card rounded-2xl p-4 shadow-card w-56">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-8 w-8 rounded-xl bg-primary/20 flex items-center justify-center">
                <Utensils className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs font-semibold">New food listed</p>
                <p className="text-xs text-muted-foreground">2 mins ago</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">
                15 kg Biryani
              </span>{" "}
              — ready for pickup in Andheri West
            </p>
          </div>
        </motion.div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────── */}
      <section className="py-16 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-border">
            <StatCard
              value={foodSaved || 12400}
              label="KG Food Saved"
              suffix="+"
              icon={Package}
              delay={0}
            />
            <StatCard
              value={ngosServed || 285}
              label="NGOs Served"
              suffix="+"
              icon={Heart}
              delay={0.1}
            />
            <StatCard
              value={deliveries || 3600}
              label="Deliveries Done"
              suffix="+"
              icon={Truck}
              delay={0.2}
            />
            <StatCard
              value={volunteers || 890}
              label="Active Volunteers"
              suffix="+"
              icon={Users}
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-3 block">
            Simple Process
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
            How RePlate Works
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Three simple steps connect surplus food with hungry mouths, powered
            by our community of volunteers.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary/30 via-secondary/30 to-primary/30" />

          {howItWorks.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative bg-card rounded-3xl p-8 border border-border shadow-card hover:shadow-card-hover transition-shadow group"
            >
              <div className="text-6xl font-display font-black text-muted/20 absolute top-4 right-6 leading-none select-none">
                {step.step}
              </div>
              <div
                className={`h-12 w-12 rounded-2xl ${step.color} flex items-center justify-center mb-6`}
              >
                <step.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-3">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/how-it-works">
            <Button variant="outline" className="rounded-2xl">
              Learn More <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────── */}
      <section className="py-24 bg-accent/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-3 block">
              Enterprise Features
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Built for Scale
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-card rounded-2xl p-6 border border-border shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1 group"
              >
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display font-bold text-foreground mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-3 block">
            Real Stories
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Community Voices
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="bg-card rounded-3xl p-8 border border-border shadow-card"
            >
              <div className="flex gap-1 mb-4">
                <Star className="h-4 w-4 text-secondary fill-secondary" />
                <Star className="h-4 w-4 text-secondary fill-secondary" />
                <Star className="h-4 w-4 text-secondary fill-secondary" />
                <Star className="h-4 w-4 text-secondary fill-secondary" />
                <Star className="h-4 w-4 text-secondary fill-secondary" />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6 italic">
                "{t.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {t.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-primary rounded-4xl p-12 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(0.75_0.18_55/0.3),transparent_60%)]" />
          <div className="relative z-10">
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-primary-foreground mb-4">
              Ready to Make a Difference?
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
              Join 890+ volunteers and 285 NGOs already on RePlate. Every meal
              saved is a life touched.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/register">
                <Button
                  size="lg"
                  className="rounded-2xl bg-white text-primary hover:bg-white/90 shadow-md h-12 px-8"
                >
                  Join RePlate Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-2xl border-white/50 text-white hover:bg-white/10 h-12 px-8"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
