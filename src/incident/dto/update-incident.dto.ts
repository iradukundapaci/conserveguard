import { PartialType } from "@nestjs/swagger";
import { CreateIncidentDto } from "./create-incident.dto";

export namespace UpdateIncidentDto {
  export class Input extends PartialType(CreateIncidentDto.Input) {}
}
