import { PartialType } from "@nestjs/swagger";
import { CreateLicenseDto } from "./create-license.dto";

export namespace UpdateLicenseDto {
  export class Input extends PartialType(CreateLicenseDto.Input) {}
  export class Output {
    title: string;
    description: string;
    documentUrl: string;
    issueDate: Date;
  }
}
