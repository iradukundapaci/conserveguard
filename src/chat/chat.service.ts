// src/chat/chat.service.ts
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Chat } from "./entities/chat.entity";
import { CreateChatDto } from "./dto/create-chat.dto";

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
  ) {}

  async createMessage(createMessageDto: CreateChatDto.Input): Promise<Chat> {
    const message = this.chatRepository.create(createMessageDto);
    return this.chatRepository.save(message);
  }

  async getMessages(senderId: number, receiverId: number): Promise<Chat[]> {
    return this.chatRepository
      .createQueryBuilder("chat")
      .leftJoinAndSelect("chat.sender", "sender")
      .leftJoinAndSelect("chat.receiver", "receiver")
      .select([
        "chat.id",
        "chat.message",
        "chat.createdAt",
        "sender.id",
        "receiver.id",
      ])
      .where(
        `(chat.sender = :senderId AND chat.receiver = :receiverId) OR (chat.sender = :receiverId AND chat.receiver = :senderId)`,
        { senderId, receiverId },
      )
      .orderBy("chat.createdAt", "ASC")
      .getMany();
  }
}
