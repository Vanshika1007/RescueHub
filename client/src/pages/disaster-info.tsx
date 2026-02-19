import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertTriangle, 
  MapPin, 
  Calendar, 
  ExternalLink, 
  RefreshCw,
  Globe,
  Activity,
  Clock,
  TrendingUp
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import rescuee from "@/photos/rescuee.jpg";
import disasterMgmt from "@/photos/what-is-disaster-management.jpg";

interface DisasterData {
  id: string;
  name: string;
  type: string;
  status: 'ongoing' | 'past' | 'alert';
  location: {
    country: string;
    region?: string;
    coordinates?: { lat: number; lng: number };
  };
  date: {
    start: string;
    end?: string;
  };
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  url?: string;
}

interface DisastersResponse {
  disasters: DisasterData[];
}

export default function DisasterInfo() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState("active");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryClient = useQueryClient();

  const { data: allDisasters, isLoading: isLoadingAll, refetch: refetchAll } = useQuery<DisastersResponse>({
    queryKey: ["/api/disasters"],
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
  });

  const { data: activeDisasters, isLoading: isLoadingActive, refetch: refetchActive } = useQuery<DisastersResponse>({
    queryKey: ["/api/disasters/active"],
    refetchInterval: 2 * 60 * 1000, // Refresh every 2 minutes for active disasters
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ongoing': return 'bg-red-100 text-red-700 border-red-200';
      case 'alert': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'past': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'flood': return '🌊';
      case 'earthquake': return '🌍';
      case 'cyclone': return '🌀';
      case 'fire': return '🔥';
      case 'drought': return '☀️';
      case 'landslide': return '⛰️';
      default: return '⚠️';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await fetch('/api/disasters/refresh', { method: 'POST' });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["/api/disasters"] }),
        queryClient.invalidateQueries({ queryKey: ["/api/disasters/active"] })
      ]);
      await Promise.all([refetchAll(), refetchActive()]);
    } finally {
      setIsRefreshing(false);
    }
  };

  const activeDisastersList = activeDisasters?.disasters || [];
  const allDisastersList = allDisasters?.disasters || [];
  const pastDisastersList = allDisastersList.filter(d => d.status === 'past');

  return (
    <div className="min-h-screen bg-background text-2xl" data-testid="page-disaster-info">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="absolute inset-0 -z-10 pointer-events-none" aria-hidden="true">
          <img src={rescuee} alt="" className="w-full h-full object-cover blur-2xl opacity-30" />
        </div>
        <div className="absolute inset-0 -z-10 pointer-events-none" aria-hidden="true">
          <img src={disasterMgmt} alt="" className="w-full h-full object-cover blur-xl opacity-35" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center relative">
            <div className="absolute inset-0 -z-10 flex items-start justify-center pt-6" aria-hidden="true">
              <img src={disasterMgmt} alt="" className="max-w-3xl w-full h-40 sm:h-48 md:h-56 lg:h-64 object-cover blur-xl opacity-40 rounded-xl" />
            </div>
            <div className="flex items-center justify-center gap-3 mb-6">
              <AlertTriangle className="h-12 w-12 text-red-500" />
              <h1 className="text-4xl md:text-6xl font-bold text-foreground">
                🌍 Disaster Information
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Real-time disaster alerts and information from trusted global sources
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={handleRefresh}
                variant="outline"
                className="bg-white/80 hover:bg-white text-black hover:text-black"
                disabled={isLoadingAll || isLoadingActive || isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${((isLoadingAll || isLoadingActive || isRefreshing) ? 'animate-spin' : '')}`} />
                Refresh Data
              </Button>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Globe className="h-4 w-4" />
                <span>Data from ReliefWeb & GDACS</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Disaster Tabs */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="active" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Active ({activeDisastersList.length})
              </TabsTrigger>
              <TabsTrigger value="alerts" className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Alerts
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                History ({pastDisastersList.length})
              </TabsTrigger>
            </TabsList>

            {/* Active Disasters */}
            <TabsContent value="active" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-4">🚨 Active Disasters</h2>
                <p className="text-muted-foreground">Currently ongoing disasters requiring immediate attention</p>
              </div>

              {isLoadingActive ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="h-4 bg-muted rounded mb-4"></div>
                        <div className="h-3 bg-muted rounded mb-2"></div>
                        <div className="h-3 bg-muted rounded w-2/3"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : activeDisastersList.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeDisastersList.map((disaster) => (
                    <Card key={disaster.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-red-500 hover:ring-2 hover:ring-red-500">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{getTypeIcon(disaster.type)}</span>
                            <CardTitle className="text-lg">{disaster.name}</CardTitle>
                          </div>
                          <Badge className={getSeverityColor(disaster.severity)}>
                            {disaster.severity.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {disaster.location.region || disaster.location.country}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                          {disaster.description}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(disaster.date.start)}
                          </div>
                          <Badge variant="outline" className={getStatusColor(disaster.status)}>
                            {disaster.status.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Source: {disaster.source}</span>
                          {disaster.url && (
                            <Button size="sm" variant="ghost" asChild>
                              <a href={disaster.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <TrendingUp className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">No Active Disasters</h3>
                    <p className="text-muted-foreground">Great news! No major disasters are currently active in the region.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Alerts */}
            <TabsContent value="alerts" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-4">⚠️ Disaster Alerts</h2>
                <p className="text-muted-foreground">Early warning alerts and advisories</p>
              </div>

              <Card className="text-center py-12">
                <CardContent>
                  <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">No Active Alerts</h3>
                  <p className="text-muted-foreground">No disaster alerts are currently active. Stay informed and stay safe!</p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Historical Disasters */}
            <TabsContent value="history" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-4">📚 Disaster History</h2>
                <p className="text-muted-foreground">Past disasters and their impact records</p>
              </div>

              {isLoadingAll ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="h-4 bg-muted rounded mb-4"></div>
                        <div className="h-3 bg-muted rounded mb-2"></div>
                        <div className="h-3 bg-muted rounded w-2/3"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : pastDisastersList.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pastDisastersList.map((disaster) => (
                    <Card key={disaster.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-gray-400 hover:ring-2 hover:ring-red-500">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{getTypeIcon(disaster.type)}</span>
                            <CardTitle className="text-lg">{disaster.name}</CardTitle>
                          </div>
                          <Badge variant="outline" className="bg-gray-100 text-gray-700">
                            {disaster.severity.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {disaster.location.region || disaster.location.country}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                          {disaster.description}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(disaster.date.start)}
                            {disaster.date.end && (
                              <span> - {formatDate(disaster.date.end)}</span>
                            )}
                          </div>
                          <Badge variant="outline" className="bg-gray-100 text-gray-700">
                            COMPLETED
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Source: {disaster.source}</span>
                          {disaster.url && (
                            <Button size="sm" variant="ghost" asChild>
                              <a href={disaster.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <Clock className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">No Historical Data</h3>
                    <p className="text-muted-foreground">Historical disaster data will appear here as it becomes available.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
