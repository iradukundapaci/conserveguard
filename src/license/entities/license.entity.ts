import { AbstractEntity } from "src/__shared__/entities/abstract.entity";
import { Column, Entity } from "typeorm";

@Entity({ name: "licenses" })
export class License extends AbstractEntity {
  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  documentUrl: string;

  @Column()
  issueDate: Date;
}
