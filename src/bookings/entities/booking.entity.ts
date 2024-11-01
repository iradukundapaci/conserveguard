import { AbstractEntity } from "src/__shared__/entities/abstract.entity";
import { Customer } from "src/customer/entities/customer.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity({ name: "bookings" })
export class Booking extends AbstractEntity {
  @Column()
  checkIn: Date;

  @Column()
  checkOut: Date;

  @Column()
  numberOfAdults: number;

  @Column({ nullable: true })
  numberOfKids: number;

  @Column({ nullable: true })
  specialRequest: string;

  @ManyToOne(() => Customer, (customer) => customer.bookings)
  customer: Customer;
}
