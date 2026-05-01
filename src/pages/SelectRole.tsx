import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/contexts/AuthContext";
import { BadgeCheck, Building2, Search, ShieldCheck, Sparkles, Wrench } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

const roles = [
  {
    id: "buyer",
    label: "Buyer / Renter",
    description: "I'm looking to buy, rent, or shortlet a property in Nigeria.",
    icon: Search,
    color: "text-blue-600",
    bg: "bg-blue-50",
    activeBorder: "border-blue-500",
    perks: ["Browse all listings", "Save favourites", "Book viewings", "Secure escrow payments"],
  },
  {
    id: "seller",
    label: "Seller / Landlord",
    description: "I want to list my property for sale or rent.",
    icon: Building2,
    color: "text-green-600",
    bg: "bg-green-50",
    activeBorder: "border-green-500",
    perks: ["Post unlimited listings", "Receive secure payments", "Chat with buyers", "Track listing views"],
  },
  {
    id: "agent",
    label: "Real Estate Agent",
    description: "I'm a professional agent managing properties for clients.",
    icon: BadgeCheck,
    color: "text-primary",
    bg: "bg-primary/10",
    activeBorder: "border-primary",
    perks: ["Verified agent badge", "Manage multiple listings", "Client messaging", "Agent analytics"],
  },
  {
    id: "service_provider",
    label: "Service Provider",
    description: "I offer services like cleaning, repairs, or installations.",
    icon: Wrench,
    color: "text-orange-600",
    bg: "bg-orange-50",
    activeBorder: "border-orange-500",
    perks: ["List your services", "Get bookings", "Secure payments", "Build your reputation"],
  },
];

export default function SelectRole() {
  const { user, updateUserRole, loading } = useAuthContext();
  const [, navigate] = useLocation();
  const [selected, setSelected] = useState("");
  const [saving, setSaving] = useState(false);

  const handleContinue = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await updateUserRole(selected);
      navigate("/dashboard");
    } catch {
      navigate("/dashboard");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary/30 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
            Welcome{user?.name ? `, ${user.name.split(" ")[0]}` : ""}! 👋
          </h1>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            Tell us how you'll be using Homvera NG so we can personalise your experience.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {roles.map(role => {
            const isSelected = selected === role.id;
            return (
              <button
                key={role.id}
                onClick={() => setSelected(role.id)}
                className={`text-left p-5 rounded-2xl border-2 bg-white transition-all duration-200 hover:shadow-md ${
                  isSelected ? `${role.activeBorder} shadow-md` : "border-border"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-11 h-11 rounded-xl ${role.bg} flex items-center justify-center flex-shrink-0`}>
                    <role.icon className={`w-6 h-6 ${role.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-foreground">{role.label}</p>
                      {isSelected && <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{role.description}</p>
                  </div>
                </div>
                {isSelected && (
                  <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 gap-1.5">
                    {role.perks.map(perk => (
                      <div key={perk} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                        {perk}
                      </div>
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <Button
          className="w-full h-12 text-base font-semibold"
          disabled={!selected || saving || loading}
          onClick={handleContinue}
        >
          {saving ? "Setting up your account..." : selected ? `Continue as ${roles.find(r => r.id === selected)?.label}` : "Select a role to continue"}
        </Button>

        <p className="text-center text-xs text-muted-foreground mt-4">
          You can change your role anytime in Profile Settings
        </p>
      </div>
    </div>
  );
}
