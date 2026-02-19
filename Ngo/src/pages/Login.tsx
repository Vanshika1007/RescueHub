import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Mail, Lock, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Check credentials
      if (formData.email === "ngo@relief.org" && formData.password === "password") {
        // Store auth data
        localStorage.setItem("ngoAuth", JSON.stringify({ 
          email: formData.email, 
          verified: true,
          timestamp: Date.now() 
        }));
        
        toast({
          title: "Login Successful",
          description: "Welcome to the NGO Relief Dashboard",
        });
        
        // Navigate to dashboard
        navigate("/dashboard");
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid credentials. Try ngo@relief.org / password",
          variant: "destructive",
        });
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="h-16 w-16 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow">
            <Shield className="h-10 w-10 text-primary-foreground" />
          </div>
        </div>

        <Card className="shadow-xl border-2">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">NGO Login</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the relief dashboard
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="ngo@relief.org"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="pl-10"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>
              </div>

              <Alert className="border-info bg-info/10">
                <AlertCircle className="h-4 w-4 text-info" />
                <AlertDescription className="text-sm">
                  Demo credentials: ngo@relief.org / password
                </AlertDescription>
              </Alert>

              <Button
                type="submit"
                className="w-full bg-gradient-primary hover:opacity-90"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-2">
            <Button
              variant="link"
              onClick={() => navigate("/register")}
              className="text-sm"
            >
              New NGO? Register here
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}