import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  AlertTriangle, BadgeCheck, CheckCircle2, ChevronLeft, Clock, CreditCard,
  DollarSign, Lock, Shield, XCircle,
} from "lucide-react";
import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { toast } from "sonner";

const statusConfig = {
  pending: { label: "Pending", icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200" },
  funded: { label: "Funded", icon: Lock, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
  held: { label: "Held in Escrow", icon: Shield, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200" },
  released: { label: "Released", icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50", border: "border-green-200" },
  refunded: { label: "Refunded", icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50", border: "border-green-200" },
  disputed: { label: "Disputed", icon: AlertTriangle, color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" },
  resolved: { label: "Resolved", icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50", border: "border-green-200" },
};

export default function EscrowPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [disputeReason, setDisputeReason] = useState("");
  const [showDisputeForm, setShowDisputeForm] = useState(false);

  const bookingIdNum = parseInt(bookingId);
  const utils = trpc.useUtils();

  const { data: escrow, isLoading } = trpc.escrow.getByBooking.useQuery({ bookingId: bookingIdNum });

  const initiateMutation = trpc.escrow.initiate.useMutation({
    onSuccess: () => {
      toast.success("Escrow initiated!");
      utils.escrow.getByBooking.invalidate({ bookingId: bookingIdNum });
    },
  });

  const confirmDelivery = trpc.escrow.confirmDelivery.useMutation({
    onSuccess: () => {
      toast.success("Delivery confirmed! Funds are being released.");
      utils.escrow.getByBooking.invalidate({ bookingId: bookingIdNum });
    },
  });

  const openDispute = trpc.escrow.openDispute.useMutation({
    onSuccess: () => {
      toast.success("Dispute opened. Our team will review within 5 business days.");
      setShowDisputeForm(false);
      utils.escrow.getByBooking.invalidate({ bookingId: bookingIdNum });
    },
  });

  const { data: bookings } = trpc.bookings.myBookings.useQuery(undefined, { enabled: isAuthenticated });
  const booking = bookings?.find(b => b.id === bookingIdNum);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-20 text-center">
          <Shield className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-30" />
          <h1 className="text-2xl font-serif font-bold mb-2">Sign In Required</h1>
          <Button asChild><a href={getLoginUrl()}>Sign In</a></Button>
        </div>
        <Footer />
      </div>
    );
  }

  const status = escrow?.status ?? "pending";
  const config = statusConfig[status as keyof typeof statusConfig] ?? statusConfig.pending;
  const StatusIcon = config.icon;
  const isBuyer = escrow?.buyerId === user?.id || booking?.buyerId === user?.id;
  const isSeller = escrow?.sellerId === user?.id || booking?.sellerId === user?.id;

  const handleInitiateCheckout = async () => {
    if (!booking) return;
    // Initiate escrow record first
    const newEscrow = await initiateMutation.mutateAsync({
      bookingId: bookingIdNum,
      sellerId: booking.sellerId,
      amount: booking.totalAmount ?? "0",
      currency: "USD",
    });

    if (!newEscrow) return;

    // Create Stripe checkout session
    toast.info("Redirecting to secure payment...");
    try {
      const response = await fetch("/api/stripe/create-escrow-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          escrowId: newEscrow.id,
          bookingId: bookingIdNum,
          amount: parseFloat(booking.totalAmount ?? "100"),
          currency: "usd",
          listingTitle: `Booking #${bookingIdNum}`,
          buyerEmail: user?.email,
          origin: window.location.origin,
        }),
      });
      const { url } = await response.json();
      if (url) {
        window.open(url, "_blank");
      } else {
        toast.error("Failed to create payment session.");
      }
    } catch (err) {
      toast.error("Payment service unavailable. Please try again.");
    }
  };

  const steps = [
    { label: "Initiate Escrow", done: !!escrow, active: !escrow },
    { label: "Fund Payment", done: ["funded", "held", "released", "refunded", "resolved"].includes(status), active: escrow && status === "pending" },
    { label: "Seller Delivers", done: ["released", "refunded", "resolved"].includes(status), active: status === "funded" || status === "held" },
    { label: "Confirm & Release", done: status === "released" || status === "resolved", active: status === "funded" || status === "held" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8 max-w-2xl">
        <button onClick={() => navigate("/dashboard/bookings")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to Bookings
        </button>

        <h1 className="text-2xl font-serif font-bold text-foreground mb-2">Escrow Payment</h1>
        <p className="text-muted-foreground mb-6">Booking #{bookingId} — Secured by Stripe</p>

        {/* Status Card */}
        <Card className={`border ${config.border} ${config.bg} mb-6`}>
          <CardContent className="p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full ${config.bg} border ${config.border} flex items-center justify-center`}>
              <StatusIcon className={`w-6 h-6 ${config.color}`} />
            </div>
            <div>
              <p className="font-semibold text-foreground">Status: {config.label}</p>
              {escrow?.amount && (
                <p className="text-sm text-muted-foreground">
                  Amount: <strong>${parseFloat(escrow.amount).toLocaleString()}</strong>
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Progress Steps */}
        <Card className="border-border mb-6">
          <CardHeader>
            <CardTitle className="text-base">Escrow Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {steps.map((step, i) => (
                <div key={step.label} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    step.done ? "bg-green-500 text-white" : step.active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}>
                    {step.done ? <BadgeCheck className="w-4 h-4" /> : <span className="text-xs font-bold">{i + 1}</span>}
                  </div>
                  <p className={`text-sm ${step.done ? "text-green-600 font-medium" : step.active ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                    {step.label}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="space-y-4">
          {/* Initiate Escrow */}
          {!escrow && isBuyer && (
            <Card className="border-border">
              <CardContent className="p-5">
                <h3 className="font-semibold text-foreground mb-2">Initiate Escrow Payment</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Your payment will be held securely until you confirm delivery. Amount: ₦{parseFloat(booking?.totalAmount ?? "0").toLocaleString()}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                  <Lock className="w-3.5 h-3.5 text-green-600" />
                  <span>Powered by Stripe — your payment is fully protected</span>
                </div>
                <Button className="w-full gap-2" onClick={handleInitiateCheckout} disabled={initiateMutation.isPending}>
                  <CreditCard className="w-4 h-4" />
                  {initiateMutation.isPending ? "Processing..." : "Pay Securely with Stripe"}
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-2">
                  Test card: 4242 4242 4242 4242 · Any future date · Any CVV
                </p>
              </CardContent>
            </Card>
          )}

          {/* Confirm Delivery */}
          {escrow && (status === "funded" || status === "held") && isBuyer && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-5">
                <h3 className="font-semibold text-foreground mb-2">Confirm Delivery</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Has the seller fulfilled their obligations? Confirming will release the funds to the seller. This action is irreversible.
                </p>
                <Button
                  className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => confirmDelivery.mutate({ escrowId: escrow.id })}
                  disabled={confirmDelivery.isPending}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {confirmDelivery.isPending ? "Confirming..." : "Confirm & Release Funds"}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Open Dispute */}
          {escrow && (status === "funded" || status === "held") && (isBuyer || isSeller) && (
            <Card className="border-orange-200">
              <CardContent className="p-5">
                <h3 className="font-semibold text-foreground mb-2">Open a Dispute</h3>
                {!showDisputeForm ? (
                  <>
                    <p className="text-sm text-muted-foreground mb-3">
                      Is there an issue with this transaction? Open a dispute and our team will review within 5 business days.
                    </p>
                    <Button variant="outline" className="w-full gap-2 border-orange-300 text-orange-600 hover:bg-orange-50" onClick={() => setShowDisputeForm(true)}>
                      <AlertTriangle className="w-4 h-4" /> Open Dispute
                    </Button>
                  </>
                ) : (
                  <div className="space-y-3">
                    <Label>Reason for Dispute</Label>
                    <Textarea
                      placeholder="Describe the issue in detail..."
                      value={disputeReason}
                      onChange={e => setDisputeReason(e.target.value)}
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <Button
                        className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
                        onClick={() => openDispute.mutate({ escrowId: escrow.id, reason: disputeReason })}
                        disabled={!disputeReason.trim() || openDispute.isPending}
                      >
                        {openDispute.isPending ? "Submitting..." : "Submit Dispute"}
                      </Button>
                      <Button variant="outline" onClick={() => setShowDisputeForm(false)}>Cancel</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Completed States */}
          {status === "released" && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-5 flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-green-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-green-800">Transaction Complete</p>
                  <p className="text-sm text-green-700">Funds have been released to the seller. Thank you for using Homvera NG!</p>
                </div>
              </CardContent>
            </Card>
          )}

          {status === "disputed" && (
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-5 flex items-center gap-3">
                <AlertTriangle className="w-8 h-8 text-orange-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-orange-800">Dispute Under Review</p>
                  <p className="text-sm text-orange-700">Our team is reviewing your dispute. We'll notify you within 5 business days.</p>
                  {escrow?.disputeReason && <p className="text-xs text-orange-600 mt-1">Reason: {escrow.disputeReason}</p>}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Security Notice */}
        <div className="mt-6 flex items-start gap-3 p-4 bg-secondary/50 rounded-xl">
          <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">Escrow Protection</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Your funds are held securely by Stripe until you confirm delivery. Homvera NG acts as an independent escrow agent to protect both parties.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
