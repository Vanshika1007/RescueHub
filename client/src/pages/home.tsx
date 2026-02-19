import Hero from "@/components/hero";
import NewsTicker from "@/components/news-ticker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Heart, 
  Users, 
  Zap, 
  Shield, 
  Wifi, 
  Brain, 
  Box,
  Phone,
  MessageCircle,
  Mail,
  Satellite,
  Star,
  CheckCircle,
  Cross,
  HandHeart,
  ShieldCheck,
  Globe,
  Building,
  Smartphone,
  Monitor,
  MessageSquare,
  SatelliteDish,
  ArrowRight,
  Mic,
  AlertTriangle
} from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { DonationsResponse, CampaignsResponse, Donation, Campaign } from "@/types/api";
import { useI18n } from "@/lib/i18n";


export default function Home() {
  const { t } = useI18n();
  
  const { data: recentDonations } = useQuery<DonationsResponse, Error, Donation[]>({
    queryKey: ["/api/donations/recent"],
    select: (data) => data?.donations || [],
  });


  const { data: currentCampaign } = useQuery<CampaignsResponse, Error, Campaign | null>({
    queryKey: ["/api/campaigns"],
    select: (data) => data?.campaigns?.[0] || null,
  });


  const campaignProgress = currentCampaign 
    ? (parseFloat(currentCampaign.raisedAmount) / parseFloat(currentCampaign.targetAmount)) * 100
    : 78;


  return (
    <div data-testid="page-home">
      {/* UPDATED HERO SECTION WITH DONATION PAGE STYLING */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
             style={{backgroundImage: "url('https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')"}}></div>
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>
        
        {/* Hero Content - Using Donation Page Styling */}
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {/* Main Heading - Donation Page Style */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8 drop-shadow-2xl text-white">
            One Platform for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
              Disaster Relief
            </span>
          </h1>

          {/* Subtitle - Donation Page Typography */}
          <div className="mb-16 max-w-5xl mx-auto">
            <p className="text-xl md:text-2xl lg:text-3xl leading-relaxed text-white drop-shadow-lg mb-4">
              <span className="font-medium italic text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400 block mb-2 text-2xl md:text-3xl lg:text-4xl">
                Fast, Transparent, Real-Time
              </span>
              <span className="text-lg md:text-xl lg:text-2xl text-gray-100">
                Connecting survivors, volunteers, and NGOs when every second counts.
              </span>
            </p>
          </div>

          {/* Action Buttons - Donation Page Colors */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-6xl mx-auto">
            
            {/* Request Help Button - Orange to Red gradient style */}
            <Link href="/emergency">
              <div className="group relative">
                <Button className="relative bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-10 py-6 text-lg font-bold rounded-2xl shadow-2xl transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-3xl border-2 border-white/20 backdrop-blur-sm min-w-[250px] h-16">
                  <AlertTriangle className="mr-3 h-6 w-6" />
                  Request Help
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                </Button>
              </div>
            </Link>

            {/* Volunteer Button - Blue gradient style */}
            <Link href="/volunteer">
              <div className="group relative">
                <Button className="relative bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-10 py-6 text-lg font-bold rounded-2xl shadow-2xl transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-3xl border-2 border-white/20 backdrop-blur-sm min-w-[250px] h-16">
                  <Users className="mr-3 h-6 w-6" />
                  Volunteer
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                </Button>
              </div>
            </Link>

            {/* Donate Button - Green gradient style */}
            <Link href="/donate">
              <div className="group relative">
                <Button className="relative bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-10 py-6 text-lg font-bold rounded-2xl shadow-2xl transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-3xl border-2 border-white/20 backdrop-blur-sm min-w-[250px] h-16">
                  <Heart className="mr-3 h-6 w-6" />
                  Donate
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                </Button>
              </div>
            </Link>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-1 h-12 bg-white/60 rounded-full"></div>
          </div>
        </div>
      </section>
      {/* END OF HERO SECTION UPDATES */}

      <NewsTicker />

      {/* Emergency Request System - UNCHANGED */}
      <section className="py-16 bg-muted/30" data-testid="section-emergency-system">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">{t("emergency_system_title")}</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("emergency_system_subtitle")}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-stretch">
            <div className="order-2 lg:order-1">
              <img 
                src="https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Disaster relief volunteers helping community members" 
                className="rounded-xl shadow-2xl w-full"
                data-testid="img-emergency-volunteers"
              />
            </div>
            
            <div className="order-1 lg:order-2">
              <Card className="shadow-lg h-full">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Request Emergency Assistance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-0">
                  <div className="grid grid-cols-2 gap-3 mb-2">
                    <Link href="/emergency?mode=voice">
                      <Button className="w-full px-4 py-3 border border-red-600 text-red-600 bg-transparent hover:bg-red-600 hover:text-white">
                        <Mic className="mr-2 h-4 w-4" />
                        Start Voice Recording
                      </Button>
                    </Link>
                    <Link href="/emergency?mode=form">
                      <Button className="w-full px-4 py-3 border border-red-600 text-red-600 bg-transparent hover:bg-red-600 hover:text-white">
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        Fill Emergency Form
                      </Button>
                    </Link>
                  </div>

                  <Link href="/emergency">
                    <Button className="w-full bg-red-600 text-white px-6 py-4 rounded-lg font-semibold text-lg hover:bg-red-700 transform hover:scale-105 transition-all duration-200" data-testid="button-emergency-request">
                      Send Emergency Request
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Rest of the sections remain exactly the same... */}
      {/* Volunteer Registration - UNCHANGED */}
      <section className="py-16 bg-gradient-to-br from-accent/10 to-secondary/10" data-testid="section-volunteer">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">{t("volunteer_network_title")}</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t("volunteer_network_subtitle")}
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card className="p-6 transition-transform duration-200 hover:scale-105 hover:shadow-xl">
                  <Heart className="text-3xl text-primary mb-4 h-8 w-8" />
                  <h3 className="font-semibold text-foreground mb-2">Medical Response</h3>
                  <p className="text-sm text-muted-foreground">First aid, EMT support, medical supply distribution</p>
                </Card>
                <Card className="p-6 transition-transform duration-200 hover:scale-105 hover:shadow-xl">
                  <Users className="text-3xl text-secondary mb-4 h-8 w-8" />
                  <h3 className="font-semibold text-foreground mb-2">Search & Rescue</h3>
                  <p className="text-sm text-muted-foreground">Missing person searches, evacuation assistance</p>
                </Card>
                <Card className="p-6 transition-transform duration-200 hover:scale-105 hover:shadow-xl">
                  <Zap className="text-3xl text-accent mb-4 h-8 w-8" />
                  <h3 className="font-semibold text-foreground mb-2">Emergency Repair</h3>
                  <p className="text-sm text-muted-foreground">Infrastructure repair, debris clearing</p>
                </Card>
                <Card className="p-6 transition-transform duration-200 hover:scale-105 hover:shadow-xl">
                  <Shield className="text-3xl text-emergency-green mb-4 h-8 w-8" />
                  <h3 className="font-semibold text-foreground mb-2">Logistics Support</h3>
                  <p className="text-sm text-muted-foreground">Supply transport, coordination assistance</p>
                </Card>
              </div>

              <Link href="/volunteer">
                <Button className="bg-red-600 text-white px-10 py-4 rounded-lg font-semibold text-lg hover:bg-red-700 transform hover:scale-105 transition-all duration-200 w-full md:w-auto ml-6 md:ml-12" data-testid="button-volunteer-register">
                  <Users className="mr-2 h-5 w-5" />
                  Register as Volunteer
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            <div className="space-y-6">
              <img 
                src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                alt="Volunteers working together in disaster response" 
                className="rounded-xl shadow-lg w-full lg:h-[400px] object-cover"
                data-testid="img-volunteers-working"
              />
            </div>
          </div>
        </div>
      </section>

      {/* All other sections remain exactly the same... */}
      {/* Donation Tracking - UNCHANGED */}
      <section className="py-16 bg-background" data-testid="section-donation">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">{t("transparent_donations_title")}</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("transparent_donations_subtitle")}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Current Campaign */}
            <div className="lg:col-span-2">
              <Card className="shadow-lg p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      {currentCampaign?.title || "Hurricane Relief Fund 2024"}
                    </h3>
                    <p className="text-muted-foreground">
                      {currentCampaign?.description || "Providing immediate aid to hurricane-affected communities across the Southeast region."}
                    </p>
                  </div>
                  <Badge className="bg-primary/10 text-primary">Active</Badge>
                </div>

                <img 
                  src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400" 
                  alt="Aid distribution and community support" 
                  className="rounded-lg w-full h-64 object-cover mb-6"
                  data-testid="img-aid-distribution"
                />

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground font-medium">Progress</span>
                    <span className="text-foreground font-medium">
                      ${currentCampaign ? parseFloat(currentCampaign.raisedAmount).toLocaleString() : "2,347,890"} of ${currentCampaign ? parseFloat(currentCampaign.targetAmount).toLocaleString() : "3,000,000"}
                    </span>
                  </div>
                  <Progress value={campaignProgress} className="h-3" />
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div data-testid="stat-donors">
                      <div className="text-2xl font-bold text-foreground">12,456</div>
                      <div className="text-sm text-muted-foreground">Donors</div>
                    </div>
                    <div data-testid="stat-days-left">
                      <div className="text-2xl font-bold text-foreground">18</div>
                      <div className="text-sm text-muted-foreground">Days Left</div>
                    </div>
                    <div data-testid="stat-people-helped">
                      <div className="text-2xl font-bold text-foreground">8,932</div>
                      <div className="text-sm text-muted-foreground">People Helped</div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-4 gap-3">
                  <Button variant="outline" className="bg-primary/10 text-primary hover:bg-primary/20">$25</Button>
                  <Button variant="outline" className="bg-primary/10 text-primary hover:bg-primary/20">$50</Button>
                  <Button variant="outline" className="bg-primary/10 text-primary hover:bg-primary/20">$100</Button>
                  <Link href="/donate">
                    <Button className="w-full bg-red-600 text-white hover:bg-red-700" data-testid="button-donate-custom">
                      Custom
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>

            {/* Donation Form & Blockchain Track */}
            <div className="space-y-6">
              <Card className="shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-foreground">Blockchain Transparency</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Box className="text-accent h-4 w-4" />
                      <span className="text-sm font-medium text-foreground">Latest Block</span>
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">#4A7B9C</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="text-emergency-green h-4 w-4" />
                      <span className="text-sm font-medium text-foreground">Verified Tx</span>
                    </div>
                    <span className="text-xs text-muted-foreground">2,847</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Shield className="text-accent h-4 w-4" />
                      <span className="text-sm font-medium text-foreground">Transparency</span>
                    </div>
                    <span className="text-xs text-emergency-green font-medium">100%</span>
                  </div>
                </div>
                <Button variant="ghost" className="w-full mt-4 text-center text-accent hover:text-accent/80 font-medium text-sm">
                  View Full Blockchain Record
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* NGO & Partners Section - UNCHANGED */}
      <section className="py-16 bg-background" data-testid="section-partners">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Trusted Partners</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Working with leading NGOs, government agencies, and tech companies to maximize disaster relief impact.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              { name: "Red Cross", desc: "Global humanitarian network", icon: Cross },
              { name: "UNICEF", desc: "Children's emergency relief", icon: HandHeart },
              { name: "FEMA", desc: "Federal emergency management", icon: ShieldCheck },
              { name: "UN OCHA", desc: "UN humanitarian coordination", icon: Globe }
            ].map((partner, index) => {
              const Icon = partner.icon;
              return (
                <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="text-white h-8 w-8" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{partner.name}</h3>
                  <p className="text-sm text-muted-foreground">{partner.desc}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Technology & Features - UNCHANGED */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-accent/5" data-testid="section-technology">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Advanced Technology Stack</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built with cutting-edge technology to ensure reliability, security, and accessibility even in the most challenging disaster scenarios.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <Card className="p-8 shadow-lg transition-transform duration-200 hover:scale-105 hover:shadow-xl">
              <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mb-6">
                <Wifi className="text-white h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-foreground">React + TypeScript</h3>
              <p className="text-muted-foreground mb-6">
                Frontend built with React 18 and TypeScript for a fast, type-safe SPA. Bundled with a modern toolchain for rapid iteration.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center text-muted-foreground">
                  <CheckCircle className="text-emergency-green mr-2 h-4 w-4" />
                  Component-driven architecture
                </li>
                <li className="flex items-center text-muted-foreground">
                  <CheckCircle className="text-emergency-green mr-2 h-4 w-4" />
                  Strict typing and DX improvements
                </li>
                <li className="flex items-center text-muted-foreground">
                  <CheckCircle className="text-emergency-green mr-2 h-4 w-4" />
                  Fast dev server & HMR
                </li>
              </ul>
            </Card>

            <Card className="p-8 shadow-lg transition-transform duration-200 hover:scale-105 hover:shadow-xl">
              <div className="w-16 h-16 bg-secondary rounded-xl flex items-center justify-center mb-6">
                <Brain className="text-white h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-foreground">Tailwind CSS + shadcn/ui</h3>
              <p className="text-muted-foreground mb-6">
                Utility-first styling with Tailwind and accessible components from shadcn/ui. Iconography powered by Lucide.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center text-muted-foreground">
                  <CheckCircle className="text-emergency-green mr-2 h-4 w-4" />
                  Responsive, accessible UI
                </li>
                <li className="flex items-center text-muted-foreground">
                  <CheckCircle className="text-emergency-green mr-2 h-4 w-4" />
                  Prebuilt primitives (Button, Card, Sheet)
                </li>
                <li className="flex items-center text-muted-foreground">
                  <CheckCircle className="text-emergency-green mr-2 h-4 w-4" />
                  Lucide icons integration
                </li>
              </ul>
            </Card>

            <Card className="p-8 shadow-lg transition-transform duration-200 hover:scale-105 hover:shadow-xl">
              <div className="w-16 h-16 bg-accent rounded-xl flex items-center justify-center mb-6">
                <Box className="text-white h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-foreground">TanStack Query + Wouter + Node/Express</h3>
              <p className="text-muted-foreground mb-6">
                Data fetching/caching via TanStack Query and lightweight routing with Wouter. Backend served by a Node/Express API in the same repo.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center text-muted-foreground">
                  <CheckCircle className="text-emergency-green mr-2 h-4 w-4" />
                  Request caching, retries, and status management
                </li>
                <li className="flex items-center text-muted-foreground">
                  <CheckCircle className="text-emergency-green mr-2 h-4 w-4" />
                  Minimal client routing (Wouter)
                </li>
                <li className="flex items-center text-muted-foreground">
                  <CheckCircle className="text-emergency-green mr-2 h-4 w-4" />
                  REST endpoints with Express
                </li>
              </ul>
            </Card>
          </div>

          <Card className="shadow-lg p-8">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-6 text-foreground">Multi-Platform Accessibility</h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-4 bg-muted/30 rounded-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:bg-muted/40">
                    <Smartphone className="h-12 w-12 text-primary mb-3 mx-auto" />
                    <h4 className="font-medium text-foreground">Mobile First</h4>
                    <p className="text-xs text-muted-foreground">iOS & Android PWA</p>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:bg-muted/40">
                    <Monitor className="h-12 w-12 text-secondary mb-3 mx-auto" />
                    <h4 className="font-medium text-foreground">Web Platform</h4>
                    <p className="text-xs text-muted-foreground">All modern browsers</p>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:bg-muted/40">
                    <MessageSquare className="h-12 w-12 text-accent mb-3 mx-auto" />
                    <h4 className="font-medium text-foreground">SMS Gateway</h4>
                    <p className="text-xs text-muted-foreground">Basic phone support</p>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:bg-muted/40">
                    <SatelliteDish className="h-12 w-12 text-emergency-green mb-3 mx-auto" />
                    <h4 className="font-medium text-foreground">Satellite Link</h4>
                    <p className="text-xs text-muted-foreground">Emergency connectivity</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  Designed to work on any device, from smartphones to feature phones, ensuring no one is left behind during emergencies.
                </p>
              </div>

              <div className="bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl p-6">
                <h4 className="font-bold text-foreground mb-4">Technical Specifications</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center rounded-md px-3 py-2 transition-colors hover:bg-muted/40">
                    <span className="text-sm text-muted-foreground">Frontend Framework</span>
                    <span className="text-sm font-medium text-foreground">React + TypeScript</span>
                  </div>
                  <div className="flex justify-between items-center rounded-md px-3 py-2 transition-colors hover:bg-muted/40">
                    <span className="text-sm text-muted-foreground">Styling & UI</span>
                    <span className="text-sm font-medium text-foreground">Tailwind CSS + shadcn/ui + Lucide</span>
                  </div>
                  <div className="flex justify-between items-center rounded-md px-3 py-2 transition-colors hover:bg-muted/40">
                    <span className="text-sm text-muted-foreground">State & Data</span>
                    <span className="text-sm font-medium text-foreground">TanStack Query</span>
                  </div>
                  <div className="flex justify-between items-center rounded-md px-3 py-2 transition-colors hover:bg-muted/40">
                    <span className="text-sm text-muted-foreground">Routing</span>
                    <span className="text-sm font-medium text-foreground">Wouter</span>
                  </div>
                  <div className="flex justify-between items-center rounded-md px-3 py-2 transition-colors hover:bg-muted/40">
                    <span className="text-sm text-muted-foreground">Server API</span>
                    <span className="text-sm font-medium text-foreground">Node.js + Express</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Emergency Contact & Support - UNCHANGED */}
      <section className="py-16 bg-background" data-testid="section-contact">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">24/7 Emergency Support</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our dedicated support team is always ready to assist during emergencies. Multiple ways to reach us when you need help most.
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-6 mb-12">
            {[
              { icon: Phone, title: "Emergency Hotline", value: "1-800-AGNIAID", desc: "24/7 multilingual support" },
              { icon: MessageCircle, title: "Live Chat", value: "Instant Messaging", desc: "AI-powered quick responses" },
              { icon: Mail, title: "Email Support", value: "emergency@agniaid.org", desc: "Priority response guaranteed" },
              { icon: Satellite, title: "Satellite Link", value: "Emergency Only", desc: "When all else fails" }
            ].map((contact, index) => {
              const Icon = contact.icon;
              return (
                <Card key={index} className="p-6 shadow-lg text-center hover:shadow-xl transition-shadow">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="text-white h-8 w-8" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{contact.title}</h3>
                  <p className="text-lg font-medium text-foreground mb-2">{contact.value}</p>
                  <p className="text-sm text-muted-foreground">{contact.desc}</p>
                </Card>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-stretch">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                alt="Support team helping disaster victims remotely" 
                className="rounded-xl shadow-lg w-full h-full object-cover"
                data-testid="img-support-team"
              />
              
            </div>

            <Card className="shadow-lg p-8 h-full">
              <h3 className="text-2xl font-bold mb-6 text-foreground">Quick Contact Form</h3>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Name</label>
                    <input type="text" className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-ring focus:border-ring" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
                    <input type="tel" className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-ring focus:border-ring" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Priority Level</label>
                  <select className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-ring focus:border-ring">
                    <option>Emergency - Immediate Response</option>
                    <option>Urgent - Within 1 Hour</option>
                    <option>Normal - Within 24 Hours</option>
                    <option>General Inquiry</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                  <textarea rows={4} className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-ring focus:border-ring resize-none"></textarea>
                </div>
                <Button type="submit" className="w-full bg-red-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-red-700 transition-colors">
                  <Mail className="mr-2 h-5 w-5" />
                  Send Message
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
