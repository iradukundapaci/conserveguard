import { AbstractEntity } from "src/__shared__/entities/abstract.entity";
import { Column, Entity } from "typeorm";

@Entity({ name: "animals" })
export class Animals extends AbstractEntity {
  @Column({ unique: true })
  names: string;

  @Column()
  location: string;

  @Column()
  tips: string;
}
