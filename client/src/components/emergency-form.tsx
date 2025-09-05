import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Send, Clock, AlertTriangle, Zap } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function EmergencyForm() {
  const [formData, setFormData] = useState({
    type: "",
    urgency: "",
    title: "",
    description: "",
    location: "",
    peopleCount: 1,
    userId: "temp-user-id", // In a real app, this would come from auth context
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const emergencyMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return await apiRequest("POST", "/api/emergency-requests", {
        ...data,
        coordinates: null, // Would be populated by geolocation in real implementation
      });
    },
    onSuccess: () => {
      toast({
        title: "Emergency Request Sent",
        description: "Your request has been submitted and volunteers will be notified immediately.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/emergency-requests"] });
      // Reset form
      setFormData({
        type: "",
        urgency: "",
        title: "",
        description: "",
        location: "",
        peopleCount: 1,
        userId: "temp-user-id",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit emergency request",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.type || !formData.urgency || !formData.title || !formData.description || !formData.location) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    emergencyMutation.mutate(formData);
  };

  const urgencyOptions = [
    { value: "low", label: "Low", icon: Clock, color: "text-emergency-yellow border-emergency-yellow bg-emergency-yellow/10 hover:bg-emergency-yellow/20" },
    { value: "medium", label: "Medium", icon: AlertTriangle, color: "text-secondary border-secondary bg-secondary/10 hover:bg-secondary/20" },
    { value: "critical", label: "Critical", icon: Zap, color: "text-primary border-primary bg-primary text-primary-foreground hover:bg-primary/90" },
  ];

  return (
    <Card className="w-full max-w-2xl mx-auto" data-testid="card-emergency-form">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-foreground" data-testid="text-form-title">Request Emergency Assistance</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6" data-testid="form-emergency-request">
          <div className="space-y-2">
            <Label htmlFor="emergency-type">Emergency Type *</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
              <SelectTrigger data-testid="select-emergency-type">
                <SelectValue placeholder="Select emergency type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="medical">Medical Emergency</SelectItem>
                <SelectItem value="natural_disaster">Natural Disaster</SelectItem>
                <SelectItem value="fire">Fire Emergency</SelectItem>
                <SelectItem value="flood">Flood/Water Damage</SelectItem>
                <SelectItem value="structural_collapse">Structural Collapse</SelectItem>
                <SelectItem value="missing_person">Missing Person</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Urgency Level *</Label>
            <div className="grid grid-cols-3 gap-3">
              {urgencyOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <Button
                    key={option.value}
                    type="button"
                    variant="outline"
                    className={`px-4 py-3 ${option.color} ${formData.urgency === option.value ? 'ring-2 ring-ring' : ''}`}
                    onClick={() => setFormData({ ...formData, urgency: option.value })}
                    data-testid={`button-urgency-${option.value}`}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {option.label}
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Brief description of the emergency"
              data-testid="input-emergency-title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <div className="flex space-x-3">
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Enter address or coordinates"
                className="flex-1"
                data-testid="input-location"
              />
              <Button type="button" variant="outline" size="icon" data-testid="button-get-location">
                <MapPin className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="people-count">Number of People Affected</Label>
            <Input
              id="people-count"
              type="number"
              min="1"
              value={formData.peopleCount}
              onChange={(e) => setFormData({ ...formData, peopleCount: parseInt(e.target.value) || 1 })}
              data-testid="input-people-count"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the emergency situation in detail..."
              className="resize-none"
              data-testid="textarea-description"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-primary text-primary-foreground px-6 py-4 rounded-lg font-semibold text-lg hover:bg-primary/90 transform hover:scale-105 transition-all duration-200"
            disabled={emergencyMutation.isPending}
            data-testid="button-submit-emergency"
          >
            <Send className="mr-2 h-5 w-5" />
            {emergencyMutation.isPending ? "Sending Request..." : "Send Emergency Request"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
