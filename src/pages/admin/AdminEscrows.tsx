import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronLeft, DollarSign, Shield } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function AdminEscrows() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [resolveNotes, setResolveNotes] = useState("");
  const utils = trpc.useUtils();
  const { data: escrows, isLoading } = trpc.admin.escrows.useQuery({ limit: 50, offset: 0 }, { enabled: user?.role === "admin" });
  const resolveDispute = trpc.admin.resolveDispute.useMutation({
    onSuccess: () => { toast.success("Dispute resolved."); utils.admin.escrows.invalidate(); },
  });

  if (user?.role !== "admin") {
    return <div className="min-h-screen bg-background"><Navbar /><div className="container py-20 text-center"><Shield className="w-16 h-16 mx-auto mb-4 opacity-30" /><p>Admin access required.</p></div><Footer /></div>;
  }

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    funded: "bg-blue-100 text-blue-800",
    held: "bg-purple-100 text-purple-800",
    released: "bg-green-100 text-green-800",
    refunded: "bg-green-100 text-green-800",
    disputed: "bg-red-100 text-red-800",
    resolved: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8">
        <button onClick={() => navigate("/admin")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to Admin
        </button>
        <h1 className="text-2xl font-serif font-bold text-foreground mb-6 flex items-center gap-2">
          <DollarSign className="w-6 h-6" /> Escrow Oversight
        </h1>

        {isLoading ? (
          <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}</div>
        ) : (
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary/50 border-b border-border">
                  <tr>
                    {["ID", "Booking", "Amount", "Currency", "Status", "Dispute Reason", "Actions"].map(h => (
                      <th key={h} className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {escrows?.map(e => (
                    <tr key={e.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium">#{e.id}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">#{e.bookingId}</td>
                      <td className="px-4 py-3 text-sm font-medium">{parseFloat(e.amount).toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{e.currency}</td>
                      <td className="px-4 py-3">
                        <Badge className={`text-xs capitalize ${statusColors[e.status] ?? ""}`}>{e.status}</Badge>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground max-w-40">
                        <span className="line-clamp-2">{e.disputeReason ?? "—"}</span>
                      </td>
                      <td className="px-4 py-3">
                        {e.status === "disputed" && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" className="h-7 text-xs">Resolve</Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader><DialogTitle>Resolve Dispute #{e.id}</DialogTitle></DialogHeader>
                              <div className="space-y-4 mt-4">
                                <p className="text-sm text-muted-foreground">Dispute reason: {e.disputeReason}</p>
                                <Textarea placeholder="Admin notes..." value={resolveNotes} onChange={ev => setResolveNotes(ev.target.value)} rows={3} />
                                <div className="flex gap-2">
                                  <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                    onClick={() => resolveDispute.mutate({ escrowId: e.id, resolution: "released", notes: resolveNotes })}>
                                    Release to Seller
                                  </Button>
                                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                                    onClick={() => resolveDispute.mutate({ escrowId: e.id, resolution: "refunded", notes: resolveNotes })}>
                                    Refund Buyer
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
