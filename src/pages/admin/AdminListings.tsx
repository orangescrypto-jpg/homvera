import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Building2, ChevronLeft, Shield, Star } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function AdminListings() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const utils = trpc.useUtils();
  const { data: listings, isLoading } = trpc.admin.listings.useQuery({ limit: 50, offset: 0 }, { enabled: user?.role === "admin" });
  const moderate = trpc.admin.moderateListing.useMutation({
    onSuccess: () => { toast.success("Listing updated."); utils.admin.listings.invalidate(); },
  });

  if (user?.role !== "admin") {
    return <div className="min-h-screen bg-background"><Navbar /><div className="container py-20 text-center"><Shield className="w-16 h-16 mx-auto mb-4 opacity-30" /><p>Admin access required.</p></div><Footer /></div>;
  }

  const statusColors: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    rejected: "bg-red-100 text-red-800",
    draft: "bg-gray-100 text-gray-800",
    sold: "bg-blue-100 text-blue-800",
    rented: "bg-purple-100 text-purple-800",
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8">
        <button onClick={() => navigate("/admin")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to Admin
        </button>
        <h1 className="text-2xl font-serif font-bold text-foreground mb-6 flex items-center gap-2">
          <Building2 className="w-6 h-6" /> Listing Moderation
        </h1>

        {isLoading ? (
          <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}</div>
        ) : (
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary/50 border-b border-border">
                  <tr>
                    {["Title", "Category", "Price", "City", "Status", "Featured", "Actions"].map(h => (
                      <th key={h} className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {listings?.map(l => (
                    <tr key={l.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium line-clamp-1 max-w-48">{l.title}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground capitalize">{l.category}</td>
                      <td className="px-4 py-3 text-sm font-medium">₦{parseFloat(l.price).toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{l.city ?? "—"}</td>
                      <td className="px-4 py-3">
                        <Badge className={`text-xs capitalize ${statusColors[l.status] ?? ""}`}>{l.status}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        {l.isFeatured ? <Star className="w-4 h-4 fill-accent text-accent" /> : <span className="text-muted-foreground text-xs">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" className="h-7 text-xs text-green-600 border-green-200 hover:bg-green-50"
                            onClick={() => moderate.mutate({ id: l.id, status: "active" })}>Approve</Button>
                          <Button size="sm" variant="outline" className="h-7 text-xs text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => moderate.mutate({ id: l.id, status: "rejected" })}>Reject</Button>
                          <Button size="sm" variant="outline" className="h-7 text-xs text-accent border-accent/30 hover:bg-accent/10"
                            onClick={() => moderate.mutate({ id: l.id, status: "active", isFeatured: !l.isFeatured })}>
                            {l.isFeatured ? "Unfeature" : "Feature"}
                          </Button>
                        </div>
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
