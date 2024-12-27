import {
  Controller,
  Body,
  Param,
  Query,
  UploadedFiles,
  UseInterceptors,
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
import { GetUser } from "src/auth/decorators/get-user.decorator";
import { FilesInterceptor } from "@nestjs/platform-express";

@ApiTags("Incidents")
@Controller("incidents")
export class IncidentController {
  constructor(private readonly incidentService: IncidentService) {}

  @PostOperation("", "Create Incident")
  @CreatedResponse()
  @ApiRequestBody(CreateIncidentDto.Input)
  @UseInterceptors(FilesInterceptor("evidence", 10))
  async createIncident(
    @GetUser("id") id: number,
    @Body() createIncidentDto: CreateIncidentDto.Input,
    @UploadedFiles() evidence: Express.Multer.File[],
  ): Promise<GenericResponse> {
    const files = evidence?.map((file) => ({
      url: file.path,
      type: file.mimetype,
    }));

    createIncidentDto.evidence = files || [];

    await this.incidentService.createIncident(id, createIncidentDto);
    return new GenericResponse("Incident created successfully");
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
  @UseInterceptors(FilesInterceptor("evidence", 10))
  @ErrorResponses(UnauthorizedResponse, ForbiddenResponse)
  async updateIncident(
    @Param("id") id: number,
    @Body() updateIncidentDto: UpdateIncidentDto.Input,
    @UploadedFiles() evidence: Express.Multer.File[],
  ) {
    const files = evidence?.map((file) => ({
      url: file.path,
      type: file.mimetype,
    }));

    updateIncidentDto.evidence = files || [];

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
