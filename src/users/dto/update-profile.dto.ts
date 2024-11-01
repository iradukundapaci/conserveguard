import { IsString, IsEmail, IsOptional, IsEnum } from "class-validator";
import { UserRole } from "src/__shared__/enums/user-role.enum";

export namespace UpdateProfileDto {
  export class Input {
    @IsString()
    @IsOptional()
    names?: string;

    @IsEmail({}, { message: "Invalid email address" })
    @IsOptional()
    email?: string;

    @IsEnum(UserRole)
    @IsOptional()
    role?: UserRole;
  }
  export class OutPut {
    id: number;
    names: string;
    email: string;
    role: UserRole;
  }
}
