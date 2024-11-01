import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BookingsController } from "./bookings.controller";
import { BookingsService } from "./bookings.service";
import { Booking } from "./entities/booking.entity";
import { RoomsModule } from "src/rooms/rooms.module";
import { CustomerModule } from "src/customer/customer.module";

@Module({
  imports: [TypeOrmModule.forFeature([Booking]), RoomsModule, CustomerModule],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
