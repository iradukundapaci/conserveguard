import { PasswordEncryption } from "./utils/password-encrytion.util";
import { IJwtPayload } from "./interfaces/jwt.payload.interface";
import { UsersService } from "src/users/users.service";
import { TokenService } from "./utils/jwt.util";
import { SignupDto } from "./dto/sign-up.dto";
import { SignInDto } from "./dto/sign-in.dto";
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { User } from "src/users/entities/user.entity";

@Injectable()
export class AuthService {
  private tokenService: TokenService;

  constructor(private readonly usersService: UsersService) {
    this.tokenService = new TokenService();
  }

  async signup(signUpDTO: SignupDto.Input): Promise<void> {
    const { email, names, password, role } = signUpDTO;

    const userExists = await this.usersService.findUserByEmail(email);
    if (userExists) {
      throw new ConflictException("User already exists");
    }

    const user = plainToInstance(User, {
      email,
      password,
      names,
      role,
    });

    await this.usersService.createUser(user);
  }

  async signIn(signInDTO: SignInDto.Input): Promise<SignInDto.Output> {
    const { email, password } = signInDTO;
    const user = await this.usersService.findUserByEmail(email);

    if (!user || !PasswordEncryption.comparePassword(password, user.password))
      throw new UnauthorizedException("Invalid email or password");

    const payload: IJwtPayload = {
      sub: user.email,
      id: user.id,
      role: user.role,
    };
    const accessToken = this.tokenService.generateJwtToken(payload);

    return new SignInDto.Output(accessToken);
  }
}
