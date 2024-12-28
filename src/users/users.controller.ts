import { UsersService } from "./users.service";
import { Body, Controller, Param, Query } from "@nestjs/common";
import { GenericResponse } from "src/__shared__/dto/generic-response.dto";
import { Authorize } from "src/auth/decorators/authorize.decorator";
import { GetUser } from "src/auth/decorators/get-user.decorator";
import { JwtGuard } from "src/auth/guards/jwt.guard";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { FetchProfileDto } from "./dto/fetch-profile.dto";
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
import { User } from "./entities/user.entity";

@ApiTags("Users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @OkResponse(FetchProfileDto.Output)
  @Authorize(JwtGuard)
  @GetOperation("profile", "user profile")
  @ErrorResponses(UnauthorizedResponse, ForbiddenResponse, NotFoundResponse)
  async getProfile(@GetUser() user: User) {
    const loggedinUser = await this.usersService.getProfile(user.id);
    return new GenericResponse("Profile retrieved successfully", loggedinUser);
  }

  @PostOperation("", "create a new user")
  @OkResponse()
  @ApiRequestBody(CreateUserDto.Input)
  @Authorize(JwtGuard)
  @ErrorResponses(ConflictResponse, BadRequestResponse)
  async signUp(
    @Body() createUserDto: CreateUserDto.Input,
  ): Promise<GenericResponse> {
    await this.usersService.registerUser(createUserDto);
    return new GenericResponse("User successfully registered");
  }

  @OkResponse(FetchProfileDto.Output)
  @Authorize(JwtGuard)
  @GetOperation(":id", "get a user")
  @ErrorResponses(UnauthorizedResponse, ForbiddenResponse, NotFoundResponse)
  async getUser(@Param("id") id: number) {
    let user: any = await this.usersService.findUserById(id);
    user = plainToInstance(FetchProfileDto.Output, user);
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
  @PatchOperation(":id", "update user profile")
  @Authorize(JwtGuard)
  async updateProfile(
    @Param("id") userId: number,
    @Body() updateProfileDto: UpdateProfileDto.Input,
  ): Promise<GenericResponse<UpdateProfileDto.OutPut>> {
    const updatedUser = await this.usersService.updateProfile(
      userId,
      updateProfileDto,
    );
    return new GenericResponse("Profile updated successfully", updatedUser);
  }

  @DeleteOperation(":id", "delete a user")
  @OkResponse()
  @Authorize(JwtGuard)
  @ErrorResponses(UnauthorizedResponse, ForbiddenResponse, NotFoundResponse)
  async deleteUser(@Param("id") id: number): Promise<GenericResponse> {
    await this.usersService.deleteUser(id);
    return new GenericResponse("User deleted successfully");
  }

  @GetOperation("", "Retrieving all users")
  @PaginatedOkResponse(FetchProfileDto.Output)
  async getAllUsers(@Query() fetchProfileDto: FetchProfileDto.Input) {
    const result = await this.usersService.findAllUsers(fetchProfileDto);
    return new GenericResponse("Users retrieved successfully", result);
  }
}
