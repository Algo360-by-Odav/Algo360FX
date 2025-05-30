import axios from 'axios';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';
import { API_BASE_URL } from '../config';

export interface ReportOptions {
  startDate: Date;
  endDate: Date;
  type: ReportType;
  format: ReportFormat;
  includeData: ReportDataType[];
}

export type ReportType = 
  | 'mining'
  | 'financial'
  | 'performance'
  | 'billing';

export type ReportFormat = 
  | 'pdf'
  | 'csv'
  | 'excel';

export type ReportDataType = 
  | 'profits'
  | 'hashrate'
  | 'rigs'
  | 'transactions'
  | 'algorithms'
  | 'power_usage';

class ReportService {
  private readonly baseUrl = `${API_BASE_URL}/reports`;

  async generateReport(options: ReportOptions): Promise<void> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/generate`,
        options,
        { responseType: 'blob' }
      );

      const fileName = this.generateFileName(options);
      const blob = new Blob([response.data], {
        type: this.getContentType(options.format)
      });

      saveAs(blob, fileName);
    } catch (error) {
      console.error('Failed to generate report:', error);
      throw error;
    }
  }

  async generateBatchReports(optionsList: ReportOptions[]): Promise<void> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/generate-batch`,
        { reports: optionsList },
        { responseType: 'blob' }
      );

      const fileName = `batch_reports_${format(new Date(), 'yyyyMMdd_HHmmss')}.zip`;
      const blob = new Blob([response.data], { type: 'application/zip' });

      saveAs(blob, fileName);
    } catch (error) {
      console.error('Failed to generate batch reports:', error);
      throw error;
    }
  }

  async scheduleReport(options: ReportOptions & {
    schedule: {
      frequency: 'daily' | 'weekly' | 'monthly';
      time?: string; // HH:mm format
      dayOfWeek?: number; // 0-6 for weekly
      dayOfMonth?: number; // 1-31 for monthly
      recipients: string[]; // email addresses
    };
  }): Promise<void> {
    try {
      await axios.post(`${this.baseUrl}/schedule`, options);
    } catch (error) {
      console.error('Failed to schedule report:', error);
      throw error;
    }
  }

  async getScheduledReports(): Promise<Array<{
    id: string;
    options: ReportOptions;
    schedule: any;
    lastRun?: string;
    nextRun: string;
  }>> {
    try {
      const response = await axios.get(`${this.baseUrl}/scheduled`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch scheduled reports:', error);
      throw error;
    }
  }

  async deleteScheduledReport(id: string): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/scheduled/${id}`);
    } catch (error) {
      console.error('Failed to delete scheduled report:', error);
      throw error;
    }
  }

  private generateFileName(options: ReportOptions): string {
    const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
    const extension = this.getFileExtension(options.format);
    return `${options.type}_report_${timestamp}.${extension}`;
  }

  private getFileExtension(format: ReportFormat): string {
    switch (format) {
      case 'pdf': return 'pdf';
      case 'csv': return 'csv';
      case 'excel': return 'xlsx';
      default: return 'pdf';
    }
  }

  private getContentType(format: ReportFormat): string {
    switch (format) {
      case 'pdf': return 'application/pdf';
      case 'csv': return 'text/csv';
      case 'excel': return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      default: return 'application/pdf';
    }
  }
}

export const reportService = new ReportService();
export default reportService;
