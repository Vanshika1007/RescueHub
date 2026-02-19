import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Users,
  UserCheck,
  UserX,
  Star,
  Phone,
  Mail,
  MapPin,
  Search,
  Filter,
  Plus,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Volunteer } from "@/types";

const mockVolunteers: Volunteer[] = [
  {
    id: "VOL001",
    name: "Vikas Kumar",
    phone: "+91 9876543210",
    email: "vikas.kumar@volunteer.org",
    ngoId: "NGO001",
    status: "available",
    completedRequests: 45,
    rating: 4.8,
  },
  {
    id: "VOL002",
    name: "Sukhpreet Singh",
    phone: "+91 9876543211",
    email: "sukhpreet.singh@volunteer.org",
    ngoId: "NGO001",
    status: "busy",
    currentAssignment: "REQ002 - Medical Emergency Sector 15",
    completedRequests: 38,
    rating: 4.9,
  },
  {
    id: "VOL003",
    name: "Nidhi Singh",
    phone: "+91 9876543212",
    email: "nidhi.singh@volunteer.org",
    ngoId: "NGO001",
    status: "available",
    completedRequests: 52,
    rating: 4.7,
  },
  {
    id: "VOL004",
    name: "Parneet Kaur",
    phone: "+91 9876543213",
    email: "parneet.kaur@volunteer.org",
    ngoId: "NGO001",
    status: "offline",
    completedRequests: 29,
    rating: 4.6,
  },
  {
    id: "VOL005",
    name: "Vanshika",
    phone: "+91 9876543214",
    email: "vanshika@volunteer.org",
    ngoId: "NGO001",
    status: "busy",
    currentAssignment: "REQ003 - Food Distribution Dwarka",
    completedRequests: 61,
    rating: 5.0,
  },
];

export default function Volunteers() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>(mockVolunteers);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredVolunteers = volunteers.filter((vol) => {
    const matchesSearch = vol.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vol.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || vol.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: volunteers.length,
    available: volunteers.filter(v => v.status === "available").length,
    busy: volunteers.filter(v => v.status === "busy").length,
    offline: volunteers.filter(v => v.status === "offline").length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available": return "success";
      case "busy": return "warning";
      case "offline": return "secondary";
      default: return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "available": return <CheckCircle className="h-3 w-3" />;
      case "busy": return <Clock className="h-3 w-3" />;
      case "offline": return <AlertCircle className="h-3 w-3" />;
      default: return null;
    }
  };

  const assignVolunteer = (volunteerId: string) => {
    setVolunteers(prev => prev.map(vol => 
      vol.id === volunteerId 
        ? { ...vol, status: "busy" as const, currentAssignment: "REQ_NEW" }
        : vol
    ));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Volunteer Management</h1>
          <p className="text-muted-foreground mt-1">Coordinate and track volunteer activities</p>
        </div>
        
        <Button className="bg-gradient-primary hover:opacity-90">
          <Plus className="h-4 w-4 mr-2" />
          Add Volunteer
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Volunteers</p>
                <h3 className="text-2xl font-bold mt-1">{stats.total}</h3>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Available</p>
                <h3 className="text-2xl font-bold mt-1 text-success">{stats.available}</h3>
              </div>
              <UserCheck className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Busy</p>
                <h3 className="text-2xl font-bold mt-1 text-warning">{stats.busy}</h3>
              </div>
              <Clock className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Offline</p>
                <h3 className="text-2xl font-bold mt-1 text-muted-foreground">{stats.offline}</h3>
              </div>
              <UserX className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search volunteers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="busy">Busy</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Volunteers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVolunteers.map((volunteer) => (
          <Card key={volunteer.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                      {volunteer.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{volunteer.name}</CardTitle>
                    <Badge variant={getStatusColor(volunteer.status) as any} className="mt-1">
                      {getStatusIcon(volunteer.status)}
                      <span className="ml-1">{volunteer.status}</span>
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{volunteer.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{volunteer.email}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t">
                <div className="text-center">
                  <p className="text-2xl font-bold">{volunteer.completedRequests}</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-warning text-warning" />
                    <span className="text-xl font-bold">{volunteer.rating}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
              </div>

              {volunteer.currentAssignment && (
                <div className="p-2 rounded-lg bg-warning/10 text-warning text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3" />
                    <span>On assignment: {volunteer.currentAssignment}</span>
                  </div>
                </div>
              )}

              {volunteer.status === "available" && (
                <Button
                  size="sm"
                  className="w-full bg-gradient-success hover:opacity-90"
                  onClick={() => assignVolunteer(volunteer.id)}
                >
                  Assign to Request
                </Button>
              )}

              {volunteer.status === "busy" && (
                <Button size="sm" variant="outline" className="w-full">
                  View Assignment
                </Button>
              )}

              {volunteer.status === "offline" && (
                <Button size="sm" variant="outline" className="w-full" disabled>
                  Currently Offline
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}