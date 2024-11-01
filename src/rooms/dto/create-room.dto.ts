import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";
import { RoomType } from "../enums/RoomType.enum";

export namespace CreateRoomDto {
  export class Input {
    @IsString()
    @IsNotEmpty()
    roomNumber: string;

    @IsString()
    @IsNotEmpty()
    roomType: RoomType;

    @IsNumber()
    @Min(1)
    @IsNotEmpty()
    capacity: number;

    @IsNumber()
    @IsNotEmpty()
    price: number;
  }
}
