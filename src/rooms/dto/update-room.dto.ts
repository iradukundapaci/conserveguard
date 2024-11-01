import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsBoolean,
} from "class-validator";
import { RoomType } from "../enums/RoomType.enum";

export namespace UpdateRoomDto {
  export class Input {
    @IsString()
    @IsOptional()
    roomNumber?: string;

    @IsNumber()
    @IsOptional()
    capacity?: number;

    @IsEnum(RoomType)
    @IsOptional()
    roomType?: RoomType;

    @IsNumber()
    @IsOptional()
    price?: number;

    @IsBoolean()
    @IsOptional()
    occupied?: boolean;
  }
  export class Output {
    roomNumber: string;
    capacity: number;
    roomType: RoomType;
    price: number;
    occupied: boolean;
  }
}
