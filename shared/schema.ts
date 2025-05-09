import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Chat schema for WhatsApp chat settings
export const chats = pgTable("chats", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  profilePic: text("profile_pic").default(""),
  isDarkMode: boolean("is_dark_mode").default(false),
  statusTime: text("status_time").default("14:30"),
  batteryLevel: integer("battery_level").default(85)
});

// Message schema for WhatsApp chat messages
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  chatId: integer("chat_id").notNull(),
  text: text("text").notNull(),
  type: text("type").notNull(), // 'sent' or 'received'
  time: text("time").notNull()
});

// Create Zod schemas for insert operations
export const insertChatSchema = createInsertSchema(chats).pick({
  name: true,
  profilePic: true,
  isDarkMode: true,
  statusTime: true,
  batteryLevel: true
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  chatId: true,
  text: true,
  type: true,
  time: true
});

// Types for TypeScript usage
export type Chat = typeof chats.$inferSelect;
export type InsertChat = z.infer<typeof insertChatSchema>;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
