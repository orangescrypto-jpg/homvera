import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ChatbotWidget from "./components/ChatbotWidget";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Listings from "./pages/Listings";
import ListingDetail from "./pages/ListingDetail";
import NotFound from "./pages/NotFound";
import TermsOfService from "./pages/legal/TermsOfService";
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import EscrowAgreement from "./pages/legal/EscrowAgreement";
import CookiePolicy from "./pages/legal/CookiePolicy";
import Dashboard from "./pages/dashboard/Dashboard";
import Profile from "./pages/dashboard/Profile";
import SavedListings from "./pages/dashboard/SavedListings";
import MyBookings from "./pages/dashboard/MyBookings";
import Notifications from "./pages/dashboard/Notifications";
import MyListings from "./pages/dashboard/MyListings";
import CreateListing from "./pages/dashboard/CreateListing";
import Messages from "./pages/Messages";
import EscrowPage from "./pages/EscrowPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminListings from "./pages/admin/AdminListings";
import AdminEscrows from "./pages/admin/AdminEscrows";
import AdminVerifications from "./pages/admin/AdminVerifications";

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/listings" component={Listings} />
      <Route path="/listings/:id" component={ListingDetail} />
      <Route path="/terms" component={TermsOfService} />
      <Route path="/privacy" component={PrivacyPolicy} />
      <Route path="/escrow-agreement" component={EscrowAgreement} />
      <Route path="/cookies" component={CookiePolicy} />

      {/* Protected Dashboard Routes */}
      <Route path="/dashboard">
        {() => (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/dashboard/profile">
        {() => (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/dashboard/saved">
        {() => (
          <ProtectedRoute>
            <SavedListings />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/dashboard/bookings">
        {() => (
          <ProtectedRoute>
            <MyBookings />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/dashboard/notifications">
        {() => (
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/dashboard/listings">
        {() => (
          <ProtectedRoute>
            <MyListings />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/dashboard/listings/new">
        {() => (
          <ProtectedRoute>
            <CreateListing />
          </ProtectedRoute>
        )}
      </Route>

      {/* Protected Messages */}
      <Route path="/messages">
        {() => (
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/messages/:conversationId">
        {() => (
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        )}
      </Route>

      {/* Protected Escrow */}
      <Route path="/escrow/:bookingId">
        {() => (
          <ProtectedRoute>
            <EscrowPage />
          </ProtectedRoute>
        )}
      </Route>

      {/* Admin Routes (Protected + Role Check) */}
      <Route path="/admin">
        {() => (
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/users">
        {() => (
          <ProtectedRoute requiredRole="admin">
            <AdminUsers />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/listings">
        {() => (
          <ProtectedRoute requiredRole="admin">
            <AdminListings />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/escrows">
        {() => (
          <ProtectedRoute requiredRole="admin">
            <AdminEscrows />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/verifications">
        {() => (
          <ProtectedRoute requiredRole="admin">
            <AdminVerifications />
          </ProtectedRoute>
        )}
      </Route>

      {/* 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <AuthProvider>
          <TooltipProvider>
            <Toaster richColors position="top-right" />
            <Router />
            <ChatbotWidget />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
