import { IsNotEmpty, IsEnum, IsString } from "class-validator";
import { TaskStatus } from "src/__shared__/enums/task-status.enum";
import { UserRole } from "src/__shared__/enums/user-role.enum";

export namespace UpdateTaskDto {
  export class Input {
    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    @IsEnum(TaskStatus)
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
    description: string;
    status: TaskStatus;
    role: UserRole;
    taskStartDate: Date;
    taskEndDate: Date;
  }
}
