import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { CasesController } from "./cases.controller";
import { CasesService } from "./cases.service";
import { Cases } from "./entities/cases.entity";
@Module({
  imports: [TypeOrmModule.forFeature([Cases])],
  controllers: [CasesController],
  providers: [CasesService],
})
export class CasesModule {}
