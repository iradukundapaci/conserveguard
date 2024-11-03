import { AbstractEntity } from "src/__shared__/entities/abstract.entity";
import { Profile } from "src/users/entities/profile.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { CasesStatus } from "../enum/case-status.enum";

@Entity({ name: "cases" })
export class Cases extends AbstractEntity {
  @Column()
  status: CasesStatus;

  @Column()
  courtLocation: string;

  @Column()
  courtDate: Date;

  @ManyToOne(() => Profile, (lawyer) => lawyer.id, {
    cascade: true,
    eager: true,
  })
  lawyer: Profile;

  @OneToOne(() => Profile, (poacher) => poacher.id, {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  poacher: Profile;
}
