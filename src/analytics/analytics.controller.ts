import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { GetOperation } from "src/__shared__/decorators";
import { AnalyticsService } from "./analytics.service";

@Controller("analytics")
@ApiTags("analytics")
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @GetOperation("", "Get all analytics")
  findAll() {
    return this.analyticsService.getAnalytics();
  }
}
