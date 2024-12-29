import { IsNotEmpty, IsString, IsOptional } from "class-validator";

export namespace CreateIncidentDto {
  export class Input {
    @IsString()
    @IsNotEmpty()
    poacherName: string;

    @IsString()
    @IsNotEmpty()
    dateCaught: Date;

    @IsString()
    @IsOptional()
    description: string;

    @IsString()
    @IsOptional()
    reportingUserId: string;
  }
}
