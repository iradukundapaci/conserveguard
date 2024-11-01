import { IsOptional } from "class-validator";
import { PaginationDto } from "src/__shared__/dto/pagination.dto";
import { TaskStatus } from "src/__shared__/enums/task-status.enum";
import { UserRole } from "src/__shared__/enums/user-role.enum";

export namespace FetchTaskDto {
  export class Input extends PaginationDto {
    @IsOptional()
    q?: string;
  }

  export class Output {
    description: string;
    status: TaskStatus;
    role: UserRole;
    taskStartDate: Date;
    taskEndDate: Date;
  }
}
