import { Building2, Facebook, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                <Building2 className="w-5 h-5 text-accent-foreground" />
              </div>
              <span className="text-xl font-serif font-semibold text-background">
                Homvera<span className="text-accent"> NG</span>
              </span>
            </div>
            <p className="text-sm text-background/70 leading-relaxed mb-6">
              Nigeria's most trusted real estate and services marketplace. Find your perfect home, hire verified professionals, and transact securely with escrow.
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full bg-background/10 hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Marketplace */}
          <div>
            <h4 className="font-semibold text-background mb-4 text-sm uppercase tracking-wider">Marketplace</h4>
            <ul className="space-y-3">
              {[
                { label: "Browse Listings", href: "/listings" },
                { label: "Housing", href: "/listings?category=housing" },
                { label: "Services", href: "/listings?category=services" },
                { label: "Post a Listing", href: "/dashboard/listings/new" },
                { label: "Featured Properties", href: "/listings?featured=true" },
              ].map(item => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-background/70 hover:text-accent transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-semibold text-background mb-4 text-sm uppercase tracking-wider">Account</h4>
            <ul className="space-y-3">
              {[
                { label: "Dashboard", href: "/dashboard" },
                { label: "My Bookings", href: "/dashboard/bookings" },
                { label: "Saved Listings", href: "/dashboard/saved" },
                { label: "Messages", href: "/messages" },
                { label: "Identity Verification", href: "/verify" },
              ].map(item => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-background/70 hover:text-accent transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Contact */}
          <div>
            <h4 className="font-semibold text-background mb-4 text-sm uppercase tracking-wider">Legal & Support</h4>
            <ul className="space-y-3 mb-6">
              {[
                { label: "Terms of Service", href: "/terms" },
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Escrow Agreement", href: "/escrow-agreement" },
                { label: "Cookie Policy", href: "/cookies" },
              ].map(item => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-background/70 hover:text-accent transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-background/70">
                <Mail className="w-4 h-4 text-accent" />
                <span>support@homvera.ng</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-background/70">
                <Phone className="w-4 h-4 text-accent" />
                <span>+234 800 HOMVERA</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-background/70">
                <MapPin className="w-4 h-4 text-accent" />
                <span>Lagos, Nigeria</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="container py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-background/50">
            © {new Date().getFullYear()} Homvera NG. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-background/40">Secured by</span>
            <span className="text-xs font-semibold text-accent">Stripe Escrow</span>
            <span className="text-background/20">·</span>
            <span className="text-xs text-background/40">Powered by</span>
            <span className="text-xs font-semibold text-background/60">Homvera AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
