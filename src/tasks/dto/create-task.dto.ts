import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { TaskStatus } from "src/__shared__/enums/task-status.enum";
import { UserRole } from "src/__shared__/enums/user-role.enum";

export namespace CreateTaskDto {
  export class Input {
    @IsString()
    @IsNotEmpty()
    description: string;

    @IsEnum(TaskStatus)
    @IsNotEmpty()
    status: TaskStatus;

    @IsNotEmpty()
    @IsEnum(UserRole)
    role: UserRole;

    @IsString()
    @IsNotEmpty()
    taskStartDate: Date;

    @IsString()
    @IsNotEmpty()
    taskEndDate: Date;
  }

  export class Output {
    id: number;
    description: string;
    status: TaskStatus;
    role: UserRole;
    taskStartDate: Date;
    taskEndDate: Date;
  }
}
