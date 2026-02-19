import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Users,
  Package,
  MapPin,
  Heart,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  PhoneCall,
  MessageSquare,
  Timer,
  AlertTriangle,
  Navigation,
  Activity,
  Shield,
  Bell
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import MapHeatmap from "@/components/MapHeatmap";
const stats = [
  {
    title: "Active Help Requests",
    value: "47",
    subtitle: "🔴 12 Critical",
    change: "+12%",
    icon: AlertTriangle,
    color: "text-danger",
    bgColor: "bg-danger/10",
  },
  {
    title: "Volunteers Assigned",
    value: "5",
    subtitle: "3 On Field",
    change: "+8%",
    icon: Users,
    color: "text-info",
    bgColor: "bg-info/10",
  },
  {
    title: "Resources Available",
    value: "2,845",
    subtitle: "Food, Water, Medical",
    change: "+5%",
    icon: Package,
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    title: "Avg Response Time",
    value: "18 min",
    subtitle: "Target: 15 min",
    change: "-25%",
    icon: Timer,
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
];

const requestTypes = [
  { name: "Food", value: 35, color: "#10b981" },
  { name: "Water", value: 28, color: "#3b82f6" },
  { name: "Medical", value: 22, color: "#f59e0b" },
  { name: "Shelter", value: 10, color: "#8b5cf6" },
  { name: "Rescue", value: 5, color: "#ef4444" },
];

const weeklyData = [
  { day: "Mon", completed: 45, pending: 12 },
  { day: "Tue", completed: 52, pending: 8 },
  { day: "Wed", completed: 38, pending: 15 },
  { day: "Thu", completed: 65, pending: 10 },
  { day: "Fri", completed: 48, pending: 18 },
  { day: "Sat", completed: 72, pending: 5 },
  { day: "Sun", completed: 58, pending: 9 },
];

const recentRequests = [
  {
    id: "REQ001",
    type: "Medical",
    location: "Sector 15, Noida",
    urgency: "critical",
    time: "5 mins ago",
    status: "pending",
  },
  {
    id: "REQ002",
    type: "Food",
    location: "Dwarka, Delhi",
    urgency: "high",
    time: "12 mins ago",
    status: "accepted",
  },
  {
    id: "REQ003",
    type: "Water",
    location: "Gurgaon",
    urgency: "medium",
    time: "25 mins ago",
    status: "in_progress",
  },
  {
    id: "REQ004",
    type: "Shelter",
    location: "Faridabad",
    urgency: "low",
    time: "1 hour ago",
    status: "completed",
  },
];

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">NGO Dashboard</h1>
          <p className="text-muted-foreground mt-1">Real-time disaster relief operations management</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="default" className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            Verified NGO
          </Badge>
          <Button size="sm" variant="outline">
            <Bell className="h-4 w-4 mr-2" />
            Emergency Alert
          </Button>
        </div>
      </div>

      {/* Emergency Alert Banner */}
      <Alert className="border-danger bg-danger/5">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>🚨 New Critical Request:</strong> Medical emergency in Sector 12 - Immediate response required!
          <Button size="sm" variant="link" className="ml-2 p-0">View Details →</Button>
        </AlertDescription>
      </Alert>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                  <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
                  <p className={`text-sm mt-2 flex items-center gap-1 ${
                    stat.change.startsWith('+') ? 'text-success' : 'text-danger'
                  }`}>
                    <TrendingUp className="h-3 w-3" />
                    {stat.change} from yesterday
                  </p>
                </div>
                <div className={`h-12 w-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Live Map Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Live Help Requests Map
            </span>
            <div className="flex gap-2">
              <Badge variant="destructive">🔴 Critical: 12</Badge>
              <Badge variant="secondary" className="bg-warning/10 text-warning">🟡 Medium: 23</Badge>
              <Badge variant="secondary" className="bg-success/10 text-success">🟢 Resolved: 42</Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <MapHeatmap height={400} />
          </div>
        </CardContent>
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request Types Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Request Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={requestTypes}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {requestTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-4 mt-4 justify-center">
              {requestTypes.map((type) => (
                <div key={type.name} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: type.color }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {type.name} ({type.value}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Requests Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Request Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentRequests.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`h-2 w-2 rounded-full ${
                    request.urgency === "critical" ? "bg-danger" :
                    request.urgency === "high" ? "bg-warning" :
                    request.urgency === "medium" ? "bg-info" : "bg-success"
                  } animate-pulse`} />
                  <div>
                    <p className="font-medium">{request.id} - {request.type}</p>
                    <p className="text-sm text-muted-foreground">{request.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">{request.time}</span>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    request.status === "pending" ? "bg-warning/10 text-warning" :
                    request.status === "accepted" ? "bg-info/10 text-info" :
                    request.status === "in_progress" ? "bg-primary/10 text-primary" :
                    "bg-success/10 text-success"
                  }`}>
                    {request.status === "pending" && <Clock className="h-3 w-3" />}
                    {request.status === "accepted" && <AlertCircle className="h-3 w-3" />}
                    {request.status === "completed" && <CheckCircle className="h-3 w-3" />}
                    {request.status.replace("_", " ")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resource Utilization */}
      <Card>
        <CardHeader>
          <CardTitle>Resource Utilization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Food Packets</span>
              <span className="text-muted-foreground">1,250 / 2,000</span>
            </div>
            <Progress value={62.5} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Water Bottles</span>
              <span className="text-muted-foreground">800 / 1,500</span>
            </div>
            <Progress value={53.3} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Medical Kits</span>
              <span className="text-muted-foreground">150 / 300</span>
            </div>
            <Progress value={50} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Blankets</span>
              <span className="text-muted-foreground">400 / 500</span>
            </div>
            <Progress value={80} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}