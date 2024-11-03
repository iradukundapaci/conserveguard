import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { CasesController } from "./cases.controller";
import { CasesService } from "./cases.service";
import { Cases } from "./entities/cases.entity";
import { UsersModule } from "src/users/users.module";
@Module({
  imports: [TypeOrmModule.forFeature([Cases]), UsersModule],
  controllers: [CasesController],
  providers: [CasesService],
})
export class CasesModule {}
