// World Trotter visual style: route registry for the complete frontend-only planning journey.
import { AnimatePresence } from "framer-motion";
import { Route, Switch, useLocation } from "wouter";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import PageTransition from "./components/animations/PageTransition";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import CreateTripPage from "./pages/CreateTripPage";
import ItineraryBuilderPage from "./pages/ItineraryBuilderPage";
import MyTripsPage from "./pages/MyTripsPage";
import ItineraryViewPage from "./pages/ItineraryViewPage";
import CitySearchPage from "./pages/CitySearchPage";
import ActivitySearchPage from "./pages/ActivitySearchPage";
import TripBudgetPage from "./pages/TripBudgetPage";
import CalendarPage from "./pages/CalendarPage";
import CommunityPage from "./pages/CommunityPage";
import SharedItineraryPage from "./pages/SharedItineraryPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";

function Router() {
  const [location] = useLocation();
  return <AnimatePresence mode="wait"><PageTransition key={location}><Switch>
    <Route path="/" component={Home} /><Route path="/login" component={LoginPage} /><Route path="/register" component={RegisterPage} />
    <Route path="/dashboard" component={DashboardPage} /><Route path="/trips" component={MyTripsPage} /><Route path="/trips/new" component={CreateTripPage} />
    <Route path="/itinerary-builder" component={ItineraryBuilderPage} /><Route path="/itinerary-view" component={ItineraryViewPage} /><Route path="/budget" component={TripBudgetPage} />
    <Route path="/cities" component={CitySearchPage} /><Route path="/activities" component={ActivitySearchPage} /><Route path="/calendar" component={CalendarPage} />
    <Route path="/community" component={CommunityPage} /><Route path="/shared/:shareToken" component={SharedItineraryPage} /><Route path="/profile" component={ProfilePage} /><Route path="/admin" component={AdminPage} />
    <Route path="/404" component={NotFound} /><Route component={NotFound} />
  </Switch></PageTransition></AnimatePresence>;
}

export default function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><Toaster /><Router /></TooltipProvider></ThemeProvider></ErrorBoundary>;
}
