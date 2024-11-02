import { PartialType } from "@nestjs/swagger";
import { CreateIncidentDto } from "./create-incident.dto";
import { IncidentStatus } from "src/__shared__/enums/incident-status.enum";

export namespace UpdateIncidentDto {
  export class Input extends PartialType(CreateIncidentDto.Input) {}
  export class OutPut {
    id: number;
    location: string;
    dateCaught: string;
    status: IncidentStatus;
    poacher: string;
  }
}
