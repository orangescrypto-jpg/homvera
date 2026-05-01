import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Bell, CheckCheck, ChevronLeft } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function Notifications() {
  const [, navigate] = useLocation();
  const utils = trpc.useUtils();
  const { data: notifications, isLoading } = trpc.notifications.list.useQuery();
  const markRead = trpc.notifications.markRead.useMutation({ onSuccess: () => utils.notifications.list.invalidate() });
  const markAllRead = trpc.notifications.markAllRead.useMutation({
    onSuccess: () => { toast.success("All marked as read."); utils.notifications.list.invalidate(); },
  });

  const typeIcons: Record<string, string> = {
    booking_request: "📅",
    escrow_released: "💰",
    verification_update: "✅",
    message: "💬",
    default: "🔔",
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8 max-w-2xl">
        <button onClick={() => navigate("/dashboard")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to Dashboard
        </button>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-serif font-bold text-foreground">Notifications</h1>
          {notifications && notifications.some(n => !n.isRead) && (
            <Button variant="outline" size="sm" className="gap-2" onClick={() => markAllRead.mutate()}>
              <CheckCheck className="w-4 h-4" /> Mark All Read
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}</div>
        ) : notifications && notifications.length > 0 ? (
          <div className="space-y-2">
            {notifications.map(n => (
              <Card
                key={n.id}
                className={`border-border cursor-pointer transition-colors hover:bg-secondary/30 ${!n.isRead ? "border-l-4 border-l-primary" : ""}`}
                onClick={() => !n.isRead && markRead.mutate({ id: n.id })}
              >
                <CardContent className="p-4 flex items-start gap-3">
                  <span className="text-xl flex-shrink-0">{typeIcons[n.type] ?? typeIcons.default}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${!n.isRead ? "text-foreground" : "text-muted-foreground"}`}>{n.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                  </div>
                  {!n.isRead && <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            <Bell className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium text-foreground">No notifications</p>
            <p className="text-sm mt-1">You're all caught up!</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
