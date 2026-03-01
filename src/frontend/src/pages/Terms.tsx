import { motion } from "motion/react";

const sections = [
  {
    title: "1. Acceptance of Terms",
    content:
      "By using RePlate, you agree to these Terms & Conditions. If you do not agree, you may not use the platform. These terms apply to all users including event hosts, NGOs, volunteers, and administrators.",
  },
  {
    title: "2. User Accounts",
    content:
      "You must provide accurate information when registering. You are responsible for maintaining the security of your account. RePlate reserves the right to suspend or terminate accounts that violate these terms or engage in fraudulent activity.",
  },
  {
    title: "3. Food Safety Responsibility",
    content:
      "Event hosts are solely responsible for ensuring the food they list is safe for consumption. Food must be freshly cooked, properly stored, and listed within its safe consumption window. RePlate is not liable for illness caused by improperly handled food.",
  },
  {
    title: "4. Volunteer Conduct",
    content:
      "Volunteers agree to handle food with hygiene, deliver to the correct NGO, and upload proof of delivery. Misuse of the volunteer role — including theft, misrepresentation, or abandoning deliveries without notice — may result in permanent banning.",
  },
  {
    title: "5. NGO Verification",
    content:
      "NGOs must be legitimate registered organizations. Providing false organizational information is grounds for account termination and may be reported to authorities. RePlate admin reserves the right to approve or revoke NGO accounts.",
  },
  {
    title: "6. Prohibited Activities",
    content:
      "You may not use RePlate to list food for commercial sale, collect food under false pretenses, harass other users, violate food safety laws, or attempt to manipulate the platform's matching system.",
  },
  {
    title: "7. Intellectual Property",
    content:
      "All content, design, and code of RePlate is the intellectual property of the platform. You may not copy, reproduce, or commercially exploit any part of RePlate without written permission.",
  },
  {
    title: "8. Limitation of Liability",
    content:
      "RePlate acts as an intermediary and is not liable for actions taken by hosts, volunteers, or NGOs. We are not responsible for failed pickups, food safety incidents, or any damages arising from use of the platform.",
  },
  {
    title: "9. Governing Law",
    content:
      "These terms are governed by the laws of India. Any disputes shall be resolved in courts of competent jurisdiction in Mumbai, Maharashtra.",
  },
  {
    title: "10. Contact",
    content:
      "Questions? Contact us at aaryanhule1@gmail.com or +91 93226 53593.",
  },
];

export default function Terms() {
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-4xl font-bold text-foreground mb-3">
          Terms &amp; Conditions
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
