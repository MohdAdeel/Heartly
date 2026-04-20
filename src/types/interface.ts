interface Question {
  id: number;
  question: string;
  options: string[];
}

interface Message {
  id: string;
  name: string;
  avatar: string | null;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
  isTyping: boolean;
}

interface ChatMessage {
  id: string;
  text: string;
  timestamp: string;
  isMe: boolean;
  status: 'sent' | 'delivered' | 'read';
}

interface ChatUser {
  id: string;
  name: string;
  avatar: string | null;
  isOnline: boolean;
  lastSeen: string;
}

interface UserProfile {
  id: string;
  name: string;
  age: number;
  profession: string;
  isOnline: boolean;
  lastSeen: string;
  location: string;
  height: string;
  bio: string;
  essentials: {
    education: string;
    religion: string;
    languages: string[];
    familyType: string;
  };
  interests: string[];
  photos: string[];
}

interface Notification {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string | null;
  message: string;
  timestamp: string;
  type: 'like' | 'verification';
  isRead: boolean;
  isVerified: boolean;
}

export type {
  Question,
  Message,
  ChatMessage,
  ChatUser,
  UserProfile,
  Notification,
};
