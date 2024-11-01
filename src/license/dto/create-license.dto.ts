import { IsNotEmpty, IsString } from "class-validator";

export namespace CreateLicenseDto {
  export class Input {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    url: File;

    @IsString()
    @IsNotEmpty()
    issueDate: string;
  }

  export class Output {
    title: string;
    description: string;
    documentUrl: string;
    issueDate: Date;
  }
}
