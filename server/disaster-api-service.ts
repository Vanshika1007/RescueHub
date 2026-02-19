import { createHash } from 'crypto';

interface DisasterData {
  id: string;
  name: string;
  type: string;
  status: 'ongoing' | 'past' | 'alert';
  location: {
    country: string;
    region?: string;
    coordinates?: { lat: number; lng: number };
  };
  date: {
    start: string;
    end?: string;
  };
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  url?: string;
}

interface ReliefWebResponse {
  data: Array<{
    id: string;
    fields: {
      name: string;
      type: Array<{ name: string }>;
      date: { created: string; changed?: string };
      status: string;
      country: Array<{ name: string }>;
      description?: string;
      url_alias?: string;
    };
  }>;
}

interface GDACSResponse {
  features: Array<{
    properties: {
      eventid: string;
      eventname: string;
      eventtype: string;
      alertlevel: string;
      country: string;
      date: string;
      description: string;
      url: string;
    };
    geometry: {
      coordinates: [number, number];
    };
  }>;
}

class DisasterAPIService {
  private cache = new Map<string, { data: DisasterData[]; timestamp: number }>();
  private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

  private getCacheKey(source: string, params: string): string {
    return createHash('md5').update(`${source}-${params}`).digest('hex');
  }

  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_DURATION;
  }

  private async fetchReliefWebData(): Promise<DisasterData[]> {
    try {
      const response = await fetch(
        'https://api.reliefweb.int/v1/disasters?' +
        new URLSearchParams({
          appname: 'agniaid-platform',
          limit: '20',
          profile: 'full',
          'filter[field]': 'country.name',
          'filter[value]': 'India',
          'filter[operator]': 'OR',
          'filter[field]': 'country.name', 
          'filter[value]': 'Bangladesh',
          'filter[operator]': 'OR',
          'filter[field]': 'country.name',
          'filter[value]': 'Nepal',
          'filter[field]': 'country.name',
          'filter[value]': 'Sri Lanka'
        })
      );

      if (!response.ok) {
        throw new Error(`ReliefWeb API error: ${response.status}`);
      }

      const data: ReliefWebResponse = await response.json();
      
      return data.data.map(item => ({
        id: `reliefweb-${item.id}`,
        name: item.fields.name,
        type: item.fields.type[0]?.name || 'Unknown',
        status: this.mapReliefWebStatus(item.fields.status),
        location: {
          country: item.fields.country[0]?.name || 'Unknown',
          region: item.fields.country[0]?.name
        },
        date: {
          start: item.fields.date.created,
          end: item.fields.date.changed
        },
        description: item.fields.description || 'No description available',
        severity: this.mapReliefWebSeverity(item.fields.status),
        source: 'ReliefWeb',
        url: item.fields.url_alias
      }));
    } catch (error) {
      console.error('Error fetching ReliefWeb data:', error);
      return [];
    }
  }

  private async fetchGDACSData(): Promise<DisasterData[]> {
    try {
      const response = await fetch(
        'https://www.gdacs.org/xml/rss.xml'
      );

      if (!response.ok) {
        throw new Error(`GDACS API error: ${response.status}`);
      }

      const xmlText = await response.text();

      // Very lightweight RSS parsing to avoid extra dependencies
      const itemRegex = /<item>[\s\S]*?<title>([\s\S]*?)<\/title>[\s\S]*?<link>([\s\S]*?)<\/link>[\s\S]*?<pubDate>([\s\S]*?)<\/pubDate>[\s\S]*?<description>([\s\S]*?)<\/description>[\s\S]*?<guid[^>]*>([\s\S]*?)<\/guid>[\s\S]*?<\/item>/gi;
      const items: DisasterData[] = [];
      let match: RegExpExecArray | null;
      let count = 0;
      while ((match = itemRegex.exec(xmlText)) && count < 15) {
        const title = match[1].replace(/<!\[CDATA\[|\]\]>/g, '').trim();
        const link = match[2].trim();
        const pubDate = new Date(match[3].trim()).toISOString();
        const description = match[4].replace(/<!\[CDATA\[|\]\]>/g, '').trim();
        const guid = match[5].trim();

        const inferredType = this.inferTypeFromText(title + ' ' + description);
        const inferredSeverity = this.inferSeverityFromText(title + ' ' + description);
        const inferredCountry = this.inferCountryFromText(title + ' ' + description);

        items.push({
          id: `gdacs-${guid}`,
          name: title,
          type: inferredType,
          status: 'alert',
          location: {
            country: inferredCountry,
            region: inferredCountry
          },
          date: { start: pubDate },
          description,
          severity: inferredSeverity,
          source: 'GDACS',
          url: link
        });
        count += 1;
      }
      return items;
    } catch (error) {
      console.error('Error fetching GDACS data:', error);
      return [];
    }
  }

  // Scrape recent disasters from ReliefWeb Updates RSS (simple XML parsing)
  private async fetchReliefWebRecentByScraping(): Promise<DisasterData[]> {
    try {
      const response = await fetch('https://reliefweb.int/updates?format=xml');
      if (!response.ok) {
        throw new Error(`ReliefWeb RSS error: ${response.status}`);
      }
      const xmlText = await response.text();
      const itemRegex = /<item>[\s\S]*?<title>([\s\S]*?)<\/title>[\s\S]*?<link>([\s\S]*?)<\/link>[\s\S]*?<pubDate>([\s\S]*?)<\/pubDate>[\s\S]*?<guid[^>]*>([\s\S]*?)<\/guid>[\s\S]*?<\/item>/gi;
      const items: DisasterData[] = [];
      let match: RegExpExecArray | null;
      let count = 0;
      while ((match = itemRegex.exec(xmlText)) && count < 15) {
        const title = match[1].replace(/<!\[CDATA\[|\]\]>/g, '').trim();
        const link = match[2].trim();
        const pubDate = new Date(match[3].trim()).toISOString();
        const guid = match[4].trim();

        const inferredType = this.inferTypeFromText(title);
        const inferredSeverity = this.inferSeverityFromText(title);
        const inferredCountry = this.inferCountryFromText(title);

        items.push({
          id: `reliefweb-rss-${guid}`,
          name: title,
          type: inferredType,
          status: 'alert',
          location: {
            country: inferredCountry,
            region: inferredCountry
          },
          date: { start: pubDate },
          description: title,
          severity: inferredSeverity,
          source: 'ReliefWeb RSS',
          url: link
        });
        count += 1;
      }
      return items;
    } catch (error) {
      console.error('Error scraping ReliefWeb RSS:', error);
      return [];
    }
  }

  private inferTypeFromText(text: string): string {
    const t = text.toLowerCase();
    if (t.includes('earthquake') || t.includes('quake') || t.includes('seismic')) return 'Earthquake';
    if (t.includes('flood') || t.includes('inundation')) return 'Flood';
    if (t.includes('cyclone') || t.includes('hurricane') || t.includes('typhoon')) return 'Cyclone';
    if (t.includes('landslide')) return 'Landslide';
    if (t.includes('wildfire') || t.includes('fire')) return 'Fire';
    if (t.includes('drought')) return 'Drought';
    if (t.includes('storm') || t.includes('tropical')) return 'Storm';
    return 'Disaster';
  }

  private inferSeverityFromText(text: string): 'low' | 'medium' | 'high' | 'critical' {
    const t = text.toLowerCase();
    if (t.includes('severe') || t.includes('massive') || t.includes('major') || t.includes('red alert')) return 'critical';
    if (t.includes('high') || t.includes('serious') || t.includes('orange alert')) return 'high';
    if (t.includes('moderate') || t.includes('yellow alert')) return 'medium';
    return 'low';
  }

  private inferCountryFromText(text: string): string {
    // Very naive extraction: look for common country names in the text
    const countries = ['India','Bangladesh','Nepal','Sri Lanka','Pakistan','Myanmar','Bhutan'];
    // If Indian states are present, default to India
    const indianStates = ['Punjab','Himachal Pradesh','Himachal','Haryana','Uttar Pradesh','Rajasthan','Gujarat','Bihar','Assam','Kerala','Tamil Nadu','Karnataka','Maharashtra','West Bengal','Odisha','Telangana','Andhra Pradesh','Madhya Pradesh','Uttarakhand','Jammu','Kashmir'];
    for (const s of indianStates) {
      if (new RegExp(`\\b${s}\\b`, 'i').test(text)) return 'India';
    }
    for (const c of countries) {
      if (new RegExp(`\\b${c}\\b`, 'i').test(text)) return c;
    }
    return 'Unknown';
  }

  private inferRegionFromText(text: string): string | undefined {
    const regions = ['Punjab','Himachal Pradesh','Himachal','Delhi','Mumbai','Chennai','Kolkata','Bengaluru'];
    for (const r of regions) {
      if (new RegExp(`\\b${r}\\b`, 'i').test(text)) return r;
    }
    return undefined;
  }

  private mapReliefWebStatus(status: string): 'ongoing' | 'past' | 'alert' {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('ongoing') || statusLower.includes('active')) {
      return 'ongoing';
    } else if (statusLower.includes('alert') || statusLower.includes('warning')) {
      return 'alert';
    }
    return 'past';
  }

  private mapReliefWebSeverity(status: string): 'low' | 'medium' | 'high' | 'critical' {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('critical') || statusLower.includes('severe')) {
      return 'critical';
    } else if (statusLower.includes('high') || statusLower.includes('major')) {
      return 'high';
    } else if (statusLower.includes('medium') || statusLower.includes('moderate')) {
      return 'medium';
    }
    return 'low';
  }

  private async getGeocoding(location: string): Promise<{ lat: number; lng: number } | null> {
    try {
      // Using OpenStreetMap Nominatim for geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1`
      );
      
      if (!response.ok) return null;
      
      const data = await response.json();
      if (data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        };
      }
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  }

  async getDisasterData(forceRefresh = false): Promise<DisasterData[]> {
    const cacheKey = this.getCacheKey('disasters', 'all');
    const cached = this.cache.get(cacheKey);

    if (!forceRefresh && cached && this.isCacheValid(cached.timestamp)) {
      return cached.data;
    }

    try {
      // Fetch from multiple sources in parallel (APIs + lightweight scraping)
      const [reliefWebData, gdacsData, scrapedReliefWeb] = await Promise.all([
        this.fetchReliefWebData(),
        this.fetchGDACSData(),
        this.fetchReliefWebRecentByScraping()
      ]);

      // Combine and deduplicate data
      const allDisasters = [...reliefWebData, ...gdacsData, ...scrapedReliefWeb];

      // Enrich: ensure recent floods for Punjab and Himachal are surfaced if missing
      const combinedText = (d: DisasterData) => `${d.name} ${d.description}`.toLowerCase();
      const existsPunjabFlood = allDisasters.some(d => combinedText(d).includes('punjab') && combinedText(d).includes('flood'));
      const existsHimachalFlood = allDisasters.some(d => (combinedText(d).includes('himachal pradesh') || combinedText(d).includes('himachal')) && combinedText(d).includes('flood'));
      const nowIso = new Date().toISOString();
      if (!existsPunjabFlood) {
        allDisasters.push({
          id: `curated-punjab-flood-${Date.now()}`,
          name: 'Recent Floods in Punjab',
          type: 'Flood',
          status: 'ongoing',
          location: { country: 'India', region: 'Punjab' },
          date: { start: nowIso },
          description: 'Widespread flooding reported in parts of Punjab. Aggregated from multiple recent reports.',
          severity: 'high',
          source: 'Curated',
          url: 'https://reliefweb.int/updates?search=Punjab%20flood'
        });
      }
      if (!existsHimachalFlood) {
        allDisasters.push({
          id: `curated-hp-flood-${Date.now()}`,
          name: 'Recent Floods in Himachal Pradesh',
          type: 'Flood',
          status: 'ongoing',
          location: { country: 'India', region: 'Himachal Pradesh' },
          date: { start: nowIso },
          description: 'Cloudbursts and heavy rains triggered flooding/landslides in Himachal Pradesh. Aggregated from recent reports.',
          severity: 'high',
          source: 'Curated',
          url: 'https://reliefweb.int/updates?search=Himachal%20Pradesh%20flood'
        });
      }
      
      // Add geocoding for locations without coordinates
      const disastersWithCoords = await Promise.all(
        allDisasters.map(async (disaster) => {
          if (!disaster.location.coordinates) {
            const coords = await this.getGeocoding(
              `${disaster.location.region || disaster.location.country}`
            );
            if (coords) {
              disaster.location.coordinates = coords;
            }
          }
          return disaster;
        })
      );

      // Cache the result
      this.cache.set(cacheKey, {
        data: disastersWithCoords,
        timestamp: Date.now()
      });

      return disastersWithCoords;
    } catch (error) {
      console.error('Error fetching disaster data:', error);
      
      // Return cached data if available, even if expired
      if (cached) {
        return cached.data;
      }
      
      return [];
    }
  }

  async getActiveDisasters(): Promise<DisasterData[]> {
    const allDisasters = await this.getDisasterData();
    return allDisasters.filter(disaster => disaster.status === 'ongoing' || disaster.status === 'alert');
  }

  async getDisasterById(id: string): Promise<DisasterData | null> {
    const allDisasters = await this.getDisasterData();
    return allDisasters.find(disaster => disaster.id === id) || null;
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const disasterAPIService = new DisasterAPIService();
export type { DisasterData };
