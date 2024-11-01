// src/chat/chat.controller.ts
import { Controller, Get, Query } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { Chat } from "./entities/chat.entity";
import { ApiTags } from "@nestjs/swagger";

@Controller("chat")
@ApiTags("Chat")
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get("messages")
  async getMessages(
    @Query("senderId") senderId: number,
    @Query("receiverId") receiverId: number,
  ): Promise<Chat[]> {
    return this.chatService.getMessages(senderId, receiverId);
  }
}
