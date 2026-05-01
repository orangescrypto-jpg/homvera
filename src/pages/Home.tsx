import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ListingCard from "@/components/ListingCard";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  ChevronRight,
  Home as HomeIcon,
  Lock,
  MapPin,
  MessageSquare,
  Search,
  Shield,
  Star,
  TrendingUp,
  Wrench,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("all");

  const { data: featuredListings, isLoading } = trpc.listings.featured.useQuery();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (searchCategory !== "all") params.set("category", searchCategory);
    navigate(`/listings?${params.toString()}`);
  };

  const stats = [
    { label: "Active Listings", value: "12,000+", icon: Building2 },
    { label: "Verified Agents", value: "3,500+", icon: BadgeCheck },
    { label: "Secure Transactions", value: "₦2.4B+", icon: Lock },
    { label: "Happy Clients", value: "45,000+", icon: Star },
  ];

  const features = [
    {
      icon: Shield,
      title: "Escrow-Protected Payments",
      description: "Every transaction is secured with Stripe escrow. Funds are held safely until delivery is confirmed.",
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      icon: BadgeCheck,
      title: "Verified Identities",
      description: "All agents and sellers go through rigorous ID verification — NIN, BVN, and document checks.",
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      icon: MessageSquare,
      title: "Real-Time Messaging",
      description: "Communicate directly with sellers, agents, and service providers through our secure chat system.",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      icon: Zap,
      title: "AI-Powered Assistant",
      description: "Our Homvera AI helps you find the perfect property, answers listing questions, and guides you through the process.",
      color: "text-accent",
      bg: "bg-accent/10",
    },
    {
      icon: MapPin,
      title: "Interactive Map Search",
      description: "Explore properties on an interactive Google Maps view with neighborhood boundaries and directions.",
      color: "text-red-500",
      bg: "bg-red-50",
    },
    {
      icon: TrendingUp,
      title: "Market Analytics",
      description: "Access real-time market data, price trends, and neighborhood insights to make informed decisions.",
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  const categories = [
    { label: "Apartments", icon: Building2, query: "?category=housing&propertyType=apartment", count: "4,200+" },
    { label: "Houses", icon: HomeIcon, query: "?category=housing&propertyType=house", count: "2,800+" },
    { label: "Shortlets", icon: Star, query: "?category=housing&propertyType=shortlet", count: "1,100+" },
    { label: "Repairs", icon: Wrench, query: "?category=services&propertyType=repairs", count: "890+" },
    { label: "Cleaning", icon: Zap, query: "?category=services&propertyType=cleaning", count: "650+" },
    { label: "Land", icon: MapPin, query: "?category=housing&propertyType=land", count: "3,400+" },
  ];

  const testimonials = [
    {
      name: "Adaeze Okonkwo",
      role: "Property Buyer, Lagos",
      avatar: "A",
      text: "Homvera NG made finding my apartment in Lekki so easy. The escrow payment gave me complete peace of mind. I knew my money was safe until I moved in.",
      rating: 5,
    },
    {
      name: "Emeka Nwosu",
      role: "Real Estate Agent, Abuja",
      avatar: "E",
      text: "As an agent, the verification system and professional tools have helped me close more deals. My clients trust me more because of the verified badge.",
      rating: 5,
    },
    {
      name: "Fatima Aliyu",
      role: "Service Provider, Kano",
      avatar: "F",
      text: "I list my cleaning services here and get consistent bookings. The payment protection means I always get paid for completed work. Highly recommend!",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ── Hero Section ── */}
      <section className="hero-gradient text-white relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "40px 40px"
          }} />
        </div>

        <div className="container relative py-20 lg:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-6 bg-accent/20 text-accent border-accent/30 hover:bg-accent/30">
              <BadgeCheck className="w-3 h-3 mr-1" />
              Nigeria's Most Trusted Property Platform
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight mb-6">
              Find Your Perfect
              <span className="block text-accent">Home in Nigeria</span>
            </h1>

            <p className="text-lg md:text-xl text-white/80 mb-10 leading-relaxed max-w-2xl mx-auto">
              Discover verified properties and trusted services across Nigeria. Every transaction protected by Stripe escrow — your money is safe until you're satisfied.
            </p>

            {/* Search Bar */}
            <div className="glass-card rounded-2xl p-2 flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto">
              <select
                value={searchCategory}
                onChange={e => setSearchCategory(e.target.value)}
                className="px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-accent sm:w-36"
              >
                <option value="all" className="text-foreground bg-background">All Types</option>
                <option value="housing" className="text-foreground bg-background">Housing</option>
                <option value="services" className="text-foreground bg-background">Services</option>
              </select>
              <input
                type="text"
                placeholder="Search by location, property type..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
                className="flex-1 px-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-accent text-sm"
              />
              <Button
                onClick={handleSearch}
                className="bg-accent text-accent-foreground hover:bg-accent/90 px-6 py-3 rounded-xl font-semibold"
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>

            {/* Quick links */}
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              {["Lagos", "Abuja", "Port Harcourt", "Ibadan", "Kano"].map(city => (
                <button
                  key={city}
                  onClick={() => navigate(`/listings?city=${city}`)}
                  className="text-sm text-white/70 hover:text-accent transition-colors flex items-center gap-1"
                >
                  <MapPin className="w-3 h-3" />
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z" fill="var(--background)" />
          </svg>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-12 bg-background">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map(stat => (
              <div key={stat.label} className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <p className="text-2xl md:text-3xl font-serif font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="py-16 bg-secondary/30">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-3">
              Browse by Category
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              From luxury apartments to professional services — find exactly what you need.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map(cat => (
              <button
                key={cat.label}
                onClick={() => navigate(`/listings${cat.query}`)}
                className="group bg-white rounded-2xl p-5 text-center border border-border hover:border-primary hover:shadow-lg transition-all duration-200 listing-card-hover"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 group-hover:bg-primary flex items-center justify-center mx-auto mb-3 transition-colors">
                  <cat.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <p className="font-semibold text-sm text-foreground">{cat.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{cat.count}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Listings ── */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">
                Featured Properties
              </h2>
              <p className="text-muted-foreground">Hand-picked premium listings across Nigeria</p>
            </div>
            <Button variant="ghost" onClick={() => navigate("/listings?featured=true")} className="hidden md:flex items-center gap-1 text-primary">
              View All <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden border border-border">
                  <div className="skeleton h-48 w-full" />
                  <div className="p-4 space-y-3">
                    <div className="skeleton h-4 w-3/4 rounded" />
                    <div className="skeleton h-4 w-1/2 rounded" />
                    <div className="skeleton h-6 w-1/3 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredListings && featuredListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredListings.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-muted-foreground">
              <Building2 className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">No featured listings yet</p>
              <p className="text-sm mt-1">Be the first to post a property!</p>
              <Button className="mt-4" onClick={() => navigate("/dashboard/listings/new")}>
                Post a Listing
              </Button>
            </div>
          )}

          <div className="text-center mt-8 md:hidden">
            <Button variant="outline" onClick={() => navigate("/listings")} className="gap-2">
              View All Listings <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-16 bg-secondary/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-3">
              Why Choose Homvera NG?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built from the ground up for the Nigerian market, with the security and features you need.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(feature => (
              <Card key={feature.title} className="border-border hover:border-primary/30 hover:shadow-md transition-all duration-200 group">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-2xl ${feature.bg} flex items-center justify-center mb-4`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 text-lg">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-3">
              How It Works
            </h2>
            <p className="text-muted-foreground">Simple, secure, and transparent — every step of the way.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Search & Discover", desc: "Browse thousands of verified listings by location, type, and budget.", icon: Search },
              { step: "02", title: "Connect & Chat", desc: "Message sellers and agents directly through our secure messaging system.", icon: MessageSquare },
              { step: "03", title: "Book & Pay Safely", desc: "Initiate an escrow payment. Your funds are held securely until delivery.", icon: Lock },
              { step: "04", title: "Confirm & Release", desc: "Once satisfied, confirm delivery and funds are released to the seller.", icon: BadgeCheck },
            ].map((item, i) => (
              <div key={item.step} className="text-center relative">
                {i < 3 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px border-t-2 border-dashed border-border" />
                )}
                <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center mx-auto mb-4 relative z-10">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <div className="text-xs font-bold text-accent mb-2 tracking-widest">{item.step}</div>
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-16 bg-secondary/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-3">
              Trusted by Thousands
            </h2>
            <p className="text-muted-foreground">Real stories from our community across Nigeria.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <Card key={t.name} className="border-border">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-foreground">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 hero-gradient text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            Ready to Find Your Perfect Home?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
            Join over 45,000 Nigerians who trust Homvera NG for their property needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold px-8"
              onClick={() => navigate("/listings")}
            >
              Browse Listings <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            {!isAuthenticated && (
              <Link href="/register">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 px-8"
                >
                  Create Free Account
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
