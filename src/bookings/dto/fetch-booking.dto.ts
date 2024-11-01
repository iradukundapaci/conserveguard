import { PaginationDto } from "src/__shared__/dto/pagination.dto";
import { CustomerDto } from "src/customer/dto/customer.dto";

export namespace FetchBookingsDto {
  export class Input extends PaginationDto {}

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
