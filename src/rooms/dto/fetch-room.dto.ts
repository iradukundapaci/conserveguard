import { IsOptional } from "class-validator";
import { PaginationDto } from "src/__shared__/dto/pagination.dto";
import { RoomType } from "../enums/RoomType.enum";

export namespace FetchRoomDto {
  export class Input extends PaginationDto {
    @IsOptional()
    q?: string;
  }

  export class Output {
    roomNumber: string;
    capacity: number;
    roomType: RoomType;
    price: number;
    occupied: boolean;
  }
}
