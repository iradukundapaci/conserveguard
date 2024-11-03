import { AbstractEntity } from "src/__shared__/entities/abstract.entity";
import { IncidentStatus } from "src/__shared__/enums/incident-status.enum";
import { Profile } from "src/users/entities/profile.entity";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

@Entity({ name: "incidents" })
export class Incident extends AbstractEntity {
  @Column()
  location: string;
  @Column()
  dateCaught: Date;
  @Column()
  status: IncidentStatus;

  @OneToOne(() => Profile, (poacher) => poacher.id, {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  poacher: Profile;
}
