import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BookOpen, ChevronLeft, Shield } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  confirmed: "bg-blue-100 text-blue-800 border-blue-200",
  completed: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
  disputed: "bg-orange-100 text-orange-800 border-orange-200",
};

export default function MyBookings() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const utils = trpc.useUtils();
  const { data: bookings, isLoading } = trpc.bookings.myBookings.useQuery();
  const updateStatus = trpc.bookings.updateStatus.useMutation({
    onSuccess: () => { toast.success("Booking updated!"); utils.bookings.myBookings.invalidate(); },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8">
        <button onClick={() => navigate("/dashboard")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to Dashboard
        </button>
        <h1 className="text-2xl font-serif font-bold text-foreground mb-6">My Bookings</h1>

        {isLoading ? (
          <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-24 rounded-2xl" />)}</div>
        ) : bookings && bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map(booking => (
              <Card key={booking.id} className="border-border">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-semibold text-foreground">Booking #{booking.id}</p>
                        <Badge className={`text-xs capitalize ${statusColors[booking.status] ?? ""}`}>
                          {booking.status}
                        </Badge>
                      </div>
                      {booking.message && (
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{booking.message}</p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Created: {new Date(booking.createdAt).toLocaleDateString()}</span>
                        {booking.totalAmount && <span>Amount: ₦{parseFloat(booking.totalAmount).toLocaleString()}</span>}
                        <span>{booking.buyerId === user?.id ? "You are the buyer" : "You are the seller"}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      {booking.status === "pending" && booking.sellerId === user?.id && (
                        <Button size="sm" onClick={() => updateStatus.mutate({ id: booking.id, status: "confirmed" })}>
                          Confirm
                        </Button>
                      )}
                      {booking.status === "confirmed" && booking.buyerId === user?.id && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1"
                          onClick={() => navigate(`/escrow/${booking.id}`)}
                        >
                          <Shield className="w-3.5 h-3.5" /> Escrow
                        </Button>
                      )}
                      {["pending", "confirmed"].includes(booking.status) && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive hover:text-destructive"
                          onClick={() => updateStatus.mutate({ id: booking.id, status: "cancelled" })}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium text-foreground">No bookings yet</p>
            <p className="text-sm mt-1">Browse listings and make a booking request.</p>
            <Button className="mt-4" onClick={() => navigate("/listings")}>Browse Listings</Button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
