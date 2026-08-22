// GlobeTrotter Sunlit Atlas Editorial: shared navigation, white-first surfaces, colorful travel cues.
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import { CalendarPage, CommunityPage, CreateTripPage, LoginPage, MyTripsPage, ProfilePage, RegisterPage, AdminPage } from "./pages/TravelPages";
import NotFound from "./pages/NotFound";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/trips/new" component={CreateTripPage} />
      <Route path="/trips" component={MyTripsPage} />
      <Route path="/calendar" component={CalendarPage} />
      <Route path="/community" component={CommunityPage} />
      <Route path="/profile" component={ProfilePage} />
      <Route path="/admin" component={AdminPage} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
