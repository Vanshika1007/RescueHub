import { 
  type User, type InsertUser, type Volunteer, type InsertVolunteer, 
  type EmergencyRequest, type InsertEmergencyRequest, type Ngo, type InsertNgo,
  type Donation, type InsertDonation, type Campaign, type InsertCampaign,
  type ContactMessage, type InsertContactMessage
} from "@shared/schema";

export class MockStorage {
  private users: User[] = [];
  private volunteers: Volunteer[] = [];
  private emergencyRequests: EmergencyRequest[] = [];
  private ngos: Ngo[] = [];
  private donations: Donation[] = [];
  private campaigns: Campaign[] = [];
  private contactMessages: ContactMessage[] = [];

  constructor() {
    // Initialize with some sample data
    this.initializeSampleData();
  }

  private checkDb() {
    // Mock storage doesn't need database check
  }

  private initializeSampleData() {
    // Add sample users with phone numbers
    this.users.push({
      id: "user_1",
      username: "john_doe",
      email: "john@example.com",
      password: "hashed_password_1",
      role: "survivor",
      fullName: "John Doe",
      phone: "+1234567890",
      isVerified: true,
      createdAt: new Date(),
    });

    this.users.push({
      id: "user_2",
      username: "jane_smith",
      email: "jane@example.com",
      password: "hashed_password_2",
      role: "donor",
      fullName: "Jane Smith",
      phone: "+1234567891",
      isVerified: true,
      createdAt: new Date(),
    });

    this.users.push({
      id: "user_3",
      username: "dr_mike",
      email: "mike@example.com",
      password: "hashed_password_3",
      role: "volunteer",
      fullName: "Dr. Mike Johnson",
      phone: "+1234567892",
      isVerified: true,
      createdAt: new Date(),
    });

    this.users.push({
      id: "user_4",
      username: "sarah_rescue",
      email: "sarah@example.com",
      password: "hashed_password_4",
      role: "volunteer",
      fullName: "Sarah Williams",
      phone: "+1234567893",
      isVerified: true,
      createdAt: new Date(),
    });

    this.users.push({
      id: "user_5",
      username: "alex_help",
      email: "alex@example.com",
      password: "hashed_password_5",
      role: "volunteer",
      fullName: "Alex Chen",
      phone: "+1234567894",
      isVerified: true,
      createdAt: new Date(),
    });

    // Add sample campaigns
    this.campaigns.push({
      id: "camp_1",
      title: "Hurricane Relief Fund 2024",
      description: "Providing immediate aid to hurricane-affected communities across the Southeast region.",
      targetAmount: "3000000.00",
      raisedAmount: "2347890.00",
      status: "active",
      endDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000), // 18 days from now
      createdAt: new Date(),
    });

    // Add sample donations
    this.donations.push({
      id: "don_1",
      donorId: "user_1",
      amount: "100.00",
      currency: "USD",
      donationType: "emergency_relief",
      campaignId: "camp_1",
      blockchainTxHash: "0x1234567890abcdef",
      status: "confirmed",
      createdAt: new Date(),
    });

    this.donations.push({
      id: "don_2",
      donorId: "user_2",
      amount: "250.00",
      currency: "USD",
      donationType: "medical_supplies",
      campaignId: "camp_1",
      blockchainTxHash: "0xabcdef1234567890",
      status: "confirmed",
      createdAt: new Date(),
    });

    // Add sample emergency requests
    this.emergencyRequests.push({
      id: "req_1",
      userId: "user_1",
      type: "medical",
      urgency: "critical",
      title: "Medical Emergency - Heart Attack",
      description: "Elderly person experiencing chest pain and difficulty breathing",
      location: "123 Main St, Miami, FL",
      coordinates: { lat: 25.7617, lng: -80.1918 },
      peopleCount: 1,
      status: "pending",
      assignedVolunteerId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Add sample volunteers with different locations
    this.volunteers.push({
      id: "vol_1",
      userId: "user_3",
      skills: ["medical", "first_aid", "emergency_response"],
      availability: true,
      location: "Miami, FL",
      coordinates: { lat: 25.7617, lng: -80.1918 },
      vehicleType: "ambulance",
      rating: "4.8",
      totalResponses: 15,
      verificationStatus: "verified",
      createdAt: new Date(),
    });

    this.volunteers.push({
      id: "vol_2",
      userId: "user_4",
      skills: ["fire_rescue", "emergency_response", "cpr"],
      availability: true,
      location: "Miami Beach, FL",
      coordinates: { lat: 25.7907, lng: -80.1300 },
      vehicleType: "fire_truck",
      rating: "4.9",
      totalResponses: 22,
      verificationStatus: "verified",
      createdAt: new Date(),
    });

    this.volunteers.push({
      id: "vol_3",
      userId: "user_5",
      skills: ["water_rescue", "emergency_response", "first_aid"],
      availability: true,
      location: "Fort Lauderdale, FL",
      coordinates: { lat: 26.1224, lng: -80.1373 },
      vehicleType: "boat",
      rating: "4.7",
      totalResponses: 18,
      verificationStatus: "verified",
      createdAt: new Date(),
    });
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.find(u => u.id === id);
  }

  async getUserById(id: string): Promise<User | undefined> {
    return this.getUser(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.users.find(u => u.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.users.find(u => u.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const generateUuid = () =>
      'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });

    const user: User = {
      id: generateUuid(),
      ...insertUser,
      role: insertUser.role || "survivor",
      phone: insertUser.phone || null,
      isVerified: false,
      createdAt: new Date(),
    };
    this.users.push(user);
    return user;
  }

  // Emergency Request operations
  async createEmergencyRequest(request: InsertEmergencyRequest): Promise<EmergencyRequest> {
    const emergencyRequest: EmergencyRequest = {
      id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...request,
      coordinates: request.coordinates || null,
      peopleCount: request.peopleCount || null,
      assignedVolunteerId: request.assignedVolunteerId || null,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.emergencyRequests.push(emergencyRequest);
    return emergencyRequest;
  }

  async getEmergencyRequest(id: string): Promise<EmergencyRequest | undefined> {
    return this.emergencyRequests.find(r => r.id === id);
  }

  async getActiveEmergencyRequests(): Promise<EmergencyRequest[]> {
    return this.emergencyRequests.filter(r => r.status !== 'closed');
  }

  async updateEmergencyRequestStatus(id: string, status: string, assignedVolunteerId?: string): Promise<EmergencyRequest | undefined> {
    const request = this.emergencyRequests.find(r => r.id === id);
    if (request) {
      request.status = status;
      request.updatedAt = new Date();
      if (assignedVolunteerId) {
        request.assignedVolunteerId = assignedVolunteerId;
      }
    }
    return request;
  }

  async getUserEmergencyRequests(userId: string): Promise<EmergencyRequest[]> {
    return this.emergencyRequests.filter(r => r.userId === userId);
  }

  // Volunteer operations
  async createVolunteer(volunteer: InsertVolunteer): Promise<Volunteer> {
    const volunteerRecord: Volunteer = {
      id: `vol_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...volunteer,
      location: volunteer.location || null,
      coordinates: volunteer.coordinates || null,
      vehicleType: volunteer.vehicleType || null,
      availability: true,
      rating: "0.00",
      totalResponses: 0,
      verificationStatus: "pending",
      createdAt: new Date(),
    };
    this.volunteers.push(volunteerRecord);
    return volunteerRecord;
  }

  async getVolunteer(id: string): Promise<Volunteer | undefined> {
    return this.volunteers.find(v => v.id === id);
  }

  async getVolunteerByUserId(userId: string): Promise<Volunteer | undefined> {
    return this.volunteers.find(v => v.userId === userId);
  }

  async getAvailableVolunteers(): Promise<Volunteer[]> {
    return this.volunteers.filter(v => v.availability && v.verificationStatus === "verified");
  }

  async updateVolunteerAvailability(userId: string, availability: boolean): Promise<Volunteer | undefined> {
    const volunteer = this.volunteers.find(v => v.userId === userId);
    if (volunteer) {
      volunteer.availability = availability;
    }
    return volunteer;
  }

  // NGO operations
  async createNgo(ngo: InsertNgo): Promise<Ngo> {
    const ngoRecord: Ngo = {
      id: `ngo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...ngo,
      kycStatus: "pending",
      resources: ngo.resources || null,
      warehouses: ngo.warehouses || null,
      vehicles: ngo.vehicles || null,
      verificationDoc: ngo.verificationDoc || null,
      createdAt: new Date(),
    };
    this.ngos.push(ngoRecord);
    return ngoRecord;
  }

  async getNgo(id: string): Promise<Ngo | undefined> {
    return this.ngos.find(n => n.id === id);
  }

  async getNgoByUserId(userId: string): Promise<Ngo | undefined> {
    return this.ngos.find(n => n.userId === userId);
  }

  async getVerifiedNgos(): Promise<Ngo[]> {
    return this.ngos.filter(n => n.kycStatus === "approved");
  }

  // Donation operations
  async createDonation(donation: InsertDonation): Promise<Donation> {
    const donationRecord: Donation = {
      id: `don_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...donation,
      currency: donation.currency || "USD",
      campaignId: donation.campaignId || null,
      blockchainTxHash: donation.blockchainTxHash || null,
      status: "confirmed",
      createdAt: new Date(),
    };
    this.donations.push(donationRecord);
    return donationRecord;
  }

  async getDonation(id: string): Promise<Donation | undefined> {
    return this.donations.find(d => d.id === id);
  }

  async getRecentDonations(limit: number = 10): Promise<Donation[]> {
    return this.donations
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
      .slice(0, limit);
  }

  async getUserDonations(userId: string): Promise<Donation[]> {
    return this.donations
      .filter(d => d.donorId === userId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  // Campaign operations
  async createCampaign(campaign: InsertCampaign): Promise<Campaign> {
    const campaignRecord: Campaign = {
      id: `camp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...campaign,
      raisedAmount: "0.00",
      endDate: campaign.endDate || null,
      status: "active",
      createdAt: new Date(),
    };
    this.campaigns.push(campaignRecord);
    return campaignRecord;
  }

  async getCampaign(id: string): Promise<Campaign | undefined> {
    return this.campaigns.find(c => c.id === id);
  }

  async getActiveCampaigns(): Promise<Campaign[]> {
    return this.campaigns.filter(c => c.status === "active");
  }

  async updateCampaignRaisedAmount(id: string, amount: string): Promise<Campaign | undefined> {
    const campaign = this.campaigns.find(c => c.id === id);
    if (campaign) {
      campaign.raisedAmount = amount;
    }
    return campaign;
  }

  // Contact operations
  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const contactMessage: ContactMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...message,
      phone: message.phone || null,
      status: "new",
      createdAt: new Date(),
    };
    this.contactMessages.push(contactMessage);
    return contactMessage;
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return this.contactMessages
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  // Stats operations
  async getStats() {
    return {
      activeCases: this.emergencyRequests.filter(r => r.status !== 'closed').length,
      volunteers: this.volunteers.filter(v => v.verificationStatus === "verified").length,
      donationsRaised: this.donations
        .filter(d => d.status === "confirmed")
        .reduce((sum, d) => sum + parseFloat(d.amount), 0)
        .toFixed(2),
      livesHelped: this.emergencyRequests.filter(r => r.status === "resolved").length,
    };
  }
}
