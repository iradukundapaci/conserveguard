import {
  Controller,
  Body,
  Param,
  Query,
  UploadedFiles,
  UseInterceptors,
  NotFoundException,
  Res,
  StreamableFile,
} from "@nestjs/common";
import { IncidentService } from "./incident.service";
import { ApiTags } from "@nestjs/swagger";
import {
  PostOperation,
  CreatedResponse,
  ApiRequestBody,
  GetOperation,
  ErrorResponses,
  UnauthorizedResponse,
  ForbiddenResponse,
  OkResponse,
  DeleteOperation,
  PatchOperation,
} from "src/__shared__/decorators";
import { GenericResponse } from "src/__shared__/dto/generic-response.dto";
import { Authorize } from "src/auth/decorators/authorize.decorator";
import { JwtGuard } from "src/auth/guards/jwt.guard";
import { CreateIncidentDto } from "./dto/create-incident.dto";
import { FetchIncidentDto } from "./dto/fetch-incident.dto";
import { UpdateIncidentDto } from "./dto/update-incident.dto";
import { FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { v4 as uuidv4 } from "uuid";
import { Response } from "express";
import { resolve } from "path";
import { existsSync } from "fs";
import { GetUser } from "src/auth/decorators/get-user.decorator";
import { GenerateReportDto } from "./dto/generate-report.dto";

@ApiTags("Incidents")
@Controller("incidents")
export class IncidentController {
  constructor(private readonly incidentService: IncidentService) {}

  @PostOperation("", "Create Incident")
  @CreatedResponse()
  @ApiRequestBody(CreateIncidentDto.Input)
  @Authorize(JwtGuard)
  @UseInterceptors(
    FilesInterceptor("files", 10, {
      storage: diskStorage({
        destination: "./uploads",
        filename: (req, file, callback) => {
          const fileExtension = file.originalname.split(".").pop();
          const uniqueName = `${uuidv4()}.${fileExtension}`;
          callback(null, uniqueName);
        },
      }),
    }),
  )
  async createIncident(
    @GetUser("id") id: number,
    @Body() createIncidentDto: CreateIncidentDto.Input,
    @UploadedFiles() evidence: Express.Multer.File[],
  ): Promise<GenericResponse> {
    const files = evidence?.map((file) => file.filename);

    await this.incidentService.createIncident(id, createIncidentDto, files);
    return new GenericResponse("Incident created successfully");
  }

  @GetOperation("download/:filename", "Download File")
  async downloadFile(
    @Param("filename") filename: string,
    @Res() res: Response,
  ) {
    try {
      const filePath = resolve(__dirname, "../../uploads", filename);
      const exists = existsSync(filePath);

      if (!exists) {
        throw new NotFoundException("File not found");
      }

      res.sendFile(filePath, (err) => {
        if (err) {
          console.error("Error sending file:", err); // Log the error for debugging
          res.status(500).send("Error sending file"); // Send a user-friendly error response
        }
      });
    } catch (error) {
      console.error("Error in downloadFile method:", error);
      res.status(500).send("An error occurred while processing your request");
    }
  }

  @GetOperation("report", "Generate and Download Report")
  @OkResponse()
  async generateAndDownloadReport(
    @Query() dto: GenerateReportDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const fileName = await this.incidentService.generateReport(dto);
    return this.incidentService.downloadReport(fileName, res);
  }

  @GetOperation("", "Get All Incident")
  @ErrorResponses(UnauthorizedResponse, ForbiddenResponse)
  async getAllIncident(@Query() fetchIncidentDto: FetchIncidentDto.Input) {
    const incidents =
      await this.incidentService.findAllIncident(fetchIncidentDto);
    return new GenericResponse("Incident retrieved successfully", incidents);
  }

  @GetOperation(":id", "Get Incident")
  @ErrorResponses(UnauthorizedResponse, ForbiddenResponse)
  async findIncident(@Param("id") id: number) {
    const incident = await this.incidentService.findIncidentById(id);
    return new GenericResponse("Incident retrieved successfully", incident);
  }

  @PatchOperation(":id", "Update Incident")
  @OkResponse()
  @ApiRequestBody(UpdateIncidentDto.Input)
  @ErrorResponses(UnauthorizedResponse, ForbiddenResponse)
  async updateIncident(
    @Param("id") id: number,
    @Body() updateIncidentDto: UpdateIncidentDto.Input,
  ) {
    await this.incidentService.updateIncidentById(id, updateIncidentDto);
    return new GenericResponse("Incident updated successfully");
  }

  @DeleteOperation(":id", "Delete Incident")
  @OkResponse()
  @ErrorResponses(UnauthorizedResponse, ForbiddenResponse)
  async removeIncident(@Param("id") id: number): Promise<GenericResponse> {
    await this.incidentService.removeIncidentById(id);
    return new GenericResponse("Incident deleted successfully");
  }
}
