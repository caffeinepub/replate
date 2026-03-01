import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone } from "lucide-react";
import { SiLinkedin } from "react-icons/si";

export default function Contact() {
  return (
    <section id="contact" className="py-20 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
              Contact Us
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-6" />
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Let's discuss how we can work together to drive growth and
              innovation in your marketing initiatives.
            </p>
          </div>

          {/* Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Phone */}
            <Card className="shadow-card border-border/50 hover:shadow-lg transition-all hover:-translate-y-1">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  Phone
                </h3>
                <a
                  href="tel:+919823741455"
                  className="text-muted-foreground hover:text-primary transition-colors text-lg"
                >
                  +91-98237 41455
                </a>
              </CardContent>
            </Card>

            {/* Email */}
            <Card className="shadow-card border-border/50 hover:shadow-lg transition-all hover:-translate-y-1">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  Email
                </h3>
                <a
                  href="mailto:ashish91@gmail.com"
                  className="text-muted-foreground hover:text-primary transition-colors text-lg break-all"
                >
                  ashish91@gmail.com
                </a>
              </CardContent>
            </Card>

            {/* LinkedIn */}
            <Card className="shadow-card border-border/50 hover:shadow-lg transition-all hover:-translate-y-1">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <SiLinkedin className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  LinkedIn
                </h3>
                <p className="text-muted-foreground text-lg">Ashish Singh 🇮🇳</p>
              </CardContent>
            </Card>
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <Button
              size="lg"
              className="px-10 py-6 text-lg"
              onClick={() => {
                window.location.href = "mailto:ashish91@gmail.com";
              }}
            >
              Send a Message
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
