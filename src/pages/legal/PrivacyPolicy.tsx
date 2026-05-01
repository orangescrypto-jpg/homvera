import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-16 max-w-4xl">
        <div className="mb-10">
          <p className="text-sm text-muted-foreground mb-2">Last updated: May 1, 2026</p>
          <h1 className="text-4xl font-serif font-bold text-foreground mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            This Privacy Policy explains how Homvera NG collects, uses, and protects your personal information when you use our platform.
          </p>
        </div>
        <div className="space-y-8">
          {[
            { title: "1. Information We Collect", content: "We collect information you provide directly, such as your name, email address, phone number, and identity documents for verification. We also collect information automatically, including your IP address, browser type, pages visited, and transaction data. When you use our payment services, Stripe collects payment information on our behalf." },
            { title: "2. How We Use Your Information", content: "We use your information to provide and improve our services, process transactions, verify your identity, communicate with you about your account and listings, detect and prevent fraud, comply with legal obligations, and personalize your experience on the platform." },
            { title: "3. Information Sharing", content: "We do not sell your personal information. We share information with other users only as necessary to facilitate transactions (e.g., sharing your name and contact details with a counterparty). We share data with service providers like Stripe for payment processing and cloud storage providers. We may disclose information to comply with legal requirements." },
            { title: "4. Identity Verification Data", content: "Documents submitted for identity verification (NIN, BVN, passport, etc.) are stored securely and used solely for verification purposes. This data is retained for the duration of your account and for up to 7 years thereafter as required by Nigerian law." },
            { title: "5. Data Security", content: "We implement industry-standard security measures including encryption in transit and at rest, access controls, and regular security audits. However, no system is completely secure, and we cannot guarantee absolute security of your data." },
            { title: "6. Your Rights", content: "You have the right to access, correct, or delete your personal information. You may request a copy of your data or ask us to restrict processing. To exercise these rights, contact privacy@homvera.ng. We will respond within 30 days." },
            { title: "7. Cookies", content: "We use cookies and similar technologies to maintain your session, remember your preferences, and analyze platform usage. See our Cookie Policy for detailed information about the cookies we use and how to manage them." },
            { title: "8. Data Retention", content: "We retain your account data for as long as your account is active. After account deletion, we retain certain data for up to 7 years as required by Nigerian financial regulations. Transaction records are retained for legal compliance purposes." },
            { title: "9. Children's Privacy", content: "Our platform is not intended for users under 18 years of age. We do not knowingly collect personal information from minors. If we discover we have collected data from a minor, we will delete it promptly." },
            { title: "10. Contact Us", content: "For privacy-related questions or to exercise your rights, contact our Data Protection Officer at privacy@homvera.ng or write to Homvera NG Limited, Victoria Island, Lagos, Nigeria." },
          ].map(s => (
            <section key={s.title}>
              <h2 className="text-xl font-serif font-semibold text-foreground mb-3">{s.title}</h2>
              <p className="text-muted-foreground leading-relaxed">{s.content}</p>
            </section>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
