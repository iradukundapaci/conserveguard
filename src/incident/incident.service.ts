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
    id: number,
    createIncidentDto: CreateIncidentDto.Input,
    files: string[],
  ): Promise<void> {
    const reportingUser = await this.userService.findUserById(id);

    if (!reportingUser) {
      throw new NotFoundException("Reporting user not found");
    }

    const incident = plainToInstance(Incident, {
      ...createIncidentDto,
    });
    incident.ranger = reportingUser;
    incident.evidence = files;

    await this.incidentRepository.save(incident);
  }

  async findAllIncident(dto: FetchIncidentDto.Input): Promise<any> {
    const queryBuilder = this.incidentRepository
      .createQueryBuilder("incidents")
      .leftJoinAndSelect("incidents.ranger", "ranger")
      .select([
        "incidents.id",
        "incidents.dateCaught",
        "incidents.description",
        "incidents.evidence",
        "incidents.createdAt",
        "incidents.updatedAt",
        "ranger.id",
        "ranger.names",
      ])
      .orderBy("incidents.id", "DESC");

    return await paginate(queryBuilder, {
      page: dto.page,
      limit: dto.size,
    });
  }

  async findIncidentById(id: number): Promise<Incident> {
    const incident = await this.incidentRepository.findOne({
      where: { id },
      relations: ["ranger"],
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

    const updatedIncident = plainToInstance(Incident, {
      ...incident,
      ...updateIncidentDto,
    });

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
