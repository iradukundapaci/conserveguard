import { AbstractEntity } from "src/__shared__/entities/abstract.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity()
export class Group extends AbstractEntity {
  @Column()
  name: string;

  @OneToMany(() => User, (user) => user.group, { nullable: true })
  rangers: User[];
}
