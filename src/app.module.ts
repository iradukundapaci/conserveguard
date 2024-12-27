import { GlobalExceptionFilter } from "./__shared__/filters/global-exception.filter";
import { AuditInterceptor } from "./__shared__/interceptors/audit.interceptor";
import { NotificationsModule } from "./notifications/notifications.module";
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { AppDataSource } from "./__shared__/config/typeorm.config";
import { appConfig } from "./__shared__/config/app.config";
import { UsersModule } from "./users/users.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import {
  ClassSerializerInterceptor,
  Module,
  OnApplicationBootstrap,
  ValidationPipe,
} from "@nestjs/common";
import { SeedModule } from "src/__shared__/seed/seed.module";
import { AdminSeedService } from "src/__shared__/seed/admin-seed.service";
import { IncidentModule } from "./incident/incident.module";
import { ChatModule } from "./chat/chat.module";
import { AnimalsModule } from "./animals/animals.module";
import { GroupModule } from "./group/group.module";
import { ScheduleModule } from "./schedule/schedule.module";
import { AnalyticsModule } from "./analytics/analytics.module";
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    TypeOrmModule.forRoot(AppDataSource.options),
    AuthModule,
    UsersModule,
    NotificationsModule,
    SeedModule,
    IncidentModule,
    ChatModule,
    AnimalsModule,
    GroupModule,
    ScheduleModule,
    AnalyticsModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(private adminSeedService: AdminSeedService) {}

  async onApplicationBootstrap() {
    await this.adminSeedService.run();
  }
}
