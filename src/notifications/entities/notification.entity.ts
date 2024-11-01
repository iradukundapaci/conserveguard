import { AbstractEntity } from "src/__shared__/entities/abstract.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class Notifications extends AbstractEntity {
  @Column()
  message: string;

  @Column({ default: false })
  isRead: boolean;
}
