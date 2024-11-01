import { Injectable, UnauthorizedException } from "@nestjs/common";
import { IJwtPayload } from "../interfaces/jwt.payload.interface";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "../auth.service";
import { Request } from "express";
import "dotenv/config";
import { IAppConfig } from "src/__shared__/interfaces/app-config.interface";

/** JWT refresh strategy */
@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  "jwt-refresh",
) {
  /**
   * Constructor
   * @param usersService The user repository
   * @param configService The config service
   */
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService<IAppConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get("jwtRefresh").secret,
      passReqToCallback: true,
      ignoreExpiration: true,
    });
  }

  /**
   * Validate refresh token
   * @param req Request
   * @param payload Jwt payload
   * @returns user
   */
  async validate(req: Request, payload: IJwtPayload) {
    const { id } = payload;
    const refreshToken = req.get("Authorization").replace("Bearer", "").trim();
    if (!refreshToken) throw new UnauthorizedException();
    const user = await this.authService.validateRefreshToken(id, refreshToken);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
