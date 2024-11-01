import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import { UpdateCustomerDto } from "./dto/update-customer.dto";
import { Customer } from "./entities/customer.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { plainToInstance } from "class-transformer";
import { paginate } from "nestjs-typeorm-paginate";
import { FetchCustomerDto } from "./dto/fetch-customer.dto";
import { CustomerDto } from "./dto/customer.dto";

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}
  async createCustomer(
    createCustomerDto: CreateCustomerDto.Input,
  ): Promise<void> {
    const customer = await this.findCustomerByEmail(createCustomerDto.email);

    if (customer) {
      throw new ConflictException("Customer already exists");
    }

    const newCustomer = plainToInstance(Customer, {
      ...createCustomerDto,
    });

    await this.customerRepository.save(newCustomer);
  }

  async findAllCustomer(dto: FetchCustomerDto.Input): Promise<any> {
    const queryBuilder = this.customerRepository
      .createQueryBuilder("customer")
      .orderBy("customer.id", "DESC")
      .select([
        "customer.id",
        "customer.names",
        "customer.email",
        "customer.phoneNumber",
      ]);
    if (dto.q) {
      queryBuilder.andWhere(
        "customer.names ilike :searchKey OR customer.email ilike :searchKey",
        {
          searchKey: `%${dto.q}%`,
        },
      );
    }

    return await paginate<Customer>(queryBuilder, {
      page: dto.page,
      limit: dto.size,
    });
  }

  async findcustomerById(id: number): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { id },
    });

    if (!customer) {
      throw new NotFoundException("Customer not found");
    }

    return customer;
  }

  async updateCustomerById(
    id: number,
    updateCustomerDto: UpdateCustomerDto.Input,
  ): Promise<CustomerDto.Output> {
    const customer = await this.findcustomerById(id);

    if (!customer) {
      throw new NotFoundException("Customer not found");
    }

    let updatedCustomer = plainToInstance(Customer, {
      ...customer,
      ...updateCustomerDto,
    });

    updatedCustomer = await this.customerRepository.save(updatedCustomer);
    return plainToInstance(CustomerDto.Output, updatedCustomer);
  }

  async removeCustomerById(id: number): Promise<void> {
    const customer = await this.findcustomerById(id);
    if (!customer) {
      throw new NotFoundException("Customer not found");
    }

    await this.customerRepository.remove(customer);
  }

  async findCustomerByEmail(email: string): Promise<Customer | undefined> {
    return await this.customerRepository.findOne({
      where: { email },
    });
  }
}
