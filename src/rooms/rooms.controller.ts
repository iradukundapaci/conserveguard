import { Controller, Body, Param, Query } from "@nestjs/common";
import {
  ApiRequestBody,
  CreatedResponse,
  DeleteOperation,
  ErrorResponses,
  ForbiddenResponse,
  GetOperation,
  OkResponse,
  PaginatedOkResponse,
  PatchOperation,
  PostOperation,
  UnauthorizedResponse,
} from "src/__shared__/decorators";
import { GenericResponse } from "src/__shared__/dto/generic-response.dto";
import { plainToInstance } from "class-transformer";
import { ApiTags } from "@nestjs/swagger";
import { UserRole } from "src/__shared__/enums/user-role.enum";
import { Authorize } from "src/auth/decorators/authorize.decorator";
import { JwtGuard } from "src/auth/guards/jwt.guard";
import { RoomsService } from "./rooms.service";
import { CreateRoomDto } from "./dto/create-room.dto";
import { FetchRoomDto } from "./dto/fetch-room.dto";
import { RoomDto } from "./dto/room.dto";
import { UpdateRoomDto } from "./dto/update-room.dto";

@ApiTags("Rooms")
@Controller("rooms")
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @PostOperation("", "Create room")
  @CreatedResponse()
  @ApiRequestBody(CreateRoomDto.Input)
  @Authorize(JwtGuard, UserRole.ADMIN)
  @ErrorResponses(UnauthorizedResponse, ForbiddenResponse)
  async createRoom(
    @Body() createRoomDto: CreateRoomDto.Input,
  ): Promise<GenericResponse> {
    await this.roomsService.createRoom(createRoomDto);

    return new GenericResponse("Room created successfully");
  }

  @GetOperation("", "Get all rooms")
  @PaginatedOkResponse(FetchRoomDto.Output)
  @Authorize(JwtGuard, UserRole.ADMIN)
  @ErrorResponses(UnauthorizedResponse, ForbiddenResponse)
  async getAllRoom(
    @Query() fetchRoomDto: FetchRoomDto.Input,
  ): Promise<GenericResponse<FetchRoomDto.Output>> {
    const result = await this.roomsService.findAllRoom(fetchRoomDto);

    return new GenericResponse("Rooms retrieved successfully", result);
  }

  @GetOperation(":id", "Get room")
  @OkResponse(RoomDto.Output)
  @Authorize(JwtGuard, UserRole.ADMIN)
  @ErrorResponses(UnauthorizedResponse, ForbiddenResponse)
  async getRoom(
    @Param("id") id: number,
  ): Promise<GenericResponse<RoomDto.Output>> {
    const room = await this.roomsService.findRoomById(id);
    const output = plainToInstance(RoomDto.Output, room);

    return new GenericResponse("Room retrieved successfully", output);
  }

  @PostOperation(":id", "Update room")
  @OkResponse()
  @Authorize(JwtGuard, UserRole.ADMIN)
  @ApiRequestBody(UpdateRoomDto.Output)
  @ErrorResponses(UnauthorizedResponse, ForbiddenResponse)
  async updateRoom(
    @Param("id") id: number,
    @Body() updateRoomDto: UpdateRoomDto.Input,
  ): Promise<GenericResponse<UpdateRoomDto.Output>> {
    let outPut = await this.roomsService.updateRoomById(id, updateRoomDto);
    outPut = plainToInstance(UpdateRoomDto.Output, outPut);
    return new GenericResponse("Room updated successfully", outPut);
  }

  @DeleteOperation(":id", "Delete room")
  @OkResponse()
  @Authorize(JwtGuard, UserRole.ADMIN)
  @ErrorResponses(UnauthorizedResponse, ForbiddenResponse)
  async removeRoom(@Param("id") id: number): Promise<GenericResponse> {
    await this.roomsService.removeRoomById(id);
    return new GenericResponse("Room deleted successfully");
  }

  @PatchOperation(":id", "Update room status")
  @OkResponse()
  @Authorize(JwtGuard, UserRole.ADMIN)
  @ErrorResponses(UnauthorizedResponse, ForbiddenResponse)
  async updateRoomStatus(@Param("id") id: number): Promise<GenericResponse> {
    await this.roomsService.updateRoomStatus(id);
    return new GenericResponse("Room status updated successfully");
  }
}
