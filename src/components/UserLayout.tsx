import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Package, Truck, User, LogOut, Menu, X } from "lucide-react";
import { logoutAuth } from "@/apis/auth";

export default function UserLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: "/user/packages", label: "My Packages", icon: Package },
    { path: "/user/deliveries", label: "My Deliveries", icon: Truck },
    { path: "/user/account", label: "Account", icon: User },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logoutAuth();
    navigate("/signin");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col lg:flex-row">
      <header className="lg:hidden h-16 border-b border-slate-700 bg-slate-900 flex items-center justify-between px-4">
        <h2 className="text-lg font-semibold">My Portal</h2>
        <button
          onClick={() => setSidebarOpen((previous) => !previous)}
          className="p-2 hover:bg-slate-800 rounded-lg"
        >
          {sidebarOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </header>

      <div
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-700 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="hidden lg:flex h-16 border-b border-slate-700 items-center px-4">
          <h1 className="text-lg font-bold text-red-600">User Portal</h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-colors ${
                  isActive(item.path)
                    ? "bg-red-600/20 text-white"
                    : "hover:bg-slate-800 text-slate-300"
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="border-t border-slate-700 p-4">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start text-slate-300 hover:text-red-600 hover:bg-slate-800"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="ml-3">Logout</span>
          </Button>
        </div>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="hidden lg:flex h-16 border-b border-slate-700 bg-slate-900 items-center px-6">
          <h2 className="text-xl font-semibold">User Dashboard</h2>
        </header>

        <main className="flex-1 overflow-auto">
          <div className="p-4 lg:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
