import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Animals } from "./entities/animals.entity";
import { AnimalsController } from "./animals.controller";
import { AnimalsService } from "./animals.service";

@Module({
  imports: [TypeOrmModule.forFeature([Animals])],
  controllers: [AnimalsController],
  providers: [AnimalsService],
  exports: [AnimalsService],
})
export class AnimalsModule {}
