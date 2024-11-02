import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { CasesStatus } from "../enum/case-status.enum";

export namespace CreateCaseDto {
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
