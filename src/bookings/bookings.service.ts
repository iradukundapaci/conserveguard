import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { plainToInstance } from "class-transformer";
import { paginate } from "nestjs-typeorm-paginate";
import { Booking } from "./entities/booking.entity";
import { CreateBookingsDto } from "./dto/create-booking.dto";
import { UpdateBookingsDto } from "./dto/update-booking.dto";
import { BookingsDto } from "./dto/booking.dto";
import { FetchBookingsDto } from "./dto/fetch-booking.dto";
import { CustomerService } from "src/customer/customer.service";
import { RoomsService } from "src/rooms/rooms.service";

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    private readonly roomService: RoomsService,
    private readonly customerService: CustomerService,
  ) {}
  async createBooking(
    createBookingDto: CreateBookingsDto.Input,
  ): Promise<void> {
    let customer = await this.customerService.findCustomerByEmail(
      createBookingDto.email,
    );

    if (!customer) {
      await this.customerService.createCustomer({
        email: createBookingDto.email,
        names: createBookingDto.firstName + " " + createBookingDto.lastName,
        phoneNumber: createBookingDto.phoneNumber,
      });

      customer = await this.customerService.findCustomerByEmail(
        createBookingDto.email,
      );
    }

    const newBooking = plainToInstance(Booking, {
      ...createBookingDto,
    });

    newBooking.customer = customer;

    await this.bookingRepository.save(newBooking);
  }

  async findAllBookings(dto: FetchBookingsDto.Input): Promise<any> {
    const query = this.bookingRepository
      .createQueryBuilder("bookings")
      .leftJoinAndSelect("bookings.customer", "customer")
      .select([
        "bookings.id",
        "bookings.checkIn",
        "bookings.checkOut",
        "bookings.numberOfAdults",
        "bookings.numberOfKids",
        "bookings.specialRequest",
        "customer.names",
        "customer.email",
        "customer.phoneNumber",
      ])
      .orderBy("bookings.id", "DESC");

    return await paginate(query, {
      page: dto.page,
      limit: dto.size,
    });
  }

  async findBookingById(id: number): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
    });

    if (!booking) {
      throw new NotFoundException("Booking not found");
    }

    return booking;
  }

  async updateBookingById(
    id: number,
    updateBookingDto: UpdateBookingsDto.Input,
  ): Promise<BookingsDto.Output> {
    const booking = await this.findBookingById(id);

    if (!booking) {
      throw new NotFoundException("Booking not found");
    }

    let updatedBooking = plainToInstance(Booking, {
      ...booking,
      ...updateBookingDto,
    });

    updatedBooking = await this.bookingRepository.save(updatedBooking);
    return plainToInstance(BookingsDto.Output, updatedBooking);
  }

  async removeBookingById(id: number): Promise<void> {
    const booking = await this.findBookingById(id);
    if (!booking) {
      throw new NotFoundException("Booking not found");
    }

    await this.bookingRepository.remove(booking);
  }
}
