import { IsString, IsNotEmpty, IsNumber } from "class-validator";

export namespace UpdateAnimalDto {
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
