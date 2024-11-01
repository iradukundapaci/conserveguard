import { Injectable } from "@nestjs/common";
import { EntityManager } from "typeorm";
import { Booking } from "src/bookings/entities/booking.entity";
import { Customer } from "src/customer/entities/customer.entity";
import { Room } from "src/rooms/entities/room.entity";
import { Task } from "src/tasks/entities/task.entity";
import { Incident } from "src/incident/entities/incident.entity";
import { TaskStatus } from "src/__shared__/enums/task-status.enum";
import { AnalyticsDto } from "./dto/analytics.dto";

@Injectable()
export class AnalyticsService {
  constructor(private readonly entityManager: EntityManager) {}

  async getAnalytics(): Promise<AnalyticsDto.OutPut> {
    // Query counts for cards
    const [customers, rooms, bookings, incidents, tasks] = await Promise.all([
      this.entityManager.count(Customer),
      this.entityManager.count(Room),
      this.entityManager.count(Booking),
      this.entityManager.count(Incident),
      this.entityManager.find(Task, { select: ["status"] }),
    ]);

    // Group tasks by status
    const pendingTasks = tasks.filter(
      (task) => task.status === TaskStatus.PENDING,
    ).length;
    const completedTasks = tasks.filter(
      (task) => task.status === TaskStatus.DONE,
    ).length;

    // Group bookings by reservation month (using checkIn date)
    const bookingsGroupedByReservationMonth = await this.entityManager.query(`
      SELECT TO_CHAR("checkIn", 'YYYY-MM') AS date, COUNT(*) AS count
      FROM bookings
      GROUP BY date
      ORDER BY date
    `);

    // Group rooms by occupation status
    const occupiedRooms = await this.entityManager.count(Room, {
      where: { occupied: true },
    });
    const vacantRooms = await this.entityManager.count(Room, {
      where: { occupied: false },
    });

    // Map to DTO
    return {
      customers,
      rooms,
      bookings,
      incidents,
      tasks: {
        pending: pendingTasks,
        completed: completedTasks,
      },
      bookingsGroupedByReservationMonth: bookingsGroupedByReservationMonth.map(
        (row) => ({
          date: row.date,
          count: +row.count,
        }),
      ),
      roomsGroupedOccupation: {
        occupied: occupiedRooms,
        vacant: vacantRooms,
      },
    };
  }
}
