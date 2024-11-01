import { Injectable } from "@nestjs/common";
import { CreateLicenseDto } from "./dto/create-license.dto";
import { UpdateLicenseDto } from "./dto/update-license.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { License } from "./entities/license.entity";
import { plainToInstance } from "class-transformer";
import { paginate } from "nestjs-typeorm-paginate";
import { FetchLicenseDto } from "./dto/fetch-license.dto";

@Injectable()
export class LicenseService {
  constructor(
    @InjectRepository(License)
    private readonly licenseRepository: Repository<License>,
  ) {}

  async createLicense(createLicenseDto: CreateLicenseDto.Input): Promise<void> {
    const license = plainToInstance(License, createLicenseDto);
    await this.licenseRepository.save(license);
  }

  async findAllLicense(dto: FetchLicenseDto.Input): Promise<any> {
    const queryBuilder = this.licenseRepository
      .createQueryBuilder("license")
      .orderBy("license.id", "DESC")
      .select([
        "license.id",
        "license.title",
        "license.description",
        "license.documentUrl",
        "license.issueDate",
      ]);

    if (dto.q) {
      queryBuilder.andWhere(
        "license.title ilike :searchKey OR license.description ilike :searchKey",
        {
          searchKey: `%${dto.q}%`,
        },
      );
    }

    return await paginate<License>(queryBuilder, {
      page: dto.page,
      limit: dto.size,
    });
  }

  async findLicenseById(id: number): Promise<License> {
    const license = await this.licenseRepository.findOne({
      where: { id },
    });
    if (!license) {
      throw new Error("License not found");
    }
    return license;
  }

  async updateLicenseById(
    id: number,
    updateLicenseDto: UpdateLicenseDto.Input,
  ): Promise<License> {
    const license = await this.findLicenseById(id);
    const updatedLicense = plainToInstance(License, {
      ...license,
      ...updateLicenseDto,
    });
    await this.licenseRepository.save(updatedLicense);
    return updatedLicense;
  }

  async removeTaskById(id: number) {
    const license = await this.findLicenseById(id);

    if (!license) {
      throw new Error("License not found");
    }

    await this.licenseRepository.remove(license);
  }
}
