import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Welcome to Disaster Relief Network
        </h1>
        <p className="text-xl text-muted-foreground mb-8">NGO Registration and Management System</p>
        <div className="flex gap-4 justify-center">
          <Button 
            onClick={() => navigate("/register")}
            className="bg-gradient-primary hover:opacity-90 shadow-lg"
            size="lg"
          >
            Register NGO
          </Button>
          <Button 
            onClick={() => navigate("/login")}
            variant="outline"
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