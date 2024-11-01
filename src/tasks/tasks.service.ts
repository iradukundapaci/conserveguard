import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Task } from "./entities/task.entity";
import { plainToInstance } from "class-transformer";
import { FetchTaskDto } from "./dto/fetch-task.dto";
import { paginate } from "nestjs-typeorm-paginate";

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}
  async createTask(createTaskDto: CreateTaskDto.Input): Promise<void> {
    const task = plainToInstance(Task, createTaskDto);
    await this.taskRepository.save(task);
  }

  async findAllTasks(dto: FetchTaskDto.Input): Promise<any> {
    const queryBuilder = this.taskRepository
      .createQueryBuilder("task")
      .orderBy("task.id", "DESC")
      .select([
        "task.id",
        "task.description",
        "task.status",
        "task.role",
        "task.taskStartDate",
        "task.taskEndDate",
      ]);

    if (dto.q) {
      queryBuilder.andWhere(
        "task.description ilike :searchKey OR task.status ilike :searchKey",
        {
          searchKey: `%${dto.q}%`,
        },
      );
    }

    return await paginate<FetchTaskDto.Output>(queryBuilder, {
      page: dto.page,
      limit: dto.size,
    });
  }

  async findTaskById(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException("Task not found");
    }
    return task;
  }

  async updateTaskById(
    id: number,
    updateTaskDto: UpdateTaskDto.Input,
  ): Promise<Task> {
    const task = await this.findTaskById(id);
    const updatedTask = plainToInstance(Task, {
      ...task,
      ...updateTaskDto,
    });
    await this.taskRepository.save(updatedTask);
    return updatedTask;
  }

  async removeTaskById(id: number) {
    const task = await this.findTaskById(id);

    if (!task) {
      throw new NotFoundException("Task not found");
    }

    await this.taskRepository.remove(task);
  }
}
