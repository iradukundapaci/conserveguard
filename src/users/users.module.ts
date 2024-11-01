import { UsersController } from "./users.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersService } from "./users.service";
import { User } from "./entities/user.entity";
import { Module } from "@nestjs/common";
import { AdminsController } from "./admin.controller";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController, AdminsController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
