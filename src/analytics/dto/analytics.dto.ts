export namespace AnalyticsDto {
  export class OutPut {
    customers: number;
    rooms: number;
    bookings: number;
    incidents: number;
    tasks: {
      pending: number;
      completed: number;
    };
    bookingsGroupedByReservationMonth: {
      date: string;
      count: number;
    };
    roomsGroupedOccupation: {
      occupied: number;
      vacant: number;
    };
  }
}
