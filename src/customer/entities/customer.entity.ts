import { AbstractEntity } from "src/__shared__/entities/abstract.entity";
import { Booking } from "src/bookings/entities/booking.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity({ name: "customers" })
export class Customer extends AbstractEntity {
  @Column()
  names: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phoneNumber: string;

  @OneToMany(() => Booking, (booking) => booking.customer)
  bookings: Booking[];
}
