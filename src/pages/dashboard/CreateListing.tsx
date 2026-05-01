import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronLeft, ImagePlus, X } from "lucide-react";
import { useRef, useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function CreateListing() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: "", description: "", category: "housing" as "housing" | "services",
    propertyType: "apartment" as any, price: "", priceUnit: "total" as any,
    address: "", city: "", state: "", bedrooms: "", bathrooms: "", area: "",
    amenities: "",
  });
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const uploadImage = trpc.listings.uploadImage.useMutation();
  const createListing = trpc.listings.create.useMutation({
    onSuccess: () => {
      toast.success("Listing submitted for review!");
      navigate("/dashboard/listings");
    },
    onError: (e) => toast.error(e.message),
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setUploading(true);
    try {
      for (const file of files) {
        const reader = new FileReader();
        await new Promise<void>(resolve => {
          reader.onload = async () => {
            const base64 = (reader.result as string).split(",")[1];
            const result = await uploadImage.mutateAsync({ base64, mimeType: file.type, filename: file.name });
            setImages(prev => [...prev, result.url]);
            resolve();
          };
          reader.readAsDataURL(file);
        });
      }
    } finally {
      setUploading(false);
    }
  };

  const housingTypes = ["apartment", "house", "land", "commercial", "shortlet"];
  const serviceTypes = ["cleaning", "repairs", "installation", "logistics", "other"];
  const currentTypes = form.category === "housing" ? housingTypes : serviceTypes;

  const handleSubmit = () => {
    if (!form.title || !form.price) { toast.error("Title and price are required."); return; }
    createListing.mutate({
      ...form,
      price: form.price,
      bedrooms: form.bedrooms ? parseInt(form.bedrooms) : undefined,
      bathrooms: form.bathrooms ? parseInt(form.bathrooms) : undefined,
      area: form.area || undefined,
      images,
      amenities: form.amenities ? form.amenities.split(",").map(a => a.trim()).filter(Boolean) : [],
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-20 text-center">
          <p className="text-muted-foreground mb-4">Please sign in to create a listing.</p>
          <Button asChild><a href={getLoginUrl()}>Sign In</a></Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8 max-w-2xl">
        <button onClick={() => navigate("/dashboard/listings")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to My Listings
        </button>
        <h1 className="text-2xl font-serif font-bold text-foreground mb-6">Create New Listing</h1>

        <Card className="border-border">
          <CardContent className="p-6 space-y-5">
            {/* Images */}
            <div>
              <Label className="mb-2 block">Photos</Label>
              <div className="flex flex-wrap gap-3">
                {images.map((url, i) => (
                  <div key={i} className="relative w-24 h-20 rounded-lg overflow-hidden border border-border">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={() => setImages(prev => prev.filter((_, j) => j !== i))}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-24 h-20 rounded-lg border-2 border-dashed border-border hover:border-primary flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                >
                  <ImagePlus className="w-5 h-5" />
                  <span className="text-xs">{uploading ? "Uploading..." : "Add Photo"}</span>
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
              </div>
            </div>

            {/* Basic Info */}
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input id="title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. 3-Bedroom Apartment in Lekki Phase 1" className="mt-1" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Category *</Label>
                <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v as any, propertyType: v === "housing" ? "apartment" : "cleaning" }))}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="housing">Housing</SelectItem>
                    <SelectItem value="services">Services</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Type *</Label>
                <Select value={form.propertyType} onValueChange={v => setForm(f => ({ ...f, propertyType: v }))}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {currentTypes.map(t => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price (₦) *</Label>
                <Input id="price" type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="0" className="mt-1" />
              </div>
              <div>
                <Label>Price Unit</Label>
                <Select value={form.priceUnit} onValueChange={v => setForm(f => ({ ...f, priceUnit: v }))}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="total">Total</SelectItem>
                    <SelectItem value="per_month">Per Month</SelectItem>
                    <SelectItem value="per_year">Per Year</SelectItem>
                    <SelectItem value="per_day">Per Day</SelectItem>
                    <SelectItem value="per_service">Per Service</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe the property or service in detail..." rows={4} className="mt-1" />
            </div>

            {/* Location */}
            <div>
              <Label htmlFor="address">Address</Label>
              <Input id="address" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="Street address" className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} placeholder="Lagos" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input id="state" value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} placeholder="Lagos State" className="mt-1" />
              </div>
            </div>

            {/* Housing-specific */}
            {form.category === "housing" && (
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input id="bedrooms" type="number" value={form.bedrooms} onChange={e => setForm(f => ({ ...f, bedrooms: e.target.value }))} placeholder="0" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input id="bathrooms" type="number" value={form.bathrooms} onChange={e => setForm(f => ({ ...f, bathrooms: e.target.value }))} placeholder="0" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="area">Area (sqm)</Label>
                  <Input id="area" type="number" value={form.area} onChange={e => setForm(f => ({ ...f, area: e.target.value }))} placeholder="0" className="mt-1" />
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="amenities">Amenities (comma-separated)</Label>
              <Input id="amenities" value={form.amenities} onChange={e => setForm(f => ({ ...f, amenities: e.target.value }))} placeholder="Pool, Gym, Parking, Security..." className="mt-1" />
            </div>

            <Button className="w-full" onClick={handleSubmit} disabled={createListing.isPending}>
              {createListing.isPending ? "Submitting..." : "Submit Listing for Review"}
            </Button>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
