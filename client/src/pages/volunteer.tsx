import VolunteerForm from "@/components/volunteer-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Heart, 
  Users, 
  Star, 
  MapPin, 
  Clock, 
  Award,
  TrendingUp,
  Activity,
  CheckCircle
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function Volunteer() {
  const { data: volunteersData } = useQuery({
    queryKey: ["/api/volunteers"],
    select: (data) => data?.volunteers || [],
  });

  const { data: requestsData } = useQuery({
    queryKey: ["/api/emergency-requests"],
    select: (data) => data?.requests || [],
  });

  const volunteers = volunteersData || [];
  const activeRequests = requestsData || [];

  const skillCategories = [
    { name: "Medical Training", count: 34, color: "bg-primary" },
    { name: "Search & Rescue", count: 28, color: "bg-secondary" },
    { name: "Emergency Repair", count: 22, color: "bg-accent" },
    { name: "Logistics & Transport", count: 41, color: "bg-emergency-green" },
    { name: "Communication", count: 19, color: "bg-emergency-yellow" },
    { name: "Food Service", count: 15, color: "bg-emergency-blue" },
  ];

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

  return (
    <div className="min-h-screen bg-background" data-testid="page-volunteer">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 bg-gradient-to-br from-accent/10 to-secondary/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground" data-testid="text-volunteer-title">
                Join Our <span className="text-primary">Volunteer</span> Network
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Make a difference when it matters most. Our AI-powered matching system connects your skills with urgent needs in real-time.
              </p>

              {/* Impact Stats */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-card rounded-lg p-6 border border-border">
                  <Users className="h-8 w-8 text-primary mb-4" />
                  <div className="text-2xl font-bold text-foreground">8,932</div>
                  <div className="text-sm text-muted-foreground">Active Volunteers</div>
                </div>
                <div className="bg-card rounded-lg p-6 border border-border">
                  <Heart className="h-8 w-8 text-secondary mb-4" />
                  <div className="text-2xl font-bold text-foreground">12,456</div>
                  <div className="text-sm text-muted-foreground">Lives Helped</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-primary text-primary-foreground px-8 py-4" data-testid="button-join-now">
                  <Heart className="mr-2 h-5 w-5" />
                  Join Now
                </Button>
                <Button variant="outline" size="lg" className="px-8 py-4" data-testid="button-learn-more">
                  Learn More
                </Button>
              </div>
            </div>

            <div>
              <img 
                src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=500" 
                alt="Volunteers working together in disaster response" 
                className="rounded-xl shadow-2xl w-full"
                data-testid="img-volunteers-hero"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Volunteer Skills & Opportunities */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Skills We Need</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Every skill makes a difference. Find how your expertise can help save lives and rebuild communities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {skillCategories.map((skill, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground">{skill.name}</h3>
                    <Badge variant="secondary">{skill.count} active</Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 mb-3">
                    <div 
                      className={`h-2 rounded-full ${skill.color}`} 
                      style={{ width: `${Math.min((skill.count / 50) * 100, 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Demand: High</span>
                    <span className="text-foreground font-medium">{skill.count}/50</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            <Card className="p-6 text-center">
              <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Medical Response</h3>
              <p className="text-sm text-muted-foreground mb-4">First aid, EMT support, medical supply distribution</p>
              <Button variant="outline" size="sm" className="w-full">Apply Now</Button>
            </Card>
            
            <Card className="p-6 text-center">
              <Users className="h-12 w-12 text-secondary mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Search & Rescue</h3>
              <p className="text-sm text-muted-foreground mb-4">Missing person searches, evacuation assistance</p>
              <Button variant="outline" size="sm" className="w-full">Apply Now</Button>
            </Card>
            
            <Card className="p-6 text-center">
              <Activity className="h-12 w-12 text-accent mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Emergency Repair</h3>
              <p className="text-sm text-muted-foreground mb-4">Infrastructure repair, debris clearing</p>
              <Button variant="outline" size="sm" className="w-full">Apply Now</Button>
            </Card>
            
            <Card className="p-6 text-center">
              <TrendingUp className="h-12 w-12 text-emergency-green mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Logistics Support</h3>
              <p className="text-sm text-muted-foreground mb-4">Supply transport, coordination assistance</p>
              <Button variant="outline" size="sm" className="w-full">Apply Now</Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Registration & Dashboard */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Registration Form */}
            <div className="lg:col-span-2">
              <VolunteerForm />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Active Volunteers */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Active Volunteers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {volunteers.length === 0 ? (
                      <div className="text-center text-muted-foreground py-6" data-testid="text-no-volunteers">
                        <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No volunteers registered yet</p>
                      </div>
                    ) : (
                      volunteers.slice(0, 5).map((volunteer: any, index: number) => (
                        <div key={volunteer.id} className="flex items-center space-x-3" data-testid={`volunteer-list-${volunteer.id}`}>
                          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-medium">
                            {volunteer.user?.fullName?.charAt(0) || 'V'}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-foreground text-sm">
                              {volunteer.user?.fullName || `Volunteer ${index + 1}`}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              {volunteer.skills?.[0] || 'General Support'} • {volunteer.location || 'Location not set'}
                            </p>
                          </div>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-xs text-muted-foreground ml-1">
                              {volunteer.rating || '5.0'}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Urgent Needs */}
              <Card className="bg-primary/10 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-primary flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Urgent Needs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {activeRequests.length === 0 ? (
                      <div className="text-center text-muted-foreground py-6" data-testid="text-no-urgent-needs">
                        <CheckCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No urgent requests at the moment</p>
                      </div>
                    ) : (
                      activeRequests.filter((req: any) => req.urgency === 'critical').slice(0, 3).map((request: any) => (
                        <div key={request.id} className="bg-white rounded-lg p-3" data-testid={`urgent-request-${request.id}`}>
                          <div className="flex items-start justify-between mb-2">
                            <span className="font-medium text-foreground text-sm">{request.title || request.type}</span>
                            <Badge className="bg-primary text-primary-foreground text-xs">Critical</Badge>
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3 mr-1" />
                            {request.location}
                            <span className="mx-2">•</span>
                            <Clock className="h-3 w-3 mr-1" />
                            {getTimeAgo(request.createdAt)}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Volunteer Benefits */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-secondary" />
                    Volunteer Benefits
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-emergency-green" />
                    <span className="text-sm text-foreground">Verified Hero status & badges</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-emergency-green" />
                    <span className="text-sm text-foreground">Skills-based matching system</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-emergency-green" />
                    <span className="text-sm text-foreground">Real-time coordination tools</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-emergency-green" />
                    <span className="text-sm text-foreground">Community recognition</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-emergency-green" />
                    <span className="text-sm text-foreground">Training & certification</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-emergency-green" />
                    <span className="text-sm text-foreground">Impact tracking dashboard</span>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="bg-accent/10 border-accent/20">
                <CardHeader>
                  <CardTitle className="text-accent">Your Impact Potential</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-foreground">Response Time</span>
                    <span className="font-medium text-accent">&lt; 15 min avg</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-foreground">People Helped/Month</span>
                    <span className="font-medium text-accent">12-25 avg</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-foreground">Success Rate</span>
                    <span className="font-medium text-accent">94%</span>
                  </div>
                  <div className="pt-2 border-t border-accent/20">
                    <div className="text-xs text-muted-foreground text-center">
                      Join thousands making a real difference
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Volunteer Stories</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Hear from volunteers who are making a real difference in their communities.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Dr. Sarah Chen",
                role: "Medical Volunteer",
                quote: "AgniAid's matching system connected me with patients who needed my specific expertise during the wildfire crisis. It's revolutionizing disaster response.",
                avatar: "S"
              },
              {
                name: "Marcus Johnson", 
                role: "Search & Rescue Specialist",
                quote: "The real-time coordination tools helped our team save 15 people during the flood. Every second counts in emergencies.",
                avatar: "M"
              },
              {
                name: "Elena Rodriguez",
                role: "Logistics Coordinator", 
                quote: "I've helped coordinate supply distribution to over 500 families. The impact tracking shows exactly how much difference we're making.",
                avatar: "E"
              }
            ].map((testimonial, index) => (
              <Card key={index} className="p-6 text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold">
                  {testimonial.avatar}
                </div>
                <h3 className="font-bold text-foreground mb-1">{testimonial.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{testimonial.role}</p>
                <blockquote className="text-sm text-muted-foreground italic mb-4">
                  "{testimonial.quote}"
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
    </div>
  );
}
