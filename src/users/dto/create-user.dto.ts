import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { UserRole } from "src/__shared__/enums/user-role.enum";

export namespace CreateUserDto {
  export class Input {
    @IsString()
    @IsNotEmpty()
    names: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @IsEnum(UserRole)
    role: UserRole;

    @IsString()
    @IsNotEmpty()
    password: string;
  }
}
