import { Controller, Param, Body } from "@nestjs/common";
import { NotificationsService } from "./notifications.service";
import { ApiTags } from "@nestjs/swagger";
import {
  ApiRequestBody,
  DeleteOperation,
  GetOperation,
  OkResponse,
  PatchOperation,
  PostOperation,
} from "src/__shared__/decorators";
import { CreateNotificationDto } from "./dto/create-notification.dto";
import { GenericResponse } from "src/__shared__/dto/generic-response.dto";
import { Notifications } from "./entities/notification.entity";

@ApiTags("Notifications")
@Controller("notifications")
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @PostOperation("", "Create Notification")
  @OkResponse()
  @ApiRequestBody(CreateNotificationDto.Input)
  async createNotification(@Body() message: CreateNotificationDto.Input) {
    this.notificationsService.createNotification(message);
    return new GenericResponse("Notification created");
  }

  @GetOperation("", "Get Notifications")
  @OkResponse()
  async getNotifications(): Promise<GenericResponse<Notifications[]>> {
    const result = await this.notificationsService.getNotifications();
    return new GenericResponse("Notifications retrieved successfully", result);
  }

  @PatchOperation(":id", "Mark Notification as Read")
  @OkResponse()
  async markAsRead(@Param("id") id: number) {
    this.notificationsService.markAsRead(id);
    return new GenericResponse("Notification marked as read");
  }

  @DeleteOperation(":id", "Delete Notification")
  @OkResponse()
  async deleteNotification(@Param("id") id: number) {
    await this.notificationsService.deleteNotification(id);
    return new GenericResponse("Notification deleted successfully");
  }
}
