import { PartialType } from "@nestjs/swagger";
import { JobStatus } from "src/__shared__/enums/job-status.enum";
import { CreateIncidentDto } from "./create-incident.dto";

export namespace UpdateIncidentDto {
  export class Input extends PartialType(CreateIncidentDto.Input) {}
  export class OutPut {
    id: number;
    title: string;
    description: string;
    status: JobStatus;
    resolution: string;
  }
}
