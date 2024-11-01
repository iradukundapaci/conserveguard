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
import { BookingsService } from "./bookings.service";
import { BookingsDto } from "./dto/booking.dto";
import { CreateBookingsDto } from "./dto/create-booking.dto";
import { FetchBookingsDto } from "./dto/fetch-booking.dto";
import { UpdateBookingsDto } from "./dto/update-booking.dto";

@ApiTags("Bookings")
@Controller("bookings")
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @PostOperation("", "Create booking")
  @CreatedResponse()
  @ErrorResponses(UnauthorizedResponse, ForbiddenResponse)
  async createBookings(
    @Body() createBookingsDto: CreateBookingsDto.Input,
  ): Promise<GenericResponse> {
    await this.bookingsService.createBooking(createBookingsDto);
    return new GenericResponse("Bookings created successfully");
  }

  @GetOperation("", "Get all bookings")
  @PaginatedOkResponse(FetchBookingsDto.Output)
  @Authorize(JwtGuard, UserRole.ADMIN)
  @ErrorResponses(UnauthorizedResponse, ForbiddenResponse)
  async getAllBookings(@Query() fetchBookingsDto: FetchBookingsDto.Input) {
    const response =
      await this.bookingsService.findAllBookings(fetchBookingsDto);
    return new GenericResponse("Bookings retrieved successfully", response);
  }

  @GetOperation(":id", "Get booking")
  @OkResponse(BookingsDto.Output)
  @Authorize(JwtGuard, UserRole.ADMIN)
  @ErrorResponses(UnauthorizedResponse, ForbiddenResponse)
  async getBookings(
    @Param("id") id: number,
  ): Promise<GenericResponse<BookingsDto.Output>> {
    const booking = await this.bookingsService.findBookingById(id);
    const output = plainToInstance(BookingsDto.Output, booking);

    return new GenericResponse("Bookings retrieved successfully", output);
  }

  @PatchOperation(":id", "Update booking")
  @OkResponse()
  @Authorize(JwtGuard, UserRole.ADMIN)
  @ApiRequestBody(BookingsDto.Output)
  @ErrorResponses(UnauthorizedResponse, ForbiddenResponse)
  async updateBookings(
    @Param("id") id: number,
    @Body() updateBookingsDto: UpdateBookingsDto.Input,
  ): Promise<GenericResponse<BookingsDto.Output>> {
    let outPut = await this.bookingsService.updateBookingById(
      id,
      updateBookingsDto,
    );
    outPut = plainToInstance(BookingsDto.Output, outPut);
    return new GenericResponse("Bookings updated successfully", outPut);
  }

  @DeleteOperation(":id", "Delete booking")
  @OkResponse()
  @Authorize(JwtGuard, UserRole.ADMIN)
  @ErrorResponses(UnauthorizedResponse, ForbiddenResponse)
  async removeBookings(@Param("id") id: number): Promise<GenericResponse> {
    await this.bookingsService.removeBookingById(id);
    return new GenericResponse("Bookings deleted successfully");
  }
}
