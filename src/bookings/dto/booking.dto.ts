import { CustomerDto } from "src/customer/dto/customer.dto";

export namespace BookingsDto {
  export class Output {
    id: number;
    customer: CustomerDto.Output;
    checkIn: string;
    checkOut: string;
    numberOfAdults: number;
    numberOfKids: number;
    specialRequest: string;
  }
}
