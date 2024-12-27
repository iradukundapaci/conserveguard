import { PasswordEncryption } from "src/auth/utils/password-encrytion.util";
import { UserRole } from "src/__shared__/enums/user-role.enum";
import { CreateAdminDTO } from "./dto/create-admin.dto";
import { plainToInstance } from "class-transformer";
import { paginate } from "nestjs-typeorm-paginate";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./entities/user.entity";
import { FetchProfileDto } from "./dto/fetch-profile.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async createAdmin(createAdminDTO: CreateAdminDTO.Input) {
    const { email, names, password } = createAdminDTO;

    const userExists = await this.findUserByEmail(email);
    if (userExists) {
      throw new ConflictException("User already exists");
    }

    const user = plainToInstance(User, {
      email,
      names,
      password,
      role: UserRole.ADMIN,
    });

    await this.createUser(user);
  }

  async getProfile(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });
    return plainToInstance(FetchProfileDto.Output, {
      id: user.id,
      email: user.email,
      names: user.names,
      role: user.role,
      profileImage: user.profileImage,
    });
  }

  async createUser(user: User): Promise<User> {
    user.password = PasswordEncryption.hashPassword(user.password);
    return this.usersRepository.save(user);
  }

  registerUser(createUserDto: CreateUserDto.Input) {
    const user = plainToInstance(User, createUserDto);
    return this.createUser(user);
  }

  findUserByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({
      where: { email },
    });
  }

  async findUserById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) throw new NotFoundException("User not found");
    delete user.password;
    return user;
  }

  async updateProfile(
    userId: number,
    updateProfileDto: UpdateProfileDto.Input,
  ) {
    const user = await this.findUserById(userId);

    const exist = await this.usersRepository.findOne({
      where: { email: updateProfileDto.email },
    });

    if (exist && exist.id !== userId) {
      throw new ConflictException("Email is already in use");
    }

    user.names = updateProfileDto.names ?? user.names;
    user.email = updateProfileDto.email ?? user.email;
    user.role = updateProfileDto.role ?? user.role;
    const updatedUser = await this.usersRepository.save(user);
    return plainToInstance(UpdateProfileDto.OutPut, updatedUser);
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.findUserById(id);

    await this.usersRepository.update(user.id, {
      deletedAt: new Date().toISOString(),
      email: `${user.email}-deleted-${new Date().toISOString()}`,
    });
  }

  async findAllUsers(dto: FetchProfileDto.Input): Promise<any> {
    const queryBuilder = this.usersRepository
      .createQueryBuilder("users")
      .leftJoinAndSelect("users.group", "group")
      .orderBy("users.id", "DESC")
      .select([
        "users.id",
        "users.names",
        "users.role",
        "users.profileImage",
        "users.email",
      ]);

    if (dto.role) {
      queryBuilder.andWhere("users.role = :role", {
        role: dto.role,
      });
    }

    if (dto.hasNoGroup === "true") {
      queryBuilder.andWhere("users.groupId IS NULL");
    }

    if (dto.q) {
      queryBuilder.andWhere(
        "(users.names ilike :searchKey OR users.email ilike :searchKey)",
        {
          searchKey: `%${dto.q}%`,
        },
      );
    }

    return await paginate(queryBuilder, {
      page: dto.page,
      limit: dto.size,
    });
  }
}
