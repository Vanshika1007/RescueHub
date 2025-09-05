import { AlertCircle, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";

export default function Hero() {
  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const statsData = stats?.stats || {
    activeCases: 0,
    volunteers: 0,
    donationsRaised: "0",
    livesHelped: 0,
  };

  return (
    <section className="relative overflow-hidden" data-testid="section-hero">
      {/* Hero Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080" 
          alt="Emergency response team coordinating disaster relief efforts" 
          className="w-full h-full object-cover"
          data-testid="img-hero-background"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-secondary/80"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-shadow" data-testid="text-hero-title">
            No Cry for Help
            <span className="block text-secondary">Goes Unheard</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto" data-testid="text-hero-description">
            Offline-first disaster relief platform connecting survivors, volunteers, NGOs, and donors with AI-powered coordination and blockchain transparency.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/emergency">
              <Button 
                size="lg" 
                className="bg-white text-primary px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/95 transform hover:scale-105 transition-all duration-200"
                data-testid="button-emergency-help"
              >
                <AlertCircle className="mr-2 h-5 w-5" />
                Request Emergency Help
              </Button>
            </Link>
            <Link href="/volunteer">
              <Button 
                size="lg"
                className="bg-secondary text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-secondary/90 transform hover:scale-105 transition-all duration-200"
                data-testid="button-volunteer-now"
              >
                <Heart className="mr-2 h-5 w-5" />
                Volunteer Now
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4" data-testid="stat-active-cases">
              <div className="text-3xl font-bold text-white">{statsData.activeCases.toLocaleString()}</div>
              <div className="text-white/80 text-sm">Active Cases</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4" data-testid="stat-volunteers">
              <div className="text-3xl font-bold text-white">{statsData.volunteers.toLocaleString()}</div>
              <div className="text-white/80 text-sm">Volunteers</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4" data-testid="stat-donations">
              <div className="text-3xl font-bold text-white">${parseFloat(statsData.donationsRaised).toLocaleString(undefined, {maximumFractionDigits: 0})}M</div>
              <div className="text-white/80 text-sm">Raised</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4" data-testid="stat-lives-helped">
              <div className="text-3xl font-bold text-white">{statsData.livesHelped.toLocaleString()}</div>
              <div className="text-white/80 text-sm">Lives Helped</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
