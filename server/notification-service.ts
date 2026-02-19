import { IStorage } from './storage';

export interface VolunteerNotification {
  volunteerId: string;
  phone: string;
  name: string;
  emergencyRequest: {
    id: string;
    type: string;
    urgency: string;
    title: string;
    description: string;
    location: string;
    coordinates?: { lat: number; lng: number };
    peopleCount: number;
  };
  distance: number; // in kilometers
}

export class NotificationService {
  constructor(private storage: IStorage) {}

  // Calculate distance between two coordinates using Haversine formula
  private calculateDistance(
    lat1: number, 
    lng1: number, 
    lat2: number, 
    lng2: number
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) * 
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Find nearby volunteers within specified radius (default 50km)
  async findNearbyVolunteers(
    emergencyLat: number,
    emergencyLng: number,
    radiusKm: number = 50
  ): Promise<VolunteerNotification[]> {
    try {
      const volunteers = await this.storage.getAvailableVolunteers();
      const nearbyVolunteers: VolunteerNotification[] = [];

      for (const volunteer of volunteers) {
        if (!volunteer.coordinates || !volunteer.availability) continue;

        const coords = volunteer.coordinates as unknown as { lat?: number; lng?: number };
        if (typeof coords.lat !== 'number' || typeof coords.lng !== 'number') continue;
        const distance = this.calculateDistance(
          emergencyLat,
          emergencyLng,
          coords.lat,
          coords.lng
        );

        if (distance <= radiusKm) {
          // Get user details for phone number
          const user = await this.storage.getUserById(volunteer.userId);
          if (user && user.phone) {
            nearbyVolunteers.push({
              volunteerId: volunteer.id,
              phone: user.phone,
              name: user.fullName,
              emergencyRequest: {
                id: '', // Will be filled by caller
                type: '',
                urgency: '',
                title: '',
                description: '',
                location: '',
                coordinates: { lat: emergencyLat, lng: emergencyLng },
                peopleCount: 0
              },
              distance: Math.round(distance * 100) / 100 // Round to 2 decimal places
            });
          }
        }
      }

      // Sort by distance (closest first)
      return nearbyVolunteers.sort((a, b) => a.distance - b.distance);
    } catch (error) {
      console.error('Error finding nearby volunteers:', error);
      return [];
    }
  }

  // Send SMS notification to volunteers
  async sendSMSNotification(notification: VolunteerNotification): Promise<boolean> {
    try {
      // In a real implementation, you would integrate with SMS service like Twilio, AWS SNS, etc.
      // For now, we'll simulate the SMS sending
      const message = this.generateSMSMessage(notification);
      
      console.log(`📱 SMS sent to ${notification.name} (${notification.phone}):`);
      console.log(`Message: ${message}`);
      console.log(`Distance: ${notification.distance}km away`);
      console.log('---');

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 100));

      return true;
    } catch (error) {
      console.error('Error sending SMS notification:', error);
      return false;
    }
  }

  // Generate SMS message for volunteers
  private generateSMSMessage(notification: VolunteerNotification): string {
    const urgencyEmoji = {
      'low': '🟡',
      'medium': '🟠', 
      'critical': '🔴'
    };

    const typeEmoji = {
      'medical': '🏥',
      'natural_disaster': '🌪️',
      'fire': '🔥',
      'flood': '🌊',
      'structural_collapse': '🏗️',
      'missing_person': '👤',
      'voice_emergency': '🎙️',
      'other': '⚠️'
    };

    const emoji = typeEmoji[notification.emergencyRequest.type as keyof typeof typeEmoji] || '⚠️';
    const urgencyIcon = urgencyEmoji[notification.emergencyRequest.urgency as keyof typeof urgencyEmoji] || '🟡';

    return `🚨 EMERGENCY ALERT - RescueHub 🚨

${emoji} ${notification.emergencyRequest.title}
${urgencyIcon} ${notification.emergencyRequest.urgency.toUpperCase()} Priority

📍 Location: ${notification.emergencyRequest.location}
👥 People: ${notification.emergencyRequest.peopleCount}
📏 Distance: ${notification.distance}km from you

📝 Details: ${notification.emergencyRequest.description}

⚡ Quick Response Needed!
Reply with "ACCEPT" to help immediately.

RescueHub Emergency Network`;
  }

  // Notify all nearby volunteers about an emergency
  async notifyNearbyVolunteers(emergencyRequest: any): Promise<{
    success: boolean;
    notifiedCount: number;
    errors: string[];
  }> {
    const errors: string[] = [];
    let notifiedCount = 0;

    try {
      if (!emergencyRequest.coordinates) {
        throw new Error('Emergency request missing coordinates');
      }

      const nearbyVolunteers = await this.findNearbyVolunteers(
        emergencyRequest.coordinates.lat,
        emergencyRequest.coordinates.lng
      );

      if (nearbyVolunteers.length === 0) {
        console.log('⚠️ No nearby volunteers found for this emergency');
        return { success: true, notifiedCount: 0, errors: ['No nearby volunteers found'] };
      }

      console.log(`🔔 Notifying ${nearbyVolunteers.length} nearby volunteers...`);

      // Send notifications to all nearby volunteers
      for (const volunteer of nearbyVolunteers) {
        const notification: VolunteerNotification = {
          ...volunteer,
          emergencyRequest: {
            id: emergencyRequest.id,
            type: emergencyRequest.type,
            urgency: emergencyRequest.urgency,
            title: emergencyRequest.title,
            description: emergencyRequest.description,
            location: emergencyRequest.location,
            coordinates: emergencyRequest.coordinates,
            peopleCount: emergencyRequest.peopleCount
          }
        };

        const success = await this.sendSMSNotification(notification);
        if (success) {
          notifiedCount++;
        } else {
          errors.push(`Failed to notify ${volunteer.name}`);
        }
      }

      console.log(`✅ Successfully notified ${notifiedCount}/${nearbyVolunteers.length} volunteers`);

      return {
        success: notifiedCount > 0,
        notifiedCount,
        errors
      };
    } catch (error) {
      console.error('Error notifying volunteers:', error);
      return {
        success: false,
        notifiedCount: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }
}
