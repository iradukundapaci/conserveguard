import { Controller, Body, Param, Query } from "@nestjs/common";
import { LicenseService } from "./license.service";
import { CreateLicenseDto } from "./dto/create-license.dto";
import { UpdateLicenseDto } from "./dto/update-license.dto";
import { ApiTags } from "@nestjs/swagger";
import {
  ApiRequestBody,
  CreatedResponse,
  DeleteOperation,
  ErrorResponses,
  ForbiddenResponse,
  GetOperation,
  OkResponse,
  PaginatedOkResponse,
  PostOperation,
  UnauthorizedResponse,
} from "src/__shared__/decorators";
import { JwtGuard } from "src/auth/guards/jwt.guard";
import { UserRole } from "src/__shared__/enums/user-role.enum";
import { Authorize } from "src/auth/decorators/authorize.decorator";
import { FetchLicenseDto } from "./dto/fetch-license.dto";
import { GenericResponse } from "../__shared__/dto/generic-response.dto";
import { plainToInstance } from "class-transformer";

@ApiTags("License")
@Controller("license")
export class LicenseController {
  constructor(private readonly licenseService: LicenseService) {}

  @PostOperation("", "Create License")
  @CreatedResponse()
  @Authorize(JwtGuard, UserRole.ADMIN)
  @ApiRequestBody(CreateLicenseDto.Input)
  @ErrorResponses(UnauthorizedResponse, ForbiddenResponse)
  async createLicense(
    @Body() createLicenseDto: CreateLicenseDto.Input,
  ): Promise<void> {
    return await this.licenseService.createLicense(createLicenseDto);
  }

  @GetOperation("", "Find All Licenses")
  @PaginatedOkResponse(FetchLicenseDto.Output)
  @Authorize(JwtGuard, UserRole.ADMIN)
  @ApiRequestBody(FetchLicenseDto.Input)
  @ErrorResponses(UnauthorizedResponse, ForbiddenResponse)
  async getAllLicense(
    @Query() fetchLicenseDto: FetchLicenseDto.Input,
  ): Promise<GenericResponse<FetchLicenseDto.Output>> {
    return await this.licenseService.findAllLicense(fetchLicenseDto);
  }

  @GetOperation(":id", "Find One License")
  @OkResponse(CreateLicenseDto.Output)
  @Authorize(JwtGuard, UserRole.ADMIN)
  @ErrorResponses(UnauthorizedResponse, ForbiddenResponse)
  async getLicense(
    @Param("id") id: number,
  ): Promise<GenericResponse<CreateLicenseDto.Output>> {
    const license = await this.licenseService.findLicenseById(id);
    const output = plainToInstance(CreateLicenseDto.Output, license);
    return new GenericResponse("License retrieved successfully", output);
  }

  @PostOperation(":id", "Update License")
  @OkResponse(UpdateLicenseDto.Output)
  @Authorize(JwtGuard, UserRole.ADMIN)
  @ApiRequestBody(UpdateLicenseDto.Input)
  @ErrorResponses(UnauthorizedResponse, ForbiddenResponse)
  async updateLicense(
    @Param("id") id: number,
    @Body() updateLicenseDto: UpdateLicenseDto.Input,
  ) {
    return this.licenseService.updateLicenseById(id, updateLicenseDto);
  }

  @DeleteOperation(":id", "Delete License")
  @OkResponse()
  @Authorize(JwtGuard, UserRole.ADMIN)
  @ErrorResponses(UnauthorizedResponse, ForbiddenResponse)
  async removeLicense(@Param("id") id: number): Promise<void> {
    return await this.licenseService.removeTaskById(id);
  }
}
