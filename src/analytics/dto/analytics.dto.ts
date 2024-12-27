import { ApiProperty } from "@nestjs/swagger";

export class GroupAssignment {
  @ApiProperty()
  groupId: number;

  @ApiProperty()
  shifts: number;
}

export class GroupSize {
  @ApiProperty()
  groupId: number;

  @ApiProperty()
  size: number;
}

export class IncidentTimeData {
  @ApiProperty()
  date: string;

  @ApiProperty()
  count: number;
}

export class AnalyticsOutput {
  @ApiProperty()
  totalUsers: number;

  @ApiProperty({ type: "object", additionalProperties: { type: "number" } })
  usersByRole: Record<string, number>;

  @ApiProperty()
  assignedUsers: number;

  @ApiProperty()
  unassignedUsers: number;

  @ApiProperty({ type: "object", additionalProperties: { type: "number" } })
  shiftsPerDay: Record<string, number>;

  @ApiProperty({ type: () => [GroupAssignment] })
  groupAssignments: GroupAssignment[];

  @ApiProperty()
  totalGroups: number;

  @ApiProperty({ type: () => [GroupSize] })
  groupSizes: GroupSize[];

  @ApiProperty()
  totalAnimals: number;

  @ApiProperty({ type: "object", additionalProperties: { type: "number" } })
  animalsByType: Record<string, number>;

  @ApiProperty()
  totalIncidents: number;

  @ApiProperty({ type: "object", additionalProperties: { type: "number" } })
  incidentsByStatus: Record<string, number>;

  @ApiProperty({ type: () => [IncidentTimeData] })
  incidentsOverTime: IncidentTimeData[];
}

export namespace AnalyticsDto {
  export class Output extends AnalyticsOutput {}
}
