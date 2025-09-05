import DonationForm from "@/components/donation-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Heart, 
  DollarSign, 
  TrendingUp, 
  Shield, 
  Box,
  CheckCircle,
  Users,
  Globe,
  Clock,
  Award
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function Donate() {
  const { data: campaignsData } = useQuery({
    queryKey: ["/api/campaigns"],
    select: (data) => data?.campaigns || [],
  });

  const { data: donationsData } = useQuery({
    queryKey: ["/api/donations/recent"],
    select: (data) => data?.donations || [],
  });

  const campaigns = campaignsData || [];
  const recentDonations = donationsData || [];
  const currentCampaign = campaigns[0];

  const campaignProgress = currentCampaign 
    ? (parseFloat(currentCampaign.raisedAmount) / parseFloat(currentCampaign.targetAmount)) * 100
    : 78;

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  const donationTypes = [
    { type: "Emergency Relief", amount: "$1.2M", percentage: 35, color: "bg-primary" },
    { type: "Medical Supplies", amount: "$890K", percentage: 26, color: "bg-secondary" },
    { type: "Food & Water", amount: "$645K", percentage: 19, color: "bg-accent" },
    { type: "Shelter & Housing", amount: "$420K", percentage: 12, color: "bg-emergency-green" },
    { type: "Cleanup & Recovery", amount: "$275K", percentage: 8, color: "bg-emergency-yellow" },
  ];

  return (
    <div className="min-h-screen bg-background" data-testid="page-donate">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=600" 
            alt="Aid distribution and community support" 
            className="w-full h-full object-cover"
            data-testid="img-donate-hero"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-secondary/80"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <Heart className="h-16 w-16 mx-auto mb-6 text-white animate-pulse" />
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-shadow" data-testid="text-donate-title">
            Transparent <span className="text-secondary">Donations</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
            Blockchain-powered transparency ensures every dollar reaches those in need. Track your impact in real-time.
          </p>
          
          {/* Donation Impact Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-2xl font-bold text-white">$3.2M+</div>
              <div className="text-white/80 text-sm">Total Raised</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-2xl font-bold text-white">15,789</div>
              <div className="text-white/80 text-sm">Donors</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-2xl font-bold text-white">100%</div>
              <div className="text-white/80 text-sm">Transparent</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-2xl font-bold text-white">18,432</div>
              <div className="text-white/80 text-sm">Lives Helped</div>
            </div>
          </div>
        </div>
      </section>

      {/* Current Campaign */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Current Campaign</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Every donation is tracked on the blockchain for complete transparency and accountability.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Campaign Details */}
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
                  data-testid="img-campaign"
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
                    <div data-testid="stat-campaign-donors">
                      <div className="text-2xl font-bold text-foreground">12,456</div>
                      <div className="text-sm text-muted-foreground">Donors</div>
                    </div>
                    <div data-testid="stat-campaign-days">
                      <div className="text-2xl font-bold text-foreground">18</div>
                      <div className="text-sm text-muted-foreground">Days Left</div>
                    </div>
                    <div data-testid="stat-campaign-helped">
                      <div className="text-2xl font-bold text-foreground">8,932</div>
                      <div className="text-sm text-muted-foreground">People Helped</div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-5 gap-3">
                  <Button variant="outline" className="bg-primary/10 text-primary hover:bg-primary/20 font-medium">
                    $25
                  </Button>
                  <Button variant="outline" className="bg-primary/10 text-primary hover:bg-primary/20 font-medium">
                    $50
                  </Button>
                  <Button variant="outline" className="bg-primary/10 text-primary hover:bg-primary/20 font-medium">
                    $100
                  </Button>
                  <Button variant="outline" className="bg-primary/10 text-primary hover:bg-primary/20 font-medium">
                    $250
                  </Button>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium">
                    Custom
                  </Button>
                </div>
              </Card>
            </div>

            {/* Donation Form & Info */}
            <div className="space-y-6">
              <DonationForm />

              {/* Blockchain Transparency */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Box className="h-5 w-5 text-accent" />
                    Blockchain Transparency
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
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
                  <Button variant="ghost" className="w-full mt-4 text-center text-accent hover:text-accent/80 font-medium text-sm">
                    View Full Blockchain Record
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Donation Impact & Categories */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Where Your Money Goes</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Complete transparency on fund allocation across different relief categories.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-6">Fund Allocation</h3>
              <div className="space-y-4">
                {donationTypes.map((category, index) => (
                  <div key={index} className="space-y-2" data-testid={`category-${category.type.toLowerCase().replace(/\s+/g, '-')}`}>
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground font-medium">{category.type}</span>
                      <span className="text-foreground font-medium">{category.amount} ({category.percentage}%)</span>
                    </div>
                    <Progress value={category.percentage} className="h-2" />
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-accent/10 rounded-lg">
                <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                  <Award className="h-5 w-5 text-accent" />
                  Donation Benefits
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emergency-green" />
                    <span className="text-foreground">100% transparency via blockchain</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emergency-green" />
                    <span className="text-foreground">Real-time impact tracking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emergency-green" />
                    <span className="text-foreground">Tax-deductible receipts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emergency-green" />
                    <span className="text-foreground">Direct impact updates</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <img 
                src="https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                alt="Volunteers distributing aid to disaster victims" 
                className="rounded-xl shadow-lg w-full"
                data-testid="img-fund-allocation"
              />

              <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
                <CardContent className="p-6">
                  <h4 className="font-bold text-foreground mb-4">Impact Multiplier</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">4x</div>
                      <div className="text-sm text-muted-foreground">Efficiency Gain</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-secondary">95%</div>
                      <div className="text-sm text-muted-foreground">Direct Impact</div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    Every $1 donated provides $4 worth of relief through our efficient coordination network.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Donations */}
      {recentDonations.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Recent Impact</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                See how recent donations are making an immediate difference in disaster-affected communities.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {recentDonations.slice(0, 6).map((donation: any) => (
                <Card key={donation.id} className="shadow-lg" data-testid={`recent-donation-${donation.id}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
                        A
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {getTimeAgo(donation.createdAt)}
                      </span>
                    </div>
                    <h4 className="font-semibold text-foreground mb-2">Anonymous Donor</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Donated ${parseFloat(donation.amount).toFixed(2)} for {donation.donationType?.replace('_', ' ')}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {donation.donationType?.replace('_', ' ')}
                      </Badge>
                      <div className="text-xs text-accent font-mono">
                        {donation.blockchainTxHash}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Donor Recognition */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Donor Recognition</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We honor the generous donors whose contributions make our mission possible.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { tier: "Platinum Hero", amount: "$10,000+", donors: 23, color: "bg-gradient-to-r from-gray-400 to-gray-600" },
              { tier: "Gold Supporter", amount: "$5,000+", donors: 89, color: "bg-gradient-to-r from-yellow-400 to-yellow-600" },
              { tier: "Community Champion", amount: "$1,000+", donors: 345, color: "bg-gradient-to-r from-primary to-secondary" },
            ].map((tier, index) => (
              <Card key={index} className="text-center shadow-lg">
                <CardContent className="p-8">
                  <div className={`w-20 h-20 ${tier.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <Award className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{tier.tier}</h3>
                  <p className="text-lg font-semibold text-primary mb-2">{tier.amount}</p>
                  <p className="text-sm text-muted-foreground mb-6">{tier.donors} generous donors</p>
                  <Button variant="outline" className="w-full">
                    Join This Tier
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Corporate Partnerships */}
      <section className="py-16 bg-gradient-to-br from-accent/10 to-secondary/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Corporate Partners</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join leading companies in making a meaningful impact on disaster relief efforts.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-6">Partnership Benefits</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                  <div>
                    <h4 className="font-semibold text-foreground">Brand Recognition</h4>
                    <p className="text-sm text-muted-foreground">Your company logo featured prominently on our platform and marketing materials</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                  <div>
                    <h4 className="font-semibold text-foreground">Employee Engagement</h4>
                    <p className="text-sm text-muted-foreground">Dedicated portal for employee volunteer matching and team building</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                  <div>
                    <h4 className="font-semibold text-foreground">Impact Reporting</h4>
                    <p className="text-sm text-muted-foreground">Detailed quarterly reports showing exactly how your donations created impact</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-emergency-green rounded-full flex items-center justify-center text-white font-bold text-sm">4</div>
                  <div>
                    <h4 className="font-semibold text-foreground">Tax Benefits</h4>
                    <p className="text-sm text-muted-foreground">Full tax deduction documentation and corporate social responsibility credits</p>
                  </div>
                </div>
              </div>

              <Button size="lg" className="mt-8 bg-primary text-primary-foreground px-8 py-4" data-testid="button-corporate-partnership">
                <Users className="mr-2 h-5 w-5" />
                Become a Corporate Partner
              </Button>
            </div>

            <Card className="shadow-xl">
              <CardContent className="p-8">
                <h4 className="text-xl font-bold text-foreground mb-6">Partnership Tiers</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg">
                    <div>
                      <div className="font-semibold text-foreground">Global Impact Partner</div>
                      <div className="text-sm text-muted-foreground">$100,000+ annually</div>
                    </div>
                    <Award className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                    <div>
                      <div className="font-semibold text-foreground">Strategic Partner</div>
                      <div className="text-sm text-muted-foreground">$50,000+ annually</div>
                    </div>
                    <Award className="h-6 w-6 text-gray-600" />
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg">
                    <div>
                      <div className="font-semibold text-foreground">Community Partner</div>
                      <div className="text-sm text-muted-foreground">$25,000+ annually</div>
                    </div>
                    <Award className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
