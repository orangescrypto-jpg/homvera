import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Building2, ChevronLeft, Edit, MapPin, Plus, Trash2 } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  draft: "bg-gray-100 text-gray-800",
  rejected: "bg-red-100 text-red-800",
  sold: "bg-blue-100 text-blue-800",
  rented: "bg-purple-100 text-purple-800",
};

const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&q=80",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&q=80",
];

export default function MyListings() {
  const [, navigate] = useLocation();
  const utils = trpc.useUtils();
  const { data: listings, isLoading } = trpc.listings.myListings.useQuery();
  const deleteListing = trpc.listings.delete.useMutation({
    onSuccess: () => { toast.success("Listing deleted."); utils.listings.myListings.invalidate(); },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8">
        <button onClick={() => navigate("/dashboard")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to Dashboard
        </button>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-serif font-bold text-foreground">My Listings</h1>
          <Button onClick={() => navigate("/dashboard/listings/new")} className="gap-2">
            <Plus className="w-4 h-4" /> New Listing
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-64 rounded-2xl" />)}
          </div>
        ) : listings && listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {listings.map(listing => {
              const images: string[] = listing.images ? JSON.parse(listing.images) : [];
              const img = images[0] ?? PLACEHOLDER_IMAGES[listing.id % PLACEHOLDER_IMAGES.length];
              return (
                <Card key={listing.id} className="border-border overflow-hidden">
                  <div className="relative h-40 bg-muted">
                    <img src={img} alt={listing.title} className="w-full h-full object-cover" />
                    <Badge className={`absolute top-2 left-2 text-xs capitalize ${statusColors[listing.status] ?? ""}`}>
                      {listing.status}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-sm text-foreground mb-1 line-clamp-1">{listing.title}</h3>
                    {listing.city && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                        <MapPin className="w-3 h-3" /> {listing.city}, {listing.state}
                      </div>
                    )}
                    <p className="text-sm font-bold text-primary mb-3">
                      ₦{parseFloat(listing.price).toLocaleString()}
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1 gap-1" onClick={() => navigate(`/listings/${listing.id}`)}>
                        <Edit className="w-3 h-3" /> View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive hover:text-destructive"
                        onClick={() => {
                          if (confirm("Delete this listing?")) deleteListing.mutate({ id: listing.id });
                        }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            <Building2 className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium text-foreground">No listings yet</p>
            <p className="text-sm mt-1">Post your first property or service listing.</p>
            <Button className="mt-4 gap-2" onClick={() => navigate("/dashboard/listings/new")}>
              <Plus className="w-4 h-4" /> Create Listing
            </Button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
