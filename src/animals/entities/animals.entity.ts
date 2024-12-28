import { AbstractEntity } from "src/__shared__/entities/abstract.entity";
import { Column, Entity } from "typeorm";

@Entity({ name: "animals" })
export class Animals extends AbstractEntity {
  @Column({ unique: true })
  names: string;

  @Column()
  species: string;

  @Column("double precision")
  latitude: number;

  @Column("double precision")
  longitude: number;
}
