import { Controller, Body, Query, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { plainToInstance } from "class-transformer";
import {
  PostOperation,
  CreatedResponse,
  ApiRequestBody,
  ErrorResponses,
  UnauthorizedResponse,
  ForbiddenResponse,
  GetOperation,
  PaginatedOkResponse,
  OkResponse,
  PatchOperation,
  DeleteOperation,
} from "src/__shared__/decorators";
import { GenericResponse } from "src/__shared__/dto/generic-response.dto";
import { AnimalDto } from "./dto/animals.dto";
import { CreateAnimalDto } from "./dto/create-animal.dto";
import { FetchAnimalDto } from "./dto/fetch-animal.dto";
import { UpdateAnimalDto } from "./dto/update-animal.dto";
import { AnimalsService } from "./animals.service";

@ApiTags("Animals")
@Controller("animals")
export class AnimalsController {
  constructor(private readonly animalService: AnimalsService) {}

  @PostOperation("", "Create animals")
  @CreatedResponse()
  @ApiRequestBody(CreateAnimalDto.Input)
  @ErrorResponses(UnauthorizedResponse, ForbiddenResponse)
  async createAnimal(
    @Body() createAnimalDto: CreateAnimalDto.Input,
  ): Promise<GenericResponse> {
    await this.animalService.createAnimal(createAnimalDto);
    return new GenericResponse("Animal created successfully");
  }

  @GetOperation("", "Get all animals")
  @PaginatedOkResponse(FetchAnimalDto.Output)
  @ErrorResponses(UnauthorizedResponse, ForbiddenResponse)
  async getAllAnimal(
    @Query() fetchAnimalDto: FetchAnimalDto.Input,
  ): Promise<GenericResponse<FetchAnimalDto.Output>> {
    const result = await this.animalService.findAllAnimal(fetchAnimalDto);
    return new GenericResponse("Animals retrieved successfully", result);
  }

  @GetOperation(":id", "Get animal")
  @OkResponse(AnimalDto.Output)
  @ErrorResponses(UnauthorizedResponse, ForbiddenResponse)
  async getAnimal(
    @Param("id") id: number,
  ): Promise<GenericResponse<AnimalDto.Output>> {
    const animal = await this.animalService.findanimalById(id);
    const output = plainToInstance(AnimalDto.Output, animal);

    return new GenericResponse("Animal retrieved successfully", output);
  }

  @PatchOperation(":id", "Update animal")
  @OkResponse()
  @ApiRequestBody(AnimalDto.Output)
  @ErrorResponses(UnauthorizedResponse, ForbiddenResponse)
  async updateAnimal(
    @Param("id") id: number,
    @Body() updateAnimalDto: UpdateAnimalDto.Input,
  ): Promise<GenericResponse<AnimalDto.Output>> {
    let outPut = await this.animalService.updateAnimalById(id, updateAnimalDto);
    outPut = plainToInstance(AnimalDto.Output, outPut);
    return new GenericResponse("Animal updated successfully", outPut);
  }

  @DeleteOperation(":id", "Delete animal")
  @OkResponse()
  @ErrorResponses(UnauthorizedResponse, ForbiddenResponse)
  async removeAnimal(@Param("id") id: number): Promise<GenericResponse> {
    await this.animalService.removeAnimalById(id);
    return new GenericResponse("Animal deleted successfully");
  }
}
