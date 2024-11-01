import { GenericResponse } from "src/__shared__/dto/generic-response.dto";
import { Body, Controller, HttpCode, Query } from "@nestjs/common";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { Authorize } from "./decorators/authorize.decorator";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { GetUser } from "./decorators/get-user.decorator";
import JwtRefreshGuard from "./guards/jwt-refresh.guard";
import { User } from "src/users/entities/user.entity";
import { JwtGuard } from "./guards/jwt.guard";
import { SignInDto } from "./dto/sign-in.dto";
import { SignupDto } from "./dto/sign-up.dto";
import { AuthService } from "./auth.service";
import { ApiTags } from "@nestjs/swagger";
import {
  ApiRequestBody,
  BadRequestResponse,
  ConflictResponse,
  CreatedResponse,
  ErrorResponses,
  GetOperation,
  NotFoundResponse,
  OkResponse,
  PostOperation,
  UnauthorizedResponse,
} from "../__shared__/decorators";

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @PostOperation("/login", "Log in a user")
  @HttpCode(200)
  @OkResponse(SignInDto.Output)
  @ApiRequestBody(SignInDto.Input)
  @ErrorResponses(BadRequestResponse)
  async login(
    @Body() signInDTO: SignInDto.Input,
  ): Promise<GenericResponse<SignInDto.Output>> {
    const payload = await this.authService.signIn(signInDTO);
    return new GenericResponse("Logged in successfully", payload);
  }

  @PostOperation("/signup", "Sign up a new user")
  @CreatedResponse()
  @ApiRequestBody(SignupDto.Input)
  @ErrorResponses(ConflictResponse, BadRequestResponse)
  async SignUp(@Body() signUpDTO: SignupDto.Input): Promise<GenericResponse> {
    await this.authService.signup(signUpDTO);
    return new GenericResponse("User successfully registered");
  }

  @GetOperation("/refresh-token", "Refresh token")
  @Authorize(JwtRefreshGuard)
  @OkResponse(SignInDto.Output)
  @ErrorResponses(UnauthorizedResponse)
  async refreshToken(
    @GetUser() user: User,
  ): Promise<GenericResponse<SignInDto.Output>> {
    const tokens = await this.authService.refreshToken(user);
    return new GenericResponse("Token refreshed successfully", tokens);
  }

  @GetOperation("/logout", "Sign out a user")
  @Authorize(JwtGuard)
  @OkResponse()
  @ErrorResponses(UnauthorizedResponse)
  async logout(@GetUser("id") id: number): Promise<GenericResponse> {
    await this.authService.logout(id);
    return new GenericResponse("Logged out successfully");
  }

  @PostOperation("/forgot-password", "Forgot password")
  @HttpCode(200)
  @OkResponse()
  @ApiRequestBody(ForgotPasswordDto.Input)
  @ErrorResponses(NotFoundResponse, BadRequestResponse)
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto.Input,
  ): Promise<GenericResponse> {
    await this.authService.forgotPassword(forgotPasswordDto);
    return new GenericResponse("Reset email sent successfully");
  }

  @PostOperation("/reset-password", "Reset password")
  @HttpCode(200)
  @ApiRequestBody(ResetPasswordDto.Input)
  @ErrorResponses(NotFoundResponse, BadRequestResponse)
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto.Input,
  ): Promise<GenericResponse> {
    await this.authService.resetPassword(resetPasswordDto);
    return new GenericResponse("Password reset successfully");
  }

  @GetOperation("/verify", "Verify email")
  @ErrorResponses(BadRequestResponse, NotFoundResponse)
  async verify(@Query("token") token: string): Promise<GenericResponse> {
    await this.authService.verifyEmail(token);
    return new GenericResponse("Email verified successfully");
  }
}
