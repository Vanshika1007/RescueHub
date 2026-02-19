import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  FileText,
  Download,
  TrendingUp,
  Users,
  Package,
  AlertCircle,
  CheckCircle,
  Clock,
  Calendar,
  Filter,
  Share2,
  Shield,
  Activity,
  Award,
  MapPin
} from "lucide-react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

// Mock data for charts
const dailyRequests = [
  { date: "1 Dec", completed: 12, pending: 5, rejected: 2 },
  { date: "2 Dec", completed: 18, pending: 8, rejected: 1 },
  { date: "3 Dec", completed: 22, pending: 6, rejected: 3 },
  { date: "4 Dec", completed: 28, pending: 4, rejected: 2 },
  { date: "5 Dec", completed: 35, pending: 7, rejected: 1 },
  { date: "6 Dec", completed: 42, pending: 3, rejected: 0 },
  { date: "7 Dec", completed: 45, pending: 9, rejected: 2 },
];

const resourceDistribution = [
  { resource: "Food Packets", distributed: 1250, remaining: 750 },
  { resource: "Water Bottles", distributed: 2100, remaining: 900 },
  { resource: "Medical Kits", distributed: 150, remaining: 150 },
  { resource: "Blankets", distributed: 400, remaining: 100 },
  { resource: "Tents", distributed: 25, remaining: 25 },
];

const impactMetrics = [
  { metric: "People Helped", value: "2,847", change: "+15%", icon: Users },
  { metric: "Response Time", value: "18 min", change: "-25%", icon: Clock },
  { metric: "Success Rate", value: "94%", change: "+5%", icon: CheckCircle },
  { metric: "Active Areas", value: "12", change: "+3", icon: MapPin },
];

export default function Reports() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports & Transparency</h1>
          <p className="text-muted-foreground mt-1">Track impact and maintain transparency</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Date Range
          </Button>
          <Button className="bg-gradient-primary hover:opacity-90">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Trust Badge */}
      <Card className="border-success bg-success/5">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-success" />
              <div>
                <h3 className="font-semibold">Blockchain Verified Reports</h3>
                <p className="text-sm text-muted-foreground">All records are immutable and transparent</p>
              </div>
            </div>
            <Badge variant="outline" className="border-success text-success">
              <CheckCircle className="h-3 w-3 mr-1" />
              Verified NGO
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Impact Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {impactMetrics.map((item) => (
          <Card key={item.metric}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{item.metric}</p>
                  <h3 className="text-2xl font-bold mt-1">{item.value}</h3>
                  <p className={`text-sm mt-2 flex items-center gap-1 ${
                    item.change.startsWith('+') ? 'text-success' : 
                    item.change.startsWith('-') ? 'text-info' : 'text-muted-foreground'
                  }`}>
                    <TrendingUp className="h-3 w-3" />
                    {item.change} from last week
                  </p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Daily Request Completion Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Request Completion</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dailyRequests}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="completed" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
              <Area type="monotone" dataKey="pending" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
              <Area type="monotone" dataKey="rejected" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Resource Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Resource Distribution Report</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={resourceDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="resource" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="distributed" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="remaining" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          
          <div className="mt-6 space-y-3">
            {resourceDistribution.map((item) => (
              <div key={item.resource}>
                <div className="flex justify-between text-sm mb-2">
                  <span>{item.resource}</span>
                  <span className="text-muted-foreground">
                    {item.distributed} distributed / {item.remaining} remaining
                  </span>
                </div>
                <Progress 
                  value={(item.distributed / (item.distributed + item.remaining)) * 100} 
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Activity Log */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Recent Activity Log</span>
            <Badge variant="outline">
              <Activity className="h-3 w-3 mr-1" />
              Live
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { time: "2 mins ago", action: "Completed food distribution", location: "Sector 12", status: "completed" },
              { time: "15 mins ago", action: "Assigned volunteer to medical emergency", location: "Dwarka", status: "in_progress" },
              { time: "30 mins ago", action: "Received new help request", location: "Noida", status: "pending" },
              { time: "1 hour ago", action: "Resource inventory updated", location: "Main Center", status: "completed" },
              { time: "2 hours ago", action: "Emergency alert responded", location: "Gurgaon", status: "completed" },
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className={`h-2 w-2 rounded-full mt-2 ${
                  activity.status === 'completed' ? 'bg-success' :
                  activity.status === 'in_progress' ? 'bg-warning' : 'bg-info'
                }`} />
                <div className="flex-1">
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.location} • {activity.time}</p>
                </div>
                <Button size="sm" variant="ghost">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* NGO Performance Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-warning" />
            NGO Performance Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-4xl font-bold">94.5</h2>
              <p className="text-muted-foreground">out of 100</p>
            </div>
            <Badge className="bg-gradient-success text-white">Excellent</Badge>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Response Time</span>
                <span>96/100</span>
              </div>
              <Progress value={96} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Resource Utilization</span>
                <span>92/100</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Volunteer Management</span>
                <span>95/100</span>
              </div>
              <Progress value={95} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}