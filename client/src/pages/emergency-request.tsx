import EmergencyForm from "@/components/emergency-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, MapPin, Phone, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { RequestsResponse, Request } from "@/types/api";
import { useI18n } from "@/lib/i18n";

export default function EmergencyRequest() {
  const { t } = useI18n();
  const { data: activeRequests } = useQuery<RequestsResponse, Error, Request[]>({
    queryKey: ["/api/emergency-requests"],
    select: (data) => data?.requests || [],
  });

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-primary text-primary-foreground';
      case 'medium': return 'bg-secondary text-secondary-foreground';
      case 'low': return 'bg-emergency-yellow text-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

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
    <div className="min-h-screen bg-muted/30" data-testid="page-emergency-request">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=600" 
            alt="Disaster relief volunteers helping community members" 
            className="w-full h-full object-cover opacity-20"
            data-testid="img-emergency-hero"
          />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-2xl max-w-4xl mx-auto border border-red-500 hover:border-red-600 transition-colors duration-200">
            <AlertTriangle className="h-16 w-16 mx-auto mb-6 text-red-500 animate-pulse" />
            <h1 className="text-xl md:text-2xl font-bold mb-4 text-gray-800" data-testid="text-emergency-title">
              {t("emergency_system_title")}
            </h1>
            <p className="text-sm md:text-base mb-8 text-gray-600 max-w-3xl mx-auto">
              {t("emergency_system_subtitle")}
            </p>
            
            {/* Emergency Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-red-500 to-pink-500 rounded-xl p-4 text-white transition-transform duration-200 hover:scale-105 hover:shadow-xl cursor-default">
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-red-100 text-sm">Available</div>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-4 text-white transition-transform duration-200 hover:scale-105 hover:shadow-xl cursor-default">
                <div className="text-2xl font-bold">&lt; 2 min</div>
                <div className="text-orange-100 text-sm">Response Time</div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl p-4 text-white transition-transform duration-200 hover:scale-105 hover:shadow-xl cursor-default">
                <div className="text-2xl font-bold">98%</div>
                <div className="text-green-100 text-sm">Trusted Network</div>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl p-4 text-white transition-transform duration-200 hover:scale-105 hover:shadow-xl cursor-default">
                <div className="text-2xl font-bold">6</div>
                <div className="text-blue-100 text-sm">Languages</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Emergency Form */}
            <div className="lg:col-span-2">
              <EmergencyForm />
              
              {/* Emergency Tips */}
              <Card className="mt-8 bg-primary/10 border-primary/20 hover:border-red-500 transition-colors">
                <CardHeader>
                  <CardTitle className="text-primary flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Emergency Safety Tips
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">1</div>
                    <p className="text-sm text-foreground">
                      <strong>Life-threatening emergencies:</strong> Call local emergency services (911, 112) first, then use AgniAid for coordination
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">2</div>
                    <p className="text-sm text-foreground">
                      <strong>Location accuracy:</strong> Enable GPS for fastest response times and precise volunteer matching
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">3</div>
                    <p className="text-sm text-foreground">
                      <strong>Offline mode:</strong> Your request will be saved locally and sent when connection is restored
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">4</div>
                    <p className="text-sm text-foreground">
                      <strong>Stay calm:</strong> Help is on the way. Keep your phone charged and stay in a safe location
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Emergency Contacts */}
              <Card className="border border-transparent hover:border-red-500 transition-colors duration-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Phone className="h-5 w-5 text-primary" />
                    Emergency Contacts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-primary/10 rounded-lg p-4 text-center">
                    <Phone className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="font-bold text-primary text-lg">1-800-AGNIAID</div>
                    <div className="text-sm text-muted-foreground">24/7 Emergency Hotline</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-muted rounded-lg p-3 text-center">
                      <div className="font-medium text-foreground">911</div>
                      <div className="text-xs text-muted-foreground">US Emergency</div>
                    </div>
                    <div className="bg-muted rounded-lg p-3 text-center">
                      <div className="font-medium text-foreground">112</div>
                      <div className="text-xs text-muted-foreground">EU Emergency</div>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground text-center">
                    Local emergency services for immediate life-threatening situations
                  </div>
                </CardContent>
              </Card>

              {/* Recent Requests */}
              <Card className="border border-transparent hover:border-red-500 transition-colors duration-200">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-2xl">
                    <span className="flex items-center gap-2 text-2xl">
                      <Clock className="h-5 w-5 text-accent" />
                      Recent Requests
                    </span>
                    <Badge variant="secondary">{activeRequests?.length || 0}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {!activeRequests || activeRequests.length === 0 ? (
                      <div className="text-center text-muted-foreground py-8" data-testid="text-no-recent-requests">
                        <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No recent requests</p>
                      </div>
                    ) : (
                      activeRequests?.slice(0, 5).map((request: any) => (
                        <div key={request.id} className="border border-border rounded-lg p-3" data-testid={`recent-request-${request.id}`}>
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                              <span className="font-medium text-foreground text-sm">{request.title || request.type}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {getTimeAgo(request.createdAt)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <Badge className={`text-xs ${getUrgencyColor(request.urgency)}`}>
                              {request.urgency}
                            </Badge>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Users className="h-3 w-3 mr-1" />
                              {request.peopleCount || 1}
                            </div>
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            {request.location}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* What Happens Next */}
              <Card className="bg-accent/10 border-accent/20 hover:border-blue-500 transition-colors">
                <CardHeader>
                  <CardTitle className="text-accent">What Happens Next?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">1</div>
                    <div>
                      <div className="font-medium text-foreground text-sm">Instant Processing</div>
                      <div className="text-xs text-muted-foreground">Your request is immediately analyzed by our AI system</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">2</div>
                    <div>
                      <div className="font-medium text-foreground text-sm">Volunteer Matching</div>
                      <div className="text-xs text-muted-foreground">Nearby volunteers with relevant skills are notified</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">3</div>
                    <div>
                      <div className="font-medium text-foreground text-sm">Real-time Updates</div>
                      <div className="text-xs text-muted-foreground">You'll receive live updates on volunteer ETA and status</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">4</div>
                    <div>
                      <div className="font-medium text-foreground text-sm">Help Arrives</div>
                      <div className="text-xs text-muted-foreground">Trained volunteers arrive with necessary resources</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
