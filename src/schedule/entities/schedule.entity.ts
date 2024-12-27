import { AbstractEntity } from "src/__shared__/entities/abstract.entity";
import { Group } from "src/group/entities/group.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { WeekDays } from "../enums/week-day.enum";

@Entity()
export class Schedule extends AbstractEntity {
  @Column()
  weekDay: WeekDays;

  @Column({
    type: "time",
  })
  dutyStart: string;

  @Column({
    type: "time",
  })
  dutyEnd: string;

  @Column()
  task: string;

  @ManyToOne(() => Group, (group) => group.id)
  group: Group;
}
