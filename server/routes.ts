import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { 
  insertUserSchema, insertEmergencyRequestSchema, insertVolunteerSchema, 
  insertNgoSchema, insertDonationSchema, insertCampaignSchema, insertContactMessageSchema 
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

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
      const user = await storage.createUser(userData);
      res.json({ user: { ...user, password: undefined } });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/auth/user/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
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
      const emergencyRequest = await storage.createEmergencyRequest(requestData);
      
      // Broadcast new emergency request to all connected clients
      broadcast({
        type: 'new_emergency_request',
        data: emergencyRequest
      });

      res.json({ emergencyRequest });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/emergency-requests", async (req, res) => {
    try {
      const requests = await storage.getActiveEmergencyRequests();
      res.json({ requests });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/emergency-requests/:id", async (req, res) => {
    try {
      const request = await storage.getEmergencyRequest(req.params.id);
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
      const request = await storage.updateEmergencyRequestStatus(
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
      const requests = await storage.getUserEmergencyRequests(req.params.userId);
      res.json({ requests });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Volunteer routes
  app.post("/api/volunteers", async (req, res) => {
    try {
      const volunteerData = insertVolunteerSchema.parse(req.body);
      const volunteer = await storage.createVolunteer(volunteerData);
      
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
      const volunteers = await storage.getAvailableVolunteers();
      res.json({ volunteers });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/volunteers/user/:userId", async (req, res) => {
    try {
      const volunteer = await storage.getVolunteerByUserId(req.params.userId);
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
      const volunteer = await storage.updateVolunteerAvailability(req.params.userId, availability);
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
      const ngo = await storage.createNgo(ngoData);
      res.json({ ngo });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/ngos", async (req, res) => {
    try {
      const ngos = await storage.getVerifiedNgos();
      res.json({ ngos });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/ngos/user/:userId", async (req, res) => {
    try {
      const ngo = await storage.getNgoByUserId(req.params.userId);
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
      
      const donation = await storage.createDonation(donationData);
      
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
      const donations = await storage.getRecentDonations(limit);
      res.json({ donations });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/users/:userId/donations", async (req, res) => {
    try {
      const donations = await storage.getUserDonations(req.params.userId);
      res.json({ donations });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Campaign routes
  app.post("/api/campaigns", async (req, res) => {
    try {
      const campaignData = insertCampaignSchema.parse(req.body);
      const campaign = await storage.createCampaign(campaignData);
      res.json({ campaign });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/campaigns", async (req, res) => {
    try {
      const campaigns = await storage.getActiveCampaigns();
      res.json({ campaigns });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/campaigns/:id", async (req, res) => {
    try {
      const campaign = await storage.getCampaign(req.params.id);
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
      const message = await storage.createContactMessage(messageData);
      
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
      const messages = await storage.getContactMessages();
      res.json({ messages });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Stats routes
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json({ stats });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  return httpServer;
}
