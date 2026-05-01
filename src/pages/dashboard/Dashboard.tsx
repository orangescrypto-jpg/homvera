import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  BadgeCheck, Bell, BookOpen, Building2, ChevronRight,
  Heart, MessageSquare, Plus, Shield, TrendingUp,
} from "lucide-react";
import { useLocation } from "wouter";

export default function Dashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();

  const { data: myListings } = trpc.listings.myListings.useQuery(undefined, { enabled: isAuthenticated });
  const { data: bookings } = trpc.bookings.myBookings.useQuery(undefined, { enabled: isAuthenticated });
  const { data: notifications } = trpc.notifications.list.useQuery(undefined, { enabled: isAuthenticated });
  const { data: savedListings } = trpc.listings.savedListings.useQuery(undefined, { enabled: isAuthenticated });
  const { data: verification } = trpc.verification.myStatus.useQuery(undefined, { enabled: isAuthenticated });

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-12">
          <div className="skeleton h-32 rounded-2xl mb-6" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-24 rounded-2xl" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-20 text-center">
          <Shield className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-30" />
          <h1 className="text-2xl font-serif font-bold mb-2">Sign In Required</h1>
          <p className="text-muted-foreground mb-6">Please sign in to access your dashboard.</p>
          <Button asChild><a href={getLoginUrl()}>Sign In</a></Button>
        </div>
        <Footer />
      </div>
    );
  }

  const unreadNotifications = notifications?.filter(n => !n.isRead).length ?? 0;
  const activeListings = myListings?.filter(l => l.status === "active").length ?? 0;
  const pendingBookings = bookings?.filter(b => b.status === "pending").length ?? 0;

  const quickActions = [
    { label: "Post Listing", icon: Plus, href: "/dashboard/listings/new", color: "bg-primary text-primary-foreground" },
    { label: "My Listings", icon: Building2, href: "/dashboard/listings", color: "bg-secondary text-secondary-foreground" },
    { label: "Messages", icon: MessageSquare, href: "/messages", color: "bg-secondary text-secondary-foreground" },
    { label: "Verify ID", icon: BadgeCheck, href: "/verify", color: "bg-secondary text-secondary-foreground" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-6 text-primary-foreground mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="w-14 h-14 border-2 border-primary-foreground/30">
              <AvatarImage src={user?.avatarUrl ?? undefined} />
              <AvatarFallback className="bg-primary-foreground/20 text-primary-foreground text-xl">
                {user?.name?.charAt(0)?.toUpperCase() ?? "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-serif font-bold">Welcome back, {user?.name?.split(" ")[0] ?? "there"}!</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30 capitalize text-xs">
                  {user?.userRole ?? "buyer"}
                </Badge>
                {user?.isVerified && (
                  <Badge className="bg-green-500/20 text-green-200 border-green-400/30 text-xs">
                    <BadgeCheck className="w-3 h-3 mr-1" /> Verified
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hidden sm:flex"
            onClick={() => navigate("/dashboard/profile")}
          >
            Edit Profile
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Active Listings", value: activeListings, icon: Building2, color: "text-primary", bg: "bg-primary/10", href: "/dashboard/listings" },
            { label: "Bookings", value: pendingBookings, icon: BookOpen, color: "text-blue-600", bg: "bg-blue-50", href: "/dashboard/bookings" },
            { label: "Saved", value: savedListings?.length ?? 0, icon: Heart, color: "text-red-500", bg: "bg-red-50", href: "/dashboard/saved" },
            { label: "Notifications", value: unreadNotifications, icon: Bell, color: "text-accent", bg: "bg-accent/10", href: "/dashboard/notifications" },
          ].map(stat => (
            <Card
              key={stat.label}
              className="border-border cursor-pointer hover:border-primary/30 hover:shadow-sm transition-all"
              onClick={() => navigate(stat.href)}
            >
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

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {quickActions.map(action => (
              <button
                key={action.label}
                onClick={() => navigate(action.href)}
                className={`${action.color} rounded-xl p-4 text-center font-medium text-sm transition-opacity hover:opacity-90`}
              >
                <action.icon className="w-5 h-5 mx-auto mb-2" />
                {action.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Bookings */}
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base font-semibold">Recent Bookings</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard/bookings")} className="text-xs text-primary gap-1">
                View All <ChevronRight className="w-3 h-3" />
              </Button>
            </CardHeader>
            <CardContent>
              {bookings && bookings.length > 0 ? (
                <div className="space-y-3">
                  {bookings.slice(0, 4).map(booking => (
                    <div key={booking.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <div>
                        <p className="text-sm font-medium">Booking #{booking.id}</p>
                        <p className="text-xs text-muted-foreground">{new Date(booking.createdAt).toLocaleDateString()}</p>
                      </div>
                      <Badge
                        variant={booking.status === "confirmed" ? "default" : booking.status === "completed" ? "secondary" : "outline"}
                        className="text-xs capitalize"
                      >
                        {booking.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No bookings yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Notifications */}
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base font-semibold">Notifications</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard/notifications")} className="text-xs text-primary gap-1">
                View All <ChevronRight className="w-3 h-3" />
              </Button>
            </CardHeader>
            <CardContent>
              {notifications && notifications.length > 0 ? (
                <div className="space-y-3">
                  {notifications.slice(0, 4).map(n => (
                    <div key={n.id} className={`flex gap-3 py-2 border-b border-border last:border-0 ${!n.isRead ? "opacity-100" : "opacity-60"}`}>
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!n.isRead ? "bg-primary" : "bg-muted-foreground"}`} />
                      <div>
                        <p className="text-sm font-medium">{n.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{n.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No notifications</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Verification Banner */}
        {!user?.isVerified && (
          <Card className="border-accent/30 bg-accent/5 mt-6">
            <CardContent className="p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                  <BadgeCheck className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Verify Your Identity</p>
                  <p className="text-sm text-muted-foreground">Get a verified badge and build trust with buyers and sellers.</p>
                </div>
              </div>
              <Button size="sm" onClick={() => navigate("/verify")} className="flex-shrink-0">
                Verify Now
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      <Footer />
    </div>
  );
}
