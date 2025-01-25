import { Injectable, StreamableFile, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Response } from "express";
import * as fs from "fs";
import * as path from "path";
import { createObjectCsvWriter } from "csv-writer";
import * as ExcelJS from "exceljs";
import * as PDFDocument from "pdfkit";
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  format as formatDate,
} from "date-fns";
import { Incident } from "./entities/incident.entity";
import { GenerateReportDto, ReportType } from "./dto/generate-report.dto";
import { UsersService } from "src/users/users.service";
import { plainToInstance } from "class-transformer";
import { paginate } from "nestjs-typeorm-paginate";
import { CreateIncidentDto } from "./dto/create-incident.dto";
import { FetchIncidentDto } from "./dto/fetch-incident.dto";
import { UpdateIncidentDto } from "./dto/update-incident.dto";

@Injectable()
export class IncidentService {
  private readonly TEMP_REPORTS_DIR = "temp-reports";

  constructor(
    @InjectRepository(Incident)
    private readonly incidentRepository: Repository<Incident>,
    private readonly userService: UsersService,
  ) {
    if (!fs.existsSync(this.TEMP_REPORTS_DIR)) {
      fs.mkdirSync(this.TEMP_REPORTS_DIR, { recursive: true });
    }
  }

  async createIncident(
    id: number,
    createIncidentDto: CreateIncidentDto.Input,
    files: string[],
  ): Promise<void> {
    const reportingUser = await this.userService.findUserById(id);

    if (!reportingUser) {
      throw new NotFoundException("Reporting user not found");
    }

    const incident = plainToInstance(Incident, {
      ...createIncidentDto,
    });
    incident.ranger = reportingUser;
    incident.evidence = files;

    await this.incidentRepository.save(incident);
  }

  async findAllIncident(dto: FetchIncidentDto.Input): Promise<any> {
    const queryBuilder = this.incidentRepository
      .createQueryBuilder("incidents")
      .leftJoinAndSelect("incidents.ranger", "ranger")
      .select([
        "incidents.id",
        "incidents.dateCaught",
        "incidents.description",
        "incidents.evidence",
        "incidents.createdAt",
        "incidents.updatedAt",
        "ranger.id",
        "ranger.names",
      ])
      .orderBy("incidents.id", "DESC");

    return await paginate(queryBuilder, {
      page: dto.page,
      limit: dto.size,
    });
  }

  async findIncidentById(id: number): Promise<Incident> {
    const incident = await this.incidentRepository.findOne({
      where: { id },
      relations: ["ranger"],
    });
    if (!incident) {
      throw new NotFoundException("Incident not found");
    }
    return incident;
  }

  async updateIncidentById(
    id: number,
    updateIncidentDto: UpdateIncidentDto.Input,
  ): Promise<Incident> {
    const incident = await this.findIncidentById(id);

    const updatedIncident = plainToInstance(Incident, {
      ...incident,
      ...updateIncidentDto,
    });

    await this.incidentRepository.save(updatedIncident);
    return updatedIncident;
  }

  async removeIncidentById(id: number): Promise<void> {
    const incident = await this.findIncidentById(id);

    if (!incident) {
      throw new NotFoundException("Incident not found");
    }

    await this.incidentRepository.remove(incident);
  }

  async generateIncidentSummary(type: "weekly" | "monthly"): Promise<any> {
    const now = new Date();
    let startDate: Date;
    let endDate: Date;

    if (type === "weekly") {
      startDate = startOfWeek(now);
      endDate = endOfWeek(now);
    } else if (type === "monthly") {
      startDate = startOfMonth(now);
      endDate = endOfMonth(now);
    } else {
      throw new Error("Invalid type. Use 'weekly' or 'monthly'.");
    }

    const incidents = await this.incidentRepository
      .createQueryBuilder("incident")
      .leftJoinAndSelect("incident.ranger", "ranger")
      .where("incident.dateCaught BETWEEN :startDate AND :endDate", {
        startDate,
        endDate,
      })
      .select([
        "incident.id",
        "incident.dateCaught",
        "incident.description",
        "incident.evidence",
        "ranger.names",
      ])
      .orderBy("incident.dateCaught", "ASC")
      .getMany();

    const summary = {
      type,
      startDate,
      endDate,
      totalIncidents: incidents.length,
      details: incidents.map((incident) => ({
        id: incident.id,
        date: incident.dateCaught,
        ranger: incident.ranger?.names,
        description: incident.description,
      })),
    };

    return summary;
  }

  private getDateRange(
    type: ReportType,
    startDate?: Date,
    endDate?: Date,
  ): { start: Date; end: Date } {
    const now = new Date();

    if (startDate && endDate) {
      return { start: new Date(startDate), end: new Date(endDate) };
    }

    switch (type) {
      case "weekly":
        return {
          start: startOfWeek(now),
          end: endOfWeek(now),
        };
      case "monthly":
        return {
          start: startOfMonth(now),
          end: endOfMonth(now),
        };
      default:
        throw new Error("Invalid report type");
    }
  }

  private async generateReportData(startDate: Date, endDate: Date) {
    return await this.incidentRepository
      .createQueryBuilder("incident")
      .leftJoinAndSelect("incident.ranger", "ranger")
      .where("incident.dateCaught BETWEEN :startDate AND :endDate", {
        startDate,
        endDate,
      })
      .select([
        "incident.id",
        "incident.dateCaught",
        "incident.description",
        "incident.evidence",
        "ranger.names",
      ])
      .orderBy("incident.dateCaught", "ASC")
      .getMany();
  }

  private async createCsvReport(data: any[], filePath: string): Promise<void> {
    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: [
        { id: "id", title: "ID" },
        { id: "date", title: "Date" },
        { id: "ranger", title: "Ranger" },
        { id: "description", title: "Description" },
        { id: "evidence", title: "Evidence" },
      ],
    });

    const records = data.map((incident) => ({
      id: incident.id,
      date: formatDate(incident.dateCaught, "yyyy-MM-dd"),
      ranger: incident.ranger?.names || "Unknown",
      description: incident.description,
      evidence: incident.evidence?.join(", ") || "None",
    }));

    await csvWriter.writeRecords(records);
  }

  private createJsonReport(data: any[], filePath: string): void {
    const jsonData = {
      generatedAt: new Date(),
      totalIncidents: data.length,
      incidents: data.map((incident) => ({
        id: incident.id,
        date: formatDate(incident.dateCaught, "yyyy-MM-dd"),
        ranger: incident.ranger?.names || "Unknown",
        description: incident.description,
        evidence: incident.evidence || [],
      })),
    };

    fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));
  }

  private async createXlsxReport(data: any[], filePath: string): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Incidents Report");

    worksheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Date", key: "date", width: 15 },
      { header: "Ranger", key: "ranger", width: 20 },
      { header: "Description", key: "description", width: 50 },
      { header: "Evidence", key: "evidence", width: 30 },
    ];

    // Add title row with merged cells
    worksheet.spliceRows(1, 0, ["Incidents Report"]);
    worksheet.mergeCells("A1:E1");
    worksheet.getCell("A1").font = { size: 16, bold: true };
    worksheet.getCell("A1").alignment = { horizontal: "center" };

    // Add data
    data.forEach((incident) => {
      worksheet.addRow({
        id: incident.id,
        date: formatDate(incident.dateCaught, "yyyy-MM-dd"),
        ranger: incident.ranger?.names || "Unknown",
        description: incident.description,
        evidence: incident.evidence?.join(", ") || "None",
      });
    });

    // Style the header row
    worksheet.getRow(2).font = { bold: true };
    worksheet.getRow(2).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE0E0E0" },
    };

    await workbook.xlsx.writeFile(filePath);
  }

  private async createPdfReport(data: any[], filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        margin: 50,
        size: "A4",
      });
      const stream = fs.createWriteStream(filePath);

      doc.pipe(stream);

      // Custom color palette
      const colors = {
        header: "#2C3E50",
        text: "#34495E",
        accent: "#3498DB",
        separator: "#BDC3C7",
      };

      // Header and Title
      doc
        .fillColor(colors.header)
        .fontSize(24)
        .font("Helvetica-Bold")
        .text("Incidents Report", { align: "center" })
        .moveDown();

      // Metadata with styling
      doc
        .fillColor(colors.accent)
        .fontSize(12)
        .font("Helvetica")
        .text(`Generated: ${formatDate(new Date(), "yyyy-MM-dd HH:mm")}`, {
          align: "right",
        })
        .fillColor(colors.text)
        .text(`Total Incidents: ${data.length}`, { align: "right" })
        .moveDown(1.5);

      // Table-like formatting
      const tableTop = 200;
      let currentY = tableTop;

      data.forEach((incident, index) => {
        // Add page break if needed
        if (currentY > 700) {
          doc.addPage();
          currentY = 50;
        }

        // Alternate background color for better readability
        doc
          .rect(50, currentY - 5, 500, 120)
          .fillColor(index % 2 === 0 ? "#F4F6F7" : "white")
          .fillOpacity(0.5)
          .fill();

        // Reset for content
        doc.fillOpacity(1).fillColor(colors.text);

        doc
          .fontSize(10)
          .font("Helvetica-Bold")
          .text(`Incident #${incident.id}`, 60, currentY, {
            underline: true,
          })
          .font("Helvetica")
          .moveDown(0.5);

        // Incident details with aligned layout
        const details = [
          `Date: ${formatDate(incident.dateCaught, "yyyy-MM-dd")}`,
          `Ranger: ${incident.ranger?.names || "Unknown"}`,
          `Description: ${incident.description}`,
          `Evidence: ${incident.evidence?.join(", ") || "None"}`,
        ];

        details.forEach((detail) => {
          doc
            .fillColor(colors.text)
            .text(detail, 60, doc.y, {
              width: 480,
              align: "left",
            })
            .moveDown(0.5);
        });

        // Stylized separator
        doc
          .strokeColor(colors.separator)
          .lineWidth(0.5)
          .moveTo(50, doc.y)
          .lineTo(550, doc.y)
          .stroke()
          .moveDown(1);

        currentY = doc.y + 10;
      });

      // Footer
      doc
        .fontSize(8)
        .fillColor(colors.text)
        .text(`Page ${doc.bufferedPageRange().count}`, 50, 820, {
          align: "center",
        });

      doc.end();

      stream.on("finish", () => resolve());
      stream.on("error", reject);
    });
  }
  async generateReport(dto: GenerateReportDto): Promise<string> {
    const { type, format } = dto;
    const { start, end } = this.getDateRange(type, dto.startDate, dto.endDate);

    const data = await this.generateReportData(start, end);
    const timestamp = formatDate(new Date(), "yyyyMMdd-HHmmss");
    const fileName = `incident-report-${type}-${timestamp}.${format}`;
    const filePath = path.join(this.TEMP_REPORTS_DIR, fileName);

    switch (format) {
      case "csv":
        await this.createCsvReport(data, filePath);
        break;
      case "json":
        this.createJsonReport(data, filePath);
        break;
      case "xlsx":
        await this.createXlsxReport(data, filePath);
        break;
      case "pdf":
        await this.createPdfReport(data, filePath);
        break;
      default:
        throw new Error("Unsupported format");
    }

    return fileName;
  }

  async downloadReport(
    fileName: string,
    res: Response,
  ): Promise<StreamableFile> {
    const filePath = path.join(this.TEMP_REPORTS_DIR, fileName);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException("Report file not found");
    }

    const file = fs.createReadStream(filePath);
    const stat = fs.statSync(filePath);

    res.set({
      "Content-Type": this.getContentType(fileName),
      "Content-Length": stat.size,
      "Content-Disposition": `attachment; filename="${fileName}"`,
    });

    file.on("end", () => {
      fs.unlink(filePath, (err) => {
        if (err) console.error("Error deleting temporary file:", err);
      });
    });

    return new StreamableFile(file);
  }

  private getContentType(fileName: string): string {
    const ext = path.extname(fileName).toLowerCase();
    const contentTypes = {
      ".csv": "text/csv",
      ".json": "application/json",
      ".xlsx":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ".pdf": "application/pdf",
    };
    return contentTypes[ext] || "application/octet-stream";
  }
}
