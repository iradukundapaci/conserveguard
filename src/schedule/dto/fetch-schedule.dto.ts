import { IsOptional } from "class-validator";
import { PaginationDto } from "src/__shared__/dto/pagination.dto";
import { WeekDays } from "../enums/week-day.enum";

export namespace FetchScheduleDto {
  export class Input extends PaginationDto {
    @IsOptional()
    groupId?: number;

    @IsOptional()
    weekDay?: WeekDays;
  }
}
