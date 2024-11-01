import { AbstractEntity } from "src/__shared__/entities/abstract.entity";
import { IncidentStatus } from "src/__shared__/enums/incident-status.enum";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity({ name: "incidents" })
export class Incident extends AbstractEntity {
  @Column()
  title: string;
  @Column()
  description: string;
  @Column()
  status: IncidentStatus;
  @Column()
  resolution: string;

  @ManyToOne(() => User, (user) => user.incidents)
  user: User;
}
