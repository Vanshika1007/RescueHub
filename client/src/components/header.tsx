import { useMemo, useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { 
  Menu, 
  X, 
  Zap, 
  AlertTriangle, 
  Users, 
  Heart, 
  BarChart3, 
  Globe, 
  Sun, 
  Moon 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Header() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentLang, setCurrentLang] = useState("English");
  const langMenuRef = useRef<HTMLDetailsElement>(null);

  // Scroll detection for header styling
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Theme toggle functionality
  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Close language dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      const details = langMenuRef.current;
      if (!details) return;
      if (!details.open) return;

      const target = event.target as Node | null;
      if (target && details.contains(target)) return;
      details.removeAttribute("open");
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        langMenuRef.current?.open && langMenuRef.current.removeAttribute("open");
      }
    };

    document.addEventListener("mousedown", handleDocumentClick);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Navigation items with proper text (no i18n dependency)
  const navigation = useMemo(() => [
    { name: "Emergency Help", href: "/emergency", icon: AlertTriangle, color: "text-orange-500" },
    { name: "Become a Volunteer", href: "/volunteer", icon: Users, color: "text-blue-500" },
    { name: "Disaster Info", href: "/disaster-info", icon: Globe, color: "text-green-500" },
    { name: "NGO Connect", href: "/ngo", icon: BarChart3, color: "text-purple-500" },
    { name: "Donation", href: "/donate", icon: Heart, color: "text-red-500" },
  ], []);

  // Language options
  const languages = [
    { label: "English", value: "en" },
    { label: "हिंदी", value: "hi" },
    { label: "বাংলা", value: "bn" },
    { label: "தமிழ்", value: "ta" },
    { label: "ગુજરાતી", value: "gu" },
    { label: "ಕನ್ನಡ", value: "kn" },
    { label: "తెలుగు", value: "te" },
    { label: "മലയാളം", value: "ml" },
    { label: "ਪੰਜਾਬੀ", value: "pa" },
    { label: "मराठी", value: "mr" },
  ];

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      isScrolled 
        ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-200 dark:border-gray-800" 
        : "bg-white dark:bg-gray-900 shadow-sm"
    }`}>
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          
          {/* LEFT SECTION - Logo & Name (Far Left) */}
          <div className="flex items-center min-w-0 flex-shrink-0">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <img 
                  src="../src/photos/Rescue_Logo.jpg" 
                  alt="RescueHub Logo" 
                  className="h-10 w-10 rounded-lg shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-red-500/10 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="hidden sm:block">
                <div className="text-xl font-bold bg-gradient-to-r from-red-500 to-red-600 dark:from-red-400 dark:to-red-500 bg-clip-text text-transparent">
                  RescueHub
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium -mt-1">
                  Emergency Response Network
                </div>
              </div>
            </Link>
          </div>

          {/* CENTER SECTION - Navigation (Absolutely Centered) */}
          <div className="absolute left-1/2 transform -translate-x-1/2 hidden lg:block">
            <nav className="flex items-center space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.href;
                
                return (
                  <Link key={item.name} href={item.href}>
                    <Button
                      variant="ghost"
                      className={`relative px-4 py-2 h-10 font-medium transition-all duration-200 group focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 ${
                        isActive 
                          ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 shadow-sm" 
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white"
                      } focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-800/50 active:bg-gray-100 dark:active:bg-gray-800`}
                    >
                      <Icon className={`w-4 h-4 mr-2 transition-all duration-200 ${
                        isActive ? item.color : "text-current"
                      } group-hover:scale-110`} />
                      {item.name}
                      {isActive && (
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-0.5 bg-gradient-to-r from-red-500 to-red-600 rounded-full"></div>
                      )}
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* RIGHT SECTION - Language & Dark Mode (Far Right) */}
          <div className="flex items-center space-x-3 min-w-0 flex-shrink-0">
            
            {/* Language Selector */}
            <details ref={langMenuRef} className="relative">
              <summary className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                <Globe className="w-4 h-4 text-red-500 dark:text-red-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {currentLang}
                </span>
              </summary>
              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50 backdrop-blur-sm">
                {languages.map((language) => (
                  <button
                    key={language.value}
                    onClick={() => {
                      setCurrentLang(language.label);
                      langMenuRef.current?.removeAttribute("open");
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150 focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-700/50 ${
                      currentLang === language.label 
                        ? "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 font-medium" 
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {language.label}
                  </button>
                ))}
              </div>
            </details>

            {/* Dark Mode Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className="p-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 active:bg-gray-100 dark:active:bg-gray-800"
            >
              {isDark ? (
                <Sun className="h-4 w-4 text-yellow-500" />
              ) : (
                <Moon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              )}
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="lg:hidden p-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 active:bg-gray-100 dark:active:bg-gray-800"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              
              <SheetContent side="right" className="w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800">
                <div className="flex flex-col h-full">
                  
                  {/* Mobile Header */}
                  <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-center space-x-3">
                      <img src="/Rescue_Logo.jpg" alt="RescueHub Logo" className="h-8 w-8 rounded-lg shadow-sm" />
                      <div>
                        <div className="text-lg font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                          RescueHub
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Emergency Response</div>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Navigation */}
                  <nav className="flex-1 py-6">
                    <div className="space-y-2">
                      {navigation.map((item) => {
                        const Icon = item.icon;
                        const isActive = location === item.href;
                        
                        return (
                          <Link key={item.name} href={item.href}>
                            <Button
                              variant="ghost"
                              onClick={() => setIsOpen(false)}
                              className={`w-full justify-start px-4 py-3 h-auto font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                                isActive 
                                  ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400" 
                                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                              } active:bg-gray-100 dark:active:bg-gray-800`}
                            >
                              <Icon className={`w-5 h-5 mr-3 ${
                                isActive ? item.color : "text-current"
                              }`} />
                              {item.name}
                            </Button>
                          </Link>
                        );
                      })}
                    </div>
                  </nav>

                  {/* Mobile Footer Controls */}
                  <div className="border-t border-gray-200 dark:border-gray-800 pt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Language & Theme</span>
                    </div>
                    <div className="flex space-x-3">
                      <details className="relative flex-1">
                        <summary className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                          <Globe className="w-4 h-4 text-red-500" />
                          <span className="text-sm">{currentLang}</span>
                        </summary>
                        <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border py-2 z-50">
                          {languages.map((language) => (
                            <button
                              key={language.value}
                              onClick={() => {
                                setCurrentLang(language.label);
                              }}
                              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-700 ${
                                currentLang === language.label ? "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 font-medium" : "text-gray-700 dark:text-gray-300"
                              }`}
                            >
                              {language.label}
                            </button>
                          ))}
                        </div>
                      </details>
                      
                      <Button
                        variant="outline"
                        onClick={toggleTheme}
                        className="px-3 py-2 border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 active:bg-gray-100 dark:active:bg-gray-800"
                      >
                        {isDark ? (
                          <Sun className="h-4 w-4" />
                        ) : (
                          <Moon className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
