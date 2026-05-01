import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-16 max-w-4xl">
        <div className="mb-10">
          <p className="text-sm text-muted-foreground mb-2">Last updated: May 1, 2026</p>
          <h1 className="text-4xl font-serif font-bold text-foreground mb-4">Terms of Service</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            These Terms of Service govern your use of the Homvera NG platform. By accessing or using our services, you agree to be bound by these terms.
          </p>
        </div>

        <div className="prose prose-gray max-w-none space-y-8">
          {[
            {
              title: "1. Acceptance of Terms",
              content: "By creating an account or using Homvera NG, you confirm that you are at least 18 years old and have the legal capacity to enter into binding agreements. If you are using the platform on behalf of a business, you represent that you have authority to bind that business to these terms.",
            },
            {
              title: "2. Platform Description",
              content: "Homvera NG is an online marketplace that connects property buyers, sellers, renters, and service providers in Nigeria. We facilitate transactions but are not a party to any agreement between users. We provide tools including escrow payments, messaging, identity verification, and listing management.",
            },
            {
              title: "3. User Accounts & Roles",
              content: "Users may register as Buyers, Sellers, Agents, or Admins. Each role carries specific permissions and responsibilities. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use.",
            },
            {
              title: "4. Listing Rules",
              content: "All listings must be accurate, lawful, and not misleading. You may not list properties you do not own or have authority to list. Listings must comply with all applicable Nigerian laws including the Land Use Act. We reserve the right to remove any listing that violates these terms or applicable law.",
            },
            {
              title: "5. Escrow Payments",
              content: "Homvera NG uses Stripe to process escrow payments. When you initiate an escrow transaction, funds are held securely until delivery is confirmed by the buyer. Disputes are handled according to our Escrow Agreement. We charge a platform fee on completed transactions as disclosed at the time of payment.",
            },
            {
              title: "6. Identity Verification",
              content: "We may require identity verification for certain activities. You consent to the collection and processing of your identity documents for verification purposes. Verified status is displayed on your profile but does not constitute an endorsement by Homvera NG.",
            },
            {
              title: "7. Prohibited Activities",
              content: "You may not: use the platform for fraud or money laundering; post false or misleading listings; harass other users; circumvent our payment systems; scrape or copy our data; or violate any applicable law. Violations may result in immediate account termination.",
            },
            {
              title: "8. Intellectual Property",
              content: "All content on Homvera NG, including our logo, design, and software, is owned by Homvera NG Limited. You retain ownership of content you post but grant us a license to display and distribute it on our platform.",
            },
            {
              title: "9. Limitation of Liability",
              content: "Homvera NG is not liable for any indirect, incidental, or consequential damages arising from your use of the platform. Our total liability to you shall not exceed the fees paid by you in the 12 months preceding the claim.",
            },
            {
              title: "10. Governing Law",
              content: "These terms are governed by the laws of the Federal Republic of Nigeria. Any disputes shall be resolved by the courts of Lagos State, Nigeria.",
            },
            {
              title: "11. Changes to Terms",
              content: "We may update these terms at any time. We will notify you of significant changes via email or platform notification. Continued use of the platform after changes constitutes acceptance of the new terms.",
            },
            {
              title: "12. Contact",
              content: "For questions about these terms, contact us at legal@homvera.ng or write to Homvera NG Limited, Victoria Island, Lagos, Nigeria.",
            },
          ].map(section => (
            <section key={section.title}>
              <h2 className="text-xl font-serif font-semibold text-foreground mb-3">{section.title}</h2>
              <p className="text-muted-foreground leading-relaxed">{section.content}</p>
            </section>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
