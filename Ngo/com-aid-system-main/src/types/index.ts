export interface NGO {
  id: string;
  name: string;
  registrationId: string;
  email: string;
  phone: string;
  address: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  createdAt: Date;
  documents?: string[];
  credibilityScore?: number;
}

export interface Resource {
  id: string;
  ngoId: string;
  type: 'food' | 'water' | 'medical' | 'blankets' | 'shelter';
  quantity: number;
  available: number;
  distributed: number;
  unit: string;
  lastUpdated: Date;
}

export interface HelpRequest {
  id: string;
  userId: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  type: 'food' | 'water' | 'medical' | 'shelter' | 'rescue';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'rejected';
  description: string;
  specialNotes?: string;
  requestedAt: Date;
  assignedNgoId?: string;
  assignedVolunteerId?: string;
}

export interface Volunteer {
  id: string;
  name: string;
  phone: string;
  email: string;
  ngoId: string;
  status: 'available' | 'busy' | 'offline';
  currentAssignment?: string;
  completedRequests: number;
  rating: number;
}

export interface Donation {
  id: string;
  donorName: string;
  amount: number;
  purpose: string;
  date: Date;
  transactionId: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface Analytics {
  totalRequests: number;
  completedRequests: number;
  pendingRequests: number;
  totalResources: number;
  totalVolunteers: number;
  totalDonations: number;
  requestsByType: Record<string, number>;
  resourceUtilization: number;
}