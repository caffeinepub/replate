import { Eye, Heart, Leaf, Target, TrendingUp, Users } from "lucide-react";
import { motion } from "motion/react";

const values = [
  {
    icon: Heart,
    title: "Compassion First",
    desc: "We believe no food should go to waste while people go hungry. Every action on our platform is driven by empathy.",
  },
  {
    icon: Target,
    title: "Zero Waste Mission",
    desc: "Our goal is a world where event surplus reaches those in need within hours — not days, not never.",
  },
  {
    icon: Eye,
    title: "Radical Transparency",
    desc: "Donors track every delivery. NGOs know what's coming. Volunteers see the impact. No black boxes.",
  },
  {
    icon: Leaf,
    title: "Environmental Impact",
    desc: "Food waste accounts for 8% of global greenhouse gas emissions. We're tackling that problem one meal at a time.",
  },
];

const team = [
  {
    name: "Aaryan Hule",
    role: "Founder & CEO",
    bio: "Passionate about using technology to solve social problems. Founded RePlate after witnessing massive food waste at his cousin's wedding.",
    emoji: "🚀",
  },
  {
    name: "Meera Nair",
    role: "Head of NGO Partnerships",
    bio: "10 years in the development sector. Connected over 200 NGOs to RePlate's network across Maharashtra.",
    emoji: "🤝",
  },
  {
    name: "Rahul Verma",
    role: "Head of Volunteers",
    bio: "Former logistics professional turned social entrepreneur. Built the volunteer training and verification program.",
    emoji: "🏃",
  },
  {
    name: "Aisha Patel",
    role: "Tech Lead",
    bio: "Full-stack engineer and former Zomato tech alumni. Built the real-time tracking system that powers RePlate.",
    emoji: "💻",
  },
];

export default function About() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-4 block">
              Our Story
            </span>
            <h1 className="font-display text-5xl sm:text-6xl font-bold text-foreground leading-tight mb-6">
              We started with <span className="text-primary">one wedding</span>{" "}
              and <span className="text-secondary">40kg</span> of wasted food.
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              In 2024, our founder watched 40 kilograms of freshly cooked food
              being thrown away at the end of a wedding reception — while an
              orphanage just 2km away struggled to feed 80 children that night.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              That disconnect broke something in us. So we built RePlate — a
              platform that closes the gap between surplus and need, using
              technology, community, and a whole lot of heart.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { icon: Users, value: "12,000+", label: "Meals Delivered" },
              { icon: Heart, value: "285+", label: "Partner NGOs" },
              { icon: TrendingUp, value: "890+", label: "Active Volunteers" },
              { icon: Leaf, value: "4.2T", label: "CO₂ Saved (kg)" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                className="bg-card rounded-2xl p-6 border border-border shadow-card"
              >
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <p className="font-display text-3xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-accent/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl font-bold text-foreground mb-4">
              Our Values
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              These aren't just words. They shape every product decision, every
              partnership, every line of code.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-card rounded-2xl p-6 border border-border shadow-card"
              >
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <v.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display font-bold text-foreground mb-2">
                  {v.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {v.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl font-bold text-foreground mb-4">
            Meet the Team
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            A small team with a big mission — eliminating food waste across
            India, one delivery at a time.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-card rounded-2xl p-6 border border-border shadow-card text-center"
            >
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-3xl mx-auto mb-4">
                {member.emoji}
              </div>
              <h3 className="font-display font-bold text-foreground">
                {member.name}
              </h3>
              <p className="text-xs text-primary font-semibold mb-3">
                {member.role}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {member.bio}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
