import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <div className="absolute inset-0 -z-10 pointer-events-none" aria-hidden="true">
        <img
          src="https://images.unsplash.com/photo-1508182311256-3b62f2b34b09?q=80&w=1920&auto=format&fit=crop"
          alt="Disaster management background"
          className="h-full w-full object-cover blur-xl opacity-35"
        />
      </div>
      <div className="text-center">
        <h1 className="mb-4 text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Welcome to Disaster Relief Network
        </h1>
        <p className="text-xl text-muted-foreground mb-8">NGO Registration and Management System</p>
        <div className="flex gap-4 justify-center">
          <Button 
            onClick={() => navigate("/register")}
            className="bg-red-600 hover:bg-red-700 text-white shadow-lg transition-transform hover:scale-105"
            size="lg"
          >
            Register NGO
          </Button>
          <Button 
            onClick={() => navigate("/login")}
            variant="outline"
            className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-transform hover:scale-105"
            size="lg"
          >
            Login to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;