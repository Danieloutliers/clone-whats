export type MessageType = 'sent' | 'received';

export interface Message {
  id: string;
  text: string;
  type: MessageType;
  time: string;
}

export interface ChatState {
  isDarkMode: boolean;
  contactName: string;
  profilePic: string;
  statusTime: string;
  batteryLevel: number;
  messages: Message[];
}
