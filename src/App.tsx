import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
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
import AdminPackageDetailsPage from "./pages/admin/AdminPackageDetailsPage";
import SignInPage from "./pages/SignInPage";
import VerifyOtpPage from "./pages/VerifyOtpPage";
import UserPackagesPage from "./pages/user/UserPackagesPage";
import UserDeliveriesPage from "./pages/user/UserDeliveriesPage";
import UserAccountPage from "./pages/user/UserAccountPage";
import UserPackageDetailsPage from "@/pages/user/UserPackageDetailsPage";
import {
  getPostAuthRedirectPath,
  isAdminAuthenticated,
  isAuthenticated,
} from "./apis/token-storage";

gsap.registerPlugin(ScrollTrigger);

function resolveRouteRedirect(pathname: string) {
  const loggedIn = isAuthenticated();
  const isAdmin = isAdminAuthenticated();

  if (pathname === "/admin/login" || pathname.startsWith("/signin")) {
    return loggedIn ? getPostAuthRedirectPath() : null;
  }

  if (pathname.startsWith("/admin")) {
    if (!loggedIn) return "/admin/login";
    if (!isAdmin) return "/user/packages";
  }

  if (pathname.startsWith("/user")) {
    if (!loggedIn) return "/signin";
  }

  return null;
}

function AuthMiddleware({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const redirectTo = resolveRouteRedirect(location.pathname);

  if (redirectTo && redirectTo !== location.pathname) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
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
      <AuthMiddleware>
        <div className="relative">
          <div className="grain-overlay" />
          <Routes>
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signin/verify/:email" element={<VerifyOtpPage />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/*" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="deliveries" element={<AdminDeliveriesPage />} />
              <Route path="packages" element={<AdminPackagesPage />} />
              <Route
                path="packages/:packageId"
                element={<AdminPackageDetailsPage />}
              />
              <Route
                path="create-package-delivery"
                element={<AdminCreatePackageDeliveryPage />}
              />
            </Route>

            {/* User Routes */}
            <Route path="/user/*" element={<UserLayout />}>
              <Route index element={<Navigate to="packages" replace />} />
              <Route path="packages" element={<UserPackagesPage />} />
              <Route
                path="packages/:packageId"
                element={<UserPackageDetailsPage />}
              />
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
      </AuthMiddleware>
    </Router>
  );
}

export default App;
