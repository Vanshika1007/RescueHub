import Hero from "@/components/hero";
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
  SatelliteDish
} from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { data: donationsData } = useQuery({
    queryKey: ["/api/donations/recent"],
    select: (data) => data?.donations || [],
  });

  const { data: campaignsData } = useQuery({
    queryKey: ["/api/campaigns"],
    select: (data) => data?.campaigns?.[0] || null,
  });

  const recentDonations = donationsData || [];
  const currentCampaign = campaignsData;

  const campaignProgress = currentCampaign 
    ? (parseFloat(currentCampaign.raisedAmount) / parseFloat(currentCampaign.targetAmount)) * 100
    : 78;

  return (
    <div data-testid="page-home">
      <Hero />

      {/* Emergency Request System */}
      <section className="py-16 bg-muted/30" data-testid="section-emergency-system">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Emergency Help Request</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Fast, AI-powered emergency response system that works offline and connects you to immediate help.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <img 
                src="https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Disaster relief volunteers helping community members" 
                className="rounded-xl shadow-2xl w-full"
                data-testid="img-emergency-volunteers"
              />
            </div>
            
            <div className="order-1 lg:order-2">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Request Emergency Assistance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <Button variant="outline" className="px-4 py-3 border-emergency-yellow bg-emergency-yellow/10 text-emergency-yellow hover:bg-emergency-yellow/20">
                      <Zap className="mr-2 h-4 w-4" />
                      Low
                    </Button>
                    <Button variant="outline" className="px-4 py-3 border-secondary bg-secondary/10 text-secondary hover:bg-secondary/20">
                      <Zap className="mr-2 h-4 w-4" />
                      Medium
                    </Button>
                    <Button className="px-4 py-3 bg-primary text-primary-foreground hover:bg-primary/90">
                      <Zap className="mr-2 h-4 w-4" />
                      Critical
                    </Button>
                  </div>
                  <Link href="/emergency">
                    <Button className="w-full bg-primary text-primary-foreground px-6 py-4 rounded-lg font-semibold text-lg hover:bg-primary/90 transform hover:scale-105 transition-all duration-200" data-testid="button-emergency-request">
                      <Heart className="mr-2 h-5 w-5" />
                      Send Emergency Request
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Volunteer Registration */}
      <section className="py-16 bg-gradient-to-br from-accent/10 to-secondary/10" data-testid="section-volunteer">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">Join Our Volunteer Network</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Make a difference when it matters most. Our AI-powered matching system connects your skills with urgent needs in real-time.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card className="p-6">
                  <Heart className="text-3xl text-primary mb-4 h-8 w-8" />
                  <h3 className="font-semibold text-foreground mb-2">Medical Response</h3>
                  <p className="text-sm text-muted-foreground">First aid, EMT support, medical supply distribution</p>
                </Card>
                <Card className="p-6">
                  <Users className="text-3xl text-secondary mb-4 h-8 w-8" />
                  <h3 className="font-semibold text-foreground mb-2">Search & Rescue</h3>
                  <p className="text-sm text-muted-foreground">Missing person searches, evacuation assistance</p>
                </Card>
                <Card className="p-6">
                  <Zap className="text-3xl text-accent mb-4 h-8 w-8" />
                  <h3 className="font-semibold text-foreground mb-2">Emergency Repair</h3>
                  <p className="text-sm text-muted-foreground">Infrastructure repair, debris clearing</p>
                </Card>
                <Card className="p-6">
                  <Shield className="text-3xl text-emergency-green mb-4 h-8 w-8" />
                  <h3 className="font-semibold text-foreground mb-2">Logistics Support</h3>
                  <p className="text-sm text-muted-foreground">Supply transport, coordination assistance</p>
                </Card>
              </div>

              <Link href="/volunteer">
                <Button className="bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary/90 transform hover:scale-105 transition-all duration-200" data-testid="button-volunteer-register">
                  <Users className="mr-2 h-5 w-5" />
                  Register as Volunteer
                </Button>
              </Link>
            </div>

            <div className="space-y-6">
              <img 
                src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                alt="Volunteers working together in disaster response" 
                className="rounded-xl shadow-lg w-full"
                data-testid="img-volunteers-working"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Donation Tracking */}
      <section className="py-16 bg-background" data-testid="section-donation">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Transparent Donations</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Blockchain-powered transparency ensures every dollar reaches those in need. Track your impact in real-time.
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
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" data-testid="button-donate-custom">
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

          {/* Recent Donations */}
          {recentDonations.length > 0 && (
            <Card className="mt-12 shadow-lg p-8">
              <h3 className="text-2xl font-bold mb-6 text-foreground">Recent Impact</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {recentDonations.slice(0, 3).map((donation: any) => (
                  <div key={donation.id} className="bg-muted/50 rounded-lg p-4" data-testid={`donation-${donation.id}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-medium">A</div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(donation.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <h4 className="font-medium text-foreground mb-1">Anonymous Donor</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Donated ${parseFloat(donation.amount).toFixed(2)} for {donation.donationType?.replace('_', ' ')}
                    </p>
                    <div className="text-xs text-accent font-mono">
                      Tx: {donation.blockchainTxHash}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </section>

      {/* Impact Stories & Testimonials */}
      <section className="py-16 bg-muted/30" data-testid="section-impact">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Real Stories, Real Impact</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See how AgniAid has made a difference in the lives of disaster survivors and communities worldwide.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Community members supporting each other during crisis" 
                className="rounded-xl shadow-lg w-full"
                data-testid="img-community-support"
              />
            </div>
            
            <div className="space-y-8">
              <Card className="p-8 shadow-lg">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-xl font-bold">M</div>
                  <div>
                    <h3 className="font-bold text-foreground text-lg">Maria Rodriguez</h3>
                    <p className="text-muted-foreground">Hurricane Survivor, Puerto Rico</p>
                    <div className="flex text-yellow-400 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <blockquote className="text-muted-foreground italic mb-6">
                  "When Hurricane Maria hit, we lost everything. AgniAid connected us with volunteers who brought food, water, and hope. The blockchain donation tracking gave us confidence that help was real and on the way."
                </blockquote>
                <div className="bg-primary/10 rounded-lg p-4">
                  <div className="text-sm text-primary font-medium">Impact: Received $3,200 in aid • Connected with 12 volunteers • Full recovery within 6 months</div>
                </div>
              </Card>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Dr. James Chen", role: "Emergency Physician & Volunteer", initial: "D" },
              { name: "Lisa Thompson", role: "NGO Director, Hope Foundation", initial: "L" },
              { name: "Robert Kim", role: "Corporate Donor & Tech Executive", initial: "R" }
            ].map((person, index) => (
              <Card key={index} className="p-6 shadow-lg text-center">
                <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                  {person.initial}
                </div>
                <h3 className="font-bold text-foreground text-lg mb-2">{person.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">{person.role}</p>
                <blockquote className="text-muted-foreground italic text-sm mb-4">
                  "AgniAid has transformed how we coordinate relief efforts. The transparency and efficiency is incredible."
                </blockquote>
                <div className="flex justify-center text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* NGO & Partners Section */}
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

      {/* Technology & Features */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-accent/5" data-testid="section-technology">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Advanced Technology Stack</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built with cutting-edge technology to ensure reliability, security, and accessibility even in the most challenging disaster scenarios.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <Card className="p-8 shadow-lg">
              <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mb-6">
                <Wifi className="text-white h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-foreground">Offline-First Architecture</h3>
              <p className="text-muted-foreground mb-6">
                Progressive Web App with service worker caching ensures functionality even without internet connectivity. Critical features work offline and sync when connection is restored.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center text-muted-foreground">
                  <CheckCircle className="text-emergency-green mr-2 h-4 w-4" />
                  Service Worker Implementation
                </li>
                <li className="flex items-center text-muted-foreground">
                  <CheckCircle className="text-emergency-green mr-2 h-4 w-4" />
                  Local Data Storage
                </li>
                <li className="flex items-center text-muted-foreground">
                  <CheckCircle className="text-emergency-green mr-2 h-4 w-4" />
                  Background Sync
                </li>
              </ul>
            </Card>

            <Card className="p-8 shadow-lg">
              <div className="w-16 h-16 bg-secondary rounded-xl flex items-center justify-center mb-6">
                <Brain className="text-white h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-foreground">AI-Powered Matching</h3>
              <p className="text-muted-foreground mb-6">
                Machine learning algorithms analyze survivor needs, volunteer skills, and resource availability to create optimal matches in real-time, maximizing relief effectiveness.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center text-muted-foreground">
                  <CheckCircle className="text-emergency-green mr-2 h-4 w-4" />
                  Skill-Need Matching
                </li>
                <li className="flex items-center text-muted-foreground">
                  <CheckCircle className="text-emergency-green mr-2 h-4 w-4" />
                  Resource Optimization
                </li>
                <li className="flex items-center text-muted-foreground">
                  <CheckCircle className="text-emergency-green mr-2 h-4 w-4" />
                  Predictive Analytics
                </li>
              </ul>
            </Card>

            <Card className="p-8 shadow-lg">
              <div className="w-16 h-16 bg-accent rounded-xl flex items-center justify-center mb-6">
                <Box className="text-white h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-foreground">Blockchain Transparency</h3>
              <p className="text-muted-foreground mb-6">
                Immutable ledger tracks every donation from source to recipient, ensuring complete transparency and preventing fraud in disaster relief operations.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center text-muted-foreground">
                  <CheckCircle className="text-emergency-green mr-2 h-4 w-4" />
                  Immutable Records
                </li>
                <li className="flex items-center text-muted-foreground">
                  <CheckCircle className="text-emergency-green mr-2 h-4 w-4" />
                  Smart Contracts
                </li>
                <li className="flex items-center text-muted-foreground">
                  <CheckCircle className="text-emergency-green mr-2 h-4 w-4" />
                  Real-time Verification
                </li>
              </ul>
            </Card>
          </div>

          <Card className="shadow-lg p-8">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-6 text-foreground">Multi-Platform Accessibility</h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <Smartphone className="h-12 w-12 text-primary mb-3 mx-auto" />
                    <h4 className="font-medium text-foreground">Mobile First</h4>
                    <p className="text-xs text-muted-foreground">iOS & Android PWA</p>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <Monitor className="h-12 w-12 text-secondary mb-3 mx-auto" />
                    <h4 className="font-medium text-foreground">Web Platform</h4>
                    <p className="text-xs text-muted-foreground">All modern browsers</p>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <MessageSquare className="h-12 w-12 text-accent mb-3 mx-auto" />
                    <h4 className="font-medium text-foreground">SMS Gateway</h4>
                    <p className="text-xs text-muted-foreground">Basic phone support</p>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
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
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Offline Storage</span>
                    <span className="text-sm font-medium text-foreground">IndexedDB + LocalStorage</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Real-time Updates</span>
                    <span className="text-sm font-medium text-foreground">WebSocket + Server-Sent Events</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Geolocation</span>
                    <span className="text-sm font-medium text-foreground">GPS + Network Triangulation</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Security</span>
                    <span className="text-sm font-medium text-foreground">End-to-End Encryption</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Blockchain Network</span>
                    <span className="text-sm font-medium text-foreground">Ethereum + IPFS</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Emergency Contact & Support */}
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

          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                alt="Support team helping disaster victims remotely" 
                className="rounded-xl shadow-lg w-full mb-6"
                data-testid="img-support-team"
              />
              
              <div className="bg-muted/30 rounded-xl p-6 mb-6">
                <h4 className="font-bold text-foreground mb-4">Global Support Centers</h4>
                <div className="space-y-3">
                  {["North America", "Europe", "Asia Pacific", "Latin America"].map(region => (
                    <div key={region} className="flex justify-between">
                      <span className="text-muted-foreground">{region}</span>
                      <span className="font-medium text-foreground">Online</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-primary/10 rounded-xl p-6">
                <h4 className="font-bold text-foreground mb-3">Emergency Protocol</h4>
                <ol className="space-y-2 text-sm text-muted-foreground">
                  <li><span className="font-medium text-primary">1.</span> Immediate life-threatening situations: Call local emergency services first (911, 112, etc.)</li>
                  <li><span className="font-medium text-primary">2.</span> Then contact AgniAid hotline for coordination support</li>
                  <li><span className="font-medium text-primary">3.</span> Use app SOS button for instant location sharing</li>
                  <li><span className="font-medium text-primary">4.</span> Follow up with volunteer matching and resource requests</li>
                </ol>
              </div>
            </div>

            <Card className="shadow-lg p-8 h-fit">
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
                <Button type="submit" className="w-full bg-primary text-primary-foreground px-6 py-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
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
