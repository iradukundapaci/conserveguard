import { AbstractEntity } from "src/__shared__/entities/abstract.entity";
import { Entity, Column, OneToMany } from "typeorm";
import { UserRole } from "src/__shared__/enums/user-role.enum";
import { Incident } from "src/incident/entities/incident.entity";

@Entity("users")
export class User extends AbstractEntity {
  @Column()
  names: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  role: UserRole;

  @Column({ nullable: true })
  refreshToken: string;

  @Column({ type: "timestamptz", default: null, nullable: true })
  verifiedAt: Date;

  @Column({ nullable: true, default: true })
  activated: boolean;

  @OneToMany(() => Incident, (incident) => incident.user)
  incidents: Incident[];
}
