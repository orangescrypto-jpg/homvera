import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bath, Bed, Building2, Heart, MapPin, Maximize2, Star } from "lucide-react";
import { useLocation } from "wouter";
import type { Listing } from "../../../drizzle/schema";

interface ListingCardProps {
  listing: Listing;
  onSave?: (id: number) => void;
  isSaved?: boolean;
}

function formatPrice(price: string | number, unit: string) {
  const num = typeof price === "string" ? parseFloat(price) : price;
  const formatted = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(num);

  const unitMap: Record<string, string> = {
    per_month: "/mo",
    per_year: "/yr",
    per_day: "/day",
    per_service: "/service",
    total: "",
  };
  return `${formatted}${unitMap[unit] ?? ""}`;
}

const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80",
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80",
];

export default function ListingCard({ listing, onSave, isSaved }: ListingCardProps) {
  const [, navigate] = useLocation();

  const images: string[] = listing.images ? JSON.parse(listing.images) : [];
  const imageUrl = images[0] ?? PLACEHOLDER_IMAGES[listing.id % PLACEHOLDER_IMAGES.length];

  const propertyTypeLabel: Record<string, string> = {
    apartment: "Apartment",
    house: "House",
    land: "Land",
    commercial: "Commercial",
    shortlet: "Shortlet",
    cleaning: "Cleaning",
    repairs: "Repairs",
    installation: "Installation",
    logistics: "Logistics",
    other: "Other",
  };

  return (
    <div
      className="group bg-card rounded-2xl overflow-hidden border border-border listing-card-hover cursor-pointer"
      onClick={() => navigate(`/listings/${listing.id}`)}
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-muted">
        <img
          src={imageUrl}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={e => {
            (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGES[0];
          }}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {listing.isFeatured && (
            <Badge className="bg-accent text-accent-foreground text-xs font-semibold">
              <Star className="w-3 h-3 mr-1" /> Featured
            </Badge>
          )}
          <Badge variant="secondary" className="bg-white/90 text-foreground text-xs">
            {propertyTypeLabel[listing.propertyType] ?? listing.propertyType}
          </Badge>
        </div>

        {/* Save button */}
        {onSave && (
          <button
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-sm transition-colors"
            onClick={e => {
              e.stopPropagation();
              onSave(listing.id);
            }}
          >
            <Heart className={`w-4 h-4 ${isSaved ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
          </button>
        )}

        {/* Category tag */}
        <div className="absolute bottom-3 left-3">
          <Badge className={`text-xs ${listing.category === "housing" ? "bg-primary/90 text-primary-foreground" : "bg-green-600/90 text-white"}`}>
            {listing.category === "housing" ? "Housing" : "Service"}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-foreground text-base leading-snug mb-1 line-clamp-2 group-hover:text-primary transition-colors">
          {listing.title}
        </h3>

        {(listing.city || listing.state) && (
          <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{[listing.city, listing.state].filter(Boolean).join(", ")}</span>
          </div>
        )}

        {/* Property specs */}
        {listing.category === "housing" && (
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
            {listing.bedrooms != null && (
              <span className="flex items-center gap-1">
                <Bed className="w-3.5 h-3.5" /> {listing.bedrooms} bed{listing.bedrooms !== 1 ? "s" : ""}
              </span>
            )}
            {listing.bathrooms != null && (
              <span className="flex items-center gap-1">
                <Bath className="w-3.5 h-3.5" /> {listing.bathrooms} bath{listing.bathrooms !== 1 ? "s" : ""}
              </span>
            )}
            {listing.area && (
              <span className="flex items-center gap-1">
                <Maximize2 className="w-3.5 h-3.5" /> {listing.area} {listing.areaUnit}
              </span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between">
          <p className="text-lg font-bold text-primary font-serif">
            {formatPrice(listing.price, listing.priceUnit)}
          </p>
          <Button
            size="sm"
            variant="ghost"
            className="text-xs text-muted-foreground hover:text-primary"
            onClick={e => {
              e.stopPropagation();
              navigate(`/listings/${listing.id}`);
            }}
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
}
