import { IsEmail, IsNotEmpty } from "class-validator";

/** Forgot password DTO */
export namespace ForgotPasswordDto {
  export class Input {
    @IsNotEmpty()
    @IsEmail()
    email: string;
  }
}
