import { IsNotEmpty, IsString } from "class-validator";

export namespace CreateAnimalDto {
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
}
