import { IsOptional } from "class-validator";
import { PaginationDto } from "src/__shared__/dto/pagination.dto";
import { CasesStatus } from "../enum/case-status.enum";

export namespace FetchCaseDto {
  export class Input extends PaginationDto {
    @IsOptional()
    q?: string;
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
