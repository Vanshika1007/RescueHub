import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n";
import { apiRequest } from "@/lib/queryClient";
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Skills, 
  Building2, 
  CheckCircle,
  Heart
} from "lucide-react";

interface NGO {
  id: string;
  organizationName: string;
  description: string;
  location: string;
  isVerified: boolean;
}

interface VolunteerRegistrationData {
  name: string;
  age?: number;
  gender?: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  availability: string;
  availabilityDates?: string;
  skills: string[];
  preferredRole?: string;
  selectedNgoId: string;
  consentGiven: boolean;
}

const SKILL_OPTIONS = [
  { id: "medical_aid", label: "🏥 Medical Aid", description: "First aid, EMT, medical support" },
  { id: "rescue_evacuation", label: "🚑 Rescue & Evacuation", description: "Search and rescue operations" },
  { id: "driving_transport", label: "🚗 Driving / Transport", description: "Vehicle operation and logistics" },
  { id: "food_relief", label: "🍞 Food & Relief Distribution", description: "Food distribution and relief work" },
  { id: "logistics_coordination", label: "📋 Logistics / Coordination", description: "Supply chain and coordination" },
  { id: "it_communication", label: "💻 IT / Communication Support", description: "Technical and communication support" },
  { id: "construction_repair", label: "🔨 Construction / Repair", description: "Infrastructure repair and construction" },
  { id: "counseling_support", label: "💬 Counseling / Support", description: "Psychological and emotional support" },
  { id: "language_translation", label: "🗣️ Language / Translation", description: "Multi-language support" },
  { id: "general_help", label: "🤝 General Help", description: "General assistance and support" }
];

const AVAILABILITY_OPTIONS = [
  { value: "full_time", label: "Full-time (24/7 available)" },
  { value: "part_time", label: "Part-time (Weekends/Evenings)" },
  { value: "specific_dates", label: "Specific dates only" },
  { value: "emergency_only", label: "Emergency situations only" }
];

const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "prefer_not_to_say", label: "Prefer not to say" }
];

export default function VolunteerRegistrationForm() {
  const { t } = useI18n();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<VolunteerRegistrationData>({
    name: "",
    age: undefined,
    gender: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    availability: "",
    availabilityDates: "",
    skills: [],
    preferredRole: "",
    selectedNgoId: "",
    consentGiven: false,
  });

  // Fetch verified NGOs
  const { data: ngosData, isLoading: isLoadingNGOs } = useQuery<{ ngos: NGO[] }>({
    queryKey: ["/api/ngos?verified=true"],
    select: (data) => data || { ngos: [] },
  });

  const volunteerRegistrationMutation = useMutation({
    mutationFn: async (data: VolunteerRegistrationData) => {
      // Create a lightweight user first (no auth yet), then create volunteer profile
      const userPayload = {
        username: data.email || data.phone,
        email: data.email || `${Date.now()}@example.com`,
        fullName: data.name,
        password: "temp-password",
        phone: data.phone,
        role: "volunteer",
      };

      const userRes = await apiRequest("POST", "/api/auth/register", userPayload);
      const userJson = await userRes.json();
      const userId = userJson.user.id as string;

      const locationParts = [data.address, data.city, data.state].filter(Boolean);
      const volunteerPayload = {
        userId,
        skills: data.skills,
        location: locationParts.join(", ") || undefined,
        vehicleType: null,
        coordinates: null,
      };

      return await apiRequest("POST", "/api/volunteers", volunteerPayload);
    },
    onSuccess: () => {
      toast({
        title: "✅ Registration Successful!",
        description: "Your volunteer registration has been submitted. The selected NGO will review your application and contact you soon.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/volunteer-registrations"] });
      // Reset form
      setFormData({
        name: "",
        age: undefined,
        gender: "",
        phone: "",
        email: "",
        address: "",
        city: "",
        state: "",
        availability: "",
        availabilityDates: "",
        skills: [],
        preferredRole: "",
        selectedNgoId: "",
        consentGiven: false,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSkillToggle = (skillId: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skillId)
        ? prev.skills.filter(id => id !== skillId)
        : [...prev.skills, skillId]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.consentGiven) {
      toast({
        title: "Consent Required",
        description: "Please agree to share your details with the selected NGO.",
        variant: "destructive",
      });
      return;
    }

    if (formData.skills.length === 0) {
      toast({
        title: "Skills Required",
        description: "Please select at least one skill.",
        variant: "destructive",
      });
      return;
    }

    volunteerRegistrationMutation.mutate(formData);
  };

  const selectedNGO = ngosData?.ngos.find(ngo => ngo.id === formData.selectedNgoId);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="shadow-lg">
        <CardHeader className="text-center bg-gradient-to-r from-blue-50 to-purple-50">
          <CardTitle className="flex items-center justify-center gap-3 text-2xl">
            <Heart className="h-8 w-8 text-red-500" />
            Join as Volunteer
          </CardTitle>
          <p className="text-muted-foreground">
            Help make a difference in disaster relief efforts. Fill out the form below to register as a volunteer.
          </p>
        </CardHeader>
        
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Details */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <User className="h-5 w-5 text-blue-500" />
                Basic Details
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age || ""}
                    onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || undefined })}
                    placeholder="Enter your age"
                    min="16"
                    max="80"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      {GENDER_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter your email address"
                  />
                </div>
              </div>
            </div>

            {/* Location & Availability */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <MapPin className="h-5 w-5 text-green-500" />
                Location & Availability
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Enter your address"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Enter your city"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="Enter your state"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="availability">Availability *</Label>
                  <Select value={formData.availability} onValueChange={(value) => setFormData({ ...formData, availability: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your availability" />
                    </SelectTrigger>
                    <SelectContent>
                      {AVAILABILITY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {formData.availability === "specific_dates" && (
                <div className="space-y-2">
                  <Label htmlFor="availabilityDates">Specific Dates</Label>
                  <Input
                    id="availabilityDates"
                    value={formData.availabilityDates}
                    onChange={(e) => setFormData({ ...formData, availabilityDates: e.target.value })}
                    placeholder="e.g., Weekends, Dec 15-20, etc."
                  />
                </div>
              )}
            </div>

            {/* Skills & Role */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Skills className="h-5 w-5 text-purple-500" />
                Skills & Role
              </h3>
              
              <div className="space-y-4">
                <Label>Select Your Skills * (Choose at least one)</Label>
                <div className="grid md:grid-cols-2 gap-4">
                  {SKILL_OPTIONS.map((skill) => (
                    <div
                      key={skill.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        formData.skills.includes(skill.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleSkillToggle(skill.id)}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={formData.skills.includes(skill.id)}
                          onChange={() => handleSkillToggle(skill.id)}
                        />
                        <div>
                          <div className="font-medium">{skill.label}</div>
                          <div className="text-sm text-muted-foreground">{skill.description}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {formData.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skillId) => {
                      const skill = SKILL_OPTIONS.find(s => s.id === skillId);
                      return (
                        <Badge key={skillId} variant="secondary" className="bg-blue-100 text-blue-700">
                          {skill?.label}
                        </Badge>
                      );
                    })}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="preferredRole">Preferred Role (Optional)</Label>
                <Textarea
                  id="preferredRole"
                  value={formData.preferredRole}
                  onChange={(e) => setFormData({ ...formData, preferredRole: e.target.value })}
                  placeholder="Describe your preferred role or any specific areas you'd like to help with..."
                  rows={3}
                />
              </div>
            </div>

            {/* NGO Selection */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Building2 className="h-5 w-5 text-orange-500" />
                Choose NGO to Work With
              </h3>
              
              <div className="space-y-2">
                <Label htmlFor="selectedNgoId">Select NGO *</Label>
                <Select value={formData.selectedNgoId} onValueChange={(value) => setFormData({ ...formData, selectedNgoId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an NGO to work with" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingNGOs ? (
                      <SelectItem value="loading" disabled>Loading NGOs...</SelectItem>
                    ) : (
                      ngosData?.ngos.map((ngo) => (
                        <SelectItem key={ngo.id} value={ngo.id}>
                          <div className="flex items-center gap-2">
                            <span>{ngo.organizationName}</span>
                            {ngo.isVerified && <Badge variant="secondary" className="text-xs">Verified</Badge>}
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                
                {selectedNGO && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold">{selectedNGO.organizationName}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{selectedNGO.description}</p>
                    <p className="text-sm text-muted-foreground mt-1">📍 {selectedNGO.location}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Consent */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="consent"
                  checked={formData.consentGiven}
                  onCheckedChange={(checked) => setFormData({ ...formData, consentGiven: !!checked })}
                />
                <Label htmlFor="consent" className="text-sm leading-relaxed">
                  I agree to share my details with the selected NGO for disaster relief work. 
                  I understand that my information will be used for volunteer coordination and 
                  emergency response purposes only.
                </Label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <Button
                type="submit"
                size="lg"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={volunteerRegistrationMutation.isPending}
              >
                {volunteerRegistrationMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting Registration...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Submit Volunteer Registration
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
