import {
  Injectable,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToInstance } from "class-transformer";
import { paginate } from "nestjs-typeorm-paginate";
import { Repository } from "typeorm";
import { AnimalDto } from "./dto/animals.dto";
import { CreateAnimalDto } from "./dto/create-animal.dto";
import { FetchAnimalDto } from "./dto/fetch-animal.dto";
import { UpdateAnimalDto } from "./dto/update-animal.dto";
import { Animals } from "./entities/animals.entity";

@Injectable()
export class AnimalsService {
  constructor(
    @InjectRepository(Animals)
    private readonly animalsRepository: Repository<Animals>,
  ) {}
  async createAnimal(createAnimalDto: CreateAnimalDto.Input): Promise<void> {
    const animal = await this.animalsRepository.findOne({
      where: { names: createAnimalDto.names },
    });

    if (animal) {
      throw new ConflictException("Animal already exists");
    }

    const newAnimal = plainToInstance(Animals, {
      ...createAnimalDto,
    });

    await this.animalsRepository.save(newAnimal);
  }

  async findAllAnimal(dto: FetchAnimalDto.Input): Promise<any> {
    const queryBuilder = this.animalsRepository
      .createQueryBuilder("animals")
      .orderBy("animal.id", "DESC");

    if (dto.q) {
      queryBuilder.andWhere(
        "animals.names ilike :searchKey OR animals.email ilike :searchKey",
        {
          searchKey: `%${dto.q}%`,
        },
      );
    }

    return await paginate<Animals>(queryBuilder, {
      page: dto.page,
      limit: dto.size,
    });
  }

  async findanimalById(id: number): Promise<Animals> {
    const animal = await this.animalsRepository.findOne({
      where: { id },
    });

    if (!animal) {
      throw new NotFoundException("Animals not found");
    }

    return animal;
  }

  async updateAnimalById(
    id: number,
    updateAnimalDto: UpdateAnimalDto.Input,
  ): Promise<AnimalDto.Output> {
    const animal = await this.findanimalById(id);

    if (!animal) {
      throw new NotFoundException("Animal not found");
    }

    let updatedAnimal = plainToInstance(Animals, {
      ...animal,
      ...updateAnimalDto,
    });

    updatedAnimal = await this.animalsRepository.save(updatedAnimal);
    return plainToInstance(AnimalDto.Output, updatedAnimal);
  }

  async removeAnimalById(id: number): Promise<void> {
    const animal = await this.findanimalById(id);
    if (!animal) {
      throw new NotFoundException("Animal not found");
    }

    await this.animalsRepository.remove(animal);
  }

  async findAnimalByName(names: string): Promise<Animals | undefined> {
    return await this.animalsRepository.findOne({
      where: { names },
    });
  }
}
