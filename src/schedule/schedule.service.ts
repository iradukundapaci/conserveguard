import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Schedule } from "./entities/schedule.entity";
import { Group } from "src/group/entities/group.entity";
import { CreateScheduleDto } from "./dto/create-schedule.dto";
import { FetchScheduleDto } from "./dto/fetch-schedule.dto";
import { paginate } from "nestjs-typeorm-paginate";

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
  ) {}

  async createSchedule(data: CreateScheduleDto.Input): Promise<Schedule> {
    const schedule = this.scheduleRepository.create(data);
    const group = await this.groupRepository.findOneBy({ id: data.groupId });

    if (!group) throw new Error("Group not found");
    schedule.group = group;
    return this.scheduleRepository.save(schedule);
  }

  async updateSchedule(id: number, updateScheduleDto: CreateScheduleDto.Input) {
    const schedule = await this.scheduleRepository.preload({
      id,
      ...updateScheduleDto,
    });

    if (!schedule) {
      throw new Error("Schedule not found");
    }

    const group = await this.groupRepository.findOneBy({
      id: updateScheduleDto.groupId,
    });

    if (!group) {
      throw new Error("Group not found");
    }

    schedule.group = group;

    return this.scheduleRepository.save(schedule);
  }

  async getAllSchedules(input: FetchScheduleDto.Input) {
    const querriBuilder = this.scheduleRepository
      .createQueryBuilder("schedule")
      .leftJoinAndSelect("schedule.group", "group")
      .select([
        "schedule.id",
        "schedule.weekDay",
        "schedule.dutyStart",
        "schedule.dutyEnd",
        "schedule.task",
        "group.id",
        "group.name",
      ])
      .orderBy("schedule.weekDay", "ASC");

    if (input.groupId) {
      querriBuilder.andWhere("schedule.groupId = :groupId", {
        groupId: input.groupId,
      });
    }

    if (input.weekDay) {
      querriBuilder.andWhere("schedule.weekDay = :weekDay", {
        weekDay: input.weekDay,
      });
    }

    return await paginate(querriBuilder, {
      page: input.page,
      limit: input.size,
    });
  }

  async getScheduleById(id: number): Promise<Schedule> {
    return this.scheduleRepository.findOne({
      where: { id },
      relations: ["group"],
    });
  }

  async assignGroupToSchedule(
    scheduleId: number,
    groupId: number,
  ): Promise<Schedule> {
    const schedule = await this.scheduleRepository.findOneBy({
      id: scheduleId,
    });
    if (!schedule) throw new Error("Schedule not found");

    const group = await this.groupRepository.findOneBy({ id: groupId });
    if (!group) throw new Error("Group not found");

    schedule.group = group;
    return this.scheduleRepository.save(schedule);
  }

  async deleteSchedule(id: number): Promise<void> {
    await this.scheduleRepository.delete(id);
  }
}
