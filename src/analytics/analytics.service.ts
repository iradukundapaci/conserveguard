import { Injectable } from "@nestjs/common";
import { EntityManager, IsNull, Not } from "typeorm";
import {
  AnalyticsDto,
  GroupAssignment,
  GroupSize,
  IncidentTimeData,
} from "./dto/analytics.dto";
import { User } from "../users/entities/user.entity";
import { Schedule } from "../schedule/entities/schedule.entity";
import { Group } from "../group/entities/group.entity";
import { Animals } from "../animals/entities/animals.entity";
import { Incident } from "../incident/entities/incident.entity";

@Injectable()
export class AnalyticsService {
  constructor(private readonly entityManager: EntityManager) {}

  async getAnalytics(): Promise<AnalyticsDto.Output> {
    // Users analytics
    const users = await this.entityManager.find(User, {
      relations: { group: true },
    });

    const totalUsers = users.length;

    const usersByRole = users.reduce(
      (acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const assignedUsers = await this.entityManager.count(User, {
      where: { group: Not(IsNull()) },
    });
    const unassignedUsers = totalUsers - assignedUsers;

    // Schedule analytics
    const schedules = await this.entityManager.find(Schedule, {
      relations: { group: true },
    });

    const shiftsPerDay = schedules.reduce(
      (acc, schedule) => {
        acc[schedule.weekDay] = (acc[schedule.weekDay] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const groupAssignments: GroupAssignment[] = schedules.reduce(
      (acc, schedule) => {
        if (!schedule.group) return acc;
        const groupId = schedule.group.id;
        const existingGroup = acc.find((g) => g.groupId === groupId);
        if (existingGroup) {
          existingGroup.shifts++;
        } else {
          acc.push({ groupId, shifts: 1 });
        }
        return acc;
      },
      [] as GroupAssignment[],
    );

    // Groups analytics
    const groups = await this.entityManager.find(Group, {
      relations: { rangers: true },
    });

    const totalGroups = groups.length;

    const groupSizes: GroupSize[] = groups.map((group) => ({
      groupId: group.id,
      size: group.rangers?.length || 0,
    }));

    // Animals analytics
    const animals = await this.entityManager.find(Animals);

    const totalAnimals = animals.length;

    const animalsByType = animals.reduce(
      (acc, animal) => {
        acc[animal.names] = (acc[animal.names] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Incidents analytics
    const incidents = await this.entityManager.find(Incident, {
      order: { dateCaught: "ASC" },
    });

    const totalIncidents = incidents.length;

    const incidentsByStatus = incidents.reduce(
      (acc, incident) => {
        acc[incident.status] = (acc[incident.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const incidentsOverTime: IncidentTimeData[] = incidents.reduce(
      (acc, incident) => {
        const date = incident.dateCaught.toISOString().split("T")[0];
        const existingDate = acc.find((d) => d.date === date);
        if (existingDate) {
          existingDate.count++;
        } else {
          acc.push({ date, count: 1 });
        }
        return acc;
      },
      [] as IncidentTimeData[],
    );

    return {
      totalUsers,
      usersByRole,
      assignedUsers,
      unassignedUsers,
      shiftsPerDay,
      groupAssignments,
      totalGroups,
      groupSizes,
      totalAnimals,
      animalsByType,
      totalIncidents,
      incidentsByStatus,
      incidentsOverTime,
    };
  }
}
