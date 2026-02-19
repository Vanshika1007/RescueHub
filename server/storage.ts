import { 
  users, volunteers, emergencyRequests, ngos, donations, campaigns, contactMessages,
  type User, type InsertUser, type Volunteer, type InsertVolunteer, 
  type EmergencyRequest, type InsertEmergencyRequest, type Ngo, type InsertNgo,
  type Donation, type InsertDonation, type Campaign, type InsertCampaign,
  type ContactMessage, type InsertContactMessage
} from "../shared/schema";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserById(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Emergency Request operations
  createEmergencyRequest(request: InsertEmergencyRequest): Promise<EmergencyRequest>;
  getEmergencyRequest(id: string): Promise<EmergencyRequest | undefined>;
  getActiveEmergencyRequests(): Promise<EmergencyRequest[]>;
  updateEmergencyRequestStatus(id: string, status: string, assignedVolunteerId?: string): Promise<EmergencyRequest | undefined>;
  getUserEmergencyRequests(userId: string): Promise<EmergencyRequest[]>;

  // Volunteer operations
  createVolunteer(volunteer: InsertVolunteer): Promise<Volunteer>;
  getVolunteer(id: string): Promise<Volunteer | undefined>;
  getVolunteerByUserId(userId: string): Promise<Volunteer | undefined>;
  getAvailableVolunteers(): Promise<Volunteer[]>;
  updateVolunteerAvailability(userId: string, availability: boolean): Promise<Volunteer | undefined>;

  // NGO operations
  createNgo(ngo: InsertNgo): Promise<Ngo>;
  getNgo(id: string): Promise<Ngo | undefined>;
  getNgoByUserId(userId: string): Promise<Ngo | undefined>;
  getVerifiedNgos(): Promise<Ngo[]>;

  // Donation operations
  createDonation(donation: InsertDonation): Promise<Donation>;
  getDonation(id: string): Promise<Donation | undefined>;
  getRecentDonations(limit?: number): Promise<Donation[]>;
  getUserDonations(userId: string): Promise<Donation[]>;

  // Campaign operations
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  getCampaign(id: string): Promise<Campaign | undefined>;
  getActiveCampaigns(): Promise<Campaign[]>;
  updateCampaignRaisedAmount(id: string, amount: string): Promise<Campaign | undefined>;

  // Contact operations
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getContactMessages(): Promise<ContactMessage[]>;

  // Stats operations
  getStats(): Promise<{
    activeCases: number;
    volunteers: number;
    donationsRaised: string;
    livesHelped: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  private checkDb() {
    if (!db) {
      throw new Error("Database is not configured. Set DATABASE_URL or use mock storage.");
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    this.checkDb();
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserById(id: string): Promise<User | undefined> {
    return this.getUser(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    this.checkDb();
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async createEmergencyRequest(request: InsertEmergencyRequest): Promise<EmergencyRequest> {
    const [emergencyRequest] = await db.insert(emergencyRequests).values(request).returning();
    return emergencyRequest;
  }

  async getEmergencyRequest(id: string): Promise<EmergencyRequest | undefined> {
    const [request] = await db.select().from(emergencyRequests).where(eq(emergencyRequests.id, id));
    return request || undefined;
  }

  async getActiveEmergencyRequests(): Promise<EmergencyRequest[]> {
    return await db.select().from(emergencyRequests)
      .where(and(
        eq(emergencyRequests.status, "pending"),
        sql`${emergencyRequests.status} != 'closed'`
      ))
      .orderBy(desc(emergencyRequests.createdAt));
  }

  async updateEmergencyRequestStatus(id: string, status: string, assignedVolunteerId?: string): Promise<EmergencyRequest | undefined> {
    const updateData: any = { status, updatedAt: new Date() };
    if (assignedVolunteerId) {
      updateData.assignedVolunteerId = assignedVolunteerId;
    }
    
    const [updated] = await db.update(emergencyRequests)
      .set(updateData)
      .where(eq(emergencyRequests.id, id))
      .returning();
    return updated || undefined;
  }

  async getUserEmergencyRequests(userId: string): Promise<EmergencyRequest[]> {
    return await db.select().from(emergencyRequests)
      .where(eq(emergencyRequests.userId, userId))
      .orderBy(desc(emergencyRequests.createdAt));
  }

  async createVolunteer(volunteer: InsertVolunteer): Promise<Volunteer> {
    const [volunteerRecord] = await db.insert(volunteers).values(volunteer).returning();
    return volunteerRecord;
  }

  async getVolunteer(id: string): Promise<Volunteer | undefined> {
    const [volunteer] = await db.select().from(volunteers).where(eq(volunteers.id, id));
    return volunteer || undefined;
  }

  async getVolunteerByUserId(userId: string): Promise<Volunteer | undefined> {
    const [volunteer] = await db.select().from(volunteers).where(eq(volunteers.userId, userId));
    return volunteer || undefined;
  }

  async getAvailableVolunteers(): Promise<Volunteer[]> {
    return await db.select().from(volunteers)
      .where(and(
        eq(volunteers.availability, true),
        eq(volunteers.verificationStatus, "verified")
      ));
  }

  async updateVolunteerAvailability(userId: string, availability: boolean): Promise<Volunteer | undefined> {
    const [updated] = await db.update(volunteers)
      .set({ availability })
      .where(eq(volunteers.userId, userId))
      .returning();
    return updated || undefined;
  }

  async createNgo(ngo: InsertNgo): Promise<Ngo> {
    const [ngoRecord] = await db.insert(ngos).values(ngo).returning();
    return ngoRecord;
  }

  async getNgo(id: string): Promise<Ngo | undefined> {
    const [ngo] = await db.select().from(ngos).where(eq(ngos.id, id));
    return ngo || undefined;
  }

  async getNgoByUserId(userId: string): Promise<Ngo | undefined> {
    const [ngo] = await db.select().from(ngos).where(eq(ngos.userId, userId));
    return ngo || undefined;
  }

  async getVerifiedNgos(): Promise<Ngo[]> {
    return await db.select().from(ngos).where(eq(ngos.kycStatus, "approved"));
  }

  async createDonation(donation: InsertDonation): Promise<Donation> {
    const [donationRecord] = await db.insert(donations).values(donation).returning();
    return donationRecord;
  }

  async getDonation(id: string): Promise<Donation | undefined> {
    const [donation] = await db.select().from(donations).where(eq(donations.id, id));
    return donation || undefined;
  }

  async getRecentDonations(limit: number = 10): Promise<Donation[]> {
    return await db.select().from(donations)
      .orderBy(desc(donations.createdAt))
      .limit(limit);
  }

  async getUserDonations(userId: string): Promise<Donation[]> {
    return await db.select().from(donations)
      .where(eq(donations.donorId, userId))
      .orderBy(desc(donations.createdAt));
  }

  async createCampaign(campaign: InsertCampaign): Promise<Campaign> {
    const [campaignRecord] = await db.insert(campaigns).values(campaign).returning();
    return campaignRecord;
  }

  async getCampaign(id: string): Promise<Campaign | undefined> {
    const [campaign] = await db.select().from(campaigns).where(eq(campaigns.id, id));
    return campaign || undefined;
  }

  async getActiveCampaigns(): Promise<Campaign[]> {
    return await db.select().from(campaigns).where(eq(campaigns.status, "active"));
  }

  async updateCampaignRaisedAmount(id: string, amount: string): Promise<Campaign | undefined> {
    const [updated] = await db.update(campaigns)
      .set({ raisedAmount: amount })
      .where(eq(campaigns.id, id))
      .returning();
    return updated || undefined;
  }

  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const [contactMessage] = await db.insert(contactMessages).values(message).returning();
    return contactMessage;
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  }

  async getStats() {
    const [activeCases] = await db.select({ count: sql<number>`count(*)` }).from(emergencyRequests)
      .where(sql`${emergencyRequests.status} != 'closed'`);
    
    const [volunteerCount] = await db.select({ count: sql<number>`count(*)` }).from(volunteers)
      .where(eq(volunteers.verificationStatus, "verified"));
    
    const [donationSum] = await db.select({ sum: sql<string>`COALESCE(sum(${donations.amount}), 0)` }).from(donations)
      .where(eq(donations.status, "confirmed"));
    
    const [helpedCount] = await db.select({ count: sql<number>`count(*)` }).from(emergencyRequests)
      .where(eq(emergencyRequests.status, "resolved"));

    return {
      activeCases: activeCases?.count || 0,
      volunteers: volunteerCount?.count || 0,
      donationsRaised: donationSum?.sum || "0",
      livesHelped: helpedCount?.count || 0,
    };
  }
}

export const storage = new DatabaseStorage();
