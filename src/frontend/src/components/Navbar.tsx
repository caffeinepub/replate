import { Role } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import {
  useCallerProfile,
  useMarkNotificationRead,
  useMyNotifications,
} from "@/hooks/useQueries";
import { useTheme } from "@/hooks/useTheme";
import { Link, useLocation } from "@/lib/router";
import {
  Bell,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Sun,
  User,
  X,
} from "lucide-react";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

function getDashboardRoute(role: Role): string {
  switch (role) {
    case Role.host:
      return "/dashboard/host";
    case Role.ngo:
      return "/dashboard/ngo";
    case Role.volunteer:
      return "/dashboard/volunteer";
    case Role.admin:
      return "/dashboard/admin";
    default:
      return "/setup-profile";
  }
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggle } = useTheme();
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const [location] = useLocation();
  const { data: profile } = useCallerProfile();
  const { data: notifications } = useMyNotifications();
  const markRead = useMarkNotificationRead();

  const isLoggedIn = !!identity;
  const unreadCount = notifications?.filter((n) => !n.isRead).length ?? 0;

  return (
    <nav className="sticky top-0 z-50 bg-card/90 backdrop-blur-md border-b border-border shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-8 h-8 rounded-xl overflow-hidden shadow-sm group-hover:scale-105 transition-transform">
              <img
                src="/assets/generated/replate-logo-transparent.dim_200x200.png"
                alt="RePlate Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display font-bold text-lg text-foreground tracking-tight">
                RePlate
              </span>
              <span className="text-[10px] text-muted-foreground font-medium hidden sm:block">
                Leftovers → Lifesavers
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1 ml-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  location === link.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex-1" />

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggle}
              className="rounded-xl h-9 w-9"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>

            {isLoggedIn && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-xl h-9 w-9 relative"
                    aria-label="Notifications"
                  >
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-80 rounded-2xl p-2"
                >
                  <p className="text-xs font-semibold text-muted-foreground px-2 py-1 mb-1">
                    Notifications
                  </p>
                  {notifications && notifications.length > 0 ? (
                    notifications.slice(0, 5).map((n) => (
                      <DropdownMenuItem
                        key={n.id.toString()}
                        className={`rounded-xl flex gap-2 items-start text-xs py-2 cursor-pointer ${
                          !n.isRead ? "bg-primary/5 font-medium" : ""
                        }`}
                        onClick={() => {
                          if (!n.isRead) markRead.mutate(n.id);
                        }}
                      >
                        {!n.isRead && (
                          <span className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" />
                        )}
                        <span className={!n.isRead ? "" : "ml-4"}>
                          {n.message}
                        </span>
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground text-center py-4">
                      No notifications
                    </p>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="rounded-xl h-9 gap-1.5 text-sm hidden sm:flex"
                  >
                    <User className="h-3.5 w-3.5" />
                    <span className="max-w-[100px] truncate">
                      {profile?.name ?? "Account"}
                    </span>
                    <ChevronDown className="h-3 w-3 opacity-60" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-2xl w-48">
                  {profile && (
                    <div className="px-3 py-2 border-b border-border mb-1">
                      <p className="text-xs font-semibold">{profile.name}</p>
                      <Badge
                        variant="outline"
                        className="text-[10px] mt-1 capitalize"
                      >
                        {profile.role}
                      </Badge>
                    </div>
                  )}
                  <DropdownMenuItem asChild className="rounded-xl">
                    <Link
                      href={
                        profile
                          ? getDashboardRoute(profile.role as Role)
                          : "/setup-profile"
                      }
                      className="flex items-center gap-2"
                    >
                      <LayoutDashboard className="h-3.5 w-3.5" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="rounded-xl text-destructive focus:text-destructive"
                    onClick={clear}
                  >
                    <LogOut className="h-3.5 w-3.5 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Button
                  variant="ghost"
                  className="rounded-xl h-9 text-sm"
                  onClick={login}
                  disabled={isLoggingIn}
                >
                  {isLoggingIn ? "Logging in..." : "Login"}
                </Button>
                <Link href="/register">
                  <Button className="rounded-xl h-9 text-sm bg-primary hover:bg-primary/90">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-xl h-9 w-9"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card/95 backdrop-blur-md px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                location === link.href
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-border flex gap-2">
            {isLoggedIn ? (
              <Button
                variant="outline"
                size="sm"
                className="flex-1 rounded-xl"
                onClick={() => {
                  clear();
                  setMobileOpen(false);
                }}
              >
                Logout
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 rounded-xl"
                  onClick={() => {
                    login();
                    setMobileOpen(false);
                  }}
                  disabled={isLoggingIn}
                >
                  Login
                </Button>
                <Link
                  href="/register"
                  className="flex-1"
                  onClick={() => setMobileOpen(false)}
                >
                  <Button size="sm" className="w-full rounded-xl bg-primary">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
