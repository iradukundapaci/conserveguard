import { IsNotEmpty, IsString, IsOptional } from "class-validator";
import { IncidentStatus } from "src/__shared__/enums/incident-status.enum";

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
    status?: IncidentStatus;

    @IsString()
    @IsOptional()
    description: string;
  }
}
