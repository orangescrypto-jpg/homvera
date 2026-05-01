import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ListingCard from "@/components/ListingCard";
import { Building2, ChevronLeft, Heart } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function SavedListings() {
  const [, navigate] = useLocation();
  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.listings.savedListings.useQuery();
  const unsave = trpc.listings.unsave.useMutation({
    onSuccess: () => { toast.success("Removed from saved."); utils.listings.savedListings.invalidate(); },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8">
        <button onClick={() => navigate("/dashboard")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to Dashboard
        </button>
        <h1 className="text-2xl font-serif font-bold text-foreground mb-6">Saved Listings</h1>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-64 rounded-2xl" />)}
          </div>
        ) : data && data.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.map(({ listing }) => listing && (
              <ListingCard
                key={listing.id}
                listing={listing}
                isSaved={true}
                onSave={() => unsave.mutate({ listingId: listing.id })}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            <Heart className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium text-foreground">No saved listings</p>
            <p className="text-sm mt-1">Browse listings and save the ones you like.</p>
            <Button className="mt-4" onClick={() => navigate("/listings")}>Browse Listings</Button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
