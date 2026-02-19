import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, MessageSquare, Phone, Send, AlertTriangle, Users, Radio, Mail } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function Communication() {
  const [message, setMessage] = useState("");
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [selectedVolunteers, setSelectedVolunteers] = useState<string[]>([]);

  // Mock data for messages
  const messages = [
    { id: 1, sender: "Vikas Kumar", message: "Reached location, assessing situation", time: "10:30 AM", type: "volunteer" },
    { id: 2, sender: "Help Request #45", message: "Urgent medical supplies needed", time: "10:15 AM", type: "request", urgent: true },
    { id: 3, sender: "Sukhpreet Singh", message: "Delivered food packets to 20 families", time: "9:45 AM", type: "volunteer" },
    { id: 4, sender: "Central Relief Hub", message: "New supplies arriving at 2 PM", time: "9:30 AM", type: "hub" },
    { id: 5, sender: "Nidhi Singh", message: "Medical camp setup complete", time: "9:00 AM", type: "volunteer" },
  ];

  const volunteers = [
    { id: 1, name: "Vikas Kumar", status: "online", skill: "Rescue" },
    { id: 2, name: "Sukhpreet Singh", status: "busy", skill: "Medical" },
    { id: 3, name: "Nidhi Singh", status: "online", skill: "Medical" },
    { id: 4, name: "Parneet Kaur", status: "offline", skill: "Distribution" },
    { id: 5, name: "Vanshika", status: "online", skill: "Coordination" },
  ];

  const alerts = [
    { id: 1, message: "Flood warning in Sector 12", time: "1 hour ago", severity: "high" },
    { id: 2, message: "Medical emergency at Relief Camp B", time: "2 hours ago", severity: "critical" },
    { id: 3, message: "Food shortage reported in Zone 5", time: "3 hours ago", severity: "medium" },
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      toast({
        title: "Message Sent",
        description: "Your message has been delivered successfully",
      });
      setMessage("");
    }
  };

  const handleBroadcast = () => {
    if (broadcastMessage.trim() && selectedVolunteers.length > 0) {
      toast({
        title: "Broadcast Sent",
        description: `Emergency message sent to ${selectedVolunteers.length} volunteers`,
        variant: "default",
      });
      setBroadcastMessage("");
      setSelectedVolunteers([]);
    }
  };

  const toggleVolunteerSelection = (volunteerId: string) => {
    setSelectedVolunteers(prev =>
      prev.includes(volunteerId)
        ? prev.filter(id => id !== volunteerId)
        : [...prev, volunteerId]
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">Communication Hub</h1>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Phone className="h-4 w-4" />
            Emergency Hotline
          </Button>
          <Button variant="destructive" className="gap-2">
            <AlertTriangle className="h-4 w-4" />
            Send SOS
          </Button>
        </div>
      </div>

      <Tabs defaultValue="messages" className="space-y-4">
        <TabsList>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="broadcast">Emergency Broadcast</TabsTrigger>
          <TabsTrigger value="alerts">System Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="messages" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 p-4">
              <div className="flex flex-col h-[500px]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Recent Messages</h3>
                  <Badge variant="secondary">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    {messages.length} Active
                  </Badge>
                </div>
                
                <ScrollArea className="flex-1 pr-4">
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div key={msg.id} className="flex gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {msg.sender.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{msg.sender}</span>
                            {msg.urgent && (
                              <Badge variant="destructive" className="text-xs">
                                Urgent
                              </Badge>
                            )}
                            <span className="text-xs text-muted-foreground ml-auto">
                              {msg.time}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{msg.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="flex gap-2 mt-4">
                  <Input
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4">Active Volunteers</h3>
              <ScrollArea className="h-[450px]">
                <div className="space-y-3">
                  {volunteers.map((volunteer) => (
                    <div key={volunteer.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-accent">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{volunteer.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${
                            volunteer.status === 'online' ? 'bg-green-500' :
                            volunteer.status === 'busy' ? 'bg-yellow-500' : 'bg-gray-400'
                          }`} />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{volunteer.name}</p>
                          <p className="text-xs text-muted-foreground">{volunteer.skill}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="broadcast" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Radio className="h-5 w-5 text-destructive" />
                <h3 className="text-lg font-semibold">Emergency Broadcast System</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Select Recipients</label>
                    <ScrollArea className="h-[200px] border rounded-lg p-3">
                      <div className="space-y-2">
                        {volunteers.map((volunteer) => (
                          <div key={volunteer.id} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id={`volunteer-${volunteer.id}`}
                              checked={selectedVolunteers.includes(volunteer.id.toString())}
                              onChange={() => toggleVolunteerSelection(volunteer.id.toString())}
                              className="rounded"
                            />
                            <label 
                              htmlFor={`volunteer-${volunteer.id}`} 
                              className="text-sm cursor-pointer flex-1"
                            >
                              {volunteer.name} ({volunteer.skill})
                            </label>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedVolunteers(volunteers.map(v => v.id.toString()))}
                    >
                      Select All
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedVolunteers([])}
                    >
                      Clear All
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Broadcast Message</label>
                    <Textarea
                      placeholder="Type your emergency broadcast message..."
                      value={broadcastMessage}
                      onChange={(e) => setBroadcastMessage(e.target.value)}
                      className="min-h-[150px]"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleBroadcast}
                      className="flex-1"
                      disabled={!broadcastMessage.trim() || selectedVolunteers.length === 0}
                      variant="destructive"
                    >
                      <Radio className="h-4 w-4 mr-2" />
                      Send Broadcast ({selectedVolunteers.length} selected)
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">System Alerts & Notifications</h3>
              <Badge variant="destructive">
                <Bell className="h-3 w-3 mr-1" />
                {alerts.length} Active
              </Badge>
            </div>
            
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className={`p-4 rounded-lg border-l-4 ${
                    alert.severity === 'critical' ? 'border-red-500 bg-red-50 dark:bg-red-950/20' :
                    alert.severity === 'high' ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/20' :
                    'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                      <AlertTriangle className={`h-5 w-5 mt-0.5 ${
                        alert.severity === 'critical' ? 'text-red-500' :
                        alert.severity === 'high' ? 'text-orange-500' :
                        'text-yellow-500'
                      }`} />
                      <div>
                        <p className="font-medium">{alert.message}</p>
                        <p className="text-sm text-muted-foreground mt-1">{alert.time}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Respond
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}