import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-16 max-w-4xl">
        <div className="mb-10">
          <p className="text-sm text-muted-foreground mb-2">Last updated: May 1, 2026</p>
          <h1 className="text-4xl font-serif font-bold text-foreground mb-4">Cookie Policy</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            This Cookie Policy explains how Homvera NG uses cookies and similar tracking technologies on our platform.
          </p>
        </div>
        <div className="space-y-8">
          {[
            { title: "1. What Are Cookies?", content: "Cookies are small text files stored on your device when you visit a website. They help websites remember your preferences, maintain your session, and collect analytics data. We also use similar technologies like local storage and session storage." },
            { title: "2. Essential Cookies", content: "These cookies are necessary for the platform to function. They include session cookies that keep you logged in, security cookies that protect against cross-site request forgery, and preference cookies that remember your settings. You cannot opt out of essential cookies." },
            { title: "3. Analytics Cookies", content: "We use analytics cookies to understand how users interact with our platform. This helps us improve performance and user experience. Analytics data is aggregated and anonymized. We use our own analytics infrastructure to collect this data." },
            { title: "4. Functional Cookies", content: "Functional cookies remember your preferences such as your preferred language, currency display, and search filters. These cookies enhance your experience but are not strictly necessary for the platform to work." },
            { title: "5. Third-Party Cookies", content: "Stripe, our payment processor, may set cookies when you use our payment features. Google Maps may set cookies when you view the map feature. These third parties have their own cookie policies which govern their use of cookies." },
            { title: "6. Managing Cookies", content: "You can control cookies through your browser settings. Most browsers allow you to view, delete, and block cookies. Note that blocking essential cookies will prevent you from using core platform features like logging in. To manage cookies, access your browser's privacy or security settings." },
            { title: "7. Cookie Duration", content: "Session cookies are deleted when you close your browser. Persistent cookies remain on your device for a set period: authentication cookies last 30 days, preference cookies last 1 year, and analytics cookies last up to 2 years." },
            { title: "8. Updates to This Policy", content: "We may update this Cookie Policy as we add new features or as regulations change. We will notify you of significant changes. Continued use of the platform after changes constitutes acceptance of the updated policy." },
            { title: "9. Contact", content: "For questions about our use of cookies, contact privacy@homvera.ng." },
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
