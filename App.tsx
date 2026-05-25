import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// Pages
import LocationCheck from "./pages/LocationCheck";
import AddressConfirm from "./pages/AddressConfirm";
import Index from "./pages/Index";

// Existing Pages
import Search from "./pages/Search";
import Categories from "./pages/Categories";
import SubCategories from "./pages/SubCategories";
import ProductListing from "./pages/ProductListing";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import SavedAddresses from "./pages/SavedAddresses";
import HelpSupport from "./pages/HelpSupport";
import Settings from "./pages/Settings";
import AIBot from "./pages/AIBot";
import NotFound from "./pages/NotFound";

import { CartProvider } from "@/context/CartContext";
import { UserProvider, useUser } from "@/context/UserContext";
import { LocationProvider } from "@/context/LocationContext";
import FloatingCartButton from "./components/home/FloatingCartButton";
import DesktopBlocker from "./components/layout/DesktopBlocker";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AuthGuard } from "./components/auth/AuthGuard";

const queryClient = new QueryClient();

const AppLayout = () => {
  const { loading } = useUser();
  const location = useLocation();
  const hideCartPaths = [
    '/',
    '/splash',
    '/location-check',
    '/not-serviceable',
    '/address-confirm'
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-lg font-semibold text-muted-foreground">Loading App...</div>
      </div>
    );
  }

  const showCart = !hideCartPaths.some(path => location.pathname === path || location.pathname.startsWith(path + '/'));

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* Protected Routes */}
        <Route element={<AuthGuard />}>
          <Route path="/location-check" element={<LocationCheck />} />
          <Route path="/address-confirm" element={<AddressConfirm />} />

          <Route path="/home" element={<Index />} />
          <Route path="/search" element={<Search />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/:categoryId" element={<Categories />} />
          <Route path="/categories/:categoryId/subcategories" element={<SubCategories />} />
          <Route path="/categories/:categoryId/subcategories/:subCategoryId/products" element={<ProductListing />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/addresses" element={<SavedAddresses />} />
          <Route path="/saved-addresses" element={<SavedAddresses />} />
          <Route path="/support" element={<HelpSupport />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/bot" element={<AIBot />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>

      {showCart && <FloatingCartButton />}
    </>
  );
};

const App = () => (
  <DesktopBlocker>
    <ErrorBoundary>
      <Toaster />
      <Sonner />
      <AppLayout />
    </ErrorBoundary>
  </DesktopBlocker>
);

export default App;
