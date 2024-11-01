import { PasswordDto } from "./dto/update-password.dto";
import { UsersService } from "./users.service";
import { Body, Controller, Param, Query } from "@nestjs/common";
import { GenericResponse } from "src/__shared__/dto/generic-response.dto";
import { Authorize } from "src/auth/decorators/authorize.decorator";
import { GetUser } from "src/auth/decorators/get-user.decorator";
import { JwtGuard } from "src/auth/guards/jwt.guard";
import { User } from "./entities/user.entity";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { UserRole } from "src/__shared__/enums/user-role.enum";
import { FetchProfileDto } from "./dto/fetch-profile.dto";
import { FetchUserDto } from "./dto/fetch-user.dto";
import { ApiTags } from "@nestjs/swagger";
import {
  ApiRequestBody,
  BadRequestResponse,
  ConflictResponse,
  ErrorResponses,
  ForbiddenResponse,
  GetOperation,
  NotFoundResponse,
  PaginatedOkResponse,
  OkResponse,
  PatchOperation,
  UnauthorizedResponse,
  PostOperation,
  DeleteOperation,
} from "src/__shared__/decorators";
import { plainToInstance } from "class-transformer";
import { CreateUserDto } from "./dto/create-user.dto";

@ApiTags("Users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @OkResponse(FetchProfileDto.OutPut)
  @Authorize(JwtGuard)
  @GetOperation("profile", "user profile")
  @ErrorResponses(UnauthorizedResponse, ForbiddenResponse, NotFoundResponse)
  async getProfile(
    @GetUser() user: User,
  ): Promise<GenericResponse<FetchProfileDto.OutPut>> {
    const loggedinUser = await this.usersService.getProfile(user.id);

    return new GenericResponse("Profile retrieved successfully", loggedinUser);
  }

  @PostOperation("", "create a new user")
  @OkResponse()
  @ApiRequestBody(CreateUserDto.Input)
  @ErrorResponses(ConflictResponse, BadRequestResponse)
  async signUp(
    @Body() createUserDto: CreateUserDto.Input,
  ): Promise<GenericResponse> {
    await this.usersService.registerUser(createUserDto);
    return new GenericResponse("User successfully registered");
  }

  @OkResponse(FetchProfileDto.OutPut)
  @Authorize(JwtGuard, UserRole.ADMIN)
  @GetOperation(":id", "get a user")
  @ErrorResponses(UnauthorizedResponse, ForbiddenResponse, NotFoundResponse)
  async getUser(
    @Param("id") id: number,
  ): Promise<GenericResponse<FetchProfileDto.OutPut>> {
    let user: any = await this.usersService.findUserById(id);
    user = plainToInstance(FetchProfileDto.OutPut, user);
    return new GenericResponse("User retrieved successfully", user);
  }

  @OkResponse(UpdateProfileDto.OutPut)
  @ApiRequestBody(UpdateProfileDto.Input)
  @ErrorResponses(
    UnauthorizedResponse,
    ConflictResponse,
    ForbiddenResponse,
    NotFoundResponse,
    BadRequestResponse,
  )
  @PatchOperation("profile", "update user profile")
  @Authorize(JwtGuard)
  async updateProfile(
    @GetUser() user: User,
    @Body() updateProfileDto: UpdateProfileDto.Input,
  ): Promise<GenericResponse<UpdateProfileDto.OutPut>> {
    const updatedUser = await this.usersService.updateProfile(
      +user.id,
      updateProfileDto,
    );
    return new GenericResponse("Profile updated successfully", updatedUser);
  }

  @PatchOperation("/:id", "update admin profile")
  @OkResponse(UpdateProfileDto.OutPut)
  @ApiRequestBody(UpdateProfileDto.Input)
  @Authorize(JwtGuard, UserRole.ADMIN)
  @ErrorResponses(
    UnauthorizedResponse,
    ForbiddenResponse,
    NotFoundResponse,
    ConflictResponse,
    BadRequestResponse,
  )
  async updateAdminProfile(
    @Param("id") adminId: number,
    @Body() updateProfileDto: UpdateProfileDto.Input,
  ): Promise<GenericResponse<UpdateProfileDto.OutPut>> {
    const updatedUser = await this.usersService.updateProfile(
      +adminId,
      updateProfileDto,
    );
    return new GenericResponse("Profile updated successfully", updatedUser);
  }

  @DeleteOperation(":id", "delete a user")
  @OkResponse()
  @Authorize(JwtGuard, UserRole.ADMIN)
  @ErrorResponses(UnauthorizedResponse, ForbiddenResponse, NotFoundResponse)
  async deleteUser(@Param("id") id: number): Promise<GenericResponse> {
    await this.usersService.deleteUser(id);
    return new GenericResponse("User deleted successfully");
  }

  @OkResponse()
  @ApiRequestBody(PasswordDto.Input)
  @Authorize(JwtGuard)
  @PatchOperation(":id/change-password", "Change password")
  @ErrorResponses(UnauthorizedResponse, BadRequestResponse)
  async updatePassword(
    @GetUser() user: User,
    @Body() updatePasswordDto: PasswordDto.Input,
  ): Promise<GenericResponse> {
    await this.usersService.updatePassword(
      user.id,
      updatePasswordDto.newPassword,
    );
    return new GenericResponse("Password updated successfully");
  }

  @GetOperation("", "Retrieving all users")
  @PaginatedOkResponse(FetchUserDto.Output)
  async getAllUsers(
    @Query() fetchUserDto: FetchUserDto.Input,
  ): Promise<GenericResponse<FetchUserDto.Output>> {
    const result = await this.usersService.findAllUsers(fetchUserDto);
    return new GenericResponse("Users retrieved successfully", result);
  }
}
