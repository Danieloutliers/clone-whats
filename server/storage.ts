import { chats, messages, type Chat, type Message, type InsertChat, type InsertMessage } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getChats(): Promise<Chat[]>;
  getChatById(id: number): Promise<Chat | undefined>;
  createChat(chat: InsertChat): Promise<Chat>;
  
  getMessages(chatId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  updateMessage(id: number, message: Partial<InsertMessage>): Promise<Message | undefined>;
  deleteMessage(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private chats: Map<number, Chat>;
  private messages: Map<number, Message>;
  private chatIdCounter: number;
  private messageIdCounter: number;

  constructor() {
    this.chats = new Map();
    this.messages = new Map();
    this.chatIdCounter = 1;
    this.messageIdCounter = 1;
    
    // Initialize with a default chat
    this.createChat({
      name: "Chat do WhatsApp",
      profilePic: "",
      isDarkMode: false,
      statusTime: "14:30",
      batteryLevel: 85
    });
  }

  async getChats(): Promise<Chat[]> {
    return Array.from(this.chats.values());
  }

  async getChatById(id: number): Promise<Chat | undefined> {
    return this.chats.get(id);
  }

  async createChat(insertChat: InsertChat): Promise<Chat> {
    const id = this.chatIdCounter++;
    const chat: Chat = { 
      id, 
      name: insertChat.name,
      profilePic: insertChat.profilePic ?? "",
      isDarkMode: insertChat.isDarkMode ?? false,
      statusTime: insertChat.statusTime ?? "14:30",
      batteryLevel: insertChat.batteryLevel ?? 85 
    };
    this.chats.set(id, chat);
    return chat;
  }

  async getMessages(chatId: number): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(msg => msg.chatId === chatId);
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.messageIdCounter++;
    const message: Message = { ...insertMessage, id };
    this.messages.set(id, message);
    return message;
  }

  async updateMessage(id: number, messageUpdate: Partial<InsertMessage>): Promise<Message | undefined> {
    const message = this.messages.get(id);
    if (!message) return undefined;
    
    const updatedMessage = { ...message, ...messageUpdate };
    this.messages.set(id, updatedMessage);
    return updatedMessage;
  }

  async deleteMessage(id: number): Promise<boolean> {
    return this.messages.delete(id);
  }
}

export const storage = new MemStorage();
