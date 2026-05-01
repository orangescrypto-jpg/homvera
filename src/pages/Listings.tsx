import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ListingCard from "@/components/ListingCard";
import { MapView } from "@/components/Map";
import {
  Building2,
  Filter,
  Grid3X3,
  LayoutList,
  Map,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function Listings() {
  const params = new URLSearchParams(window.location.search);
  const [, navigate] = useLocation();

  const [query, setQuery] = useState(params.get("q") ?? "");
  const [category, setCategory] = useState(params.get("category") ?? "");
  const [propertyType, setPropertyType] = useState(params.get("propertyType") ?? "");
  const [city, setCity] = useState(params.get("city") ?? "");
  const [viewMode, setViewMode] = useState<"grid" | "list" | "map">("grid");
  const [page, setPage] = useState(0);
  const limit = 12;

  const { data: listings, isLoading } = trpc.listings.search.useQuery({
    query: query || undefined,
    category: category || undefined,
    propertyType: propertyType || undefined,
    city: city || undefined,
    limit,
    offset: page * limit,
  });

  const saveMutation = trpc.listings.save.useMutation({
    onSuccess: () => toast.success("Listing saved!"),
  });

  const { isAuthenticated } = useAuth();

  const handleSave = (listingId: number) => {
    if (!isAuthenticated) { toast.error("Please sign in to save listings."); return; }
    saveMutation.mutate({ listingId });
  };

  const activeFilters = [
    category && { label: category, key: "category" },
    propertyType && { label: propertyType, key: "propertyType" },
    city && { label: city, key: "city" },
  ].filter(Boolean) as { label: string; key: string }[];

  const removeFilter = (key: string) => {
    if (key === "category") setCategory("");
    if (key === "propertyType") setPropertyType("");
    if (key === "city") setCity("");
  };

  const mapMarkers = useMemo(() => {
    if (!listings) return [];
    return listings.filter(l => l.latitude && l.longitude).map(l => ({
      id: l.id, lat: parseFloat(l.latitude!), lng: parseFloat(l.longitude!),
      title: l.title, price: l.price,
    }));
  }, [listings]);

  const propertyTypeOptions = category === "housing"
    ? ["apartment", "house", "land", "commercial", "shortlet"]
    : category === "services"
    ? ["cleaning", "repairs", "installation", "logistics", "other"]
    : ["apartment", "house", "land", "commercial", "shortlet", "cleaning", "repairs", "installation", "logistics", "other"];

  const FilterPanel = () => (
    <div className="space-y-5">
      <div>
        <Label className="text-sm font-semibold mb-2 block">Category</Label>
        <Select value={category || "all"} onValueChange={v => { setCategory(v === "all" ? "" : v); setPropertyType(""); }}>
          <SelectTrigger><SelectValue placeholder="All Categories" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="housing">Housing</SelectItem>
            <SelectItem value="services">Services</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="text-sm font-semibold mb-2 block">Property Type</Label>
        <Select value={propertyType || "all"} onValueChange={v => setPropertyType(v === "all" ? "" : v)}>
          <SelectTrigger><SelectValue placeholder="All Types" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {propertyTypeOptions.map(t => (
              <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="text-sm font-semibold mb-2 block">City</Label>
        <Input placeholder="e.g. Lagos, Abuja" value={city} onChange={e => setCity(e.target.value)} />
      </div>
      <Button variant="outline" className="w-full" onClick={() => { setCategory(""); setPropertyType(""); setCity(""); setQuery(""); }}>
        Clear All Filters
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="bg-secondary/30 border-b border-border py-8">
        <div className="container">
          <h1 className="text-3xl font-serif font-bold text-foreground mb-4">
            {category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Listings` : "All Listings"}
          </h1>
          <div className="flex gap-3 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, location..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && setPage(0)}
                className="pl-10"
              />
            </div>
            <Button onClick={() => setPage(0)}>Search</Button>
          </div>
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {activeFilters.map(f => (
                <Badge key={f.key} variant="secondary" className="gap-1 cursor-pointer capitalize" onClick={() => removeFilter(f.key)}>
                  {f.label} <X className="w-3 h-3" />
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="container py-6">
        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-card rounded-2xl border border-border p-5 sticky top-20">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" /> Filters
              </h3>
              <FilterPanel />
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-muted-foreground">
                {isLoading ? "Searching..." : `${listings?.length ?? 0} listing${listings?.length !== 1 ? "s" : ""} found`}
              </p>
              <div className="flex items-center gap-2">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="lg:hidden gap-2">
                      <Filter className="w-4 h-4" /> Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-72">
                    <SheetHeader><SheetTitle>Filters</SheetTitle></SheetHeader>
                    <div className="mt-6"><FilterPanel /></div>
                  </SheetContent>
                </Sheet>
                <div className="flex border border-border rounded-lg overflow-hidden">
                  {([["grid", Grid3X3], ["list", LayoutList], ["map", Map]] as const).map(([mode, Icon]) => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      className={`p-2 transition-colors ${viewMode === mode ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"}`}
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {viewMode === "map" && (
              <div className="rounded-2xl overflow-hidden border border-border h-[600px] mb-6">
                <MapView
                  onMapReady={(map) => {
                    mapMarkers.forEach(marker => {
                      const m = new google.maps.Marker({
                        position: { lat: marker.lat, lng: marker.lng },
                        map,
                        title: marker.title,
                      });
                      const infoWindow = new google.maps.InfoWindow({
                        content: `<div style="padding:8px;min-width:150px"><strong>${marker.title}</strong><br/>₦${parseFloat(marker.price).toLocaleString()}</div>`,
                      });
                      m.addListener("click", () => infoWindow.open(map, m));
                    });
                    if (mapMarkers.length > 0) {
                      map.setCenter({ lat: mapMarkers[0].lat, lng: mapMarkers[0].lng });
                    } else {
                      map.setCenter({ lat: 6.5244, lng: 3.3792 }); // Lagos default
                    }
                  }}
                />
              </div>
            )}

            {viewMode !== "map" && (
              <>
                {isLoading ? (
                  <div className={`grid gap-5 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="rounded-2xl overflow-hidden border border-border">
                        <div className="skeleton h-48 w-full" />
                        <div className="p-4 space-y-3">
                          <div className="skeleton h-4 w-3/4 rounded" />
                          <div className="skeleton h-4 w-1/2 rounded" />
                          <div className="skeleton h-6 w-1/3 rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : listings && listings.length > 0 ? (
                  <div className={`grid gap-5 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
                    {listings.map(listing => (
                      <ListingCard key={listing.id} listing={listing} onSave={handleSave} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-24 text-muted-foreground">
                    <Building2 className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p className="text-lg font-medium text-foreground">No listings found</p>
                    <p className="text-sm mt-1">Try adjusting your search filters</p>
                  </div>
                )}
                {listings && listings.length === limit && (
                  <div className="flex justify-center gap-3 mt-8">
                    <Button variant="outline" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Previous</Button>
                    <span className="flex items-center text-sm text-muted-foreground">Page {page + 1}</span>
                    <Button variant="outline" onClick={() => setPage(p => p + 1)}>Next</Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
