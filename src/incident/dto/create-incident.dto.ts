import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { IncidentStatus } from "src/__shared__/enums/incident-status.enum";

export namespace CreateIncidentDto {
  export class Input {
    @IsString()
    @IsNotEmpty()
    location: string;

    @IsString()
    @IsNotEmpty()
    dateCaught: Date;

    @IsEnum(IncidentStatus)
    @IsNotEmpty()
    status: IncidentStatus;

    @IsString()
    @IsNotEmpty()
    poacher: string;
  }
}
