import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsUUID,
} from "class-validator";
import { Type } from "class-transformer";
import { IncidentStatus } from "src/__shared__/enums/incident-status.enum";

export namespace CreateIncidentDto {
  export class Evidence {
    @IsString()
    @IsNotEmpty()
    type: string;

    @IsString()
    @IsNotEmpty()
    url: string;
  }

  export class Input {
    @IsString()
    @IsNotEmpty()
    location: string;

    @IsString()
    @IsNotEmpty()
    poacherName: string;

    @IsString()
    @IsNotEmpty()
    poacherPhone: string;

    @IsString()
    @IsNotEmpty()
    dateCaught: Date;

    @IsEnum(IncidentStatus)
    @IsNotEmpty()
    status: IncidentStatus;

    @IsString()
    @IsOptional()
    description?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Evidence)
    @IsOptional()
    evidence?: Evidence[];

    @IsUUID()
    @IsOptional()
    reportingUserId?: string;
  }
}
