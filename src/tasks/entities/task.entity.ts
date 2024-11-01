import { AbstractEntity } from "src/__shared__/entities/abstract.entity";
import { TaskStatus } from "src/__shared__/enums/task-status.enum";
import { UserRole } from "src/__shared__/enums/user-role.enum";
import { Column, Entity } from "typeorm";

@Entity({ name: "tasks" })
export class Task extends AbstractEntity {
  @Column()
  description: string;

  @Column()
  status: TaskStatus;

  @Column()
  role: UserRole;

  @Column()
  taskStartDate: Date;

  @Column()
  taskEndDate: Date;
}
