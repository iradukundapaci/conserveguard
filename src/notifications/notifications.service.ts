import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateNotificationDto } from "./dto/create-notification.dto";
import { Notifications } from "./entities/notification.entity";

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notifications)
    private readonly notificationsRepository: Repository<Notifications>,
  ) {}

  async createNotification(createNotificationDto: CreateNotificationDto.Input) {
    const { message } = createNotificationDto;
    const notification = new Notifications();
    notification.message = message;
    return await this.notificationsRepository.save(notification);
  }

  async getNotifications(): Promise<Notifications[]> {
    const notifications = await this.notificationsRepository.find();
    return notifications;
  }

  async markAsRead(id: number): Promise<void> {
    await await this.notificationsRepository.update(id, { isRead: true });
  }

  async deleteNotification(id: number): Promise<void> {
    await this.notificationsRepository.delete(id);
  }
}
