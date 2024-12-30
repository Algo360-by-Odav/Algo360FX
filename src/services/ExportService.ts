import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs';
import { format } from 'date-fns';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export interface ExportConfig {
  format: 'excel' | 'pdf' | 'csv';
  includeMetadata: boolean;
  includeSummary: boolean;
  includeCharts: boolean;
  customFields?: string[];
}

export interface ExportData {
  reportName: string;
  reportType: string;
  generatedBy: string;
  timestamp: Date;
  data: any;
  metadata?: any;
  summary?: any;
  charts?: any[];
}

class ExportService {
  private static instance: ExportService;

  private constructor() {}

  public static getInstance(): ExportService {
    if (!ExportService.instance) {
      ExportService.instance = new ExportService();
    }
    return ExportService.instance;
  }

  public async exportReport(data: ExportData, config: ExportConfig): Promise<void> {
    switch (config.format) {
      case 'excel':
        await this.exportToExcel(data, config);
        break;
      case 'pdf':
        await this.exportToPDF(data, config);
        break;
      case 'csv':
        await this.exportToCSV(data, config);
        break;
      default:
        throw new Error(`Unsupported export format: ${config.format}`);
    }
  }

  private async exportToExcel(data: ExportData, config: ExportConfig): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = data.generatedBy;
    workbook.created = data.timestamp;

    // Main Data Sheet
    const mainSheet = workbook.addWorksheet('Report Data');
    this.addDataToSheet(mainSheet, data.data);

    // Metadata Sheet (if included)
    if (config.includeMetadata && data.metadata) {
      const metadataSheet = workbook.addWorksheet('Metadata');
      this.addMetadataToSheet(metadataSheet, data.metadata);
    }

    // Summary Sheet (if included)
    if (config.includeSummary && data.summary) {
      const summarySheet = workbook.addWorksheet('Summary');
      this.addSummaryToSheet(summarySheet, data.summary);
    }

    // Charts Sheet (if included)
    if (config.includeCharts && data.charts) {
      const chartsSheet = workbook.addWorksheet('Charts');
      this.addChartsToSheet(chartsSheet, data.charts);
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, this.generateFileName(data.reportName, 'xlsx'));
  }

  private async exportToPDF(data: ExportData, config: ExportConfig): Promise<void> {
    const doc = new jsPDF();
    let yPos = 20;

    // Title
    doc.setFontSize(16);
    doc.text(data.reportName, 20, yPos);
    yPos += 10;

    // Metadata
    if (config.includeMetadata && data.metadata) {
      doc.setFontSize(12);
      doc.text('Metadata', 20, yPos);
      yPos += 10;
      
      Object.entries(data.metadata).forEach(([key, value]) => {
        doc.setFontSize(10);
        doc.text(`${key}: ${value}`, 20, yPos);
        yPos += 5;
      });
      yPos += 10;
    }

    // Summary
    if (config.includeSummary && data.summary) {
      doc.setFontSize(12);
      doc.text('Summary', 20, yPos);
      yPos += 10;

      Object.entries(data.summary).forEach(([key, value]) => {
        doc.setFontSize(10);
        doc.text(`${key}: ${value}`, 20, yPos);
        yPos += 5;
      });
      yPos += 10;
    }

    // Main Data
    doc.setFontSize(12);
    doc.text('Report Data', 20, yPos);
    yPos += 10;

    // Convert data to table format
    const tableData = this.convertDataToTable(data.data);
    (doc as any).autoTable({
      startY: yPos,
      head: [tableData.headers],
      body: tableData.rows,
      margin: { top: 20 },
    });

    // Charts (if included)
    if (config.includeCharts && data.charts) {
      data.charts.forEach((chart, index) => {
        if (index > 0) doc.addPage();
        doc.setFontSize(12);
        doc.text(`Chart ${index + 1}: ${chart.title}`, 20, 20);
        // Add chart image
        if (chart.imageData) {
          doc.addImage(chart.imageData, 'PNG', 20, 30, 170, 100);
        }
      });
    }

    doc.save(this.generateFileName(data.reportName, 'pdf'));
  }

  private async exportToCSV(data: ExportData, config: ExportConfig): Promise<void> {
    const tableData = this.convertDataToTable(data.data);
    const csvContent = [
      tableData.headers.join(','),
      ...tableData.rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, this.generateFileName(data.reportName, 'csv'));
  }

  private addDataToSheet(sheet: ExcelJS.Worksheet, data: any): void {
    const tableData = this.convertDataToTable(data);
    sheet.addRow(tableData.headers);
    tableData.rows.forEach(row => sheet.addRow(row));

    // Style the header row
    const headerRow = sheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };
  }

  private addMetadataToSheet(sheet: ExcelJS.Worksheet, metadata: any): void {
    Object.entries(metadata).forEach(([key, value], index) => {
      sheet.addRow([key, value]);
    });
  }

  private addSummaryToSheet(sheet: ExcelJS.Worksheet, summary: any): void {
    Object.entries(summary).forEach(([key, value], index) => {
      sheet.addRow([key, value]);
    });
  }

  private addChartsToSheet(sheet: ExcelJS.Worksheet, charts: any[]): void {
    charts.forEach((chart, index) => {
      sheet.addRow([`Chart ${index + 1}: ${chart.title}`]);
      if (chart.data) {
        const tableData = this.convertDataToTable(chart.data);
        sheet.addRow(tableData.headers);
        tableData.rows.forEach(row => sheet.addRow(row));
      }
    });
  }

  private convertDataToTable(data: any): { headers: string[]; rows: any[][] } {
    if (Array.isArray(data)) {
      if (data.length === 0) return { headers: [], rows: [] };

      const headers = Object.keys(data[0]);
      const rows = data.map(item =>
        headers.map(header => this.formatValue(item[header]))
      );

      return { headers, rows };
    }

    const headers = Object.keys(data);
    const rows = [headers.map(header => this.formatValue(data[header]))];

    return { headers, rows };
  }

  private formatValue(value: any): string {
    if (value === null || value === undefined) return '';
    if (value instanceof Date) return format(value, 'PPpp');
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  }

  private generateFileName(baseName: string, extension: string): string {
    const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
    const sanitizedName = baseName.replace(/[^a-zA-Z0-9]/g, '_');
    return `${sanitizedName}_${timestamp}.${extension}`;
  }

  public async exportAuditTrail(
    data: {
      events: any[];
      filters?: {
        startDate?: Date;
        endDate?: Date;
        eventTypes?: string[];
        users?: string[];
      };
    },
    config: ExportConfig
  ): Promise<void> {
    const auditData: ExportData = {
      reportName: 'Audit_Trail',
      reportType: 'Audit',
      generatedBy: 'System',
      timestamp: new Date(),
      data: data.events,
      metadata: data.filters,
      summary: {
        totalEvents: data.events.length,
        dateRange: data.filters?.startDate && data.filters?.endDate
          ? `${format(data.filters.startDate, 'PPpp')} - ${format(data.filters.endDate, 'PPpp')}`
          : 'All Time',
        eventTypes: data.filters?.eventTypes?.join(', ') || 'All Types',
        users: data.filters?.users?.join(', ') || 'All Users'
      }
    };

    await this.exportReport(auditData, config);
  }
}

export default ExportService;
