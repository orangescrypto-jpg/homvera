import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BadgeCheck, ChevronLeft, Eye, Shield } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function AdminVerifications() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [adminNotes, setAdminNotes] = useState("");
  const utils = trpc.useUtils();
  const { data: verifications, isLoading } = trpc.admin.verifications.useQuery(undefined, { enabled: user?.role === "admin" });
  const reviewVerification = trpc.admin.reviewVerification.useMutation({
    onSuccess: () => { toast.success("Verification reviewed."); utils.admin.verifications.invalidate(); },
  });

  if (user?.role !== "admin") {
    return <div className="min-h-screen bg-background"><Navbar /><div className="container py-20 text-center"><Shield className="w-16 h-16 mx-auto mb-4 opacity-30" /><p>Admin access required.</p></div><Footer /></div>;
  }

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    under_review: "bg-blue-100 text-blue-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8">
        <button onClick={() => navigate("/admin")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to Admin
        </button>
        <h1 className="text-2xl font-serif font-bold text-foreground mb-6 flex items-center gap-2">
          <BadgeCheck className="w-6 h-6" /> Verification Queue
        </h1>

        {isLoading ? (
          <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}</div>
        ) : verifications && verifications.length > 0 ? (
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary/50 border-b border-border">
                  <tr>
                    {["ID", "User ID", "Document Type", "Status", "Submitted", "Actions"].map(h => (
                      <th key={h} className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {verifications.map(v => (
                    <tr key={v.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium">#{v.id}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">User #{v.userId}</td>
                      <td className="px-4 py-3 text-sm capitalize text-muted-foreground">{v.documentType.replace("_", " ")}</td>
                      <td className="px-4 py-3">
                        <Badge className={`text-xs capitalize ${statusColors[v.status] ?? ""}`}>{v.status.replace("_", " ")}</Badge>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(v.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                              <Eye className="w-3 h-3" /> Review
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-lg">
                            <DialogHeader><DialogTitle>Review Verification #{v.id}</DialogTitle></DialogHeader>
                            <div className="space-y-4 mt-4">
                              <div>
                                <p className="text-sm font-medium mb-2">Document ({v.documentType.replace("_", " ")})</p>
                                <a href={v.documentUrl} target="_blank" rel="noopener noreferrer">
                                  <img src={v.documentUrl} alt="Document" className="max-h-48 rounded-lg border border-border object-contain w-full" />
                                </a>
                              </div>
                              {v.selfieUrl && (
                                <div>
                                  <p className="text-sm font-medium mb-2">Selfie with Document</p>
                                  <img src={v.selfieUrl} alt="Selfie" className="max-h-48 rounded-lg border border-border object-contain w-full" />
                                </div>
                              )}
                              <div>
                                <p className="text-sm font-medium mb-1">Admin Notes</p>
                                <Textarea placeholder="Optional notes for the user..." value={adminNotes} onChange={e => setAdminNotes(e.target.value)} rows={2} />
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                  onClick={() => reviewVerification.mutate({ id: v.id, status: "approved", userId: v.userId, adminNotes })}
                                  disabled={reviewVerification.isPending}
                                >
                                  Approve
                                </Button>
                                <Button
                                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                                  onClick={() => reviewVerification.mutate({ id: v.id, status: "rejected", userId: v.userId, adminNotes })}
                                  disabled={reviewVerification.isPending}
                                >
                                  Reject
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            <BadgeCheck className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium text-foreground">No pending verifications</p>
            <p className="text-sm mt-1">All verifications have been reviewed.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
