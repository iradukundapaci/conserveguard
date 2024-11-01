import { AbstractEntity } from "src/__shared__/entities/abstract.entity";
import { Column, Entity } from "typeorm";
import { RoomType } from "../enums/RoomType.enum";

@Entity({ name: "rooms" })
export class Room extends AbstractEntity {
  @Column({ unique: true })
  roomNumber: string;

  @Column()
  capacity: number;

  @Column()
  roomType: RoomType;

  @Column()
  price: number;

  @Column()
  occupied: boolean = false;
}
