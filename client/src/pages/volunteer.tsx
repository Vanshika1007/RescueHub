
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
import type { VolunteersResponse, RequestsResponse, Volunteer, Request } from "@/types/api";
import { useI18n } from "@/lib/i18n";

export default function Volunteer() {
  const { t } = useI18n();
  
  const { data: volunteers } = useQuery<VolunteersResponse, Error, Volunteer[]>({
    queryKey: ["/api/volunteers"],
    select: (data) => data?.volunteers || [],
  });

  const { data: activeRequests } = useQuery<RequestsResponse, Error, Request[]>({
    queryKey: ["/api/emergency-requests"],
    select: (data) => data?.requests || [],
  });

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

  const handleJoinNow = () => {
    window.location.href = '/register';
  };
  return (
    <div className="min-h-screen bg-background" data-testid="page-volunteer">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 bg-gradient-to-br from-accent/10 to-secondary/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground" data-testid="text-volunteer-title">
                {t("volunteer_title")}
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                {t("volunteer_subtitle")}
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
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground px-8 py-4"
                  data-testid="button-join-now"
                  onClick={handleJoinNow}
                >
                  <Heart className="mr-2 h-5 w-5" />
                  {t("join_now")}
                </Button>
                <Button variant="outline" size="lg" className="px-8 py-4" data-testid="button-learn-more">
                  {t("learn_more")}
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">{t("skills_title")}</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("skills_subtitle")}
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

  {/* Registration & Dashboard section removed. 'Join Now' button opens registration page. */}

      {/* Gamification & Leaderboard */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">🏆 {t("volunteer_leaderboard_title")}</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("volunteer_leaderboard_subtitle")}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Points System */}
            <Card className="p-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-6 w-6 text-yellow-500" />
                  {t("points_system")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium">Complete Emergency Response</span>
                  <Badge className="bg-green-500">+50 pts</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium">Help with Medical Aid</span>
                  <Badge className="bg-blue-500">+30 pts</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="text-sm font-medium">Transport Supplies</span>
                  <Badge className="bg-purple-500">+20 pts</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <span className="text-sm font-medium">Daily Check-in</span>
                  <Badge className="bg-orange-500">+5 pts</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Current User Stats */}
            <Card className="p-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-green-500" />
                  {t("your_progress")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">1,250</div>
                  <div className="text-sm text-muted-foreground">Total Points</div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Next Level</span>
                    <span>750 pts to go</span>
                  </div>
                  <Progress value={62} className="h-2" />
                  <div className="text-xs text-muted-foreground text-center">Level 3 - Hero Helper</div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">12</div>
                    <div className="text-xs text-muted-foreground">Missions</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">8</div>
                    <div className="text-xs text-muted-foreground">Lives Saved</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Badges */}
            <Card className="p-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-6 w-6 text-yellow-500" />
                  {t("your_badges")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <div className="text-2xl mb-1">🥇</div>
                    <div className="text-xs font-medium">First Responder</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl mb-1">🏥</div>
                    <div className="text-xs font-medium">Medical Hero</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl mb-1">🚑</div>
                    <div className="text-xs font-medium">Rescue Master</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl mb-1">⭐</div>
                    <div className="text-xs font-medium">Top Volunteer</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Volunteers Leaderboard */}
          <Card className="p-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-6 w-6 text-yellow-500" />
                {t("top_volunteers")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Dr. Sarah Chen", points: 2450, missions: 18, badge: "🥇", level: "Legend" },
                  { name: "Marcus Johnson", points: 2200, missions: 15, badge: "🥈", level: "Champion" },
                  { name: "Elena Rodriguez", points: 1980, missions: 14, badge: "🥉", level: "Expert" },
                  { name: "Raj Patel", points: 1750, missions: 12, badge: "4️⃣", level: "Hero" },
                  { name: "Lisa Wang", points: 1620, missions: 11, badge: "5️⃣", level: "Helper" }
                ].map((volunteer, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">{volunteer.badge}</div>
                      <div>
                        <div className="font-semibold text-foreground">{volunteer.name}</div>
                        <div className="text-sm text-muted-foreground">{volunteer.missions} missions • {volunteer.level}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary">{volunteer.points.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">points</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">{t("volunteer_stories_title")}</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("volunteer_stories_subtitle")}
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
