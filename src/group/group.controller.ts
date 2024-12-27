import { Controller, Body, Param, Query } from "@nestjs/common";
import { GroupService } from "./group.service";
import {
  DeleteOperation,
  GetOperation,
  PatchOperation,
  PostOperation,
} from "src/__shared__/decorators";
import { ApiTags } from "@nestjs/swagger";
import { FetchGroupDto } from "./dto/fetch-group.dto";
import { GenericResponse } from "src/__shared__/dto/generic-response.dto";

@Controller("groups")
@ApiTags("Groups")
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @PostOperation("", "Create a new group")
  async createGroup(@Body("name") name: string) {
    await this.groupService.createGroup(name);
    return new GenericResponse("Group created successfully");
  }

  @PatchOperation(":id", "Update group by id")
  async updateGroup(@Param("id") id: number, @Body("name") name: string) {
    await this.groupService.updateGroup(id, name);
    return new GenericResponse("Group updated successfully");
  }

  @PostOperation(":groupId/assign-users", "Add ranger to group")
  async addRangerToGroup(
    @Param("groupId") groupId: number,
    @Body("userIds") rangerIds: number[],
  ) {
    await this.groupService.addRangersToGroup(groupId, rangerIds);
    return new GenericResponse("Ranger added to group successfully");
  }

  @GetOperation("", "Get all groups")
  async getAllGroups(@Query() input: FetchGroupDto.Input) {
    const result = await this.groupService.getAllGroups(input);
    return new GenericResponse("Groups retrieved successfully", result);
  }

  @GetOperation(":id", "Get group by id")
  async getGroupById(@Param("id") id: number) {
    const result = await this.groupService.getGroupById(id);
    return new GenericResponse("Group retrieved successfully", result);
  }

  @DeleteOperation(":id", "Delete group by id")
  async deleteGroup(@Param("id") id: number) {
    await this.groupService.deleteGroup(id);
    return new GenericResponse("Group deleted successfully");
  }
}
