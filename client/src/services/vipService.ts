import { apiService } from './api';

export interface VIPManager {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  availability: {
    timezone: string;
    workingHours: string;
    availableNow: boolean;
  };
  expertise: string[];
  languages: string[];
  clients: number;
}

export interface CustomReport {
  id: string;
  title: string;
  type: 'portfolio' | 'market' | 'risk' | 'performance';
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
  format: 'pdf' | 'excel' | 'web';
  delivery: 'email' | 'dashboard' | 'both';
  settings: any;
}

export interface VIPWebinar {
  id: string;
  title: string;
  description: string;
  speaker: {
    name: string;
    title: string;
    bio: string;
  };
  datetime: Date;
  duration: number;
  maxAttendees: number;
  currentAttendees: number;
  topics: string[];
  materials?: string[];
  recordingUrl?: string;
}

export interface VIPBenefit {
  id: string;
  name: string;
  description: string;
  value: number;
  active: boolean;
  expiryDate?: Date;
}

class VIPService {
  private static instance: VIPService;
  private readonly baseUrl = '/vip';

  private constructor() {}

  public static getInstance(): VIPService {
    if (!VIPService.instance) {
      VIPService.instance = new VIPService();
    }
    return VIPService.instance;
  }

  // Dedicated Manager
  async getAssignedManager(): Promise<VIPManager> {
    try {
      return await apiService.get(`${this.baseUrl}/manager`);
    } catch (error) {
      console.error('Failed to fetch assigned manager:', error);
      throw error;
    }
  }

  async scheduleManagerMeeting(request: {
    topic: string;
    datetime: Date;
    duration: number;
    format: 'video' | 'phone' | 'chat';
  }): Promise<{
    meetingId: string;
    joinUrl: string;
  }> {
    try {
      return await apiService.post(`${this.baseUrl}/manager/meetings`, request);
    } catch (error) {
      console.error('Failed to schedule manager meeting:', error);
      throw error;
    }
  }

  async contactManager(message: {
    subject: string;
    content: string;
    priority: 'normal' | 'high' | 'urgent';
  }): Promise<{ success: boolean; ticketId: string }> {
    try {
      return await apiService.post(`${this.baseUrl}/manager/contact`, message);
    } catch (error) {
      console.error('Failed to contact manager:', error);
      throw error;
    }
  }

  // Priority Execution
  async enablePriorityExecution(): Promise<{ success: boolean }> {
    try {
      return await apiService.post(`${this.baseUrl}/priority-execution/enable`);
    } catch (error) {
      console.error('Failed to enable priority execution:', error);
      throw error;
    }
  }

  async getPriorityStatus(): Promise<{
    enabled: boolean;
    ordersExecuted: number;
    averageSpeed: number;
    savings: number;
  }> {
    try {
      return await apiService.get(`${this.baseUrl}/priority-execution/status`);
    } catch (error) {
      console.error('Failed to get priority status:', error);
      throw error;
    }
  }

  // Custom Reports
  async getCustomReports(): Promise<CustomReport[]> {
    try {
      return await apiService.get(`${this.baseUrl}/reports`);
    } catch (error) {
      console.error('Failed to fetch custom reports:', error);
      throw error;
    }
  }

  async createCustomReport(report: Omit<CustomReport, 'id'>): Promise<CustomReport> {
    try {
      return await apiService.post(`${this.baseUrl}/reports`, report);
    } catch (error) {
      console.error('Failed to create custom report:', error);
      throw error;
    }
  }

  async updateCustomReport(
    reportId: string,
    updates: Partial<CustomReport>
  ): Promise<CustomReport> {
    try {
      return await apiService.put(`${this.baseUrl}/reports/${reportId}`, updates);
    } catch (error) {
      console.error('Failed to update custom report:', error);
      throw error;
    }
  }

  async deleteCustomReport(reportId: string): Promise<{ success: boolean }> {
    try {
      return await apiService.delete(`${this.baseUrl}/reports/${reportId}`);
    } catch (error) {
      console.error('Failed to delete custom report:', error);
      throw error;
    }
  }

  // Exclusive Webinars
  async getUpcomingWebinars(): Promise<VIPWebinar[]> {
    try {
      return await apiService.get(`${this.baseUrl}/webinars/upcoming`);
    } catch (error) {
      console.error('Failed to fetch upcoming webinars:', error);
      throw error;
    }
  }

  async registerForWebinar(webinarId: string): Promise<{
    success: boolean;
    registrationId: string;
    joinUrl: string;
  }> {
    try {
      return await apiService.post(`${this.baseUrl}/webinars/${webinarId}/register`);
    } catch (error) {
      console.error('Failed to register for webinar:', error);
      throw error;
    }
  }

  async getWebinarRecordings(): Promise<VIPWebinar[]> {
    try {
      return await apiService.get(`${this.baseUrl}/webinars/recordings`);
    } catch (error) {
      console.error('Failed to fetch webinar recordings:', error);
      throw error;
    }
  }

  // VIP Benefits
  async getVIPBenefits(): Promise<VIPBenefit[]> {
    try {
      return await apiService.get(`${this.baseUrl}/benefits`);
    } catch (error) {
      console.error('Failed to fetch VIP benefits:', error);
      throw error;
    }
  }

  async activateBenefit(benefitId: string): Promise<{
    success: boolean;
    activationDate: Date;
    expiryDate: Date;
  }> {
    try {
      return await apiService.post(`${this.baseUrl}/benefits/${benefitId}/activate`);
    } catch (error) {
      console.error('Failed to activate benefit:', error);
      throw error;
    }
  }

  async getVIPStatus(): Promise<{
    level: string;
    since: Date;
    benefits: VIPBenefit[];
    tradingVolume: number;
    savings: number;
  }> {
    try {
      return await apiService.get(`${this.baseUrl}/status`);
    } catch (error) {
      console.error('Failed to fetch VIP status:', error);
      throw error;
    }
  }
}

export const vipService = VIPService.getInstance();
