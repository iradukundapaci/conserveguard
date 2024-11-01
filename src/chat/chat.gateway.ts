// src/chat/chat.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ChatService } from "./chat.service";
import { CreateChatDto } from "./dto/create-chat.dto";

@WebSocketGateway({ cors: { origin: "*" } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private activeUsers = new Map<number, Socket>();

  constructor(private readonly chatService: ChatService) {}

  handleConnection(socket: Socket) {
    const userId = socket.handshake.query.userId as unknown as number;
    if (userId) {
      this.activeUsers.set(+userId, socket);
    }
    console.log(`User connected: ${userId}`);
  }

  handleDisconnect(socket: Socket) {
    const userId = Array.from(this.activeUsers.entries()).find(
      ([, s]) => s === socket,
    )?.[0];
    if (userId) {
      this.activeUsers.delete(userId);
      console.log(`User disconnected: ${userId}`);
    }
  }

  @SubscribeMessage("sendMessage")
  async handleSendMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody()
    data: {
      sender: { id: number };
      receiver: { id: number };
      message: string;
      createdAt: string;
    },
  ) {
    const senderId = +socket.handshake.query.userId;
    const { receiver, message } = data;
    const receiverId = receiver.id;
    console.log(data);

    const messageDto: CreateChatDto.Input = {
      sender: senderId,
      receiver: receiverId,
      message: message,
    };

    await this.chatService.createMessage(messageDto);

    // Find the receiver socket
    const receiverSocket = this.activeUsers.get(receiverId);
    if (receiverSocket) {
      // Emit the complete message data including createdAt
      receiverSocket.emit("receiveMessage", {
        sender: { id: senderId }, // Include sender information
        receiver: { id: receiverId }, // Include receiver information
        message: message,
        createdAt: data.createdAt, // Include createdAt from the incoming data
      });
      console.log(`Message from ${senderId} to ${receiverId}: ${message}`);
    } else {
      console.log(`User ${receiverId} is not online.`);
    }
  }
}
