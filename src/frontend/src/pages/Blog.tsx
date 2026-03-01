import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { motion } from "motion/react";

const articles = [
  {
    id: 1,
    title: "India Wastes 40% of Its Food — Here's Why That Has to Change",
    excerpt:
      "India produces enough food to feed its entire population twice over, yet nearly 40% is wasted before it reaches the plate. We break down the systemic causes and what RePlate is doing to fix them.",
    category: "Food Waste",
    author: "Aaryan Hule",
    date: "February 15, 2026",
    readTime: "6 min read",
    color: "bg-primary/10 text-primary",
    emoji: "🌾",
  },
  {
    id: 2,
    title: "The Real Cost of a Wedding: 300 Guests, 80kg of Wasted Food",
    excerpt:
      "The average Indian wedding wastes between 50–100kg of cooked food. We spoke to caterers, event managers, and an NGO director to understand how this happens — and how to stop it.",
    category: "Events",
    author: "Meera Nair",
    date: "January 28, 2026",
    readTime: "8 min read",
    color: "bg-secondary/10 text-secondary",
    emoji: "🎊",
  },
  {
    id: 3,
    title: "Meet Arjun: The Volunteer Who Has Done 200 Deliveries",
    excerpt:
      "Arjun Mehta, a 29-year-old software engineer from Pune, has completed over 200 food deliveries on RePlate in his spare time. This is his story.",
    category: "Community",
    author: "Rahul Verma",
    date: "January 10, 2026",
    readTime: "5 min read",
    color: "bg-primary/10 text-primary",
    emoji: "🏍️",
  },
  {
    id: 4,
    title: "Food Waste and Climate Change: The Connection You're Not Told",
    excerpt:
      "If food waste were a country, it would be the world's third-largest emitter of greenhouse gases. We explore the data and what community platforms can do at a local level.",
    category: "Environment",
    author: "Aisha Patel",
    date: "December 5, 2025",
    readTime: "7 min read",
    color: "bg-primary/10 text-primary",
    emoji: "🌍",
  },
];

export default function Blog() {
  return (
    <div className="overflow-x-hidden">
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-4 block">
            Stories & Insights
          </span>
          <h1 className="font-display text-5xl sm:text-6xl font-bold text-foreground mb-6">
            The RePlate Blog
          </h1>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed">
            Food waste awareness, volunteer stories, impact reports, and ideas
            on building a zero-waste India.
          </p>
        </motion.div>

        {/* Featured article */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card rounded-3xl border border-border overflow-hidden shadow-card mb-8 group hover:shadow-card-hover transition-shadow"
        >
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="bg-gradient-to-br from-primary/20 to-primary/5 p-12 flex items-center justify-center">
              <span className="text-8xl">{articles[0].emoji}</span>
            </div>
            <div className="p-10 flex flex-col justify-center">
              <span
                className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full mb-4 w-fit ${articles[0].color}`}
              >
                {articles[0].category}
              </span>
              <h2 className="font-display text-3xl font-bold text-foreground mb-4 leading-tight">
                {articles[0].title}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {articles[0].excerpt}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {articles[0].date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {articles[0].readTime}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-xl group-hover:text-primary transition-colors"
                >
                  Read More <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Article grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.slice(1).map((article, i) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-card rounded-2xl border border-border overflow-hidden shadow-card hover:shadow-card-hover transition-shadow group cursor-pointer"
            >
              <div className="bg-gradient-to-br from-muted to-muted/50 p-10 flex items-center justify-center">
                <span className="text-6xl">{article.emoji}</span>
              </div>
              <div className="p-6">
                <span
                  className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full mb-3 ${article.color}`}
                >
                  {article.category}
                </span>
                <h3 className="font-display font-bold text-foreground mb-3 leading-snug line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {article.readTime}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-xl h-7 px-2 text-xs group-hover:text-primary"
                  >
                    Read <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
