import type { MainStackParamList } from '../types/navigation.types';
import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef<MainStackParamList>();

export type PushData = {
  type?: 'message' | 'like' | 'match' | string;
  chatId?: string;
  senderId?: string;
  senderName?: string;
  senderAvatar?: string;
  [key: string]: string | undefined;
};

export const navigateFromPushData = (data: PushData) => {
  if (!navigationRef.isReady()) return;

  if (data.type === 'message') {
    if (data.chatId && data.senderId) {
      navigationRef.navigate('ChatScreen', {
        conversationId: data.chatId,
        userId: data.senderId,
        userName: data.senderName || 'Chat',
        userAvatar: data.senderAvatar || null,
      });
      return;
    }
    navigationRef.navigate('MainTabs', { screen: 'Chats' });
    return;
  }

  if (data.type === 'like') {
    navigationRef.navigate('MainTabs', { screen: 'Interactions' });
    return;
  }

  if (data.type === 'match') {
    navigationRef.navigate('MainTabs', { screen: 'Chats' });
  }
};
