import { Provider } from 'react-redux';
import { store } from '@/app/store';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from '@/app/layout';
import { ProtectedRoute } from '@/app/router/ProtectedRoute';

// Pages
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import OrdersPage from "./pages/OrdersPage";
import ProductsPage from "./pages/ProductsPage";
import SellersPage from "./pages/SellersPage";
import LogisticsPage from "./pages/LogisticsPage";
import ReviewsPage from "./pages/ReviewsPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const App = () => (
  <Provider store={store}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/analytics" element={<DashboardPage />} />
              <Route path="/analytics/orders" element={<OrdersPage />} />
              <Route path="/analytics/products" element={<ProductsPage />} />
              <Route path="/analytics/sellers" element={<SellersPage />} />
              <Route path="/analytics/logistics" element={<LogisticsPage />} />
              <Route path="/analytics/reviews" element={<ReviewsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Route>
          
          {/* Redirects */}
          <Route path="/" element={<Navigate to="/analytics" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </Provider>
);

export default App;
