import {
  Controller,
  Body,
  Param,
  Query,
  UploadedFiles,
  UseInterceptors,
  NotFoundException,
  Res,
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
import { UserRole } from "src/__shared__/enums/user-role.enum";
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

@ApiTags("Incidents")
@Controller("incidents")
export class IncidentController {
  constructor(private readonly incidentService: IncidentService) {}

  @PostOperation("", "Create Incident")
  @CreatedResponse()
  @ApiRequestBody(CreateIncidentDto.Input)
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
    @Body() createIncidentDto: CreateIncidentDto.Input,
    @UploadedFiles() evidence: Express.Multer.File[],
  ): Promise<GenericResponse> {
    const files = evidence?.map((file) => file.filename);

    await this.incidentService.createIncident(createIncidentDto, files);
    return new GenericResponse("Incident created successfully");
  }

  @GetOperation("download/:filename", "Download File")
  async downloadFile(
    @Param("filename") filename: string,
    @Res() res: Response,
  ) {
    const filePath = resolve(__dirname, "../../uploads", filename);
    const exists = existsSync(filePath);

    if (!exists) {
      throw new NotFoundException("File not found");
    }

    res.sendFile(filePath, (err) => {
      if (err) {
        throw new Error("Error sending file");
      }
    });
  }

  @GetOperation("", "Get All Incident")
  @Authorize(JwtGuard)
  @ErrorResponses(UnauthorizedResponse, ForbiddenResponse)
  async getAllIncident(@Query() fetchIncidentDto: FetchIncidentDto.Input) {
    const incidents =
      await this.incidentService.findAllIncident(fetchIncidentDto);
    return new GenericResponse("Incident retrieved successfully", incidents);
  }

  @GetOperation(":id", "Get Incident")
  @Authorize(JwtGuard, UserRole.ADMIN)
  @ErrorResponses(UnauthorizedResponse, ForbiddenResponse)
  async findIncident(@Param("id") id: number) {
    const incident = await this.incidentService.findIncidentById(id);
    return new GenericResponse("Incident retrieved successfully", incident);
  }

  @PatchOperation(":id", "Update Incident")
  @OkResponse()
  @Authorize(JwtGuard, UserRole.ADMIN)
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
  @Authorize(JwtGuard, UserRole.ADMIN)
  @ErrorResponses(UnauthorizedResponse, ForbiddenResponse)
  async removeIncident(@Param("id") id: number): Promise<GenericResponse> {
    await this.incidentService.removeIncidentById(id);
    return new GenericResponse("Incident deleted successfully");
  }
}
