import { IsOptional } from "class-validator";
import { PaginationDto } from "src/__shared__/dto/pagination.dto";

export namespace FetchGroupDto {
  export class Input extends PaginationDto {
    @IsOptional()
    userId?: number;
  }
}
