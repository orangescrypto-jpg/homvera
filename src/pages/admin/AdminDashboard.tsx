import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BadgeCheck, Building2, DollarSign, Shield, Users } from "lucide-react";
import { useLocation } from "wouter";

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const { data: stats } = trpc.admin.stats.useQuery(undefined, { enabled: user?.role === "admin" });

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-20 text-center">
          <Shield className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-30" />
          <h1 className="text-2xl font-serif font-bold mb-2">Admin Access Required</h1>
          <p className="text-muted-foreground">You don't have permission to access this page.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const statCards = [
    { label: "Total Users", value: stats?.users ?? 0, icon: Users, href: "/admin/users", color: "text-primary", bg: "bg-primary/10" },
    { label: "Total Listings", value: stats?.listings ?? 0, icon: Building2, href: "/admin/listings", color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Escrow Transactions", value: stats?.escrows ?? 0, icon: DollarSign, href: "/admin/escrows", color: "text-green-600", bg: "bg-green-50" },
    { label: "Pending Verifications", value: stats?.pendingVerifications ?? 0, icon: BadgeCheck, href: "/admin/verifications", color: "text-orange-600", bg: "bg-orange-50" },
  ];

  const adminLinks = [
    { label: "User Management", desc: "View, manage, and update user roles", href: "/admin/users", icon: Users },
    { label: "Listing Moderation", desc: "Approve, reject, or feature listings", href: "/admin/listings", icon: Building2 },
    { label: "Escrow Oversight", desc: "Monitor transactions and resolve disputes", href: "/admin/escrows", icon: DollarSign },
    { label: "Verification Queue", desc: "Review and approve identity verifications", href: "/admin/verifications", icon: BadgeCheck },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold text-foreground">Admin Panel</h1>
            <p className="text-sm text-muted-foreground">Homvera NG Platform Management</p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map(stat => (
            <Card key={stat.label} className="border-border cursor-pointer hover:border-primary/30 transition-all" onClick={() => navigate(stat.href)}>
              <CardContent className="p-5">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {adminLinks.map(link => (
            <Card key={link.label} className="border-border cursor-pointer hover:border-primary/30 hover:shadow-sm transition-all" onClick={() => navigate(link.href)}>
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <link.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{link.label}</p>
                  <p className="text-sm text-muted-foreground">{link.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
