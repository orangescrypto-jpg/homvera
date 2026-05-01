import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bell,
  Building2,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Search,
  Settings,
  Shield,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: notifications } = trpc.notifications.list.useQuery(undefined, {
    enabled: isAuthenticated,
    refetchInterval: 30000,
  });

  const unreadCount = notifications?.filter(n => !n.isRead).length ?? 0;

  const isActive = (path: string) => location === path || location.startsWith(path + "/");

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-serif font-semibold text-foreground">
              Homvera
              <span className="text-accent font-bold"> NG</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link href="/listings">
              <Button
                variant="ghost"
                size="sm"
                className={isActive("/listings") ? "bg-secondary text-primary font-medium" : "text-muted-foreground hover:text-foreground"}
              >
                Browse
              </Button>
            </Link>
            <Link href="/listings?category=housing">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                Housing
              </Button>
            </Link>
            <Link href="/listings?category=services">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                Services
              </Button>
            </Link>
            {isAuthenticated && (
              <Link href="/verify">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  Verify ID
                </Button>
              </Link>
            )}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <>
                {/* Messages */}
                <Link href="/messages">
                  <Button variant="ghost" size="icon" className="relative">
                    <MessageSquare className="w-5 h-5" />
                  </Button>
                </Link>

                {/* Notifications */}
                <Link href="/dashboard/notifications">
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center font-medium">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </Button>
                </Link>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 pl-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user?.avatarUrl ?? undefined} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                          {user?.name?.charAt(0)?.toUpperCase() ?? "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-left hidden lg:block">
                        <p className="text-sm font-medium leading-none">{user?.name ?? "User"}</p>
                        <p className="text-xs text-muted-foreground capitalize">{user?.userRole ?? "buyer"}</p>
                      </div>
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div>
                        <p className="font-medium">{user?.name}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <Link href="/dashboard">
                      <DropdownMenuItem>
                        <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/dashboard/profile">
                      <DropdownMenuItem>
                        <Settings className="w-4 h-4 mr-2" /> Profile Settings
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/dashboard/listings/new">
                      <DropdownMenuItem>
                        <Building2 className="w-4 h-4 mr-2" /> Post a Listing
                      </DropdownMenuItem>
                    </Link>
                    {user?.role === "admin" && (
                      <>
                        <DropdownMenuSeparator />
                        <Link href="/admin">
                          <DropdownMenuItem>
                            <Shield className="w-4 h-4 mr-2" /> Admin Panel
                          </DropdownMenuItem>
                        </Link>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
                      <LogOut className="w-4 h-4 mr-2" /> Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <a href={getLoginUrl()}>Sign In</a>
                </Button>
                <Button size="sm" className="bg-primary text-primary-foreground" asChild>
                  <a href={getLoginUrl()}>Get Started</a>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-white py-4">
          <div className="container flex flex-col gap-2">
            <Link href="/listings" onClick={() => setMobileOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">Browse Listings</Button>
            </Link>
            <Link href="/listings?category=housing" onClick={() => setMobileOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">Housing</Button>
            </Link>
            <Link href="/listings?category=services" onClick={() => setMobileOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">Services</Button>
            </Link>
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">Dashboard</Button>
                </Link>
                <Link href="/messages" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">Messages</Button>
                </Link>
                <Link href="/verify" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">Verify ID</Button>
                </Link>
                <Button variant="ghost" className="w-full justify-start text-destructive" onClick={logout}>
                  Sign Out
                </Button>
              </>
            ) : (
              <Button className="w-full" asChild>
                <a href={getLoginUrl()}>Sign In / Register</a>
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
