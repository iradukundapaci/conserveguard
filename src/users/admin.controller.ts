import { GenericResponse } from "src/__shared__/dto/generic-response.dto";
import { Authorize } from "src/auth/decorators/authorize.decorator";
import { UserRole } from "src/__shared__/enums/user-role.enum";
import { Body, Controller, HttpCode, Param } from "@nestjs/common";
import { CreateAdminDTO } from "./dto/create-admin.dto";
import { JwtGuard } from "src/auth/guards/jwt.guard";
import { UsersService } from "./users.service";
import { ApiTags } from "@nestjs/swagger";
import {
  ApiRequestBody,
  BadRequestResponse,
  ConflictResponse,
  CreatedResponse,
  DeleteOperation,
  ErrorResponses,
  ForbiddenResponse,
  NotFoundResponse,
  OkResponse,
  PostOperation,
  UnauthorizedResponse,
} from "src/__shared__/decorators";

@ApiTags("Admins")
@Controller("admins")
export class AdminsController {
  constructor(private readonly usersService: UsersService) {}

  @PostOperation("", "create an admin")
  @CreatedResponse()
  @ApiRequestBody(CreateAdminDTO.Input)
  @Authorize(JwtGuard, UserRole.ADMIN)
  @ErrorResponses(
    UnauthorizedResponse,
    ForbiddenResponse,
    ConflictResponse,
    BadRequestResponse,
  )
  async createAdmin(
    @Body() createAdminDTO: CreateAdminDTO.Input,
  ): Promise<GenericResponse> {
    await this.usersService.createAdmin(createAdminDTO);
    return new GenericResponse("Admin successfully created");
  }

  @OkResponse()
  @Authorize(JwtGuard, UserRole.ADMIN)
  @DeleteOperation(":id", "delete an admin")
  @ErrorResponses(UnauthorizedResponse, ForbiddenResponse, NotFoundResponse)
  async deleteAdmin(@Param("id") id: number): Promise<GenericResponse> {
    await this.usersService.deleteUser(id);
    return new GenericResponse("Admin deleted successfully");
  }

  @OkResponse()
  @HttpCode(200)
  @Authorize(JwtGuard, UserRole.ADMIN)
  @PostOperation(":id/pause", "pause an admin")
  @ErrorResponses(UnauthorizedResponse, ForbiddenResponse, NotFoundResponse)
  async pauseUser(@Param("id") id: number): Promise<GenericResponse> {
    await this.usersService.pauseUser(id);
    return new GenericResponse("Admin paused successfully");
  }

  @OkResponse()
  @HttpCode(200)
  @Authorize(JwtGuard, UserRole.ADMIN)
  @PostOperation(":id/activate", "activate an admin")
  @ErrorResponses(UnauthorizedResponse, ForbiddenResponse, NotFoundResponse)
  async activateUser(@Param("id") id: number): Promise<GenericResponse> {
    await this.usersService.activateUser(id);
    return new GenericResponse("Admin activated successfully");
  }
}
