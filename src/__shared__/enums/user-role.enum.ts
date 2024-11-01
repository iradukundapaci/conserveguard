import { BadRequestException } from "@nestjs/common";

export enum UserRole {
  ADMIN = "ADMIN",
  CAPTAIN = "CAPTAIN",
  CO_CAPTAIN = "CO-CAPTAIN",
  CO_PILOT = "CO-PILOT",
  CREW = "CREW",
}

export function getUserRole(role: string): UserRole {
  switch (role.toUpperCase()) {
    case "CREW":
      return UserRole.CREW;
    case "ADMIN":
      return UserRole.ADMIN;
    default:
      throw new BadRequestException(`Invalid role: ${role}`);
  }
}
