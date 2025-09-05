import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, decimal, boolean, jsonb, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("survivor"), // survivor, volunteer, ngo, donor, admin
  fullName: text("full_name").notNull(),
  phone: text("phone"),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const emergencyRequests = pgTable("emergency_requests", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // medical, natural_disaster, fire, flood, structural_collapse, missing_person, other
  urgency: text("urgency").notNull(), // low, medium, critical
  title: text("title").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  coordinates: jsonb("coordinates"), // {lat: number, lng: number}
  peopleCount: integer("people_count").default(1),
  status: text("status").notNull().default("pending"), // pending, assigned, enroute, resolved, closed
  assignedVolunteerId: uuid("assigned_volunteer_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const volunteers = pgTable("volunteers", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull().references(() => users.id),
  skills: jsonb("skills").notNull(), // array of skill strings
  availability: boolean("availability").default(true),
  location: text("location"),
  coordinates: jsonb("coordinates"),
  vehicleType: text("vehicle_type"),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
  totalResponses: integer("total_responses").default(0),
  verificationStatus: text("verification_status").default("pending"), // pending, verified, rejected
  createdAt: timestamp("created_at").defaultNow(),
});

export const ngos = pgTable("ngos", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull().references(() => users.id),
  organizationName: text("organization_name").notNull(),
  kycStatus: text("kyc_status").default("pending"), // pending, approved, rejected
  resources: jsonb("resources"), // inventory of resources
  warehouses: jsonb("warehouses"), // array of warehouse locations
  vehicles: jsonb("vehicles"), // array of vehicles
  verificationDoc: text("verification_doc"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const donations = pgTable("donations", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  donorId: uuid("donor_id").notNull().references(() => users.id),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("USD"),
  donationType: text("donation_type").notNull(), // emergency_relief, medical_supplies, food_water, shelter_housing, cleanup_recovery
  campaignId: uuid("campaign_id"),
  blockchainTxHash: text("blockchain_tx_hash"),
  status: text("status").notNull().default("pending"), // pending, confirmed, allocated, distributed
  createdAt: timestamp("created_at").defaultNow(),
});

export const campaigns = pgTable("campaigns", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  targetAmount: decimal("target_amount", { precision: 12, scale: 2 }).notNull(),
  raisedAmount: decimal("raised_amount", { precision: 12, scale: 2 }).default("0.00"),
  status: text("status").notNull().default("active"), // active, completed, paused
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const contactMessages = pgTable("contact_messages", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  phone: text("phone"),
  priority: text("priority").notNull(), // emergency, urgent, normal, general
  message: text("message").notNull(),
  status: text("status").default("new"), // new, in_progress, resolved
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  emergencyRequests: many(emergencyRequests),
  volunteers: many(volunteers),
  ngos: many(ngos),
  donations: many(donations),
}));

export const emergencyRequestsRelations = relations(emergencyRequests, ({ one }) => ({
  user: one(users, {
    fields: [emergencyRequests.userId],
    references: [users.id],
  }),
  assignedVolunteer: one(users, {
    fields: [emergencyRequests.assignedVolunteerId],
    references: [users.id],
  }),
}));

export const volunteersRelations = relations(volunteers, ({ one }) => ({
  user: one(users, {
    fields: [volunteers.userId],
    references: [users.id],
  }),
}));

export const ngosRelations = relations(ngos, ({ one }) => ({
  user: one(users, {
    fields: [ngos.userId],
    references: [users.id],
  }),
}));

export const donationsRelations = relations(donations, ({ one }) => ({
  donor: one(users, {
    fields: [donations.donorId],
    references: [users.id],
  }),
  campaign: one(campaigns, {
    fields: [donations.campaignId],
    references: [campaigns.id],
  }),
}));

export const campaignsRelations = relations(campaigns, ({ many }) => ({
  donations: many(donations),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertEmergencyRequestSchema = createInsertSchema(emergencyRequests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertVolunteerSchema = createInsertSchema(volunteers).omit({
  id: true,
  createdAt: true,
});

export const insertNgoSchema = createInsertSchema(ngos).omit({
  id: true,
  createdAt: true,
});

export const insertDonationSchema = createInsertSchema(donations).omit({
  id: true,
  createdAt: true,
});

export const insertCampaignSchema = createInsertSchema(campaigns).omit({
  id: true,
  createdAt: true,
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertEmergencyRequest = z.infer<typeof insertEmergencyRequestSchema>;
export type EmergencyRequest = typeof emergencyRequests.$inferSelect;

export type InsertVolunteer = z.infer<typeof insertVolunteerSchema>;
export type Volunteer = typeof volunteers.$inferSelect;

export type InsertNgo = z.infer<typeof insertNgoSchema>;
export type Ngo = typeof ngos.$inferSelect;

export type InsertDonation = z.infer<typeof insertDonationSchema>;
export type Donation = typeof donations.$inferSelect;

export type InsertCampaign = z.infer<typeof insertCampaignSchema>;
export type Campaign = typeof campaigns.$inferSelect;

export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;
