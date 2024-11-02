import { AbstractEntity } from "src/__shared__/entities/abstract.entity";
import { Entity, Column, OneToOne } from "typeorm";
import { Profile } from "./profile.entity";

@Entity("users")
export class User extends AbstractEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToOne(() => Profile, (profile) => profile.id, {
    cascade: true,
    eager: true,
    nullable: true,
  })
  profile: Profile;
}
