import { RoomType } from "../enums/RoomType.enum";

export namespace RoomDto {
  export class Output {
    roomNumber: string;
    capacity: number;
    roomType: RoomType;
    price: number;
    occupied: boolean;
  }
}
