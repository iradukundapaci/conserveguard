import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { WeekDays } from "../enums/week-day.enum";

export namespace CreateScheduleDto {
  export class Input {
    @IsString()
    @IsNotEmpty()
    weekDay: WeekDays;

    @IsString()
    @IsNotEmpty()
    dutyStart: string;

    @IsString()
    @IsNotEmpty()
    dutyEnd: string;

    @IsString()
    @IsNotEmpty()
    task: string;

    @IsNumber()
    @IsNotEmpty()
    groupId: number;
  }
}
