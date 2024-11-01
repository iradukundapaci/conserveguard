import { AuthGuard } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";

/** JWT refresh guard */
@Injectable()
export default class JwtRefreshGuard extends AuthGuard("jwt-refresh") {}
