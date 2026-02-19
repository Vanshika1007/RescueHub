import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { MockStorage } from "./mock-storage";
import { NotificationService } from "./notification-service";
import { disasterAPIService } from "./disaster-api-service";
import { 
  insertUserSchema, insertEmergencyRequestSchema, insertVolunteerSchema, 
  insertNgoSchema, insertDonationSchema, insertCampaignSchema, insertContactMessageSchema 
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // Use mock storage if database is not available
  let storageInstance: any = storage;
  try {
    // Try to test database connection
    await storageInstance.getStats();
  } catch (error) {
    console.log("Database not available, using mock storage for development");
    storageInstance = new MockStorage();
  }

  // Initialize notification service
  const notificationService = new NotificationService(storageInstance);

  // WebSocket setup for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');
    
    ws.on('message', (message) => {
      console.log('Received:', message.toString());
    });

    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
    });
  });

  // Broadcast function for real-time updates
  function broadcast(data: any) {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }

  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storageInstance.createUser(userData);
      res.json({ user: { ...user, password: undefined } });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/auth/user/:id", async (req, res) => {
    try {
      const user = await storageInstance.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ user: { ...user, password: undefined } });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Emergency Request routes
  app.post("/api/emergency-requests", async (req, res) => {
    try {
      const requestData = insertEmergencyRequestSchema.parse(req.body);
      const emergencyRequest = await storageInstance.createEmergencyRequest(requestData);
      
      // Notify nearby volunteers via SMS
      console.log(`🚨 New emergency request created: ${emergencyRequest.title}`);
      const notificationResult = await notificationService.notifyNearbyVolunteers(emergencyRequest);
      
      if (notificationResult.success) {
        console.log(`✅ Notified ${notificationResult.notifiedCount} volunteers`);
      } else {
        console.log(`⚠️ Failed to notify volunteers: ${notificationResult.errors.join(', ')}`);
      }
      
      // Broadcast new emergency request to all connected clients
      broadcast({
        type: 'new_emergency_request',
        data: {
          ...emergencyRequest,
          notificationResult: {
            notifiedCount: notificationResult.notifiedCount,
            success: notificationResult.success
          }
        }
      });

      res.json({ 
        emergencyRequest,
        notificationResult: {
          notifiedCount: notificationResult.notifiedCount,
          success: notificationResult.success,
          errors: notificationResult.errors
        }
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/emergency-requests", async (req, res) => {
    try {
      const requests = await storageInstance.getActiveEmergencyRequests();
      res.json({ requests });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/emergency-requests/:id", async (req, res) => {
    try {
      const request = await storageInstance.getEmergencyRequest(req.params.id);
      if (!request) {
        return res.status(404).json({ message: "Emergency request not found" });
      }
      res.json({ request });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/emergency-requests/:id/status", async (req, res) => {
    try {
      const { status, assignedVolunteerId } = req.body;
      const request = await storageInstance.updateEmergencyRequestStatus(
        req.params.id, 
        status, 
        assignedVolunteerId
      );
      
      if (!request) {
        return res.status(404).json({ message: "Emergency request not found" });
      }

      // Broadcast status update
      broadcast({
        type: 'request_status_update',
        data: request
      });

      res.json({ request });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/users/:userId/emergency-requests", async (req, res) => {
    try {
      const requests = await storageInstance.getUserEmergencyRequests(req.params.userId);
      res.json({ requests });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Volunteer routes
  app.post("/api/volunteers", async (req, res) => {
    try {
      // Accept any string for userId to support mock/dev IDs while maintaining other validations
      const relaxedSchema = insertVolunteerSchema.extend({ userId: z.string() });
      const volunteerData = relaxedSchema.parse(req.body);
      const volunteer = await storageInstance.createVolunteer(volunteerData);
      
      // Broadcast new volunteer
      broadcast({
        type: 'new_volunteer',
        data: volunteer
      });

      res.json({ volunteer });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/volunteers", async (req, res) => {
    try {
      const volunteers = await storageInstance.getAvailableVolunteers();
      res.json({ volunteers });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/volunteers/user/:userId", async (req, res) => {
    try {
      const volunteer = await storageInstance.getVolunteerByUserId(req.params.userId);
      if (!volunteer) {
        return res.status(404).json({ message: "Volunteer not found" });
      }
      res.json({ volunteer });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/volunteers/:userId/availability", async (req, res) => {
    try {
      const { availability } = req.body;
      const volunteer = await storageInstance.updateVolunteerAvailability(req.params.userId, availability);
      if (!volunteer) {
        return res.status(404).json({ message: "Volunteer not found" });
      }
      
      // Broadcast availability update
      broadcast({
        type: 'volunteer_availability_update',
        data: volunteer
      });

      res.json({ volunteer });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // NGO routes
  app.post("/api/ngos", async (req, res) => {
    try {
      const ngoData = insertNgoSchema.parse(req.body);
      const ngo = await storageInstance.createNgo(ngoData);
      res.json({ ngo });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/ngos", async (req, res) => {
    try {
      const ngos = await storageInstance.getVerifiedNgos();
      res.json({ ngos });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/ngos/user/:userId", async (req, res) => {
    try {
      const ngo = await storageInstance.getNgoByUserId(req.params.userId);
      if (!ngo) {
        return res.status(404).json({ message: "NGO not found" });
      }
      res.json({ ngo });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Donation routes
  app.post("/api/donations", async (req, res) => {
    try {
      const donationData = insertDonationSchema.parse(req.body);
      // Simulate blockchain transaction hash
      donationData.blockchainTxHash = `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 4)}`;
      donationData.status = "confirmed";
      
      const donation = await storageInstance.createDonation(donationData);
      
      // Broadcast new donation
      broadcast({
        type: 'new_donation',
        data: donation
      });

      res.json({ donation });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/donations/recent", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const donations = await storageInstance.getRecentDonations(limit);
      res.json({ donations });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/users/:userId/donations", async (req, res) => {
    try {
      const donations = await storageInstance.getUserDonations(req.params.userId);
      res.json({ donations });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Campaign routes
  app.post("/api/campaigns", async (req, res) => {
    try {
      const campaignData = insertCampaignSchema.parse(req.body);
      const campaign = await storageInstance.createCampaign(campaignData);
      res.json({ campaign });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/campaigns", async (req, res) => {
    try {
      const campaigns = await storageInstance.getActiveCampaigns();
      res.json({ campaigns });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/campaigns/:id", async (req, res) => {
    try {
      const campaign = await storageInstance.getCampaign(req.params.id);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      res.json({ campaign });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Contact routes
  app.post("/api/contact", async (req, res) => {
    try {
      const messageData = insertContactMessageSchema.parse(req.body);
      const message = await storageInstance.createContactMessage(messageData);
      
      // Broadcast new contact message for urgent priorities
      if (messageData.priority === 'emergency' || messageData.priority === 'urgent') {
        broadcast({
          type: 'urgent_contact_message',
          data: message
        });
      }

      res.json({ message });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/contact-messages", async (req, res) => {
    try {
      const messages = await storageInstance.getContactMessages();
      res.json({ messages });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Stats routes
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storageInstance.getStats();
      res.json({ stats });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Disaster API routes
  app.get("/api/disasters", async (req, res) => {
    try {
      const forceRefresh = req.query.refresh === 'true';
      const disasters = await disasterAPIService.getDisasterData(forceRefresh);
      res.json({ disasters });
    } catch (error: any) {
      console.error('Error fetching disasters:', error);
      res.status(500).json({ message: 'Failed to fetch disaster data' });
    }
  });

  app.get("/api/disasters/active", async (req, res) => {
    try {
      const activeDisasters = await disasterAPIService.getActiveDisasters();
      res.json({ disasters: activeDisasters });
    } catch (error: any) {
      console.error('Error fetching active disasters:', error);
      res.status(500).json({ message: 'Failed to fetch active disasters' });
    }
  });

  app.get("/api/disasters/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const disaster = await disasterAPIService.getDisasterById(id);
      
      if (!disaster) {
        return res.status(404).json({ message: 'Disaster not found' });
      }
      
      res.json({ disaster });
    } catch (error: any) {
      console.error('Error fetching disaster:', error);
      res.status(500).json({ message: 'Failed to fetch disaster details' });
    }
  });

  app.post("/api/disasters/refresh", async (req, res) => {
    try {
      disasterAPIService.clearCache();
      const disasters = await disasterAPIService.getDisasterData(true);
      res.json({ message: 'Cache refreshed successfully', disasters });
    } catch (error: any) {
      console.error('Error refreshing disaster cache:', error);
      res.status(500).json({ message: 'Failed to refresh disaster data' });
    }
  });

  return httpServer;
}
