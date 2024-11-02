import { AbstractEntity } from "src/__shared__/entities/abstract.entity";
import { UserRole } from "src/__shared__/enums/user-role.enum";
import { Entity, Column } from "typeorm";

@Entity("profiles")
export class Profile extends AbstractEntity {
  @Column()
  names: string;

  @Column()
  role: UserRole;

  @Column({ nullable: true })
  profileImage: string;
}
