import { ChatMessage } from '../types/interface';

export const initialMessages: ChatMessage[] = [
  {
    id: '1',
    text: 'Assalamu Alaikum! Thank you for connecting with me 😊',
    timestamp: '10:30 AM',
    isMe: false,
    status: 'read',
  },
  {
    id: '2',
    text: 'Wa Alaikum Assalam! I am glad we matched. How are you?',
    timestamp: '10:32 AM',
    isMe: true,
    status: 'read',
  },
  {
    id: '3',
    text: 'Alhamdulillah, I am doing well! I noticed we have similar interests. You mentioned you enjoy reading?',
    timestamp: '10:35 AM',
    isMe: false,
    status: 'read',
  },
  {
    id: '4',
    text: 'Yes! I love reading, especially Islamic literature and self-improvement books. What about you?',
    timestamp: '10:38 AM',
    isMe: true,
    status: 'read',
  },
  {
    id: '5',
    text: 'That is wonderful! I also enjoy reading. Currently reading "Reclaim Your Heart" by Yasmin Mogahed. Have you read it?',
    timestamp: '10:40 AM',
    isMe: false,
    status: 'read',
  },
  {
    id: '6',
    text: 'Yes, it is one of my favorites! Such a beautiful book with deep insights.',
    timestamp: '10:42 AM',
    isMe: true,
    status: 'read',
  },
  {
    id: '7',
    text: 'That sounds wonderful! I would love to know more about your family background.',
    timestamp: '10:45 AM',
    isMe: false,
    status: 'read',
  },
];
