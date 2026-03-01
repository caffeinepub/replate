import {
  Bell,
  Camera,
  ClipboardList,
  Heart,
  MapPin,
  Truck,
  UserCheck,
  Utensils,
} from "lucide-react";
import { motion } from "motion/react";

const roles = [
  {
    title: "Event Host",
    emoji: "🎉",
    color: "bg-secondary/10 text-secondary border-secondary/20",
    headerColor: "bg-secondary",
    steps: [
      { icon: UserCheck, text: "Create an account as 'Event Host'" },
      {
        icon: ClipboardList,
        text: "Post leftover food: name, quantity, veg/non-veg, cooked time",
      },
      { icon: MapPin, text: "Enter pickup location and expiry window" },
      { icon: Bell, text: "Get notified when a volunteer accepts & delivers" },
    ],
  },
  {
    title: "Volunteer",
    emoji: "🚴",
    color: "bg-primary/10 text-primary border-primary/20",
    headerColor: "bg-primary",
    steps: [
      {
        icon: UserCheck,
        text: "Register as a volunteer — quick ID verification",
      },
      { icon: ClipboardList, text: "Browse open pickup tasks in your area" },
      { icon: Truck, text: "Accept, pick up the food, and head to the NGO" },
      { icon: Camera, text: "Upload a proof photo on delivery" },
    ],
  },
  {
    title: "NGO / Orphanage",
    emoji: "🏠",
    color: "bg-primary/10 text-primary border-primary/20",
    headerColor: "bg-primary",
    steps: [
      { icon: UserCheck, text: "Register as an NGO — wait for admin approval" },
      {
        icon: ClipboardList,
        text: "Post food requirements: type, quantity, urgency, people count",
      },
      { icon: Heart, text: "Browse & claim available food listings near you" },
      { icon: Bell, text: "Track delivery status in real-time" },
    ],
  },
];

const timeline = [
  {
    time: "T+0",
    event: "Event host posts food listing on RePlate",
    icon: Utensils,
    color: "bg-secondary",
  },
  {
    time: "T+5m",
    event: "System notifies nearby volunteers",
    icon: Bell,
    color: "bg-primary",
  },
  {
    time: "T+15m",
    event: "Volunteer accepts and heads to pickup location",
    icon: Truck,
    color: "bg-primary",
  },
  {
    time: "T+45m",
    event: "Food collected, in transit to NGO",
    icon: Truck,
    color: "bg-secondary",
  },
  {
    time: "T+90m",
    event: "Food delivered. NGO confirms receipt.",
    icon: Heart,
    color: "bg-primary",
  },
  {
    time: "T+91m",
    event: "Impact recorded. CO₂ saved calculated.",
    icon: ClipboardList,
    color: "bg-primary",
  },
];

export default function HowItWorks() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-4 block">
            The Process
          </span>
          <h1 className="font-display text-5xl sm:text-6xl font-bold text-foreground mb-6">
            How RePlate Works
          </h1>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed">
            A transparent, end-to-end system connecting food donors with
            recipients — in under 90 minutes.
          </p>
        </motion.div>
      </section>

      {/* Role Walkthroughs */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {roles.map((role, i) => (
            <motion.div
              key={role.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className={`bg-card rounded-3xl border ${role.color} overflow-hidden shadow-card`}
            >
              <div
                className={`${role.headerColor} px-8 py-6 text-primary-foreground`}
              >
                <div className="text-4xl mb-2">{role.emoji}</div>
                <h2 className="font-display text-2xl font-bold">
                  {role.title}
                </h2>
              </div>
              <div className="p-8">
                <ol className="space-y-4">
                  {role.steps.map((step) => (
                    <li key={step.text} className="flex items-start gap-3">
                      <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <step.icon className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <p className="text-sm text-foreground leading-relaxed">
                        {step.text}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-accent/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl font-bold text-foreground mb-4">
              From Feast to Need in 90 Minutes
            </h2>
            <p className="text-muted-foreground text-lg">
              Here's what happens from the moment a listing goes live.
            </p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-16 top-0 bottom-0 w-0.5 bg-border" />
            <div className="space-y-8">
              {timeline.map((item, i) => (
                <motion.div
                  key={item.time}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="flex items-start gap-6"
                >
                  <div className="w-20 text-right shrink-0">
                    <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2 py-1 rounded-lg">
                      {item.time}
                    </span>
                  </div>
                  <div className="relative flex items-center justify-center">
                    <div
                      className={`h-8 w-8 rounded-full ${item.color} flex items-center justify-center z-10 shadow-sm`}
                    >
                      <item.icon className="h-4 w-4 text-primary-foreground" />
                    </div>
                  </div>
                  <div className="pt-1 pb-2">
                    <p className="text-sm font-medium text-foreground leading-relaxed">
                      {item.event}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-4xl font-bold text-foreground mb-4">
            Common Questions
          </h2>
        </motion.div>

        <div className="space-y-4">
          {[
            {
              q: "What types of events can use RePlate?",
              a: "Weddings, birthday parties, corporate events, conferences, religious gatherings — any event with leftover prepared food is eligible.",
            },
            {
              q: "How are volunteers verified?",
              a: "All volunteers submit a government-issued ID during registration. Our team verifies each application manually within 24 hours.",
            },
            {
              q: "Is there a minimum food quantity?",
              a: "We recommend at least 2kg or 2 litres of food. Smaller quantities may not justify a volunteer trip, but we never turn away a listing.",
            },
            {
              q: "What happens if food is not picked up?",
              a: "If no volunteer accepts a task within the listing's window, we notify the host so they can arrange alternative disposal or extend the window.",
            },
            {
              q: "Is RePlate free to use?",
              a: "Completely free for hosts, NGOs, and volunteers. We're funded by CSR grants and platform partnerships.",
            },
          ].map((faq, i) => (
            <motion.div
              key={faq.q}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
              className="bg-card rounded-2xl border border-border p-6 shadow-xs"
            >
              <h3 className="font-semibold text-foreground mb-2">{faq.q}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {faq.a}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
