import { Controller, Body, Query, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import {
  PostOperation,
  CreatedResponse,
  ApiRequestBody,
  ErrorResponses,
  UnauthorizedResponse,
  ForbiddenResponse,
  GetOperation,
  PaginatedOkResponse,
  DeleteOperation,
  OkResponse,
  PatchOperation,
} from "src/__shared__/decorators";
import { GenericResponse } from "src/__shared__/dto/generic-response.dto";
import { Authorize } from "src/auth/decorators/authorize.decorator";
import { JwtGuard } from "src/auth/guards/jwt.guard";
import { CreateCaseDto } from "./dto/create-case.dto";
import { FetchCaseDto } from "./dto/fetch-case.dto";
import { CasesService } from "./cases.service";
import { UserRole } from "src/__shared__/enums/user-role.enum";
import { UpdateCaseDto } from "./dto/update-case.dto";

@ApiTags("Cases")
@Controller("cases")
export class CasesController {
  constructor(private readonly casesService: CasesService) {}

  @PostOperation("", "Create new case")
  @CreatedResponse()
  @Authorize(JwtGuard)
  @ApiRequestBody(CreateCaseDto.Input)
  @ErrorResponses(UnauthorizedResponse, ForbiddenResponse)
  async createCase(@Body() createCaseDto: CreateCaseDto.Input): Promise<void> {
    return await this.casesService.createCase(createCaseDto);
  }

  @GetOperation("", "Get all cases")
  @PaginatedOkResponse(FetchCaseDto.Output)
  @Authorize(JwtGuard)
  @ApiRequestBody(FetchCaseDto.Input)
  @ErrorResponses(UnauthorizedResponse)
  async getAllCases(
    @Query() fetchCaseDto: FetchCaseDto.Input,
  ): Promise<GenericResponse<FetchCaseDto.Output>> {
    const result = await this.casesService.findAllCases(fetchCaseDto);
    return new GenericResponse("Cases retrieved successfully", result);
  }

  @GetOperation(":id", "Get case by id")
  @OkResponse(CreateCaseDto.Output)
  @Authorize(JwtGuard, UserRole.ADMIN)
  @ErrorResponses(UnauthorizedResponse, ForbiddenResponse)
  async getCustomer(@Param("id") id: number) {
    const result = await this.casesService.findCaseById(id);
    return new GenericResponse("Case retrieved successfully", result);
  }

  @PatchOperation(":id", "Update case")
  @OkResponse(UpdateCaseDto.Output)
  @Authorize(JwtGuard, UserRole.ADMIN)
  @ApiRequestBody(UpdateCaseDto.Input)
  @ErrorResponses(UnauthorizedResponse, ForbiddenResponse)
  async updateCustomer(
    @Param("id") id: number,
    @Body() updateCaseDto: UpdateCaseDto.Input,
  ) {
    const result = await this.casesService.updateCaseById(id, updateCaseDto);
    return new GenericResponse("Case updated successfully", result);
  }

  @DeleteOperation(":id", "Delete case")
  @OkResponse()
  @Authorize(JwtGuard, UserRole.ADMIN)
  @ErrorResponses(UnauthorizedResponse, ForbiddenResponse)
  async removeCustomer(@Param("id") id: number): Promise<void> {
    return await this.casesService.removeCaseById(id);
  }
}
