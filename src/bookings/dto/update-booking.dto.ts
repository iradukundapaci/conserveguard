import { IsString, IsOptional } from "class-validator";

export namespace UpdateBookingsDto {
  export class Input {
    @IsString()
    @IsOptional()
    checkIn?: string;

    @IsString()
    @IsOptional()
    checkOut?: string;
  }
}
