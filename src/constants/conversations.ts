export type ConversationItem = {
  id: string;
  other_user_id: string;
  other_user_name: string;
  other_user_avatar_url: string | null;
  last_message: string;
  last_message_at: string;
  unread_count: number;
  is_muted: boolean;
  is_marked_unread: boolean;
  is_match_deleted: boolean;
};

export const HARD_CODED_CONVERSATIONS: ConversationItem[] = [
  {
    id: 'conv-1',
    other_user_id: 'profile-1',
    other_user_name: 'Ayesha Khan',
    other_user_avatar_url:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300',
    last_message: 'That sounds great, let us continue this conversation.',
    last_message_at: new Date().toISOString(),
    unread_count: 2,
    is_muted: false,
    is_marked_unread: false,
    is_match_deleted: false,
  },
  {
    id: 'conv-2',
    other_user_id: 'profile-2',
    other_user_name: 'Sara Iqbal',
    other_user_avatar_url:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300',
    last_message: 'Assalamu Alaikum. How was your day?',
    last_message_at: new Date(Date.now() - 1000 * 60 * 28).toISOString(),
    unread_count: 0,
    is_muted: false,
    is_marked_unread: false,
    is_match_deleted: false,
  },
  {
    id: 'conv-3',
    other_user_id: 'profile-3',
    other_user_name: 'Mariam Yusuf',
    other_user_avatar_url:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300',
    last_message: 'Nice talking to you, catch up soon.',
    last_message_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    unread_count: 1,
    is_muted: true,
    is_marked_unread: true,
    is_match_deleted: false,
  },
];

