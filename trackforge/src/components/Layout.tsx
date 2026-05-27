import { Link, useLocation } from "wouter";
import { LayoutDashboard, ListTodo, BarChart3, User, LogOut, Menu, X, Plus } from "lucide-react";
import { useClerk } from "@clerk/react";
import { useState } from "react";
import { Button } from "./ui/button";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { signOut } = useClerk();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Trackers", href: "/trackers", icon: ListTodo },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Profile", href: "/profile", icon: User },
  ];

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-card transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:block flex flex-col
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex h-16 items-center px-6 border-b border-border">
          <img src={`${basePath}/logo.svg`} alt="TrackForge" className="w-8 h-8 mr-3" />
          <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">TrackForge</span>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "text-primary" : ""}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border space-y-2">
          <Link href="/trackers/new">
            <Button className="w-full justify-start gap-2" variant="outline">
              <Plus className="w-4 h-4" /> New Tracker
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
            onClick={() => signOut({ redirectUrl: basePath || "/" })}
          >
            <LogOut className="w-5 h-5" />
            Log out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-border lg:hidden bg-card/50 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <img src={`${basePath}/logo.svg`} alt="TrackForge" className="w-6 h-6" />
            <span className="font-bold">TrackForge</span>
          </div>
          <button 
            className="p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </header>

        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
