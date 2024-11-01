import { Controller, Body, Param, Query } from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import {
  ApiRequestBody,
  CreatedResponse,
  DeleteOperation,
  ErrorResponses,
  ForbiddenResponse,
  GetOperation,
  OkResponse,
  PaginatedOkResponse,
  PatchOperation,
  PostOperation,
  UnauthorizedResponse,
} from "src/__shared__/decorators";
import { Authorize } from "src/auth/decorators/authorize.decorator";
import { JwtGuard } from "src/auth/guards/jwt.guard";
import { UserRole } from "src/__shared__/enums/user-role.enum";
import { FetchTaskDto } from "./dto/fetch-task.dto";
import { GenericResponse } from "src/__shared__/dto/generic-response.dto";
import { plainToInstance } from "class-transformer";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Tasks")
@Controller("tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @PostOperation("", "Create new task")
  @CreatedResponse()
  @Authorize(JwtGuard, UserRole.ADMIN)
  @ApiRequestBody(CreateTaskDto.Input)
  @ErrorResponses(UnauthorizedResponse, ForbiddenResponse)
  async createTask(@Body() createTaskDto: CreateTaskDto.Input): Promise<void> {
    return await this.tasksService.createTask(createTaskDto);
  }

  @GetOperation("", "Get all tasks")
  @PaginatedOkResponse(FetchTaskDto.Output)
  @Authorize(JwtGuard)
  @ApiRequestBody(FetchTaskDto.Input)
  @ErrorResponses(UnauthorizedResponse)
  async getAllTasks(
    @Query() fetchTaskDto: FetchTaskDto.Input,
  ): Promise<GenericResponse<FetchTaskDto.Output>> {
    const result = await this.tasksService.findAllTasks(fetchTaskDto);
    return new GenericResponse("Tasks retrieved successfully", result);
  }

  @GetOperation(":id", "Get task by id")
  @OkResponse(CreateTaskDto.Output)
  @Authorize(JwtGuard, UserRole.ADMIN)
  @ErrorResponses(UnauthorizedResponse, ForbiddenResponse)
  async getCustomer(
    @Param("id") id: number,
  ): Promise<GenericResponse<CreateTaskDto.Output>> {
    const task = await this.tasksService.findTaskById(id);
    const outPut = plainToInstance(CreateTaskDto.Output, task);
    return new GenericResponse("Task retrieved successfully", outPut);
  }

  @PatchOperation(":id", "Update task")
  @OkResponse(UpdateTaskDto.Output)
  @Authorize(JwtGuard, UserRole.ADMIN)
  @ApiRequestBody(UpdateTaskDto.Input)
  @ErrorResponses(UnauthorizedResponse, ForbiddenResponse)
  async updateCustomer(
    @Param("id") id: number,
    @Body() updateTaskDto: UpdateTaskDto.Input,
  ): Promise<GenericResponse<UpdateTaskDto.Output>> {
    const task = await this.tasksService.updateTaskById(id, updateTaskDto);
    const outPut = plainToInstance(UpdateTaskDto.Output, task);
    return new GenericResponse("Task updated successfully", outPut);
  }

  @DeleteOperation(":id", "Delete task")
  @OkResponse()
  @Authorize(JwtGuard, UserRole.ADMIN)
  @ErrorResponses(UnauthorizedResponse, ForbiddenResponse)
  async removeCustomer(@Param("id") id: number): Promise<void> {
    return await this.tasksService.removeTaskById(id);
  }
}
