import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from "class-validator";
import { UserRole } from "src/__shared__/enums/user-role.enum";

/** Sign up DTO */
export namespace SignupDto {
  export class Input {
    @IsString()
    @IsNotEmpty()
    names: string;

    @IsEnum(UserRole)
    @IsNotEmpty()
    role: UserRole;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsStrongPassword({
      minLength: 8,
    })
    password: string;
  }
}
