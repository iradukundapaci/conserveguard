import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToInstance } from "class-transformer";
import { paginate } from "nestjs-typeorm-paginate";
import { Repository } from "typeorm";
import { CreateCaseDto } from "./dto/create-case.dto";
import { FetchCaseDto } from "./dto/fetch-case.dto";
import { UpdateCaseDto } from "./dto/update-case.dto";
import { Cases } from "./entities/cases.entity";
import { UsersService } from "src/users/users.service";

@Injectable()
export class CasesService {
  constructor(
    @InjectRepository(Cases)
    private readonly casesRepository: Repository<Cases>,
    private readonly userService: UsersService,
  ) {}
  async createCase(createCaseDto: CreateCaseDto.Input): Promise<void> {
    const result = plainToInstance(Cases, createCaseDto);
    const lawyer = await this.userService.findProfileById(
      +createCaseDto.lawyer,
    );
    const poacher = await this.userService.findProfileById(
      +createCaseDto.poacher,
    );

    if (!lawyer || !poacher) {
      throw new NotFoundException("Lawyer or poacher not found");
    }
    result.lawyer = lawyer;
    result.poacher = poacher;
    await this.casesRepository.save(result);
  }

  async findAllCases(dto: FetchCaseDto.Input): Promise<any> {
    const queryBuilder = this.casesRepository
      .createQueryBuilder("cases")
      .leftJoinAndSelect("cases.lawyer", "lawyer")
      .leftJoinAndSelect("cases.poacher", "poacher")
      .orderBy("cases.id", "DESC");

    if (dto.q) {
      queryBuilder.andWhere(
        "cases.description ilike :searchKey OR cases.status ilike :searchKey",
        {
          searchKey: `%${dto.q}%`,
        },
      );
    }

    return await paginate(queryBuilder, {
      page: dto.page,
      limit: dto.size,
    });
  }

  async findCaseById(id: number): Promise<Cases> {
    const result = await this.casesRepository.findOne({
      where: { id },
    });

    if (!result) {
      throw new NotFoundException("Case not found");
    }
    return result;
  }

  async updateCaseById(
    id: number,
    updateCaseDto: UpdateCaseDto.Input,
  ): Promise<Cases> {
    const result = await this.findCaseById(id);
    const updatedCase = plainToInstance(Cases, {
      ...result,
      ...updateCaseDto,
    });
    await this.casesRepository.save(updatedCase);
    return updatedCase;
  }

  async removeCaseById(id: number) {
    const result = await this.findCaseById(id);

    if (!result) {
      throw new NotFoundException("Case not found");
    }

    await this.casesRepository.softRemove(result);
  }
}
