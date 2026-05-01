import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BadgeCheck, ChevronLeft, Shield, Users } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function AdminUsers() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const utils = trpc.useUtils();
  const { data: users, isLoading } = trpc.admin.users.useQuery({ limit: 50, offset: 0 }, { enabled: user?.role === "admin" });
  const updateRole = trpc.admin.updateUserRole.useMutation({
    onSuccess: () => { toast.success("User role updated."); utils.admin.users.invalidate(); },
  });

  if (user?.role !== "admin") {
    return <div className="min-h-screen bg-background"><Navbar /><div className="container py-20 text-center"><Shield className="w-16 h-16 mx-auto mb-4 opacity-30" /><p>Admin access required.</p></div><Footer /></div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8">
        <button onClick={() => navigate("/admin")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to Admin
        </button>
        <h1 className="text-2xl font-serif font-bold text-foreground mb-6 flex items-center gap-2">
          <Users className="w-6 h-6" /> User Management
        </h1>

        {isLoading ? (
          <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}</div>
        ) : (
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary/50 border-b border-border">
                  <tr>
                    {["User", "Email", "Role", "User Role", "Verified", "Joined", "Actions"].map(h => (
                      <th key={h} className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users?.map(u => (
                    <tr key={u.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={u.avatarUrl ?? undefined} />
                            <AvatarFallback className="text-xs bg-primary text-primary-foreground">{u.name?.charAt(0) ?? "U"}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{u.name ?? "—"}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{u.email ?? "—"}</td>
                      <td className="px-4 py-3">
                        <Badge variant={u.role === "admin" ? "default" : "secondary"} className="text-xs capitalize">{u.role}</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm capitalize text-muted-foreground">{u.userRole}</td>
                      <td className="px-4 py-3">
                        {u.isVerified ? <BadgeCheck className="w-4 h-4 text-green-600" /> : <span className="text-xs text-muted-foreground">—</span>}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <Select
                          value={u.role}
                          onValueChange={v => updateRole.mutate({ userId: u.id, role: v as "user" | "admin" })}
                        >
                          <SelectTrigger className="h-7 text-xs w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
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
