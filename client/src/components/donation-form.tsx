import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, CreditCard } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const quickAmounts = [25, 50, 100, 250];

export default function DonationForm() {
  const [formData, setFormData] = useState({
    amount: "",
    donationType: "",
    customAmount: false,
    donorId: "temp-donor-id", // In a real app, this would come from auth context
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const donationMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/donations", {
        donorId: data.donorId,
        amount: data.amount,
        currency: "USD",
        donationType: data.donationType,
        campaignId: null, // Could be linked to specific campaigns
      });
    },
    onSuccess: () => {
      toast({
        title: "Donation Successful",
        description: "Thank you for your generous donation! Your contribution will help save lives.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/donations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      // Reset form
      setFormData({
        amount: "",
        donationType: "",
        customAmount: false,
        donorId: "temp-donor-id",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Donation Failed",
        description: error.message || "Failed to process donation",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.donationType) {
      toast({
        title: "Missing Information",
        description: "Please select an amount and donation type",
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

    donationMutation.mutate({ ...formData, amount: amount.toString() });
  };

  const handleQuickAmount = (amount: number) => {
    setFormData({ ...formData, amount: amount.toString(), customAmount: false });
  };

  return (
    <Card className="w-full max-w-lg mx-auto" data-testid="card-donation-form">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-foreground" data-testid="text-donation-form-title">Quick Donate</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6" data-testid="form-donation">
          <div className="space-y-3">
            <Label>Donation Amount *</Label>
            <div className="grid grid-cols-4 gap-3">
              {quickAmounts.map(amount => (
                <Button
                  key={amount}
                  type="button"
                  variant="outline"
                  className={`px-6 py-3 font-medium transition-colors ${
                    formData.amount === amount.toString() && !formData.customAmount
                      ? "bg-primary/10 text-primary border-primary"
                      : "hover:bg-primary/5"
                  }`}
                  onClick={() => handleQuickAmount(amount)}
                  data-testid={`button-amount-${amount}`}
                >
                  ${amount}
                </Button>
              ))}
            </div>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                placeholder="Custom amount"
                value={formData.customAmount ? formData.amount : ""}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  amount: e.target.value, 
                  customAmount: true 
                })}
                onFocus={() => setFormData({ ...formData, customAmount: true })}
                className="flex-1"
                data-testid="input-custom-amount"
              />
              <span className="text-muted-foreground">USD</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="donationType">Donation Type *</Label>
            <Select value={formData.donationType} onValueChange={(value) => setFormData({ ...formData, donationType: value })}>
              <SelectTrigger data-testid="select-donation-type">
                <SelectValue placeholder="Select donation type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="emergency_relief">Emergency Relief</SelectItem>
                <SelectItem value="medical_supplies">Medical Supplies</SelectItem>
                <SelectItem value="food_water">Food & Water</SelectItem>
                <SelectItem value="shelter_housing">Shelter & Housing</SelectItem>
                <SelectItem value="cleanup_recovery">Cleanup & Recovery</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            disabled={donationMutation.isPending}
            data-testid="button-submit-donation"
          >
            <Heart className="mr-2 h-5 w-5" />
            {donationMutation.isPending ? "Processing..." : "Donate Now"}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            <CreditCard className="inline mr-1 h-4 w-4" />
            Secure payment powered by blockchain transparency
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
