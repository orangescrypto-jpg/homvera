import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
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
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/listings" component={Listings} />
      <Route path="/listings/:id" component={ListingDetail} />
      <Route path="/terms" component={TermsOfService} />
      <Route path="/privacy" component={PrivacyPolicy} />
      <Route path="/escrow-agreement" component={EscrowAgreement} />
      <Route path="/cookies" component={CookiePolicy} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/dashboard/profile" component={Profile} />
      <Route path="/dashboard/saved" component={SavedListings} />
      <Route path="/dashboard/bookings" component={MyBookings} />
      <Route path="/dashboard/notifications" component={Notifications} />
      <Route path="/dashboard/listings" component={MyListings} />
      <Route path="/dashboard/listings/new" component={CreateListing} />
      <Route path="/messages" component={Messages} />
      <Route path="/messages/:conversationId" component={Messages} />
      <Route path="/escrow/:bookingId" component={EscrowPage} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/users" component={AdminUsers} />
      <Route path="/admin/listings" component={AdminListings} />
      <Route path="/admin/escrows" component={AdminEscrows} />
      <Route path="/admin/verifications" component={AdminVerifications} />
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
