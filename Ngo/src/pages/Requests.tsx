import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Forward,
  Clock,
  AlertTriangle,
  Navigation,
} from "lucide-react";
import { HelpRequest } from "@/types";

// Sample data for demo
const mockRequests: HelpRequest[] = [
  {
    id: "REQ001",
    userId: "USR001",
    location: { lat: 28.6139, lng: 77.2090, address: "Connaught Place, Delhi" },
    type: "medical",
    urgency: "critical",
    status: "pending",
    description: "Need urgent medical assistance for accident victim",
    specialNotes: "Multiple injuries, need ambulance",
    requestedAt: new Date(Date.now() - 5 * 60000),
  },
  {
    id: "REQ002",
    userId: "USR002",
    location: { lat: 28.5355, lng: 77.3910, address: "Sector 15, Noida" },
    type: "food",
    urgency: "high",
    status: "pending",
    description: "Family of 5 needs food supplies",
    requestedAt: new Date(Date.now() - 15 * 60000),
  },
  {
    id: "REQ003",
    userId: "USR003",
    location: { lat: 28.4595, lng: 77.0266, address: "Cyber City, Gurgaon" },
    type: "water",
    urgency: "medium",
    status: "accepted",
    description: "Water shortage in residential area",
    requestedAt: new Date(Date.now() - 30 * 60000),
    assignedNgoId: "NGO001",
  },
];

export default function Requests() {
  const [requests, setRequests] = useState<HelpRequest[]>(mockRequests);
  const [selectedRequest, setSelectedRequest] = useState<HelpRequest | null>(null);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterUrgency, setFilterUrgency] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const mapRef = useRef<HTMLDivElement>(null);

  // Filter requests
  const filteredRequests = requests.filter((req) => {
    const matchesType = filterType === "all" || req.type === filterType;
    const matchesUrgency = filterUrgency === "all" || req.urgency === filterUrgency;
    const matchesSearch = req.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          req.location.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesUrgency && matchesSearch;
  });

  const handleAccept = (requestId: string) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: "accepted", assignedNgoId: "NGO001" } : req
    ));
  };

  const handleReject = (requestId: string) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: "rejected" } : req
    ));
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "critical": return "danger";
      case "high": return "warning";
      case "medium": return "info";
      default: return "success";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "medical": return "🏥";
      case "food": return "🍽️";
      case "water": return "💧";
      case "shelter": return "🏠";
      case "rescue": return "🚨";
      default: return "📍";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header with Filters */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Live Help Requests</h1>
        <p className="text-muted-foreground mt-1">Monitor and respond to emergency requests in real-time</p>
      </div>

      {/* Filters Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Request Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="food">Food</SelectItem>
                <SelectItem value="water">Water</SelectItem>
                <SelectItem value="medical">Medical</SelectItem>
                <SelectItem value="shelter">Shelter</SelectItem>
                <SelectItem value="rescue">Rescue</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterUrgency} onValueChange={setFilterUrgency}>
              <SelectTrigger className="w-full md:w-[180px]">
                <AlertTriangle className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Urgency Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Map View */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Request Heatmap</CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              ref={mapRef}
              className="h-[500px] bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg flex items-center justify-center relative overflow-hidden"
            >
              {/* Simple Map Placeholder with Request Markers */}
              <div className="absolute inset-0">
                {filteredRequests.map((req, index) => (
                  <div
                    key={req.id}
                    className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${
                      selectedRequest?.id === req.id ? 'z-10' : 'z-0'
                    }`}
                    style={{
                      left: `${30 + (index * 20) % 60}%`,
                      top: `${20 + (index * 15) % 60}%`,
                    }}
                    onClick={() => setSelectedRequest(req)}
                  >
                    <div className={`relative ${
                      req.urgency === 'critical' ? 'animate-pulse' : ''
                    }`}>
                      <div className={`h-8 w-8 rounded-full bg-${getUrgencyColor(req.urgency)} flex items-center justify-center text-white shadow-lg`}>
                        <span className="text-sm">{getTypeIcon(req.type)}</span>
                      </div>
                      {selectedRequest?.id === req.id && (
                        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-card p-2 rounded shadow-xl border whitespace-nowrap">
                          <p className="text-xs font-medium">{req.type.toUpperCase()}</p>
                          <p className="text-xs text-muted-foreground">{req.location.address}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center z-20">
                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Interactive Map View</p>
                <p className="text-sm text-muted-foreground mt-1">Click on markers for details</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Requests List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>
              Request Queue 
              <Badge variant="danger" className="ml-2">
                {filteredRequests.filter(r => r.status === 'pending').length} Pending
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {filteredRequests.map((request) => (
                <div
                  key={request.id}
                  className={`p-4 rounded-lg border ${
                    selectedRequest?.id === request.id ? 'border-primary bg-primary/5' : ''
                  } hover:bg-muted/50 transition-all cursor-pointer`}
                  onClick={() => setSelectedRequest(request)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={getUrgencyColor(request.urgency)}>
                        {request.urgency.toUpperCase()}
                      </Badge>
                      <span className="text-2xl">{getTypeIcon(request.type)}</span>
                      <span className="font-medium">{request.type}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {Math.round((Date.now() - request.requestedAt.getTime()) / 60000)} mins ago
                    </div>
                  </div>

                  <p className="text-sm text-foreground mb-2">{request.description}</p>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                    <MapPin className="h-3 w-3" />
                    {request.location.address}
                  </div>

                  {request.specialNotes && (
                    <div className="bg-warning/10 text-warning text-xs p-2 rounded mb-3">
                      <strong>Note:</strong> {request.specialNotes}
                    </div>
                  )}

                  {request.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-gradient-success hover:opacity-90"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAccept(request.id);
                        }}
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReject(request.id);
                        }}
                      >
                        <XCircle className="h-3 w-3 mr-1" />
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <Forward className="h-3 w-3 mr-1" />
                        Forward
                      </Button>
                    </div>
                  )}

                  {request.status === 'accepted' && (
                    <Badge variant="success" className="w-full justify-center">
                      Accepted - Volunteer Assigned
                    </Badge>
                  )}

                  {request.status === 'rejected' && (
                    <Badge variant="destructive" className="w-full justify-center">
                      Rejected
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Auto-Match Notification */}
      <Card className="bg-gradient-to-r from-info/10 to-primary/10 border-info">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-info flex items-center justify-center">
              <Navigation className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">Auto-Match System Active</h3>
              <p className="text-sm text-muted-foreground">
                Requests are automatically forwarded to the nearest available NGO if not accepted within 5 minutes
              </p>
            </div>
            <Badge variant="info">Live</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}