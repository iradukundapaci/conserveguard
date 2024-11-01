import { AbstractEntity } from "src/__shared__/entities/abstract.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity()
export class Chat extends AbstractEntity {
  @Column()
  message: string;

  @ManyToOne(() => User, (sender) => sender.id, { eager: true })
  sender: number;

  @ManyToOne(() => User, (receiver) => receiver.id, { eager: true })
  receiver: number;
}
