import { IsString, IsNotEmpty, IsEmail } from "class-validator";

export namespace UpdateAnimalDto {
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
  export class Output {
    names: string;
    location: string;
    tips: string;
  }
}
