import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { Route, RouterProvider, Switch } from "@/lib/router";
import ITLeadManager from "@/pages/ITLeadManager";

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function AppRoutes() {
  return (
    <Switch>
      <Route path="/">
        <AppLayout>
          <ITLeadManager />
        </AppLayout>
      </Route>
      <Route path="*">
        <AppLayout>
          <ITLeadManager />
        </AppLayout>
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
