import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Group } from "./entities/group.entity";
import { UsersService } from "src/users/users.service";
import { paginate, Pagination } from "nestjs-typeorm-paginate";
import { FetchGroupDto } from "./dto/fetch-group.dto";

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    private readonly userService: UsersService,
  ) {}

  async createGroup(name: string): Promise<Group> {
    const group = this.groupRepository.create({ name });
    return this.groupRepository.save(group);
  }

  async getAllGroups(input: FetchGroupDto.Input): Promise<Pagination<Group>> {
    const queryBuilder = this.groupRepository
      .createQueryBuilder("groups")
      .select(["groups.id", "groups.name"])
      .loadRelationCountAndMap(
        "groups.rangersCount",
        "groups.rangers",
        "rangers",
      )
      .orderBy("groups.name", "ASC");

    return await paginate<Group>(queryBuilder, {
      page: input.page,
      limit: input.size,
    });
  }
  async getGroupById(id: number): Promise<Group> {
    return this.groupRepository.findOne({
      where: { id },
      relations: ["rangers"],
    });
  }

  async deleteGroup(id: number): Promise<void> {
    await this.groupRepository.delete(id);
  }

  async updateGroup(id: number, name: string) {
    const group = await this.groupRepository.findOne({ where: { id } });
    group.name = name;
    return this.groupRepository.save(group);
  }

  async addRangersToGroup(groupId: number, rangerIds: number[]) {
    const group = await this.groupRepository.findOne({
      where: { id: groupId },
      relations: ["rangers"],
    });
    if (!group) {
      throw new Error("Group not found.");
    }

    const rangers = await Promise.all(
      rangerIds.map((id) => this.userService.findUserById(id)),
    );
    group.rangers = [...group.rangers, ...rangers];
    await this.groupRepository.save(group);
  }
}
