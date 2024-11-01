import { Module } from "@nestjs/common";
import { IncidentService } from "./incident.service";
import { IncidentController } from "./incident.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Incident } from "./entities/incident.entity";
import { UsersModule } from "src/users/users.module";

@Module({
  imports: [TypeOrmModule.forFeature([Incident]), UsersModule],
  controllers: [IncidentController],
  providers: [IncidentService],
})
export class IncidentModule {}
