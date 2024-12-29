import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class GenerateReportDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  type: ReportType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  format: ReportFormat;

  startDate?: Date;
  endDate?: Date;
}
export enum ReportType {
  "weekly" = "weekly",
  "monthly" = "monthly",
}

export enum ReportFormat {
  "csv" = "csv",
  "json" = "json",
  "xlsx" = "xlsx",
  "pdf" = "pdf",
}
