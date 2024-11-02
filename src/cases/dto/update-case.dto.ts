import { IsNotEmpty, IsEnum, IsString } from "class-validator";
import { CasesStatus } from "../enum/case-status.enum";

export namespace UpdateCaseDto {
  export class Input {
    @IsEnum(CasesStatus)
    @IsNotEmpty()
    status: CasesStatus;

    @IsNotEmpty()
    @IsString()
    courtLocation: string;

    @IsNotEmpty()
    @IsString()
    courtDate: Date;

    @IsNotEmpty()
    @IsString()
    lawyer: string;

    @IsString()
    @IsNotEmpty()
    poacher: string;
  }

  export class Output {
    id: number;
    status: CasesStatus;
    courtLocation: string;
    courtDate: Date;
    lawyer: string;
    poacher: string;
  }
}
