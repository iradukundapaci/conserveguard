import { Controller, Body, Param, Query } from "@nestjs/common";
import { ScheduleService } from "./schedule.service";
import {
  ApiRequestBody,
  DeleteOperation,
  GetOperation,
  OkResponse,
  PatchOperation,
  PostOperation,
} from "src/__shared__/decorators";
import { CreateScheduleDto } from "./dto/create-schedule.dto";
import { ApiTags } from "@nestjs/swagger";
import { FetchScheduleDto } from "./dto/fetch-schedule.dto";
import { GenericResponse } from "src/__shared__/dto/generic-response.dto";

@Controller("schedule")
@ApiTags("Schedule")
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @PostOperation("", "Create a new schedule")
  @OkResponse()
  @ApiRequestBody(CreateScheduleDto.Input)
  async createSchedule(
    @Body()
    createScheduleDto: CreateScheduleDto.Input,
  ) {
    await this.scheduleService.createSchedule(createScheduleDto);
    return new GenericResponse("Schedule created successfully");
  }

  @PatchOperation(":id", "Update a schedule")
  async updateSchedule(
    @Param("id") id: number,
    @Body() updateScheduleDto: CreateScheduleDto.Input,
  ) {
    await this.scheduleService.updateSchedule(id, updateScheduleDto);
    return new GenericResponse("Schedule updated successfully");
  }

  @GetOperation("", "Get all schedules")
  async getAllSchedules(@Query() input: FetchScheduleDto.Input) {
    const result = await this.scheduleService.getAllSchedules(input);
    return new GenericResponse("Schedules retrieved successfully", result);
  }

  @GetOperation(":id", "Get schedule by id")
  async getScheduleById(@Param("id") id: number) {
    const result = await this.scheduleService.getScheduleById(id);
    return new GenericResponse("Schedule retrieved successfully", result);
  }

  @DeleteOperation(":id", "Delete a schedule")
  async deleteSchedule(@Param("id") id: number) {
    await this.scheduleService.deleteSchedule(id);
    return { message: "Schedule deleted successfully" };
  }
}
