export interface AppNotification {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string | null;
  message: string;
  timestamp: string;
  type: "like" | "match" | "system";
  isRead: boolean;
}

export const HARDCODED_NOTIFICATIONS: AppNotification[] = [
  {
    id: "notif-1",
    userId: "user-1001",
    userName: "Sophia",
    userAvatar: null,
    message: "liked your profile",
    timestamp: "2m ago",
    type: "like",
    isRead: false,
  },
  {
    id: "notif-2",
    userId: "user-1002",
    userName: "Daniel",
    userAvatar: null,
    message: "It is a match! Say hello now.",
    timestamp: "15m ago",
    type: "match",
    isRead: false,
  },
  {
    id: "notif-3",
    userId: "system",
    userName: "Heartly",
    userAvatar: null,
    message: "Complete your face verification to boost trust.",
    timestamp: "1h ago",
    type: "system",
    isRead: true,
  },
  {
    id: "notif-4",
    userId: "user-1003",
    userName: "Emma",
    userAvatar: null,
    message: "viewed your profile recently",
    timestamp: "Yesterday",
    type: "like",
    isRead: true,
  },
];
