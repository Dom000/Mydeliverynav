import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navigation from "./components/Navigation";
import HomePage from "./pages/HomePage";
import TrackingPage from "./pages/TrackingPage";
import RegisterPage from "./pages/RegisterPage";
import AboutPage from "./pages/AboutPage";
import AdminLayout from "./components/AdminLayout";
import UserLayout from "./components/UserLayout";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminDeliveriesPage from "./pages/admin/AdminDeliveriesPage";
import "./App.css";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminPackagesPage from "./pages/admin/AdminPackagesPage";
import AdminCreatePackageDeliveryPage from "./pages/admin/AdminCreatePackageDeliveryPage";
import SignInPage from "./pages/SignInPage";
import VerifyOtpPage from "./pages/VerifyOtpPage";
import UserPackagesPage from "./pages/user/UserPackagesPage";
import UserDeliveriesPage from "./pages/user/UserDeliveriesPage";
import UserAccountPage from "./pages/user/UserAccountPage";

gsap.registerPlugin(ScrollTrigger);

// Protected route component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = localStorage.getItem("adminToken");
  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to="/admin/login" replace />
  );
}

function UserProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = localStorage.getItem("userToken");
  return isAuthenticated ? <>{children}</> : <Navigate to="/signin" replace />;
}

function PublicLayout() {
  return (
    <>
      <Navigation />
      <Outlet />
    </>
  );
}

function App() {
  useEffect(() => {
    // Refresh ScrollTrigger on route change
    ScrollTrigger.refresh();

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <Router>
      <div className="relative">
        <div className="grain-overlay" />
        <Routes>
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signin/verify/:email" element={<VerifyOtpPage />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="deliveries" element={<AdminDeliveriesPage />} />
            <Route path="packages" element={<AdminPackagesPage />} />
            <Route
              path="create-package-delivery"
              element={<AdminCreatePackageDeliveryPage />}
            />
          </Route>

          {/* User Routes */}
          <Route
            path="/user/*"
            element={
              <UserProtectedRoute>
                <UserLayout />
              </UserProtectedRoute>
            }
          >
            <Route index element={<Navigate to="packages" replace />} />
            <Route path="packages" element={<UserPackagesPage />} />
            <Route path="deliveries" element={<UserDeliveriesPage />} />
            <Route path="account" element={<UserAccountPage />} />
          </Route>

          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/tracking" element={<TrackingPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
