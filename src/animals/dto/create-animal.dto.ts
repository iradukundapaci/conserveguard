import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export namespace CreateAnimalDto {
  export class Input {
    @IsString()
    @IsNotEmpty()
    names: string;

    @IsString()
    @IsNotEmpty()
    species: string;

    @IsNumber()
    @IsNotEmpty()
    latitude: number;

    @IsNumber()
    @IsNotEmpty()
    longitude: number;
  }
}
