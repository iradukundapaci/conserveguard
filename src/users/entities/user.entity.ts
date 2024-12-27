import { AbstractEntity } from "src/__shared__/entities/abstract.entity";
import { Entity, Column, ManyToOne } from "typeorm";
import { UserRole } from "src/__shared__/enums/user-role.enum";
import { Group } from "src/group/entities/group.entity";

@Entity("users")
export class User extends AbstractEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  names: string;

  @Column()
  role: UserRole;

  @Column({ nullable: true })
  profileImage: string;

  @ManyToOne(() => Group, (group) => group.rangers, {
    nullable: true,
  })
  group: Group;
}
