import { IsOptional } from "class-validator";
import { PaginationDto } from "src/__shared__/dto/pagination.dto";
import { UserRole } from "src/__shared__/enums/user-role.enum";

export namespace FetchProfileDto {
  export class Input extends PaginationDto {
    @IsOptional()
    role?: UserRole;

    @IsOptional()
    hasNoGroup?: string;

    @IsOptional()
    q?: string;
  }
  export class Output {
    id: number;
    names: string;
    email: string;
    role: UserRole;
    profileImage: string;
  }
}
