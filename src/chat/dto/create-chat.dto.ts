import { IsNotEmpty, IsString } from "class-validator";

export namespace CreateChatDto {
  export class Input {
    @IsNotEmpty()
    @IsString()
    message: string;
    @IsNotEmpty()
    sender: number;
    @IsNotEmpty()
    receiver: number;
  }
}
