import { Controller, Body, Param, Query } from "@nestjs/common";
import { IncidentService } from "./incident.service";
import { ApiTags } from "@nestjs/swagger";
import { plainToInstance } from "class-transformer";
import {
  PostOperation,
  CreatedResponse,
  ApiRequestBody,
  GetOperation,
  PaginatedOkResponse,
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

@ApiTags("Incidents")
@Controller("incidents")
export class IncidentController {
  constructor(private readonly incidentService: IncidentService) {}

  @PostOperation("", "Create Incident")
  @CreatedResponse()
  @ApiRequestBody(CreateIncidentDto.Input)
  async createIncident(
    @GetUser("id") id: number,
    @Body() createIncidentDto: CreateIncidentDto.Input,
  ): Promise<GenericResponse> {
    await this.incidentService.createIncident(id, createIncidentDto);
    return new GenericResponse("Incident created successfully");
  }

  @GetOperation("", "Get All Incident")
  @PaginatedOkResponse(FetchIncidentDto.OutPut)
  @Authorize(JwtGuard)
  @ErrorResponses(UnauthorizedResponse, ForbiddenResponse)
  async getAllIncident(
    @Query() fetchIncidentDto: FetchIncidentDto.Input,
  ): Promise<GenericResponse<FetchIncidentDto.OutPut>> {
    const incidents =
      await this.incidentService.findAllIncident(fetchIncidentDto);
    return new GenericResponse("Incident retrieved successfully", incidents);
  }

  @GetOperation(":id", "Get Incident")
  @OkResponse(FetchIncidentDto.OutPut)
  @Authorize(JwtGuard, UserRole.ADMIN)
  @ErrorResponses(UnauthorizedResponse, ForbiddenResponse)
  async findIncident(
    @Param("id") id: number,
  ): Promise<GenericResponse<FetchIncidentDto.OutPut>> {
    const incident = await this.incidentService.findIncidentById(id);
    const outPut = await plainToInstance(FetchIncidentDto.OutPut, incident);
    return new GenericResponse("Incident retrieved successfully", outPut);
  }

  @PatchOperation(":id", "Update Incident")
  @OkResponse(FetchIncidentDto.OutPut)
  @Authorize(JwtGuard, UserRole.ADMIN)
  @ApiRequestBody(UpdateIncidentDto.Input)
  @ErrorResponses(UnauthorizedResponse, ForbiddenResponse)
  async updateIncident(
    @Param("id") id: number,
    @Body() updateIncidentDto: UpdateIncidentDto.Input,
  ): Promise<GenericResponse<UpdateIncidentDto.OutPut>> {
    const incident = await this.incidentService.updateIncidentById(
      id,
      updateIncidentDto,
    );
    const outPut = await plainToInstance(UpdateIncidentDto.OutPut, incident);
    return new GenericResponse("Incident updated successfully", outPut);
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
