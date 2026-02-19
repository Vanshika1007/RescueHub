import { Switch, Route } from "wouter";
import { Component, ReactNode, useEffect, useMemo, useState } from "react";
import NotFound from "./pages/not-found";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/header";
import Footer from "@/components/footer";
import FloatingEmergency from "@/components/floating-emergency";
import Home from "@/pages/home";
import EmergencyRequest from "@/pages/emergency-request";
import Volunteer from "@/pages/volunteer";
import DisasterInfo from "@/pages/disaster-info";
import Donate from "@/pages/donate";
import Dashboard from "@/pages/dashboard";
import { I18nProvider } from "@/lib/i18n";
import Register from "@/pages/register";

function Router() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/emergency" component={EmergencyRequest} />
          <Route path="/emergency-help" component={EmergencyRequest} />
          <Route path="/emergency-request" component={EmergencyRequest} />
          <Route path="/become-a-volunteer" component={Volunteer} />
          <Route path="/volunteer" component={Volunteer} />
          <Route path="/disaster-info" component={DisasterInfo} />
          <Route path="/donate" component={Donate} />
          <Route path="/donation" component={Donate} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/register" component={Register} />
          <Route path="/ngo-connect" component={NgoConnect} />
          <Route path="/ngo-info" component={NgoConnect} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
      <FloatingEmergency />
    </div>
  );
}

function NgoConnect() {
  const [isDevUp, setIsDevUp] = useState(true);
  const devUrl = useMemo(() => "http://localhost:8080", []);
  const fallbackUrl = useMemo(() => "/ngo-static/index.html", []);

  useEffect(() => {
    let didCancel = false;

    fetch(devUrl, { method: "GET" })
      .then((r) => { if (!didCancel) setIsDevUp(r.ok); })
      .catch(() => { if (!didCancel) setIsDevUp(false); });

    return () => { didCancel = true; };
  }, [devUrl]);

  const src = isDevUp ? devUrl : fallbackUrl;

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">NGO Connect</h1>
        <p className="text-muted-foreground mb-6">
          Manage NGO operations and requests
        </p>
        
        <div className="mb-4 p-3 bg-muted rounded">
          <small>{isDevUp ? "Dev server" : "Static fallback"}</small>
        </div>

        {!isDevUp && (
          <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded">
            Could not reach dev server at {devUrl}. Serving static fallback if available.
          </div>
        )}

        <iframe
          src={src}
          className="w-full h-[800px] border border-border rounded-lg"
          title="NGO Dashboard"
        />
      </div>
    </div>
  );
}

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; message?: string }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, message: error?.message || String(error) };
  }

  componentDidCatch(error: any, info: any) {
    console.error("UI crashed:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive mb-4">Something went wrong</h1>
            <p className="text-muted-foreground mb-4">{this.state.message}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children as any;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <I18nProvider>
          <TooltipProvider>
            <Router />
            <Toaster />
          </TooltipProvider>
        </I18nProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
