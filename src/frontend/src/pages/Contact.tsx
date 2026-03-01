import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Mail, MapPin, Phone, Send } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    // Simulate submission
    setSubmitted(true);
    toast.success("Message sent! We'll get back to you within 24 hours.");
  };

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
            Get in Touch
          </span>
          <h1 className="font-display text-5xl sm:text-6xl font-bold text-foreground mb-6">
            Contact Us
          </h1>
          <p className="text-muted-foreground text-xl max-w-xl mx-auto">
            Have a question about RePlate? Want to partner with us? We'd love to
            hear from you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                Reach Us Directly
              </h2>
              <div className="space-y-4">
                <a
                  href="tel:9322653593"
                  className="flex items-start gap-4 p-4 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors group"
                >
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-0.5">
                      Phone
                    </p>
                    <p className="font-semibold text-foreground">
                      +91 93226 53593
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Mon–Sat, 9am–6pm IST
                    </p>
                  </div>
                </a>

                <a
                  href="mailto:aaryanhule1@gmail.com"
                  className="flex items-start gap-4 p-4 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors group"
                >
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-0.5">
                      Email
                    </p>
                    <p className="font-semibold text-foreground">
                      aaryanhule1@gmail.com
                    </p>
                    <p className="text-xs text-muted-foreground">
                      We reply within 24 hours
                    </p>
                  </div>
                </a>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-card border border-border">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-0.5">
                      Location
                    </p>
                    <p className="font-semibold text-foreground">
                      Mumbai, Maharashtra
                    </p>
                    <p className="text-xs text-muted-foreground">
                      India — serving nationwide
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Form embed note */}
            <div className="p-5 rounded-2xl bg-accent/50 border border-border">
              <p className="text-sm font-semibold text-foreground mb-2">
                🍽️ Want to Donate Food?
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                Use our quick Google Form to register your upcoming event and
                surplus food details.
              </p>
              <a
                href="https://forms.gle/placeholder"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="sm"
                  className="rounded-xl bg-primary text-xs w-full"
                >
                  Open Donation Form →
                </Button>
              </a>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="bg-card rounded-3xl border border-border p-8 shadow-card">
              {submitted ? (
                <div className="text-center py-16">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-muted-foreground">
                    Thank you for reaching out. We'll get back to you at{" "}
                    <span className="font-medium text-foreground">
                      {form.email}
                    </span>{" "}
                    within 24 hours.
                  </p>
                  <Button
                    className="mt-6 rounded-2xl"
                    variant="outline"
                    onClick={() => {
                      setSubmitted(false);
                      setForm({
                        name: "",
                        email: "",
                        subject: "",
                        message: "",
                      });
                    }}
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        placeholder="Aaryan Hule"
                        className="rounded-xl"
                        value={form.name}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, name: e.target.value }))
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        className="rounded-xl"
                        value={form.email}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, email: e.target.value }))
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="Partnership inquiry, NGO registration, etc."
                      className="rounded-xl"
                      value={form.subject}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, subject: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      rows={6}
                      placeholder="Tell us how we can help you..."
                      className="rounded-xl resize-none"
                      value={form.message}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, message: e.target.value }))
                      }
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full rounded-2xl h-11 bg-primary hover:bg-primary/90"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
