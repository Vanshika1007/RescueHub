import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Send, Clock, AlertTriangle, Zap, Mic, MicOff, Play, Square } from "lucide-react";
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
    coordinates: null as { lat: number; lng: number } | null,
    userId: "temp-user-id", // In a real app, this would come from auth context
  });

  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const emergencyMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return await apiRequest("POST", "/api/emergency-requests", {
        ...data,
        coordinates: data.coordinates,
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
        coordinates: null,
        userId: "temp-user-id",
      });
      setAudioBlob(null);
      setIsRecording(false);
      setIsPlaying(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit emergency request",
        variant: "destructive",
      });
    },
  });

  // Get current location using Indian location API
  const getCurrentLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setFormData(prev => ({ 
            ...prev, 
            coordinates: { lat: latitude, lng: longitude } 
          }));
          
          // Use reverse geocoding to get Indian address
          try {
            const response = await fetch(
              `https://api.postalpincode.in/coordinates/${latitude},${longitude}`
            );
            const data = await response.json();
            if (data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
              const place = data[0].PostOffice[0];
              const address = `${place.Name}, ${place.District}, ${place.State} - ${place.Pincode}`;
              setFormData(prev => ({ ...prev, location: address }));
            }
          } catch (error) {
            console.error('Error getting location details:', error);
            setFormData(prev => ({ 
              ...prev, 
              location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}` 
            }));
          }
        },
        (error) => {
          toast({
            title: "Location Error",
            description: "Unable to get your location. Please enter manually.",
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: "Location Not Supported",
        description: "Geolocation is not supported by this browser.",
        variant: "destructive",
      });
    }
  };

  // Voice recording functionality
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      mediaRecorder.current = recorder;
      setIsRecording(true);
    } catch (error) {
      toast({
        title: "Microphone Error",
        description: "Unable to access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  const playRecording = () => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      const audio = new Audio(url);
      audio.onended = () => setIsPlaying(false);
      audio.play();
      setIsPlaying(true);
      audioRef.current = audio;
    }
  };

  const stopPlaying = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

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
              <Button 
                type="button" 
                variant="outline" 
                size="icon" 
                onClick={getCurrentLocation}
                data-testid="button-get-location"
              >
                <MapPin className="h-4 w-4" />
              </Button>
            </div>
            {formData.coordinates && (
              <p className="text-xs text-muted-foreground">
                📍 Location detected: {formData.coordinates.lat.toFixed(6)}, {formData.coordinates.lng.toFixed(6)}
              </p>
            )}
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

          {/* Voice Message Section for Emergency */}
          <div className="space-y-3">
            <Label>Emergency Voice Message (Optional)</Label>
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4 space-y-3">
              <p className="text-sm text-red-700 dark:text-red-300">
                🎙️ Record a voice message for faster emergency response. This helps responders understand the urgency.
              </p>
              <div className="flex items-center gap-3">
                {!isRecording ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={startRecording}
                    className="flex items-center gap-2 border-red-300 text-red-700 hover:bg-red-50"
                    data-testid="button-start-emergency-recording"
                  >
                    <Mic className="h-4 w-4" />
                    Start Emergency Recording
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={stopRecording}
                    className="flex items-center gap-2 animate-pulse"
                    data-testid="button-stop-emergency-recording"
                  >
                    <MicOff className="h-4 w-4" />
                    Stop Recording
                  </Button>
                )}
                
                {audioBlob && (
                  <div className="flex items-center gap-2">
                    {!isPlaying ? (
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={playRecording}
                        data-testid="button-play-emergency-recording"
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Play
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={stopPlaying}
                        data-testid="button-stop-emergency-playing"
                      >
                        <Square className="h-3 w-3 mr-1" />
                        Stop
                      </Button>
                    )}
                    <span className="text-xs text-red-700 dark:text-red-300">Emergency voice message recorded</span>
                  </div>
                )}
              </div>
            </div>
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
