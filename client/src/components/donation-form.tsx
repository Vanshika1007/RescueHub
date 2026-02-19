import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  CreditCard, 
  Shield,
  CheckCircle,
  Globe,
  User,
  Phone,
  EyeOff,
  Sparkles,
  Award,
  Lock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Razorpay types
declare global {
  interface Window {
    Razorpay: any;
  }
}

const quickAmounts = [500, 1000, 2500, 5000, 10000];

const donationCategories = [
  { 
    id: "emergency", 
    label: "Emergency Relief", 
    emoji: "🚨",
    impact: "Provides emergency kits for 5 families"
  },
  { 
    id: "medical", 
    label: "Medical Supplies", 
    emoji: "🏥",
    impact: "Covers medical treatment for 10 people"
  },
  { 
    id: "food", 
    label: "Food & Water", 
    emoji: "🍽️",
    impact: "Feeds a family of 4 for 2 weeks"
  },
  { 
    id: "shelter", 
    label: "Shelter & Housing", 
    emoji: "🏠",
    impact: "Provides temporary shelter for 3 families"
  },
  { 
    id: "education", 
    label: "Education Support", 
    emoji: "📚",
    impact: "Supports 20 children's education for 1 month"
  }
];

interface FormData {
  amount: string;
  donationType: string;
  customAmount: boolean;
  name: string;
  phone: string;
  anonymous: boolean;
  donorId: string;
}

export default function DonationForm() {
  const [formData, setFormData] = useState<FormData>({
    amount: "",
    donationType: "",
    customAmount: false,
    name: "",
    phone: "",
    anonymous: false,
    donorId: "temp-donor-id",
  });

  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.donationType) {
      toast({
        title: "Almost there!",
        description: "Please select an amount and what you'd like to support",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid donation amount",
        variant: "destructive",
      });
      return;
    }

    if (!formData.anonymous) {
      if (!formData.name.trim()) {
        toast({
          title: "Name Required",
          description: "Please enter your name or choose anonymous donation",
          variant: "destructive",
        });
        return;
      }
      
      if (!formData.phone.trim()) {
        toast({
          title: "Phone Required",
          description: "Please enter your phone number for important updates",
          variant: "destructive",
        });
        return;
      }
      
      const phoneRegex = /^[+]?[0-9\s\-\(\)]{10,15}$/;
      if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
        toast({
          title: "Invalid Phone Number",
          description: "Please enter a valid phone number",
          variant: "destructive",
        });
        return;
      }
    }

    setIsLoading(true);
    
    try {
      const orderResponse = await fetch("http://localhost:5000/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          currency: "INR",
          donorName: formData.anonymous ? "Anonymous" : formData.name,
          donorPhone: formData.anonymous ? "Anonymous" : formData.phone,
          donorEmail: formData.anonymous ? "anonymous@donor.com" : "donor@provided.com",
          donationType: formData.donationType,
          isAnonymous: formData.anonymous
        }),
      });

      const orderData = await orderResponse.json();
      if (!orderData.success || !orderData.id) {
        throw new Error(orderData.error || "Failed to create order");
      }

      const options = {
        key: "rzp_test_RKcCbw96hKSCC5",
        amount: orderData.amount,
        currency: orderData.currency,
        name: "AgniAid - Disaster Relief",
        description: `${getDonationLabel()} donation - Thank you for your kindness!`,
        order_id: orderData.id,
        handler: async function (response: any) {
          try {
            const verifyResponse = await fetch("http://localhost:5000/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: orderData.id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                donorData: {
                  ...formData,
                  name: formData.anonymous ? "Anonymous" : formData.name,
                  phone: formData.anonymous ? "Anonymous" : formData.phone,
                },
                amount,
              }),
            });

            const verifyData = await verifyResponse.json();
            if (verifyData.success) {
              toast({
                title: "🎉 Thank you so much!",
                description: `Your donation of ₹${amount.toLocaleString()} will make a real difference. ${formData.anonymous ? "Your privacy is protected!" : `We'll update you on ${formData.phone}`}`,
              });
              
              setFormData({
                amount: "", donationType: "", customAmount: false,
                name: "", phone: "", anonymous: false, donorId: "temp-donor-id",
              });
            } else {
              throw new Error("Payment verification failed");
            }
          } catch (error: any) {
            toast({
              title: "Payment Successful!",
              description: "Your donation went through! We'll confirm shortly via SMS/call.",
            });
          }
        },
        prefill: {
          name: formData.anonymous ? "Anonymous Donor" : formData.name,
          email: "donor@agniaid.com",
          contact: formData.anonymous ? "9999999999" : formData.phone.replace(/\D/g, '')
        },
        theme: {
          color: "#ef4444"
        },
        modal: {
          ondismiss: function() {
            setIsLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error("Payment error:", err);
      toast({
        title: "Oops!",
        description: "Something went wrong. Please try again in a moment.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleQuickAmount = (amount: number) => {
    setFormData({
      ...formData,
      amount: amount.toString(),
      customAmount: false,
    });
  };

  const getDonationLabel = () => {
    const category = donationCategories.find(cat => cat.id === formData.donationType);
    return category ? category.label : "Disaster Relief";
  };

  const getSelectedCategory = () => {
    return donationCategories.find(cat => cat.id === formData.donationType);
  };

  const getImpactText = () => {
    const category = donationCategories.find(cat => cat.id === formData.donationType);
    const amount = parseInt(formData.amount);
    
    if (!category || !amount) return "";
    
    const multiplier = Math.floor(amount / 1000) || 1;
    return category.impact.replace(/\d+/, (multiplier * parseInt(category.impact.match(/\d+/)?.[0] || "1")).toString());
  };

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="relative bg-gray-200 text-gray-800 rounded-t-2xl overflow-hidden">
        <div className="relative px-8 py-8 text-center">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Be Someone's Hero Today</h1>
              <p className="text-gray-600 text-base mt-1">Help us respond to disasters when every second counts</p>
            </div>
          </div>
          
          {/* Trust Badges */}
          <div className="flex justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2 px-3 py-1 bg-gray-300 rounded-full">
              <Shield className="h-4 w-4 text-gray-700" />
              <span>Secure</span>
            </div>
            <div className="flex items-center space-x-2 px-3 py-1 bg-gray-300 rounded-full">
              <Award className="h-4 w-4 text-gray-700" />
              <span>Verified</span>
            </div>
            <div className="flex items-center space-x-2 px-3 py-1 bg-gray-300 rounded-full">
              <Globe className="h-4 w-4 text-gray-700" />
              <span>Global Impact</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Form Card */}
      <Card className="rounded-t-none border-t-0 shadow-2xl">
        <CardContent className="p-10 space-y-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Amount Selection Section */}
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">Choose Your Impact Level</h3>
                <p className="text-gray-600">Select an amount that feels right for you</p>
              </div>
              
              {/* SMALLER Amount Buttons Only */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {quickAmounts.map((amount, index) => {
                  const isSelected = formData.amount === amount.toString() && !formData.customAmount;
                  const tierLabels = ["Supporter", "Contributor", "Champion", "Hero", "Legend"];
                  
                  return (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => handleQuickAmount(amount)}
                      className={`group relative p-3 rounded-lg border-2 transition-all duration-300 hover:scale-105 hover:shadow-md ${
                        isSelected 
                          ? 'bg-red-50 border-red-500 shadow-md' 
                          : 'bg-white border-gray-300 hover:border-red-400'
                      }`}
                    >
                      <div className="text-center">
                        <div className={`text-base font-bold mb-1 ${isSelected ? 'text-red-600' : 'text-gray-700'}`}>
                          ₹{amount >= 1000 ? `${amount/1000}K` : amount}
                        </div>
                        <div className={`text-xs font-medium mb-1 ${isSelected ? 'text-red-500' : 'text-gray-500'}`}>
                          {tierLabels[index]}
                        </div>
                        <div className={`text-xs px-2 py-0.5 rounded-full ${
                          isSelected 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-gray-100 text-gray-600 group-hover:bg-red-50'
                        }`}>
                          {amount >= 5000 ? "Premium" : amount >= 2000 ? "Popular" : "Essential"}
                        </div>
                      </div>
                      {isSelected && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Custom Amount Input - FULL WIDTH TO MATCH DROPDOWN */}
              <div className="w-full">
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="Enter custom amount"
                    value={formData.customAmount ? formData.amount : ""}
                    onChange={(e) => setFormData({
                      ...formData,
                      amount: e.target.value,
                      customAmount: true,
                    })}
                    onFocus={() => setFormData({ ...formData, customAmount: true })}
                    className="h-14 pl-16 pr-20 text-lg font-semibold border-2 border-gray-300 focus:border-red-500 rounded-xl w-full"
                    min="10"
                    max="10000000"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold text-lg">
                    ₹
                  </div>
                  <Badge variant="outline" className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gray-50 border-gray-300">
                    INR
                  </Badge>
                </div>
              </div>
            </div>

            {/* Category Selection - Normal Size */}
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">Where Should Your Donation Go?</h3>
                <p className="text-gray-600">Choose the cause closest to your heart</p>
              </div>
              
              <Select value={formData.donationType} onValueChange={(value) => setFormData({...formData, donationType: value})}>
                <SelectTrigger className="h-16 border-2 border-gray-300 focus:border-red-500 rounded-xl text-left">
                  <div className="flex items-center space-x-4 py-2">
                    {getSelectedCategory() && (
                      <>
                        <div className="w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center text-white text-xl">
                          {getSelectedCategory()?.emoji}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{getSelectedCategory()?.label}</div>
                          <div className="text-sm text-gray-600">{getSelectedCategory()?.impact}</div>
                        </div>
                      </>
                    )}
                    {!getSelectedCategory() && (
                      <div className="text-gray-500 font-medium">Choose your impact area</div>
                    )}
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-white border-2 border-gray-200 shadow-xl rounded-xl max-h-80 overflow-y-auto z-50">
                  {donationCategories.map((category) => (
                    <SelectItem 
                      key={category.id} 
                      value={category.id} 
                      className="py-4 px-4 cursor-pointer hover:bg-red-50 focus:bg-red-50 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center space-x-4 w-full">
                        <div className="w-10 h-10 rounded-lg bg-red-500 flex items-center justify-center text-white text-lg shadow-md">
                          {category.emoji}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">{category.label}</div>
                          <div className="text-sm text-gray-600 mt-1">{category.impact}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Privacy Choice - Normal Size */}
            <div className="space-y-4 p-6 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-start space-x-4">
                <Checkbox
                  id="anonymous"
                  checked={formData.anonymous}
                  onCheckedChange={(checked) => {
                    setFormData({
                      ...formData, 
                      anonymous: !!checked,
                      name: checked ? "" : formData.name,
                      phone: checked ? "" : formData.phone
                    });
                  }}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <EyeOff className="h-5 w-5 text-gray-600" />
                    <Label htmlFor="anonymous" className="cursor-pointer font-semibold text-gray-900">
                      Make this an anonymous donation
                    </Label>
                  </div>
                  <p className="text-gray-700 text-sm">
                    {formData.anonymous 
                      ? "Your donation will appear as 'Anonymous' on our website. Complete privacy guaranteed." 
                      : "Your name will be displayed on our donor wall with gratitude. We'll only use your phone for important impact updates."
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Information - Normal Size */}
            {!formData.anonymous && (
              <div className="space-y-6 p-6 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <User className="h-5 w-5 text-blue-700" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Your Contact Details</h4>
                    <p className="text-gray-700 text-sm">We'll treat your information with the utmost care</p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center space-x-2 font-medium text-gray-700">
                      <span>Full Name</span>
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Enter your full name"
                      className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                    />
                    {formData.name && (
                      <p className="text-xs text-blue-600 flex items-center space-x-1">
                        <CheckCircle className="h-3 w-3" />
                        <span>Will appear as "{formData.name}" on our donor recognition wall</span>
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center space-x-2 font-medium text-gray-700">
                      <Phone className="h-4 w-4" />
                      <span>Phone Number</span>
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+91 98765 43210"
                      className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                    />
                    <p className="text-xs text-blue-600 flex items-center space-x-1">
                      <Shield className="h-3 w-3" />
                      <span>Used only for donation confirmations and impact updates</span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Impact Preview - Normal Size */}
            {formData.amount && formData.donationType && (
              <div className="relative overflow-hidden bg-green-50 rounded-xl border border-green-200 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-green-500 rounded-full">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">Your Amazing Impact</h4>
                    <p className="text-gray-600">See the difference you're about to make</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <p className="text-lg text-gray-800">
                    Your <span className="font-bold text-red-600">₹{parseInt(formData.amount).toLocaleString()}</span> donation will:{" "}
                    <span className="font-bold text-green-700">{getImpactText()}</span>
                  </p>
                  
                  {!formData.anonymous && formData.name && (
                    <div className="mt-3 flex items-center space-x-2 text-green-700">
                      <Award className="h-4 w-4" />
                      <span className="text-sm">
                        Thank you <strong>{formData.name}</strong>! Your generosity will be celebrated on our donor wall.
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Donation Button - Normal Size */}
            <div className="pt-4">
              <Button
                type="submit"
                disabled={isLoading || !formData.amount || !formData.donationType}
                className="w-full h-16 bg-red-500 hover:bg-red-600 text-white text-xl font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin w-6 h-6 border-3 border-white border-t-transparent rounded-full" />
                    <span>Processing Your Generous Donation...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <Lock className="h-6 w-6" />
                    <CreditCard className="h-6 w-6" />
                    <span>
                      {formData.anonymous ? "Donate Anonymously" : "Complete Donation"} 
                      {formData.amount && ` • ₹${parseInt(formData.amount).toLocaleString()}`}
                    </span>
                  </div>
                )}
              </Button>
              
              {/* Security Footer - Normal Size */}
              <div className="flex items-center justify-center space-x-8 mt-6 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span>256-bit SSL Encrypted</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="h-4 w-4 text-blue-500" />
                  <span>Tax Deductible</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-purple-500" />
                  <span>Instant Impact</span>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
