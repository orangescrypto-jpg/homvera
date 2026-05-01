import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MapView } from "@/components/Map";
import {
  BadgeCheck, Bath, Bed, Building2, Calendar, ChevronLeft, ChevronRight,
  Heart, MapPin, Maximize2, MessageSquare, Phone, Share2, Shield, Star,
} from "lucide-react";
import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { toast } from "sonner";

const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
];

export default function ListingDetail() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [activeImage, setActiveImage] = useState(0);
  const [bookingMessage, setBookingMessage] = useState("");
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);

  const { data, isLoading } = trpc.listings.getById.useQuery({ id: parseInt(id) });
  const { data: reviews } = trpc.listings.getReviews.useQuery({ listingId: parseInt(id) });
  const { data: isSaved } = trpc.listings.isSaved.useQuery({ listingId: parseInt(id) }, { enabled: isAuthenticated });

  const saveMutation = trpc.listings.save.useMutation({ onSuccess: () => toast.success("Saved!") });
  const unsaveMutation = trpc.listings.unsave.useMutation({ onSuccess: () => toast.success("Removed from saved.") });
  const bookingMutation = trpc.bookings.create.useMutation({
    onSuccess: () => {
      toast.success("Booking request sent!");
      setBookingDialogOpen(false);
    },
  });
  const startConversation = trpc.messages.startConversation.useMutation({
    onSuccess: (conv) => navigate(`/messages/${conv?.id}`),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-12">
          <div className="skeleton h-96 rounded-2xl mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="skeleton h-8 w-3/4 rounded" />
              <div className="skeleton h-4 w-1/2 rounded" />
              <div className="skeleton h-32 rounded" />
            </div>
            <div className="skeleton h-64 rounded-2xl" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-20 text-center">
          <Building2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-30" />
          <h1 className="text-2xl font-serif font-bold mb-2">Listing Not Found</h1>
          <Button onClick={() => navigate("/listings")}>Browse Listings</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const { listing, owner } = data;
  const images: string[] = listing.images ? JSON.parse(listing.images) : [];
  const amenities: string[] = listing.amenities ? JSON.parse(listing.amenities) : [];
  const displayImages = images.length > 0 ? images : PLACEHOLDER_IMAGES;

  const formatPrice = (price: string, unit: string) => {
    const num = parseFloat(price);
    const formatted = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(num);
    const unitMap: Record<string, string> = { per_month: "/mo", per_year: "/yr", per_day: "/day", per_service: "/service", total: "" };
    return `${formatted}${unitMap[unit] ?? ""}`;
  };

  const avgRating = reviews && reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.review.rating, 0) / reviews.length
    : null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container py-6">
        {/* Breadcrumb */}
        <button onClick={() => navigate("/listings")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-4 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to Listings
        </button>

        {/* Image Gallery */}
        <div className="relative rounded-2xl overflow-hidden mb-8 bg-muted">
          <div className="aspect-[16/7] relative">
            <img
              src={displayImages[activeImage]}
              alt={listing.title}
              className="w-full h-full object-cover"
              onError={e => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGES[0]; }}
            />
            {displayImages.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImage(i => (i - 1 + displayImages.length) % displayImages.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setActiveImage(i => (i + 1) % displayImages.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {displayImages.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`w-2 h-2 rounded-full transition-colors ${i === activeImage ? "bg-white" : "bg-white/50"}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
          {displayImages.length > 1 && (
            <div className="flex gap-2 p-3 overflow-x-auto">
              {displayImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${i === activeImage ? "border-primary" : "border-transparent"}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Badges */}
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge className={listing.category === "housing" ? "bg-primary text-primary-foreground" : "bg-green-600 text-white"}>
                  {listing.category}
                </Badge>
                <Badge variant="secondary" className="capitalize">{listing.propertyType}</Badge>
                {listing.isFeatured && (
                  <Badge className="bg-accent text-accent-foreground">
                    <Star className="w-3 h-3 mr-1" /> Featured
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-2">{listing.title}</h1>
              {(listing.city || listing.state) && (
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{[listing.address, listing.city, listing.state, listing.country].filter(Boolean).join(", ")}</span>
                </div>
              )}
            </div>

            {/* Property Specs */}
            {listing.category === "housing" && (
              <div className="flex flex-wrap gap-6 py-4 border-y border-border">
                {listing.bedrooms != null && (
                  <div className="flex items-center gap-2 text-sm">
                    <Bed className="w-4 h-4 text-primary" />
                    <span><strong>{listing.bedrooms}</strong> Bedroom{listing.bedrooms !== 1 ? "s" : ""}</span>
                  </div>
                )}
                {listing.bathrooms != null && (
                  <div className="flex items-center gap-2 text-sm">
                    <Bath className="w-4 h-4 text-primary" />
                    <span><strong>{listing.bathrooms}</strong> Bathroom{listing.bathrooms !== 1 ? "s" : ""}</span>
                  </div>
                )}
                {listing.area && (
                  <div className="flex items-center gap-2 text-sm">
                    <Maximize2 className="w-4 h-4 text-primary" />
                    <span><strong>{listing.area}</strong> {listing.areaUnit}</span>
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            {listing.description && (
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-3">Description</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{listing.description}</p>
              </div>
            )}

            {/* Amenities */}
            {amenities.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-3">Amenities</h2>
                <div className="flex flex-wrap gap-2">
                  {amenities.map(a => (
                    <Badge key={a} variant="secondary" className="capitalize">{a}</Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Map */}
            {listing.latitude && listing.longitude && (
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-3">Location</h2>
                <div className="rounded-2xl overflow-hidden border border-border h-64">
                  <MapView
                    onMapReady={(map) => {
                      const pos = { lat: parseFloat(listing.latitude!), lng: parseFloat(listing.longitude!) };
                      map.setCenter(pos);
                      map.setZoom(15);
                      new google.maps.Marker({ position: pos, map, title: listing.title });
                    }}
                  />
                </div>
              </div>
            )}

            {/* Reviews */}
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                Reviews
                {avgRating && (
                  <span className="flex items-center gap-1 text-sm font-normal text-muted-foreground">
                    <Star className="w-4 h-4 fill-accent text-accent" />
                    {avgRating.toFixed(1)} ({reviews?.length})
                  </span>
                )}
              </h2>
              {reviews && reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map(({ review, reviewer }) => (
                    <div key={review.id} className="flex gap-3">
                      <Avatar className="w-9 h-9 flex-shrink-0">
                        <AvatarImage src={reviewer?.avatarUrl ?? undefined} />
                        <AvatarFallback>{reviewer?.name?.charAt(0) ?? "U"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{reviewer?.name ?? "User"}</span>
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-3 h-3 ${i < review.rating ? "fill-accent text-accent" : "text-muted-foreground"}`} />
                            ))}
                          </div>
                        </div>
                        {review.comment && <p className="text-sm text-muted-foreground">{review.comment}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No reviews yet.</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Price Card */}
            <Card className="border-border shadow-sm">
              <CardContent className="p-6">
                <p className="text-3xl font-serif font-bold text-primary mb-1">
                  {formatPrice(listing.price, listing.priceUnit)}
                </p>
                <p className="text-sm text-muted-foreground mb-5 capitalize">
                  {listing.propertyType} · {listing.category}
                </p>

                <div className="flex gap-2 mb-4">
                  {isAuthenticated ? (
                    <>
                      <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
                        <DialogTrigger asChild>
                          <Button className="flex-1 gap-2">
                            <Calendar className="w-4 h-4" /> Book Now
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Send Booking Request</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 mt-4">
                            <p className="text-sm text-muted-foreground">Send a message to the seller about your booking.</p>
                            <Textarea
                              placeholder="Introduce yourself and describe your requirements..."
                              value={bookingMessage}
                              onChange={e => setBookingMessage(e.target.value)}
                              rows={4}
                            />
                            <Button
                              className="w-full"
                              disabled={bookingMutation.isPending}
                              onClick={() => {
                                if (!owner) return;
                                bookingMutation.mutate({
                                  listingId: listing.id,
                                  sellerId: owner.id,
                                  message: bookingMessage,
                                  totalAmount: listing.price,
                                });
                              }}
                            >
                              {bookingMutation.isPending ? "Sending..." : "Send Request"}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => isSaved ? unsaveMutation.mutate({ listingId: listing.id }) : saveMutation.mutate({ listingId: listing.id })}
                      >
                        <Heart className={`w-4 h-4 ${isSaved ? "fill-red-500 text-red-500" : ""}`} />
                      </Button>
                    </>
                  ) : (
                    <Button className="flex-1" asChild>
                      <a href={getLoginUrl()}>Sign In to Book</a>
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Shield className="w-3.5 h-3.5 text-green-600" />
                  <span>Payments secured by Stripe Escrow</span>
                </div>
              </CardContent>
            </Card>

            {/* Agent Card */}
            {owner && (
              <Card className="border-border">
                <CardContent className="p-5">
                  <h3 className="font-semibold text-foreground mb-4">Listed by</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={owner.avatarUrl ?? undefined} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {owner.name?.charAt(0) ?? "A"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="font-semibold text-sm">{owner.name}</p>
                        {owner.isVerified && <BadgeCheck className="w-4 h-4 text-primary" />}
                      </div>
                      <p className="text-xs text-muted-foreground capitalize">{owner.userRole}</p>
                    </div>
                  </div>
                  {isAuthenticated && owner.id !== user?.id && (
                    <Button
                      variant="outline"
                      className="w-full gap-2"
                      onClick={() => startConversation.mutate({ recipientId: owner.id, listingId: listing.id })}
                      disabled={startConversation.isPending}
                    >
                      <MessageSquare className="w-4 h-4" /> Send Message
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Share */}
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied!"); }}
            >
              <Share2 className="w-4 h-4" /> Share Listing
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
