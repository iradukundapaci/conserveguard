import { IsNotEmpty, IsString } from "class-validator";

export namespace CreateNotificationDto {
  export class Input {
    @IsString()
    @IsNotEmpty()
    message: string;
  }
}
