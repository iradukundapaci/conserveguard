import { IsEmail, IsNotEmpty, IsString } from "class-validator";

/** Sign in DTO */
export namespace SignInDto {
  export class Input {
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
  }

  export class Output {
    accessToken: string;
    refreshToken: string;

    constructor(accessToken: string, refreshToken: string) {
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
    }
  }
}
