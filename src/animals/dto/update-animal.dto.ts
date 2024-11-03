import { IsString, IsNotEmpty } from "class-validator";

export namespace UpdateAnimalDto {
  export class Input {
    @IsString()
    @IsNotEmpty()
    names: string;

    @IsString()
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
