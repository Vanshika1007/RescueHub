import { useState, useRef, useEffect } from "react";
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
import { useI18n } from "@/lib/i18n";

type EmergencyType =
  | "food"
  | "water"
  | "medical"
  | "shelter"
  | "rescue"
  | "other"
  | "voice_emergency";

type Urgency = "low" | "medium" | "critical";

type EmergencyFormState = {
  type: EmergencyType;
  urgency: Urgency;
  description: string;
  location: string;
  peopleCount: number;
  coordinates: { lat: number; lng: number } | null;
  userId: string;
};

export default function EmergencyForm() {
  const [formData, setFormData] = useState<EmergencyFormState>({
    type: "food",
    urgency: "medium",
    description: "",
    location: "",
    peopleCount: 1,
    coordinates: null,
    userId: "550e8400-e29b-41d4-a716-446655440000", // Valid UUID for temp user
  });

  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showVoiceInterface, setShowVoiceInterface] = useState(false);
  const [showFormInterface, setShowFormInterface] = useState(false);
  const [locationDetected, setLocationDetected] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<string>("");
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t } = useI18n();

  // Read mode from query parameter to open the desired interface directly
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const mode = params.get('mode');
      if (mode === 'voice') {
        setShowVoiceInterface(true);
        setShowFormInterface(false);
      } else if (mode === 'form') {
        setShowFormInterface(true);
        setShowVoiceInterface(false);
      }
    }
  }, []);

  type EmergencyFormPayload = EmergencyFormState & { title?: string; audioBlob?: Blob | null };
  const emergencyMutation = useMutation({
    mutationFn: async (data: EmergencyFormPayload) => {
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
        type: "food" as const,
        urgency: "medium" as const,
        description: "",
        location: "",
        peopleCount: 1,
        coordinates: null,
        userId: "550e8400-e29b-41d4-a716-446655440000",
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

  // Get current location using improved location API
  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      toast({
        title: "Location Not Supported",
        description: "Geolocation is not supported by this browser.",
        variant: "destructive",
      });
      return;
    }

    // Show loading state
    toast({
      title: "Getting Your Location",
      description: "Please allow location access for emergency response",
    });

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setFormData(prev => ({ 
            ...prev, 
            coordinates: { lat: latitude, lng: longitude } 
          }));
        
          let address = "";
        
        // Try multiple location services for better reliability
        try {
          // First try: Indian Postal API
          const postalResponse = await fetch(
            `https://api.postalpincode.in/coordinates/${latitude},${longitude}`,
            { timeout: 5000 }
          );
          if (postalResponse.ok) {
            const postalData = await postalResponse.json();
            if (postalData[0]?.Status === 'Success' && postalData[0]?.PostOffice?.length > 0) {
              const place = postalData[0].PostOffice[0];
              address = `${place.Name}, ${place.District}, ${place.State} - ${place.Pincode}`;
            }
          }
        } catch (error) {
          console.log("Postal API failed, trying alternatives");
        }

        // Second try: OpenStreetMap Nominatim
          if (!address) {
            try {
            const osmResponse = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
              { 
                headers: {
                  'User-Agent': 'AgniAid-Emergency-Platform/1.0'
                },
                timeout: 5000
              }
            );
            if (osmResponse.ok) {
              const osmData = await osmResponse.json();
              if (osmData && osmData.display_name) {
                address = osmData.display_name;
              }
            }
          } catch (error) {
            console.log("OSM API failed, trying alternatives");
          }
        }

        // Third try: Google Geocoding (if available)
          if (!address) {
          try {
            const googleResponse = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=YOUR_API_KEY`,
              { timeout: 5000 }
            );
            if (googleResponse.ok) {
              const googleData = await googleResponse.json();
              if (googleData.results && googleData.results.length > 0) {
                address = googleData.results[0].formatted_address;
              }
            }
          } catch (error) {
            console.log("Google API not available");
          }
        }

        // Fallback: Use coordinates if no address found
        if (!address) {
          address = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
        }

        setFormData(prev => ({ ...prev, location: address }));
        
        toast({
          title: "Location Detected",
          description: `Location: ${address}`,
        });
        },
        (error) => {
        let errorMessage = "Unable to get your location. Please try again.";
        if (error.code === error.PERMISSION_DENIED) {
          errorMessage = "Location access denied. Please allow location access for emergency response.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMessage = "Location information unavailable. Please check your GPS settings.";
        } else if (error.code === error.TIMEOUT) {
          errorMessage = "Location request timed out. Please try again.";
        }
          toast({
            title: "Location Error",
          description: errorMessage,
            variant: "destructive",
          });
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  // Detect location for voice interface
  const detectLocationForVoice = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          // Try Indian Postal API first
          let address = "";
          try {
            const response = await fetch(
              `https://api.postalpincode.in/coordinates/${latitude},${longitude}`
            );
            const data = await response.json();
            if (data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
              const place = data[0].PostOffice[0];
              address = `${place.Name}, ${place.District}, ${place.State} - ${place.Pincode}`;
            }
          } catch (error) {
            // ignore, fallback below
          }
          // Fallback to OpenStreetMap Nominatim if no address
          if (!address) {
            try {
              const osmRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
              const osmData = await osmRes.json();
              if (osmData && osmData.display_name) {
                address = osmData.display_name;
              }
            } catch (error) {
              // ignore
            }
          }
          setCurrentLocation(address || "");
          setLocationDetected(true);
          toast({
            title: address ? "Location Detected" : "Location Error",
            description: address ? `Your location: ${address}` : "Unable to fetch address. Please try again.",
            variant: address ? undefined : "destructive",
          });
        },
        (error) => {
          let errorMessage = "Unable to get your location. Please try again.";
          if (error.code === error.PERMISSION_DENIED) {
            errorMessage = "Location access denied. Please allow location access for emergency response.";
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            errorMessage = "Location information unavailable. Please check your GPS settings.";
          } else if (error.code === error.TIMEOUT) {
            errorMessage = "Location request timed out. Please try again.";
          }
          toast({
            title: "Location Error",
            description: errorMessage,
            variant: "destructive",
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      toast({
        title: "Location Not Supported",
        description: "Geolocation is not supported by this browser. Please use a different device.",
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
    if (!formData.type || !formData.urgency || !formData.location) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    // Add title if not present
    const dataWithTitle: EmergencyFormPayload = {
      ...formData,
      title: `${formData.type} Emergency - ${formData.urgency} Priority`,
    };
    
    emergencyMutation.mutate(dataWithTitle);
  };

  // Handle voice-only emergency request
  const handleVoiceSubmit = async () => {
    if (!audioBlob) {
      toast({
        title: "No Voice Message",
        description: "Please record a voice message first",
        variant: "destructive",
      });
      return;
    }

    // Show loading state
    toast({
      title: "Getting Your Location",
      description: "Please allow location access for emergency response",
    });

    // Get current location for voice request
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          // Try Indian Postal API first
          let address = "";
          try {
            const response = await fetch(
              `https://api.postalpincode.in/coordinates/${latitude},${longitude}`
            );
            const data = await response.json();
            if (data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
              const place = data[0].PostOffice[0];
              address = `${place.Name}, ${place.District}, ${place.State} - ${place.Pincode}`;
            }
          } catch (error) {
            // ignore, fallback below
          }
          // Fallback to OpenStreetMap Nominatim if no address
          if (!address) {
            try {
              const osmRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
              const osmData = await osmRes.json();
              if (osmData && osmData.display_name) {
                address = osmData.display_name;
              }
            } catch (error) {
              // ignore
            }
          }
          const voiceData: EmergencyFormPayload = {
            type: "voice_emergency" as const,
            urgency: "critical" as const, // Default to critical for voice requests
            title: "Voice Emergency Request",
            description: "Voice message emergency request",
            location: address,
            peopleCount: 1,
            coordinates: { lat: latitude, lng: longitude },
            userId: "550e8400-e29b-41d4-a716-446655440000",
            audioBlob: audioBlob,
          };
          emergencyMutation.mutate(voiceData);
          if (!address) {
            toast({
              title: "Location Error",
              description: "Unable to fetch address. Volunteers may not see your exact location.",
              variant: "destructive",
            });
          }
        },
        (error) => {
          let errorMessage = "Unable to get your location. Please try again.";
          if (error.code === error.PERMISSION_DENIED) {
            errorMessage = "Location access denied. Please allow location access for emergency response.";
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            errorMessage = "Location information unavailable. Please check your GPS settings.";
          } else if (error.code === error.TIMEOUT) {
            errorMessage = "Location request timed out. Please try again.";
          }
          toast({
            title: "Location Error",
            description: errorMessage,
            variant: "destructive",
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      toast({
        title: "Location Not Supported",
        description: "Geolocation is not supported by this browser. Please use a different device.",
        variant: "destructive",
      });
    }
  };

  const urgencyOptions = [
    { value: "low", label: "Low", icon: Clock, color: "text-emergency-yellow border-emergency-yellow bg-emergency-yellow/10 hover:bg-emergency-yellow/20" },
    { value: "medium", label: "Medium", icon: AlertTriangle, color: "text-secondary border-secondary bg-secondary/10 hover:bg-secondary/20" },
    { value: "critical", label: "Critical", icon: Zap, color: "text-primary border-primary bg-primary text-primary-foreground hover:bg-primary/90" },
  ];

  // Show main options screen
  if (!showVoiceInterface && !showFormInterface) {
    return (
      <div className="w-full max-w-4xl mx-auto" data-testid="card-emergency-form">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-foreground" data-testid="text-form-title">
              🚨 {t("emergency_title")}
            </CardTitle>
            <p className="text-center text-muted-foreground text-lg">
              {t("emergency_subtitle")}
            </p>
          </CardHeader>
        </Card>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Voice Option - Big and Prominent */}
          <Card 
            className="group bg-white text-black border-2 border-red-500 hover:bg-red-500 hover:text-white shadow-2xl transition-colors duration-300 cursor-pointer"
            onClick={() => setShowVoiceInterface(true)}
          >
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mic className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 group-hover:text-white">{t("voice_option")}</h3>
              <p className="text-black group-hover:text-white mb-6 text-lg">
                {t("voice_desc")}
              </p>
              <div className="bg-gray-100 text-black rounded-lg p-4 mb-6 group-hover:bg-gray-100 group-hover:text-black">
                <p className="font-medium mb-2">Perfect for:</p>
                <p className="text-sm">• Urgent situations</p>
                <p className="text-sm">• When you can't type</p>
                <p className="text-sm">• Quick emergency response</p>
              </div>
              <Button 
                className="w-full bg-red-500 text-white group-hover:bg-gray-200 group-hover:text-black font-bold py-4 text-lg"
                data-testid="button-voice-option"
              >
                <Mic className="mr-2 h-6 w-6" />
                Start Voice Recording
              </Button>
            </CardContent>
          </Card>

          {/* Form Option */}
          <Card 
            className="group bg-white text-black border-2 border-red-500 hover:bg-red-500 hover:text-white shadow-2xl transition-colors duration-300 cursor-pointer"
            onClick={() => setShowFormInterface(true)}
          >
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 group-hover:text-white">{t("form_option")}</h3>
              <p className="text-black group-hover:text-white mb-6 text-lg">
                {t("form_desc")}
              </p>
              <div className="bg-gray-100 text-black rounded-lg p-4 mb-6 group-hover:bg-gray-100 group-hover:text-black">
                <p className="font-medium mb-2">Perfect for:</p>
                <p className="text-sm">• Detailed information</p>
                <p className="text-sm">• Specific emergency types</p>
                <p className="text-sm">• Multiple people affected</p>
              </div>
              <Button 
                className="w-full bg-red-500 text-white group-hover:bg-gray-200 group-hover:text-black font-bold py-4 text-lg mt-5"
                data-testid="button-form-option"
              >
                <AlertTriangle className="mr-2 h-6 w-6" />
                Fill Emergency Form
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show voice interface
  if (showVoiceInterface) {
    return (
      <div className="w-full max-w-4xl mx-auto" data-testid="card-emergency-form">
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Mic className="h-6 w-6 text-red-500" />
                Quick Voice Message
              </CardTitle>
              <Button 
                variant="outline" 
                onClick={() => setShowVoiceInterface(false)}
                className="text-muted-foreground"
              >
                ← Back to Options
              </Button>
            </div>
          </CardHeader>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mic className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-red-800 mb-4">Record Your Emergency Message</h3>
              <p className="text-red-700 text-lg mb-4">
                Speak clearly about your emergency. We need to detect your location first.
              </p>
              
              {/* Location Detection Status */}
              <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
                {!locationDetected ? (
                  <div className="text-center">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <MapPin className="h-6 w-6 text-yellow-600" />
                    </div>
                    <p className="text-gray-700 font-medium mb-3">Location Not Detected</p>
                    <Button 
                      onClick={detectLocationForVoice}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-2 rounded-lg"
                    >
                      <MapPin className="mr-2 h-4 w-4" />
                      Detect My Location
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <MapPin className="h-6 w-6 text-green-600" />
                    </div>
                    <p className="text-green-700 font-medium mb-2">✅ Location Detected</p>
                    <p className="text-sm text-gray-600 break-words">{currentLocation}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              {!isRecording ? (
                <Button
                  type="button"
                  onClick={startRecording}
                  disabled={!locationDetected}
                  className={`w-full font-bold py-6 text-xl rounded-xl shadow-lg transition-all duration-300 ${
                    locationDetected 
                      ? 'bg-red-500 hover:bg-red-600 text-white hover:shadow-xl transform hover:scale-105' 
                      : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  }`}
                  data-testid="button-start-emergency-recording"
                >
                  <Mic className="mr-3 h-8 w-8" />
                  {locationDetected ? 'Start Voice Recording' : 'Please Detect Location First'}
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={stopRecording}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-6 text-xl rounded-xl shadow-lg animate-pulse"
                  data-testid="button-stop-emergency-recording"
                >
                  <MicOff className="mr-3 h-8 w-8" />
                  Stop Recording
                </Button>
              )}
              
              {audioBlob && (
                <div className="space-y-4">
                  <div className="bg-green-100 border border-green-300 rounded-lg p-4">
                    <p className="text-green-800 font-medium text-center mb-3">
                      ✅ Voice message recorded successfully!
                    </p>
                    <div className="flex gap-3">
                      {!isPlaying ? (
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={playRecording}
                          className="flex-1"
                          data-testid="button-play-emergency-recording"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Play Message
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={stopPlaying}
                          className="flex-1"
                          data-testid="button-stop-emergency-playing"
                        >
                          <Square className="h-4 w-4 mr-2" />
                          Stop Playing
                        </Button>
                      )}
                    </div>
                  </div>

                  <Button 
                    onClick={handleVoiceSubmit}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-6 text-xl rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    disabled={emergencyMutation.isPending}
                    data-testid="button-send-voice-request"
                  >
                    <Send className="mr-3 h-8 w-8" />
                    {emergencyMutation.isPending ? "Sending Request..." : "Send Emergency Request"}
                  </Button>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 font-medium mb-2">💡 How it works:</p>
                <p className="text-blue-700 text-sm">
                  1. Click "Detect My Location" to get your current location<br/>
                  2. Click "Start Voice Recording" and speak your emergency details<br/>
                  3. Click "Send Emergency Request" to submit your voice message and location
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show form interface
  if (showFormInterface) {
    return (
      <div className="w-full max-w-4xl mx-auto" data-testid="card-emergency-form">
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-blue-500" />
                Detailed Emergency Form
              </CardTitle>
              <Button 
                variant="outline" 
                onClick={() => setShowFormInterface(false)}
                className="text-muted-foreground"
              >
                ← Back to Options
              </Button>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6" data-testid="form-emergency-request">
              <div className="space-y-2">
                <Label htmlFor="emergency-type">{t("emergency_type")} *</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as typeof formData.type })}>
                  <SelectTrigger data-testid="select-emergency-type">
                    <SelectValue placeholder="Select emergency type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="food">🍞 Food</SelectItem>
                    <SelectItem value="water">💧 Water</SelectItem>
                    <SelectItem value="medical">🏥 Medical</SelectItem>
                    <SelectItem value="shelter">🏠 Shelter</SelectItem>
                    <SelectItem value="rescue">🚑 Rescue</SelectItem>
                    <SelectItem value="other">⚠️ Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>{t("urgency_level")} *</Label>
                <div className="grid grid-cols-3 gap-3">
                  {urgencyOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <Button
                        key={option.value}
                        type="button"
                        variant="outline"
                        className={`px-4 py-3 ${option.color} ${formData.urgency === option.value ? 'ring-2 ring-ring' : ''}`}
                        onClick={() => setFormData({ ...formData, urgency: option.value as typeof formData.urgency })}
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
                <Label htmlFor="location">{t("location")} *</Label>
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
                    title={t("get_location")}
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
                <Label htmlFor="people-count">{t("people_count")}</Label>
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
                <Label htmlFor="description">{t("description")}</Label>
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

              <div className="space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-red-600 text-white px-6 py-4 rounded-lg font-semibold text-lg hover:bg-red-700 transform hover:scale-105 transition-all duration-200"
                disabled={emergencyMutation.isPending}
                data-testid="button-submit-emergency"
              >
                <Send className="mr-2 h-5 w-5" />
                  {emergencyMutation.isPending ? "Sending Request..." : t("send_request")}
                </Button>
                
                <Button 
                  type="button"
                  variant="outline"
                  className="w-full bg-green-50 text-green-700 border-green-300 hover:bg-green-100 px-6 py-4 rounded-lg font-semibold text-lg transform hover:scale-105 transition-all duration-200"
                  onClick={() => {
                    toast({
                      title: "✅ Safe Status Sent",
                      description: "Your family and friends have been notified that you are safe.",
                    });
                  }}
                  data-testid="button-i-am-safe"
                >
                  <span className="mr-2">✅</span>
                  I am Safe
              </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
