import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export namespace CreateAnimalDto {
  export class Input {
    @IsString()
    @IsNotEmpty()
    names: string;

    @IsEmail()
    @IsNotEmpty()
    location: string;

    @IsString()
    @IsNotEmpty()
    tips: string;
  }
}
