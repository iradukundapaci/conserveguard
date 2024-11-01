import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export namespace CreateBookingsDto {
  export class Input {
    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    lastName: string;

    @IsNotEmpty()
    phoneNumber: string;

    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    checkIn: Date;

    @IsNotEmpty()
    checkOut: Date;

    @IsNotEmpty()
    numberOfAdults: number;

    @IsOptional()
    numberOfKids: number;

    @IsOptional()
    specialRequest: string;
  }
}
