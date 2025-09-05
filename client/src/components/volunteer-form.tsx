import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { UserPlus } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const skillOptions = [
  "Medical Training",
  "Search & Rescue",
  "Emergency Repair",
  "Logistics & Transport",
  "Communication & Coordination",
  "Food Service",
  "Counseling & Support",
  "Language Translation",
  "Technical Support",
  "Administrative Support"
];

export default function VolunteerForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    primarySkill: "",
    skills: [] as string[],
    vehicleType: "",
    location: "",
    userId: "temp-user-id", // In a real app, this would come from auth context
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const volunteerMutation = useMutation({
    mutationFn: async (data: any) => {
      // First create user if needed, then create volunteer profile
      const userData = {
        username: data.email,
        email: data.email,
        fullName: data.fullName,
        password: "temp-password", // In real implementation, this would be handled by auth
        phone: data.phone,
        role: "volunteer",
      };

      // Create user first
      await apiRequest("POST", "/api/auth/register", userData);

      // Then create volunteer profile
      return await apiRequest("POST", "/api/volunteers", {
        userId: data.userId,
        skills: data.skills,
        location: data.location,
        vehicleType: data.vehicleType || null,
        coordinates: null, // Would be populated by geolocation
      });
    },
    onSuccess: () => {
      toast({
        title: "Registration Successful",
        description: "Welcome to the AgniAid volunteer network! Your profile is under review.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/volunteers"] });
      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        primarySkill: "",
        skills: [],
        vehicleType: "",
        location: "",
        userId: "temp-user-id",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to register volunteer",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.primarySkill) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const skills = formData.primarySkill ? [formData.primarySkill, ...formData.skills.filter(s => s !== formData.primarySkill)] : formData.skills;
    volunteerMutation.mutate({ ...formData, skills });
  };

  const handleSkillToggle = (skill: string, checked: boolean) => {
    if (checked) {
      setFormData({ ...formData, skills: [...formData.skills, skill] });
    } else {
      setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto" data-testid="card-volunteer-form">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-foreground" data-testid="text-volunteer-form-title">Join Our Volunteer Network</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6" data-testid="form-volunteer-registration">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Your full name"
                data-testid="input-volunteer-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your.email@example.com"
                data-testid="input-volunteer-email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Your phone number"
              data-testid="input-volunteer-phone"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="primarySkill">Primary Skill *</Label>
            <Select value={formData.primarySkill} onValueChange={(value) => setFormData({ ...formData, primarySkill: value })}>
              <SelectTrigger data-testid="select-primary-skill">
                <SelectValue placeholder="Select your primary skill" />
              </SelectTrigger>
              <SelectContent>
                {skillOptions.map(skill => (
                  <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Additional Skills</Label>
            <div className="grid grid-cols-2 gap-2">
              {skillOptions
                .filter(skill => skill !== formData.primarySkill)
                .map(skill => (
                <div key={skill} className="flex items-center space-x-2">
                  <Checkbox
                    id={`skill-${skill}`}
                    checked={formData.skills.includes(skill)}
                    onCheckedChange={(checked) => handleSkillToggle(skill, checked as boolean)}
                    data-testid={`checkbox-skill-${skill.toLowerCase().replace(/\s+/g, '-')}`}
                  />
                  <Label htmlFor={`skill-${skill}`} className="text-sm">{skill}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vehicleType">Vehicle Type (Optional)</Label>
            <Select value={formData.vehicleType} onValueChange={(value) => setFormData({ ...formData, vehicleType: value })}>
              <SelectTrigger data-testid="select-vehicle-type">
                <SelectValue placeholder="Select vehicle type if available" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="car">Personal Car</SelectItem>
                <SelectItem value="truck">Pickup Truck</SelectItem>
                <SelectItem value="van">Van/SUV</SelectItem>
                <SelectItem value="motorcycle">Motorcycle</SelectItem>
                <SelectItem value="bicycle">Bicycle</SelectItem>
                <SelectItem value="boat">Boat</SelectItem>
                <SelectItem value="none">No Vehicle</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Your city or area"
              data-testid="input-volunteer-location"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-secondary text-white px-6 py-3 rounded-lg font-medium hover:bg-secondary/90 transition-colors"
            disabled={volunteerMutation.isPending}
            data-testid="button-submit-volunteer"
          >
            <UserPlus className="mr-2 h-5 w-5" />
            {volunteerMutation.isPending ? "Registering..." : "Join Volunteer Network"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
