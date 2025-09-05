import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, HandHeart, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Header() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: "Emergency", href: "/emergency", icon: AlertTriangle },
    { name: "Volunteer", href: "/volunteer" },
    { name: "Donate", href: "/donate" },
    { name: "Dashboard", href: "/dashboard" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border" data-testid="header-main">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" data-testid="link-home">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <HandHeart className="text-white h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">AgniAid</h1>
                <p className="text-xs text-muted-foreground">Disaster Relief Platform</p>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.name} href={item.href} data-testid={`link-${item.name.toLowerCase()}`}>
                  <div className={`text-sm font-medium transition-colors flex items-center gap-1 ${
                    location === item.href 
                      ? "text-primary" 
                      : "text-foreground hover:text-primary"
                  }`}>
                    {Icon && <Icon className="h-4 w-4" />}
                    {item.name}
                  </div>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center space-x-3">
            <Button 
              className="emergency-pulse bg-primary text-primary-foreground hover:bg-primary/90"
              data-testid="button-sos"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              SOS
            </Button>
            
            {/* Mobile menu */}
            <div className="md:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" data-testid="button-mobile-menu">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <div className="flex flex-col space-y-4 mt-6">
                    {navigation.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link 
                          key={item.name} 
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          data-testid={`link-mobile-${item.name.toLowerCase()}`}
                        >
                          <div className={`text-lg font-medium transition-colors flex items-center gap-2 p-2 rounded-md ${
                            location === item.href 
                              ? "text-primary bg-primary/10" 
                              : "text-foreground hover:text-primary hover:bg-muted"
                          }`}>
                            {Icon && <Icon className="h-5 w-5" />}
                            {item.name}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
