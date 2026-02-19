import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Package,
  Plus,
  Minus,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Edit2,
  Trash2,
} from "lucide-react";
import { Resource } from "@/types";
import { useToast } from "@/hooks/use-toast";

const initialResources: Resource[] = [
  {
    id: "RES001",
    ngoId: "NGO001",
    type: "food",
    quantity: 2000,
    available: 1250,
    distributed: 750,
    unit: "packets",
    lastUpdated: new Date(),
  },
  {
    id: "RES002",
    ngoId: "NGO001",
    type: "water",
    quantity: 1500,
    available: 800,
    distributed: 700,
    unit: "bottles",
    lastUpdated: new Date(),
  },
  {
    id: "RES003",
    ngoId: "NGO001",
    type: "medical",
    quantity: 300,
    available: 150,
    distributed: 150,
    unit: "kits",
    lastUpdated: new Date(),
  },
  {
    id: "RES004",
    ngoId: "NGO001",
    type: "blankets",
    quantity: 500,
    available: 400,
    distributed: 100,
    unit: "pieces",
    lastUpdated: new Date(),
  },
  {
    id: "RES005",
    ngoId: "NGO001",
    type: "shelter",
    quantity: 50,
    available: 35,
    distributed: 15,
    unit: "tents",
    lastUpdated: new Date(),
  },
];

export default function Resources() {
  const { toast } = useToast();
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [updateAmount, setUpdateAmount] = useState("");
  const [updateType, setUpdateType] = useState<"add" | "remove">("add");

  const [newResource, setNewResource] = useState({
    type: "",
    quantity: "",
    unit: "",
  });

  const getResourceIcon = (type: string) => {
    const icons: Record<string, string> = {
      food: "🍽️",
      water: "💧",
      medical: "🏥",
      blankets: "🛏️",
      shelter: "🏠",
    };
    return icons[type] || "📦";
  };

  const getResourceColor = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage < 20) return "danger";
    if (percentage < 50) return "warning";
    return "success";
  };

  const handleAddResource = () => {
    if (!newResource.type || !newResource.quantity || !newResource.unit) {
      toast({
        title: "Invalid Input",
        description: "Please fill all fields",
        variant: "destructive",
      });
      return;
    }

    const resource: Resource = {
      id: `RES${Date.now()}`,
      ngoId: "NGO001",
      type: newResource.type as Resource["type"],
      quantity: parseInt(newResource.quantity),
      available: parseInt(newResource.quantity),
      distributed: 0,
      unit: newResource.unit,
      lastUpdated: new Date(),
    };

    setResources([...resources, resource]);
    setIsAddDialogOpen(false);
    setNewResource({ type: "", quantity: "", unit: "" });
    
    toast({
      title: "Resource Added",
      description: `Successfully added ${newResource.quantity} ${newResource.unit} of ${newResource.type}`,
    });
  };

  const handleUpdateResource = () => {
    if (!selectedResource || !updateAmount) return;

    const amount = parseInt(updateAmount);
    const updatedResources = resources.map((res) => {
      if (res.id === selectedResource.id) {
        if (updateType === "add") {
          return {
            ...res,
            quantity: res.quantity + amount,
            available: res.available + amount,
            lastUpdated: new Date(),
          };
        } else {
          const newAvailable = Math.max(0, res.available - amount);
          return {
            ...res,
            available: newAvailable,
            distributed: res.distributed + (res.available - newAvailable),
            lastUpdated: new Date(),
          };
        }
      }
      return res;
    });

    setResources(updatedResources);
    setIsUpdateDialogOpen(false);
    setUpdateAmount("");
    
    toast({
      title: "Resource Updated",
      description: `Successfully ${updateType === "add" ? "added" : "removed"} ${amount} ${selectedResource.unit}`,
    });
  };

  const handleDeleteResource = (id: string) => {
    setResources(resources.filter((res) => res.id !== id));
    toast({
      title: "Resource Deleted",
      description: "Resource has been removed from inventory",
    });
  };

  const totalValue = resources.reduce((sum, res) => sum + res.quantity, 0);
  const availableValue = resources.reduce((sum, res) => sum + res.available, 0);
  const distributedValue = resources.reduce((sum, res) => sum + res.distributed, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Resource Management</h1>
          <p className="text-muted-foreground mt-1">Track and manage relief resources inventory</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              Add Resource
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Resource</DialogTitle>
              <DialogDescription>
                Add a new resource type to your inventory
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="type">Resource Type</Label>
                <Select
                  value={newResource.type}
                  onValueChange={(value) => setNewResource({ ...newResource, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="food">Food</SelectItem>
                    <SelectItem value="water">Water</SelectItem>
                    <SelectItem value="medical">Medical</SelectItem>
                    <SelectItem value="blankets">Blankets</SelectItem>
                    <SelectItem value="shelter">Shelter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="Enter quantity"
                  value={newResource.quantity}
                  onChange={(e) => setNewResource({ ...newResource, quantity: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="unit">Unit</Label>
                <Input
                  id="unit"
                  placeholder="e.g., packets, bottles, kits"
                  value={newResource.unit}
                  onChange={(e) => setNewResource({ ...newResource, unit: e.target.value })}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddResource} className="bg-gradient-primary hover:opacity-90">
                Add Resource
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Resources</p>
                <h3 className="text-2xl font-bold mt-1">{totalValue.toLocaleString()}</h3>
                <p className="text-sm text-muted-foreground mt-2">units in inventory</p>
              </div>
              <Package className="h-10 w-10 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Available</p>
                <h3 className="text-2xl font-bold mt-1 text-success">{availableValue.toLocaleString()}</h3>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="h-3 w-3 text-success" />
                  <span className="text-sm text-success">Ready to deploy</span>
                </div>
              </div>
              <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Distributed</p>
                <h3 className="text-2xl font-bold mt-1">{distributedValue.toLocaleString()}</h3>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingDown className="h-3 w-3 text-info" />
                  <span className="text-sm text-info">Delivered to beneficiaries</span>
                </div>
              </div>
              <div className="h-10 w-10 rounded-full bg-info/10 flex items-center justify-center">
                <TrendingDown className="h-5 w-5 text-info" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.map((resource) => {
          const utilizationPercentage = ((resource.available / resource.quantity) * 100);
          const statusColor = getResourceColor(resource.available, resource.quantity);
          
          return (
            <Card key={resource.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{getResourceIcon(resource.type)}</span>
                    <div>
                      <CardTitle className="capitalize">{resource.type}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Last updated: {resource.lastUpdated.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant={statusColor as any}>
                    {utilizationPercentage.toFixed(0)}%
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Available</span>
                    <span className="font-medium">
                      {resource.available} / {resource.quantity} {resource.unit}
                    </span>
                  </div>
                  <Progress value={utilizationPercentage} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="text-center p-2 rounded-lg bg-muted">
                    <p className="text-xs text-muted-foreground">Distributed</p>
                    <p className="text-lg font-bold">{resource.distributed}</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-muted">
                    <p className="text-xs text-muted-foreground">Remaining</p>
                    <p className="text-lg font-bold">{resource.available}</p>
                  </div>
                </div>

                {utilizationPercentage < 20 && (
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-danger/10 text-danger">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-xs">Low stock alert</span>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setSelectedResource(resource);
                      setIsUpdateDialogOpen(true);
                    }}
                  >
                    <Edit2 className="h-3 w-3 mr-1" />
                    Update
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteResource(resource.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Update Resource Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Resource</DialogTitle>
            <DialogDescription>
              Add or remove {selectedResource?.type} from inventory
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>Action</Label>
              <Select value={updateType} onValueChange={(value: "add" | "remove") => setUpdateType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="add">
                    <div className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Add Stock
                    </div>
                  </SelectItem>
                  <SelectItem value="remove">
                    <div className="flex items-center gap-2">
                      <Minus className="h-4 w-4" />
                      Remove/Distribute
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="amount">Amount ({selectedResource?.unit})</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={updateAmount}
                onChange={(e) => setUpdateAmount(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateResource} className="bg-gradient-primary hover:opacity-90">
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}