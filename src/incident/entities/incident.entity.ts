import { AbstractEntity } from "src/__shared__/entities/abstract.entity";
import { IncidentStatus } from "src/__shared__/enums/incident-status.enum";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity({ name: "incidents" })
export class Incident extends AbstractEntity {
  @Column({ nullable: false })
  poacherName: string;

  @Column({ type: "timestamp", nullable: false })
  dateCaught: Date;

  @Column({
    default: IncidentStatus.PENDING,
  })
  status: IncidentStatus;

  @Column({ nullable: true })
  description: string;

  @Column("text", { array: true, nullable: true })
  evidence: string[];

  @ManyToOne(() => User, (user) => user.id)
  reportingUserId: string;
}
