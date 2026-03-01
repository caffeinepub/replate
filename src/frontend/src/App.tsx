import { Role } from "@/backend";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Toaster } from "@/components/ui/sonner";
import { Route, RouterProvider, Switch } from "@/lib/router";

import About from "@/pages/About";
import AdminDashboard from "@/pages/AdminDashboard";
import Blog from "@/pages/Blog";
import Contact from "@/pages/Contact";
import HostDashboard from "@/pages/HostDashboard";
import HowItWorks from "@/pages/HowItWorks";
// Pages
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import NgoDashboard from "@/pages/NgoDashboard";
import Privacy from "@/pages/Privacy";
import Register from "@/pages/Register";
import SetupProfile from "@/pages/SetupProfile";
import Terms from "@/pages/Terms";
import VolunteerDashboard from "@/pages/VolunteerDashboard";

// Public pages with nav + footer
function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

// Dashboard pages with nav only
function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  );
}

function AppRoutes() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/">
        <PublicLayout>
          <Landing />
        </PublicLayout>
      </Route>
      <Route path="/about">
        <PublicLayout>
          <About />
        </PublicLayout>
      </Route>
      <Route path="/how-it-works">
        <PublicLayout>
          <HowItWorks />
        </PublicLayout>
      </Route>
      <Route path="/blog">
        <PublicLayout>
          <Blog />
        </PublicLayout>
      </Route>
      <Route path="/contact">
        <PublicLayout>
          <Contact />
        </PublicLayout>
      </Route>
      <Route path="/privacy">
        <PublicLayout>
          <Privacy />
        </PublicLayout>
      </Route>
      <Route path="/terms">
        <PublicLayout>
          <Terms />
        </PublicLayout>
      </Route>

      {/* Auth Routes */}
      <Route path="/register">
        <DashboardLayout>
          <Register />
        </DashboardLayout>
      </Route>
      <Route path="/login">
        <DashboardLayout>
          <Login />
        </DashboardLayout>
      </Route>
      <Route path="/setup-profile">
        <DashboardLayout>
          <SetupProfile />
        </DashboardLayout>
      </Route>

      {/* Protected Dashboard Routes */}
      <Route path="/dashboard/host">
        <DashboardLayout>
          <ProtectedRoute allowedRole={Role.host}>
            <HostDashboard />
          </ProtectedRoute>
        </DashboardLayout>
      </Route>
      <Route path="/dashboard/ngo">
        <DashboardLayout>
          <ProtectedRoute allowedRole={Role.ngo}>
            <NgoDashboard />
          </ProtectedRoute>
        </DashboardLayout>
      </Route>
      <Route path="/dashboard/volunteer">
        <DashboardLayout>
          <ProtectedRoute allowedRole={Role.volunteer}>
            <VolunteerDashboard />
          </ProtectedRoute>
        </DashboardLayout>
      </Route>
      <Route path="/dashboard/admin">
        <DashboardLayout>
          <ProtectedRoute allowedRole={Role.admin}>
            <AdminDashboard />
          </ProtectedRoute>
        </DashboardLayout>
      </Route>

      {/* 404 fallback */}
      <Route path="*">
        <PublicLayout>
          <div className="flex items-center justify-center min-h-[60vh] text-center px-4">
            <div>
              <p className="font-display text-8xl font-black text-muted/30 mb-4">
                404
              </p>
              <h1 className="font-display text-3xl font-bold text-foreground mb-3">
                Page Not Found
              </h1>
              <p className="text-muted-foreground mb-6">
                The page you're looking for doesn't exist.
              </p>
              <a
                href="/"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Back to Home
              </a>
            </div>
          </div>
        </PublicLayout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <RouterProvider>
      <Toaster position="top-right" richColors />
      <AppRoutes />
    </RouterProvider>
  );
}

export default App;
