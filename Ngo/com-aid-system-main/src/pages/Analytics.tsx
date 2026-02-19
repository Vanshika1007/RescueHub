import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Package, 
  Clock, 
  Activity,
  MapPin,
  AlertCircle,
  Download,
  Calendar
} from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
} from "recharts";

export default function Analytics() {
  // Mock data for charts
  const requestTrends = [
    { date: "Mon", requests: 45, resolved: 38, pending: 7 },
    { date: "Tue", requests: 52, resolved: 45, pending: 7 },
    { date: "Wed", requests: 38, resolved: 35, pending: 3 },
    { date: "Thu", requests: 65, resolved: 50, pending: 15 },
    { date: "Fri", requests: 48, resolved: 42, pending: 6 },
    { date: "Sat", requests: 58, resolved: 48, pending: 10 },
    { date: "Sun", requests: 42, resolved: 40, pending: 2 },
  ];

  const resourceDistribution = [
    { name: "Food Packets", value: 450, color: "#22c55e" },
    { name: "Medical Supplies", value: 230, color: "#3b82f6" },
    { name: "Water Bottles", value: 380, color: "#06b6d4" },
    { name: "Blankets", value: 120, color: "#f59e0b" },
    { name: "Shelter Kits", value: 85, color: "#8b5cf6" },
  ];

  const volunteerPerformance = [
    { name: "Vikas Kumar", requests: 24, avgTime: 45, rating: 4.8 },
    { name: "Sukhpreet Singh", requests: 22, avgTime: 38, rating: 4.9 },
    { name: "Nidhi Singh", requests: 20, avgTime: 42, rating: 4.7 },
    { name: "Parneet Kaur", requests: 18, avgTime: 50, rating: 4.6 },
    { name: "Vanshika", requests: 16, avgTime: 40, rating: 4.8 },
  ];

  const responseTimeData = [
    { hour: "00:00", time: 25 },
    { hour: "04:00", time: 20 },
    { hour: "08:00", time: 35 },
    { hour: "12:00", time: 45 },
    { hour: "16:00", time: 40 },
    { hour: "20:00", time: 30 },
  ];

  const locationHeatmap = [
    { area: "Sector 12", count: 45, urgent: 8 },
    { area: "Zone 5", count: 38, urgent: 12 },
    { area: "Relief Camp B", count: 52, urgent: 5 },
    { area: "Block A", count: 28, urgent: 3 },
    { area: "Sector 8", count: 35, urgent: 7 },
  ];

  const stats = [
    {
      title: "Total Requests",
      value: "342",
      change: "+12%",
      trend: "up",
      icon: Activity,
      color: "text-blue-500",
    },
    {
      title: "Avg Response Time",
      value: "38 min",
      change: "-8%",
      trend: "down",
      icon: Clock,
      color: "text-green-500",
    },
    {
      title: "Active Volunteers",
      value: "24",
      change: "+5",
      trend: "up",
      icon: Users,
      color: "text-purple-500",
    },
    {
      title: "Resources Used",
      value: "1,265",
      change: "+18%",
      trend: "up",
      icon: Package,
      color: "text-orange-500",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
        <div className="flex gap-2">
          <Select defaultValue="week">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
                <div className="flex items-center gap-1 mt-2">
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-green-500" />
                  )}
                  <span className={`text-sm ${stat.trend === "up" ? "text-green-500" : "text-green-500"}`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-full bg-accent ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Charts */}
      <Tabs defaultValue="requests" className="space-y-4">
        <TabsList>
          <TabsTrigger value="requests">Request Trends</TabsTrigger>
          <TabsTrigger value="resources">Resource Distribution</TabsTrigger>
          <TabsTrigger value="volunteers">Volunteer Performance</TabsTrigger>
          <TabsTrigger value="response">Response Times</TabsTrigger>
        </TabsList>

        <TabsContent value="requests">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Help Request Trends</h3>
            <ChartContainer config={{}} className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={requestTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="requests"
                    stackId="1"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.6}
                    name="Total Requests"
                  />
                  <Area
                    type="monotone"
                    dataKey="resolved"
                    stackId="2"
                    stroke="#22c55e"
                    fill="#22c55e"
                    fillOpacity={0.6}
                    name="Resolved"
                  />
                  <Area
                    type="monotone"
                    dataKey="pending"
                    stackId="2"
                    stroke="#f59e0b"
                    fill="#f59e0b"
                    fillOpacity={0.6}
                    name="Pending"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </Card>
        </TabsContent>

        <TabsContent value="resources">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Resource Distribution</h3>
              <ChartContainer config={{}} className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={resourceDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {resourceDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Resource Usage Trend</h3>
              <ChartContainer config={{}} className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={resourceDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="volunteers">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Volunteer Performance Metrics</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Volunteer Name</th>
                    <th className="text-center p-4">Requests Handled</th>
                    <th className="text-center p-4">Avg Response Time</th>
                    <th className="text-center p-4">Rating</th>
                    <th className="text-center p-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {volunteerPerformance.map((volunteer, index) => (
                    <tr key={index} className="border-b hover:bg-accent">
                      <td className="p-4 font-medium">{volunteer.name}</td>
                      <td className="text-center p-4">
                        <Badge variant="secondary">{volunteer.requests}</Badge>
                      </td>
                      <td className="text-center p-4">{volunteer.avgTime} min</td>
                      <td className="text-center p-4">
                        <div className="flex items-center justify-center gap-1">
                          <span className="font-medium">{volunteer.rating}</span>
                          <span className="text-yellow-500">★</span>
                        </div>
                      </td>
                      <td className="text-center p-4">
                        <Badge variant="default" className="bg-green-500">Active</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="response">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Response Time by Hour</h3>
              <ChartContainer config={{}} className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={responseTimeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="time" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ fill: "#3b82f6" }}
                      name="Response Time (min)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Request Hotspots</h3>
              <div className="space-y-3">
                {locationHeatmap.map((location, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-accent">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{location.area}</p>
                        <p className="text-sm text-muted-foreground">{location.count} total requests</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {location.urgent > 5 && (
                        <Badge variant="destructive" className="gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {location.urgent} urgent
                        </Badge>
                      )}
                      <div className="w-24 bg-accent rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${(location.count / 52) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}