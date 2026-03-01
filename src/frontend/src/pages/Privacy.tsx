import { motion } from "motion/react";

const sections = [
  {
    title: "1. Information We Collect",
    content:
      "We collect information you provide directly, such as your name, email address, phone number, and location when you register for RePlate. We also collect food listing data, delivery records, and usage analytics to improve our platform. We do not sell personal data.",
  },
  {
    title: "2. How We Use Your Information",
    content:
      "Your information is used to operate the RePlate platform, match food donors with recipients, communicate delivery updates, and improve our service quality. We may send email notifications about platform activity. You can unsubscribe at any time.",
  },
  {
    title: "3. Data Sharing",
    content:
      "We share minimal data necessary to facilitate food deliveries — such as a pickup address shared with an assigned volunteer. We do not share your information with advertisers or third-party data brokers. We may share aggregate, anonymized statistics for research purposes.",
  },
  {
    title: "4. Data Security",
    content:
      "All data is stored on the Internet Computer blockchain, which provides cryptographic security guarantees. We use end-to-end encryption for sensitive communications and require strong authentication for all accounts.",
  },
  {
    title: "5. Your Rights",
    content:
      "You may request access to, correction of, or deletion of your personal data at any time by contacting aaryanhule1@gmail.com. We will respond within 30 days. Account deletion removes your profile but delivery history may be retained for compliance purposes.",
  },
  {
    title: "6. Cookies",
    content:
      "We use minimal first-party cookies for authentication and session management. We do not use advertising or tracking cookies. You can disable cookies in your browser settings, though this may affect platform functionality.",
  },
  {
    title: "7. Contact",
    content:
      "Questions about this privacy policy? Contact us at aaryanhule1@gmail.com or +91 93226 53593.",
  },
];

export default function Privacy() {
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-4xl font-bold text-foreground mb-3">
          Privacy Policy
        </h1>
        <p className="text-muted-foreground text-sm mb-10">
          Last updated: February 1, 2026
        </p>

        <div className="prose prose-sm max-w-none text-muted-foreground space-y-8">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="font-display text-lg font-bold text-foreground mb-2">
                {section.title}
              </h2>
              <p className="leading-relaxed text-sm">{section.content}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
