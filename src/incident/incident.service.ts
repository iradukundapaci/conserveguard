import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateIncidentDto } from "./dto/create-incident.dto";
import { Incident } from "./entities/incident.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToInstance } from "class-transformer";
import { paginate } from "nestjs-typeorm-paginate";
import { UsersService } from "src/users/users.service";
import { Repository } from "typeorm";
import { FetchIncidentDto } from "./dto/fetch-incident.dto";
import { UpdateIncidentDto } from "./dto/update-incident.dto";

@Injectable()
export class IncidentService {
  constructor(
    @InjectRepository(Incident)
    private readonly incidentRepository: Repository<Incident>,
    private readonly userService: UsersService,
  ) {}

  async createIncident(
    userId: number,
    createIncidentDto: CreateIncidentDto.Input,
  ): Promise<void> {
    const reportingUser = await this.userService.findUserById(userId);

    if (!reportingUser) {
      throw new NotFoundException("Reporting user not found");
    }

    const { evidence, ...incidentData } = createIncidentDto;

    const incident = plainToInstance(Incident, {
      ...incidentData,
      reportingUser,
    });

    if (evidence?.length) {
      incident.evidence = evidence.map((item) => ({
        type: item.type,
        url: item.url,
      }));
    }

    await this.incidentRepository.save(incident);
  }

  async findAllIncident(dto: FetchIncidentDto.Input): Promise<any> {
    const queryBuilder = this.incidentRepository
      .createQueryBuilder("incidents")
      .leftJoinAndSelect("incidents.reportingUser", "reportingUser")
      .orderBy("incidents.id", "DESC");

    return await paginate(queryBuilder, {
      page: dto.page,
      limit: dto.size,
    });
  }

  async findIncidentById(id: number): Promise<Incident> {
    const incident = await this.incidentRepository.findOne({
      where: { id },
      relations: ["reportingUser"],
    });
    if (!incident) {
      throw new NotFoundException("Incident not found");
    }
    return incident;
  }

  async updateIncidentById(
    id: number,
    updateIncidentDto: UpdateIncidentDto.Input,
  ): Promise<Incident> {
    const incident = await this.findIncidentById(id);

    const { evidence, ...updateData } = updateIncidentDto;

    const updatedIncident = plainToInstance(Incident, {
      ...incident,
      ...updateData,
    });

    if (evidence?.length) {
      updatedIncident.evidence = evidence.map((item) => ({
        type: item.type,
        url: item.url,
      }));
    }

    await this.incidentRepository.save(updatedIncident);
    return updatedIncident;
  }

  async removeIncidentById(id: number): Promise<void> {
    const incident = await this.findIncidentById(id);

    if (!incident) {
      throw new NotFoundException("Incident not found");
    }

    await this.incidentRepository.remove(incident);
  }
}
