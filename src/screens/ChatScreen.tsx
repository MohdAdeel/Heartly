import {
  Text,
  View,
  Image,
  FlatList,
  Platform,
  Keyboard,
  AppState,
  Animated,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import {
  useRoute,
  RouteProp,
  useNavigation,
  useFocusEffect,
} from "@react-navigation/native";
import { getInitials } from "../utils/helpers";
import { themeSecond } from "../theme/colorSecond";
import Ionicons from "react-native-vector-icons/Ionicons";
import { ChatMessage, ChatUser } from "../types/interface";
import { SafeAreaView } from "react-native-safe-area-context";
import { initialMessages } from "../constants/ChatMessages";
import { EMOJI_LIST, FLAG_LIST } from "../constants/EmojiData";
import type { MainStackParamList } from "../types/navigation.types";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { moderateScale, verticalScale } from "react-native-size-matters";

const getCurrentUser = async () => ({ id: "local-user" });
type LocalApiMessage = {
  id: string;
  sender_id: string;
  message_text: string;
  created_at: string;
  is_read: boolean;
};
const getChat = async (_conversationId: string): Promise<LocalApiMessage[]> => {
  return initialMessages.map((message) => ({
    id: String(message.id),
    sender_id: message.isMe ? "local-user" : "other-user",
    message_text: message.text,
    created_at: new Date().toISOString(),
    is_read: message.status === "read",
  }));
};
const markConversationAsRead = async (_conversationId: string) => {};
const sendChatMessage = async (payload: {
  conversation_id?: string;
  sender_id: string;
  message_text: string;
  message_type?: string;
}) => {
  return {
    id: `local-${Date.now()}`,
    sender_id: payload.sender_id,
    message_text: payload.message_text,
    created_at: new Date().toISOString(),
    is_read: false,
  };
};
const supabase = {
  from: () => ({
    select: () => ({
      eq: () => ({
        maybeSingle: async () => ({ data: null }),
      }),
    }),
  }),
  channel: (..._args: any[]) => ({
    on(..._args: any[]) {
      return this;
    },
    subscribe(..._args: any[]) {
      return this;
    },
    send(..._args: any[]) {},
  }),
  removeChannel(..._args: any[]) {},
};

const defaultChatUser: ChatUser = {
  id: "1",
  name: "Aisha Khan",
  avatar: null,
  isOnline: false,
  lastSeen: "Offline",
};

type ChatMessageItem = ChatMessage & {
  createdAt?: string | null;
  dateLabel: string;
};

// Animated typing dots (same general style as InboxScreen)
const AnimatedTypingDots = () => {
  const dot1Anim = useRef(new Animated.Value(0.3)).current;
  const dot2Anim = useRef(new Animated.Value(0.3)).current;
  const dot3Anim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const createDotAnimation = (animValue: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animValue, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0.3,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      );
    };

    const anim1 = createDotAnimation(dot1Anim, 0);
    const anim2 = createDotAnimation(dot2Anim, 150);
    const anim3 = createDotAnimation(dot3Anim, 300);

    anim1.start();
    anim2.start();
    anim3.start();

    return () => {
      anim1.stop();
      anim2.stop();
      anim3.stop();
    };
  }, [dot1Anim, dot2Anim, dot3Anim]);

  return (
    <View style={styles.typingDots}>
      <Animated.View
        style={[
          styles.typingDot,
          {
            opacity: dot1Anim,
            transform: [
              {
                scale: dot1Anim.interpolate({
                  inputRange: [0.3, 1],
                  outputRange: [0.8, 1.2],
                }),
              },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.typingDot,
          {
            opacity: dot2Anim,
            transform: [
              {
                scale: dot2Anim.interpolate({
                  inputRange: [0.3, 1],
                  outputRange: [0.8, 1.2],
                }),
              },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.typingDot,
          {
            opacity: dot3Anim,
            transform: [
              {
                scale: dot3Anim.interpolate({
                  inputRange: [0.3, 1],
                  outputRange: [0.8, 1.2],
                }),
              },
            ],
          },
        ]}
      />
    </View>
  );
};

const ChatScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<MainStackParamList, "ChatScreen">>();
  const { conversationId, userId, userName, userAvatar } = route.params || {};

  const chatUser: ChatUser = {
    ...defaultChatUser,
    id: userId || defaultChatUser.id,
    name: userName || defaultChatUser.name,
    avatar: userAvatar ?? defaultChatUser.avatar,
  };

  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [inputText, setInputText] = useState("");
  const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);
  const [emojiTab, setEmojiTab] = useState<"emojis" | "flags">("emojis");
  const [authUserId, setAuthUserId] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isOpponentTyping, setIsOpponentTyping] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMatchDeleted, setIsMatchDeleted] = useState(false);
  const [opponentLastSeenAt, setOpponentLastSeenAt] = useState<Date | null>(
    null
  );
  const [statusNowTick, setStatusNowTick] = useState(() => Date.now());
  const opponentOnlineRef = useRef<boolean | null>(null);
  const flatListRef = useRef<FlatList>(null);
  const realtimeChannelRef = useRef<any>(null);
  const typingStopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingSentRef = useRef(false);
  const opponentTypingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const newMatchCardAnim = useRef(new Animated.Value(0)).current;
  const newMatchImageFloatAnim = useRef(new Animated.Value(0)).current;
  const newMatchSparkleOneAnim = useRef(new Animated.Value(0)).current;
  const newMatchSparkleTwoAnim = useRef(new Animated.Value(0)).current;

  const formatLastSeen = useCallback(
    (lastSeenAt: Date | null) => {
      if (!lastSeenAt) return "Offline";
      const diffMs = Math.max(0, statusNowTick - lastSeenAt.getTime());
      const diffMin = Math.floor(diffMs / (1000 * 60));
      if (diffMin <= 0) return "Last seen just now";
      if (diffMin === 1) return "Last seen 1 min ago";
      if (diffMin < 60) return `Last seen ${diffMin} mins ago`;
      const diffHr = Math.floor(diffMin / 60);
      if (diffHr === 1) return "Last seen 1 hour ago";
      if (diffHr < 24) return `Last seen ${diffHr} hours ago`;
      const diffDay = Math.floor(diffHr / 24);
      if (diffDay === 1) return "Last seen 1 day ago";
      return `Last seen ${diffDay} days ago`;
    },
    [statusNowTick]
  );

  const opponentOnline = false;
  const headerStatusText = isOpponentTyping
    ? "Typing..."
    : opponentOnline
    ? "Online"
    : formatLastSeen(opponentLastSeenAt);

  useEffect(() => {
    opponentOnlineRef.current = null;
    setOpponentLastSeenAt(null);
  }, [userId]);

  useEffect(() => {
    if (opponentOnlineRef.current === null) {
      opponentOnlineRef.current = opponentOnline;
      if (opponentOnline) {
        setOpponentLastSeenAt(null);
      }
      return;
    }

    if (opponentOnline) {
      setOpponentLastSeenAt(null);
    } else if (opponentOnlineRef.current) {
      setOpponentLastSeenAt(new Date());
    }

    opponentOnlineRef.current = opponentOnline;
  }, [opponentOnline]);

  useEffect(() => {
    // Keep "Last seen X mins ago" ticking while we're on this screen.
    const t = setInterval(() => setStatusNowTick(Date.now()), 30_000);
    return () => clearInterval(t);
  }, []);

  const formatTimestamp = (date?: string | null) => {
    if (!date) return "";
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return "";
    return parsed.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDateLabel = (date?: string | null) => {
    if (!date) return "Today";
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return "Today";

    const today = new Date();
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const startOfMessageDay = new Date(
      parsed.getFullYear(),
      parsed.getMonth(),
      parsed.getDate()
    );

    const diffDays = Math.floor(
      (startOfToday.getTime() - startOfMessageDay.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";

    return parsed.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  useEffect(() => {
    const loadMessages = async () => {
      if (!conversationId) {
        setError("Conversation not found");
        setMessages([]);
        setLoadingMessages(false);
        return;
      }

      setLoadingMessages(true);
      setError(null);

      try {
        const [user, remoteMessages] = await Promise.all([
          getCurrentUser(),
          getChat(conversationId),
        ]);

        const authUserId = user?.id || "";
        setAuthUserId(authUserId);
        setIsMatchDeleted(false);

        const mapped = remoteMessages.map<ChatMessageItem>((msg) => ({
          id: String(msg.id),
          text: msg.message_text || "",
          timestamp: formatTimestamp(msg.created_at),
          createdAt: msg.created_at,
          dateLabel: formatDateLabel(msg.created_at),
          isMe: msg.sender_id === authUserId,
          status: msg.is_read ? "read" : "delivered",
        }));

        setMessages(mapped);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load messages"
        );
        setMessages([]);
      } finally {
        setLoadingMessages(false);
      }
    };

    loadMessages();
  }, [conversationId]);

  useEffect(() => {
    if (!isMatchDeleted) return;
    setIsEmojiPickerVisible(false);
    setInputText("");
  }, [isMatchDeleted]);

  useFocusEffect(
    useCallback(() => {
      if (!conversationId) {
        return () => {};
      }

      // Mark incoming unread messages as read immediately on screen focus.
      markConversationAsRead(conversationId).catch(() => {
        // Non-blocking: chat should still work even if this request fails.
      });

      return () => {};
    }, [conversationId])
  );

  useFocusEffect(
    useCallback(() => {
      if (!conversationId) {
        return () => {};
      }

      let channel: ReturnType<typeof supabase.channel> | null = null;
      let appState = AppState.currentState;

      const stopLocalTyping = () => {
        // Tell the opponent we stopped typing (best effort).
        try {
          channel?.send({
            type: "broadcast",
            event: "typing",
            payload: {
              conversation_id: conversationId,
              sender_id: authUserId,
              is_typing: false,
            },
          });
        } catch {
          // ignore
        }
      };

      const startRealtime = () => {
        if (channel) return;
        if (!authUserId) return;

        setIsOpponentTyping(false);

        channel = supabase
          .channel(`chat-messages-${conversationId}`)
          .on(
            "postgres_changes",
            {
              event: "INSERT",
              schema: "public",
              table: "messages",
              filter: `conversation_id=eq.${conversationId}`,
            },
            (payload: any) => {
              const newRow = payload.new as {
                id: string | number;
                sender_id: string;
                message_text: string | null;
                is_read?: boolean | null;
                created_at?: string | null;
              };

              if (authUserId && newRow.sender_id === authUserId) {
                return;
              }

              const incoming: ChatMessageItem = {
                id: String(newRow.id),
                text: newRow.message_text || "",
                timestamp: formatTimestamp(newRow.created_at),
                createdAt: newRow.created_at,
                dateLabel: formatDateLabel(newRow.created_at),
                isMe: false,
                status: newRow.is_read ? "read" : "delivered",
              };

              setMessages((prev) => {
                if (prev.some((msg) => msg.id === incoming.id)) {
                  return prev;
                }
                return [...prev, incoming];
              });

              // If chat is open and a new incoming message arrives, mark it as read immediately.
              markConversationAsRead(conversationId).catch(() => {
                // Non-blocking best effort.
              });
            }
          )
          .on(
            "postgres_changes",
            {
              event: "UPDATE",
              schema: "public",
              table: "messages",
              filter: `conversation_id=eq.${conversationId}`,
            },
            (payload: any) => {
              const updatedRow = payload.new as {
                id: string | number;
                is_read?: boolean | null;
              };

              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === String(updatedRow.id)
                    ? {
                        ...msg,
                        status: updatedRow.is_read ? "read" : "delivered",
                      }
                    : msg
                )
              );
            }
          )
          .on("broadcast", { event: "typing" }, (payload: any) => {
            const data = payload?.payload as
              | {
                  conversation_id?: string;
                  sender_id?: string;
                  is_typing?: boolean;
                }
              | undefined;

            if (
              !data?.conversation_id ||
              data.conversation_id !== conversationId
            )
              return;
            if (!data.sender_id || data.sender_id === authUserId) return;

            const isTyping = !!data.is_typing;
            setIsOpponentTyping(isTyping);

            if (opponentTypingTimeoutRef.current) {
              clearTimeout(opponentTypingTimeoutRef.current);
              opponentTypingTimeoutRef.current = null;
            }

            if (isTyping) {
              // Safety timeout in case the "stop typing" broadcast is missed.
              opponentTypingTimeoutRef.current = setTimeout(() => {
                setIsOpponentTyping(false);
                opponentTypingTimeoutRef.current = null;
              }, 2000);
            }
          })
          // Fallback to broadcast so messages render instantly even if DB realtime lags.
          .on("broadcast", { event: "new-message" }, (payload: any) => {
            const data = payload?.payload as
              | {
                  conversation_id?: string;
                  message?: {
                    id?: string | number;
                    sender_id?: string;
                    message_text?: string | null;
                    created_at?: string | null;
                    is_read?: boolean | null;
                  };
                }
              | undefined;

            if (
              !data?.conversation_id ||
              data.conversation_id !== conversationId
            )
              return;

            const msg = data.message;
            if (!msg?.id) return;
            if (authUserId && msg.sender_id === authUserId) return;

            const incoming: ChatMessageItem = {
              id: String(msg.id),
              text: msg.message_text || "",
              timestamp: formatTimestamp(msg.created_at),
              createdAt: msg.created_at,
              dateLabel: formatDateLabel(msg.created_at),
              isMe: false,
              status: msg.is_read ? "read" : "delivered",
            };

            setMessages((prev) => {
              if (prev.some((existing) => existing.id === incoming.id)) {
                return prev;
              }
              return [...prev, incoming];
            });

            // Keep read status fresh when the chat is open.
            markConversationAsRead(conversationId).catch(() => {});
          })
          .subscribe();

        realtimeChannelRef.current = channel;
      };

      const stopRealtime = () => {
        if (!channel) return;

        stopLocalTyping();
        setIsOpponentTyping(false);
        realtimeChannelRef.current = null;
        isTypingSentRef.current = false;
        if (typingStopTimerRef.current) {
          clearTimeout(typingStopTimerRef.current);
          typingStopTimerRef.current = null;
        }
        if (opponentTypingTimeoutRef.current) {
          clearTimeout(opponentTypingTimeoutRef.current);
          opponentTypingTimeoutRef.current = null;
        }

        supabase.removeChannel(channel);
        channel = null;
      };

      startRealtime();

      const appStateSubscription = AppState.addEventListener(
        "change",
        (nextState) => {
          const wasActive = appState === "active";
          const isActive = nextState === "active";

          if (wasActive && !isActive) {
            stopRealtime();
          } else if (!wasActive && isActive) {
            startRealtime();
          }

          appState = nextState;
        }
      );

      return () => {
        appStateSubscription.remove();
        stopRealtime();
      };
    }, [conversationId, authUserId])
  );

  const sendMessage = async () => {
    const trimmed = inputText.trim();
    if (trimmed.length === 0 || isSending) return;
    if (!conversationId) {
      setError("Conversation not found");
      return;
    }
    if (!authUserId) {
      setError("User not authenticated");
      return;
    }
    if (isMatchDeleted) {
      setError(
        "Match is Deleted. If you faced any issue Please report the Chat"
      );
      return;
    }

    const tempId = `temp-${Date.now()}`;
    const nowIso = new Date().toISOString();
    const optimisticMessage: ChatMessageItem = {
      id: tempId,
      text: trimmed,
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
      createdAt: nowIso,
      dateLabel: formatDateLabel(nowIso),
      isMe: true,
      status: "sent",
    };

    setError(null);
    setMessages((prev) => [...prev, optimisticMessage]);
    setInputText("");
    setIsEmojiPickerVisible(false);
    Keyboard.dismiss();

    try {
      setIsSending(true);
      const saved = await sendChatMessage({
        conversation_id: conversationId,
        sender_id: authUserId,
        message_text: trimmed,
        message_type: "text",
      });

      const savedMessage: ChatMessageItem = {
        id: String(saved.id),
        text: saved.message_text || "",
        timestamp: formatTimestamp(saved.created_at),
        createdAt: saved.created_at,
        dateLabel: formatDateLabel(saved.created_at),
        isMe: true,
        status: saved.is_read ? "read" : "delivered",
      };

      setMessages((prev) =>
        prev.map((msg) => (msg.id === tempId ? savedMessage : msg))
      );

      // Broadcast immediately so the opponent sees the message without waiting
      // for database change notifications (helps when replication is slow).
      if (realtimeChannelRef.current) {
        realtimeChannelRef.current.send({
          type: "broadcast",
          event: "new-message",
          payload: {
            conversation_id: conversationId,
            message: {
              id: savedMessage.id,
              sender_id: authUserId,
              message_text: savedMessage.text,
              created_at: savedMessage.createdAt,
              is_read: saved.is_read ?? false,
            },
          },
        });
      }
    } catch (err) {
      setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
      setInputText(trimmed);
      setError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  // Broadcast typing status so the opponent can see typing dots instantly.
  useEffect(() => {
    if (!conversationId || !authUserId) return;
    if (isMatchDeleted) return;

    const channel = realtimeChannelRef.current;
    if (!channel) return;

    const trimmed = inputText.trim();
    const hasText = trimmed.length > 0;

    const sendTyping = (isTyping: boolean) => {
      try {
        channel.send({
          type: "broadcast",
          event: "typing",
          payload: {
            conversation_id: conversationId,
            sender_id: authUserId,
            is_typing: isTyping,
          },
        });
      } catch {
        // ignore (best effort)
      }
    };

    if (!hasText) {
      if (isTypingSentRef.current) {
        sendTyping(false);
        isTypingSentRef.current = false;
      }

      if (typingStopTimerRef.current) {
        clearTimeout(typingStopTimerRef.current);
        typingStopTimerRef.current = null;
      }
      return;
    }

    if (!isTypingSentRef.current) {
      sendTyping(true);
      isTypingSentRef.current = true;
    }

    // If the user stops typing for a moment, stop the indicator.
    if (typingStopTimerRef.current) {
      clearTimeout(typingStopTimerRef.current);
    }
    typingStopTimerRef.current = setTimeout(() => {
      sendTyping(false);
      isTypingSentRef.current = false;
      typingStopTimerRef.current = null;
    }, 1500);
  }, [inputText, conversationId, authUserId, isMatchDeleted]);

  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, isOpponentTyping]);

  useEffect(() => {
    Animated.timing(newMatchCardAnim, {
      toValue: 1,
      duration: 650,
      useNativeDriver: true,
    }).start();

    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(newMatchImageFloatAnim, {
          toValue: 1,
          duration: 2200,
          useNativeDriver: true,
        }),
        Animated.timing(newMatchImageFloatAnim, {
          toValue: 0,
          duration: 2200,
          useNativeDriver: true,
        }),
      ])
    );

    const sparkleLoop = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(newMatchSparkleOneAnim, {
            toValue: 1,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(newMatchSparkleOneAnim, {
            toValue: 0,
            duration: 900,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.delay(280),
          Animated.timing(newMatchSparkleTwoAnim, {
            toValue: 1,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(newMatchSparkleTwoAnim, {
            toValue: 0,
            duration: 900,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    floatLoop.start();
    sparkleLoop.start();

    return () => {
      floatLoop.stop();
      sparkleLoop.stop();
    };
  }, [
    newMatchCardAnim,
    newMatchImageFloatAnim,
    newMatchSparkleOneAnim,
    newMatchSparkleTwoAnim,
  ]);

  const renderMessage = ({
    item,
    index,
  }: {
    item: ChatMessageItem;
    index: number;
  }) => {
    const showDateSeparator =
      index === 0 || messages[index - 1]?.dateLabel !== item.dateLabel;

    return (
      <>
        {showDateSeparator && (
          <View style={styles.dateSeparator}>
            <View style={styles.dateLine} />
            <Text style={styles.dateText}>{item.dateLabel}</Text>
            <View style={styles.dateLine} />
          </View>
        )}

        <View
          style={[
            styles.messageContainer,
            item.isMe
              ? styles.messageContainerMe
              : styles.messageContainerOther,
          ]}
        >
          {!item.isMe && (
            <View style={styles.messageAvatar}>
              <View style={styles.avatarRing}>
                <View style={styles.avatarInner}>
                  {chatUser.avatar ? (
                    <Image
                      source={{ uri: chatUser.avatar }}
                      style={styles.avatarImageSmall}
                      resizeMode="cover"
                    />
                  ) : (
                    <Text style={styles.avatarSmallText}>
                      {getInitials(chatUser.name)}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          )}

          <View style={styles.messageBubbleWrapper}>
            <View
              style={[
                styles.messageBubble,
                item.isMe ? styles.messageBubbleMe : styles.messageBubbleOther,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  item.isMe ? styles.messageTextMe : styles.messageTextOther,
                ]}
              >
                {item.text}
              </Text>
            </View>

            <View
              style={[
                styles.messageInfo,
                item.isMe ? styles.messageInfoMe : styles.messageInfoOther,
              ]}
            >
              <Text style={styles.messageTime}>{item.timestamp}</Text>
              {item.isMe && (
                <Ionicons
                  name={
                    item.status === "read"
                      ? "checkmark-done"
                      : item.status === "delivered"
                      ? "checkmark-done"
                      : "checkmark"
                  }
                  size={moderateScale(14)}
                  color={
                    item.status === "read"
                      ? themeSecond.onlineGreen
                      : themeSecond.textSoft
                  }
                  style={styles.statusIcon}
                />
              )}
            </View>
          </View>
        </View>
      </>
    );
  };

  const renderTypingIndicator = () => {
    if (!isOpponentTyping) return null;

    return (
      <View style={[styles.messageContainer, styles.messageContainerOther]}>
        <View style={styles.messageAvatar}>
          <View style={styles.avatarRing}>
            <View style={styles.avatarInner}>
              {chatUser.avatar ? (
                <Image
                  source={{ uri: chatUser.avatar }}
                  style={styles.avatarImageSmall}
                  resizeMode="cover"
                />
              ) : (
                <Text style={styles.avatarSmallText}>
                  {getInitials(chatUser.name)}
                </Text>
              )}
            </View>
          </View>
        </View>

        <View style={styles.typingBubble}>
          <AnimatedTypingDots />
        </View>
      </View>
    );
  };

  const toggleEmojiPicker = () => {
    setIsEmojiPickerVisible((prev) => !prev);
    setEmojiTab("emojis");
    Keyboard.dismiss();
  };

  const handleSelectEmoji = (emoji: string) => {
    if (isMatchDeleted) return;
    setInputText((prev) => `${prev}${emoji}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      {/* Header - InboxSecond style */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerIconCircle}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons
            name="chevron-back"
            size={moderateScale(24)}
            color={themeSecond.textPrimary}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.userInfo} activeOpacity={0.8}>
          <View style={styles.avatarRingLarge}>
            <View style={styles.avatarInnerLarge}>
              {chatUser.avatar ? (
                <Image
                  source={{ uri: chatUser.avatar }}
                  style={styles.avatarImageLarge}
                  resizeMode="cover"
                />
              ) : (
                <Text style={styles.avatarText}>
                  {getInitials(chatUser.name)}
                </Text>
              )}
            </View>
            {opponentOnline && <View style={styles.onlineIndicator} />}
          </View>

          <View style={styles.userDetails}>
            <Text style={styles.userName}>{chatUser.name}</Text>
            <Text
              style={[
                styles.userStatus,
                !opponentOnline && !isOpponentTyping
                  ? styles.userStatusOffline
                  : null,
              ]}
            >
              {headerStatusText}
            </Text>
          </View>
        </TouchableOpacity>

        {/* <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerActionButton}
            activeOpacity={0.7}
          >
            <Ionicons
              name="call-outline"
              size={moderateScale(22)}
              color={themeSecond.accentPurple}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerActionButton}
            activeOpacity={0.7}
          >
            <Ionicons
              name="videocam-outline"
              size={moderateScale(24)}
              color={themeSecond.accentPurple}
            />
          </TouchableOpacity>
        </View> */}
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : verticalScale(8)}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.messagesContent,
            messages.length === 0
              ? isOpponentTyping
                ? styles.messagesTypingContent
                : styles.messagesEmptyContent
              : null,
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={() => (
            <>
              {loadingMessages ? (
                <View style={styles.emptyState}>
                  <ActivityIndicator
                    size="large"
                    color={themeSecond.accentPurple}
                  />
                  <Text style={styles.emptyText}>Loading messages...</Text>
                </View>
              ) : error ? (
                <View style={styles.emptyState}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : isMatchDeleted ? (
                <View style={styles.emptyState}>
                  <Text style={styles.errorText}>
                    Match is Deleted. If you faced any issue Please report the
                    Chat
                  </Text>
                </View>
              ) : isOpponentTyping ? (
                renderTypingIndicator()
              ) : (
                <Animated.View
                  style={[
                    styles.emptyState,
                    styles.newMatchCard,
                    {
                      opacity: newMatchCardAnim,
                      transform: [
                        {
                          translateY: newMatchCardAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [verticalScale(18), 0],
                          }),
                        },
                        {
                          scale: newMatchCardAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.96, 1],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <Animated.View
                    style={[
                      styles.newMatchSparkle,
                      styles.newMatchSparkleOne,
                      {
                        opacity: newMatchSparkleOneAnim,
                        transform: [
                          {
                            scale: newMatchSparkleOneAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0.75, 1.2],
                            }),
                          },
                        ],
                      },
                    ]}
                  />
                  <Animated.View
                    style={[
                      styles.newMatchSparkle,
                      styles.newMatchSparkleTwo,
                      {
                        opacity: newMatchSparkleTwoAnim,
                        transform: [
                          {
                            scale: newMatchSparkleTwoAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0.75, 1.2],
                            }),
                          },
                        ],
                      },
                    ]}
                  />
                  <View style={styles.newMatchImageWrap}>
                    <Animated.Image
                      source={require("../../assets/Images/chatScreen_couple.png")}
                      style={[
                        styles.newMatchImage,
                        {
                          transform: [
                            {
                              translateY: newMatchImageFloatAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, -verticalScale(8)],
                              }),
                            },
                          ],
                        },
                      ]}
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={styles.emptyText}>
                    You matched! Start chatting now!
                  </Text>
                </Animated.View>
              )}
            </>
          )}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: false })
          }
          ListFooterComponent={
            messages.length > 0 && isOpponentTyping
              ? renderTypingIndicator()
              : null
          }
        />

        {isMatchDeleted && (
          <View style={styles.matchDeletedBanner}>
            <Text style={styles.matchDeletedBannerText}>
              Match is Deleted. If you faced any issue Please report the Chat
            </Text>
          </View>
        )}

        {!isMatchDeleted && isEmojiPickerVisible && (
          <View style={styles.emojiPickerContainer}>
            <View style={styles.emojiPickerHeader}>
              <Text style={styles.emojiPickerTitle}>Emojis</Text>
              <TouchableOpacity
                style={styles.emojiCloseButton}
                onPress={() => setIsEmojiPickerVisible(false)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="close"
                  size={moderateScale(18)}
                  color={themeSecond.textSoft}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.emojiTabRow}>
              <TouchableOpacity
                style={[
                  styles.emojiTabButton,
                  emojiTab === "emojis" && styles.emojiTabButtonActive,
                ]}
                onPress={() => setEmojiTab("emojis")}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.emojiTabText,
                    emojiTab === "emojis" && styles.emojiTabTextActive,
                  ]}
                >
                  Emojis
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.emojiTabButton,
                  emojiTab === "flags" && styles.emojiTabButtonActive,
                ]}
                onPress={() => setEmojiTab("flags")}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.emojiTabText,
                    emojiTab === "flags" && styles.emojiTabTextActive,
                  ]}
                >
                  Flags
                </Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              style={styles.emojiGrid}
              contentContainerStyle={styles.emojiGridContent}
              showsVerticalScrollIndicator={false}
            >
              {(emojiTab === "emojis" ? EMOJI_LIST : FLAG_LIST).map((item) => (
                <TouchableOpacity
                  key={item}
                  style={styles.emojiItem}
                  onPress={() => handleSelectEmoji(item)}
                  activeOpacity={0.75}
                >
                  <Text style={styles.emojiText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {!isMatchDeleted && (
          <View style={styles.inputContainer}>
            {/* <TouchableOpacity style={styles.attachButton} activeOpacity={0.7}>
              <Ionicons
                name="add-circle-outline"
                size={moderateScale(26)}
                color={themeSecond.accentPurple}
              />
            </TouchableOpacity> */}

            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                placeholder="Type a message..."
                placeholderTextColor={themeSecond.textSoft}
                value={inputText}
                onChangeText={setInputText}
                onFocus={() => setIsEmojiPickerVisible(false)}
                multiline
                maxLength={500}
              />
              <TouchableOpacity
                style={[
                  styles.emojiButton,
                  isEmojiPickerVisible && styles.emojiButtonActive,
                ]}
                activeOpacity={0.7}
                onPress={toggleEmojiPicker}
              >
                <Ionicons
                  name={isEmojiPickerVisible ? "happy" : "happy-outline"}
                  size={moderateScale(24)}
                  color={
                    isEmojiPickerVisible
                      ? themeSecond.accentPurple
                      : themeSecond.textSoft
                  }
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[
                styles.sendButton,
                inputText.trim().length > 0 && styles.sendButtonActive,
              ]}
              onPress={sendMessage}
              activeOpacity={0.7}
              disabled={inputText.trim().length === 0 || isSending}
            >
              {isSending ? (
                <ActivityIndicator
                  size="small"
                  color={themeSecond.textPrimary}
                />
              ) : (
                <Ionicons
                  name="send"
                  size={moderateScale(20)}
                  color={
                    inputText.trim().length > 0
                      ? themeSecond.textPrimary
                      : themeSecond.textSoft
                  }
                />
              )}
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeSecond.bgDark,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(10),
    backgroundColor: themeSecond.bgDark,
    borderBottomWidth: moderateScale(1),
    borderBottomColor: themeSecond.borderLight,
  },
  headerIconCircle: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: themeSecond.glassBg,
    borderWidth: moderateScale(1),
    borderColor: themeSecond.glassBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  userInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: moderateScale(12),
  },
  avatarRingLarge: {
    position: "relative",
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(22),
    padding: moderateScale(2),
    backgroundColor: themeSecond.avatarRingBg,
    borderWidth: moderateScale(1.5),
    borderColor: themeSecond.accentPurpleMedium,
  },
  avatarInnerLarge: {
    width: "100%",
    height: "100%",
    borderRadius: moderateScale(20),
    backgroundColor: themeSecond.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImageLarge: {
    width: "100%",
    height: "100%",
    borderRadius: moderateScale(20),
  },
  avatarText: {
    fontSize: moderateScale(16),
    fontWeight: "700",
    color: themeSecond.accentPurple,
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: moderateScale(12),
    height: moderateScale(12),
    borderRadius: moderateScale(6),
    backgroundColor: themeSecond.onlineGreen,
    borderWidth: moderateScale(2),
    borderColor: themeSecond.bgDark,
  },
  userDetails: {
    marginLeft: moderateScale(12),
  },
  userName: {
    fontSize: moderateScale(15),
    fontWeight: "600",
    color: themeSecond.textPrimary,
  },
  userStatus: {
    fontSize: moderateScale(12),
    color: themeSecond.onlineGreen,
    marginTop: verticalScale(2),
  },
  userStatusOffline: {
    color: themeSecond.textSoft,
  },
  headerActions: {
    flexDirection: "row",
    gap: moderateScale(6),
  },
  headerActionButton: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: themeSecond.glassBg,
    borderWidth: moderateScale(1),
    borderColor: themeSecond.glassBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  dateSeparator: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: moderateScale(20),
    paddingVertical: verticalScale(16),
  },
  dateLine: {
    flex: 1,
    height: verticalScale(1),
    backgroundColor: themeSecond.borderLight,
  },
  dateText: {
    fontSize: moderateScale(12),
    color: themeSecond.textSoft,
    paddingHorizontal: moderateScale(12),
    fontWeight: "500",
  },
  keyboardAvoid: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: moderateScale(16),
    paddingBottom: verticalScale(16),
  },
  messagesEmptyContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: verticalScale(40),
  },
  messagesTypingContent: {
    flexGrow: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: verticalScale(10),
    paddingTop: verticalScale(10),
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    gap: verticalScale(8),
    paddingTop: verticalScale(20),
    paddingHorizontal: moderateScale(16),
  },
  newMatchCard: {
    width: "100%",
    paddingVertical: verticalScale(8),
    paddingHorizontal: moderateScale(4),
    backgroundColor: "transparent",
  },
  newMatchImageWrap: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    minHeight: verticalScale(260),
  },
  newMatchImage: {
    width: moderateScale(220),
    height: verticalScale(300),
  },
  newMatchSparkle: {
    position: "absolute",
    width: moderateScale(10),
    height: moderateScale(10),
    borderRadius: moderateScale(5),
    backgroundColor: "#E8D8FF",
  },
  newMatchSparkleOne: {
    top: verticalScale(42),
    right: moderateScale(32),
  },
  newMatchSparkleTwo: {
    top: verticalScale(125),
    left: moderateScale(28),
  },
  emptyText: {
    color: themeSecond.textPrimary,
    fontSize: moderateScale(16),
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: moderateScale(0.2),
  },
  errorText: {
    color: themeSecond.optionOrange,
    fontSize: moderateScale(13),
    textAlign: "center",
  },
  messageContainer: {
    flexDirection: "row",
    marginBottom: verticalScale(12),
    alignItems: "flex-end",
  },
  messageContainerMe: {
    justifyContent: "flex-end",
  },
  messageContainerOther: {
    justifyContent: "flex-start",
  },
  messageAvatar: {
    marginRight: moderateScale(8),
  },
  avatarRing: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    padding: moderateScale(2),
    backgroundColor: themeSecond.avatarRingBg,
    borderWidth: moderateScale(1),
    borderColor: themeSecond.accentPurpleMedium,
  },
  avatarInner: {
    width: "100%",
    height: "100%",
    borderRadius: moderateScale(14),
    backgroundColor: themeSecond.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImageSmall: {
    width: "100%",
    height: "100%",
    borderRadius: moderateScale(14),
  },
  avatarSmallText: {
    fontSize: moderateScale(10),
    fontWeight: "700",
    color: themeSecond.accentPurple,
  },
  messageBubbleWrapper: {
    maxWidth: "75%",
  },
  messageBubble: {
    paddingHorizontal: moderateScale(14),
    paddingVertical: verticalScale(10),
    borderRadius: moderateScale(18),
  },
  messageBubbleMe: {
    backgroundColor: themeSecond.primaryActionPurple,
    borderBottomRightRadius: moderateScale(4),
  },
  messageBubbleOther: {
    backgroundColor: themeSecond.surfaceCard,
    borderWidth: moderateScale(1),
    borderColor: themeSecond.borderLight,
    borderBottomLeftRadius: moderateScale(4),
  },
  messageText: {
    fontSize: moderateScale(14),
    lineHeight: moderateScale(20),
  },
  messageTextMe: {
    color: themeSecond.textPrimary,
  },
  messageTextOther: {
    color: themeSecond.textPrimary,
  },
  messageInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: verticalScale(4),
    gap: moderateScale(4),
  },
  messageInfoMe: {
    justifyContent: "flex-end",
  },
  messageInfoOther: {
    justifyContent: "flex-start",
  },
  messageTime: {
    fontSize: moderateScale(10),
    color: themeSecond.textSoft,
  },
  statusIcon: {
    marginLeft: moderateScale(2),
  },
  typingBubble: {
    backgroundColor: themeSecond.surfaceCard,
    paddingHorizontal: moderateScale(16),
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(18),
    borderBottomLeftRadius: moderateScale(4),
    borderWidth: moderateScale(1),
    borderColor: themeSecond.borderLight,
  },
  typingDots: {
    flexDirection: "row",
    gap: moderateScale(4),
  },
  typingDot: {
    width: moderateScale(8),
    height: moderateScale(8),
    borderRadius: moderateScale(4),
    backgroundColor: themeSecond.accentPurple,
  },
  emojiPickerContainer: {
    marginHorizontal: moderateScale(12),
    marginBottom: verticalScale(6),
    backgroundColor: themeSecond.glassBg,
    borderWidth: moderateScale(1),
    borderColor: themeSecond.glassBorder,
    borderRadius: moderateScale(18),
    maxHeight: verticalScale(220),
    overflow: "hidden",
  },
  emojiPickerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: moderateScale(14),
    paddingVertical: verticalScale(10),
    borderBottomWidth: moderateScale(1),
    borderBottomColor: themeSecond.borderLight,
  },
  emojiPickerTitle: {
    color: themeSecond.textPrimary,
    fontSize: moderateScale(13),
    fontWeight: "600",
  },
  emojiCloseButton: {
    width: moderateScale(28),
    height: moderateScale(28),
    borderRadius: moderateScale(14),
    backgroundColor: themeSecond.surfaceCard,
    borderWidth: moderateScale(1),
    borderColor: themeSecond.borderLight,
    alignItems: "center",
    justifyContent: "center",
  },
  emojiGrid: {
    maxHeight: verticalScale(168),
  },
  emojiTabRow: {
    flexDirection: "row",
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(8),
    gap: moderateScale(8),
    borderBottomWidth: moderateScale(1),
    borderBottomColor: themeSecond.borderLight,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  emojiTabButton: {
    borderRadius: moderateScale(999),
    paddingVertical: verticalScale(7),
    paddingHorizontal: moderateScale(14),
    alignItems: "center",
    backgroundColor: themeSecond.surfaceCard,
    borderWidth: moderateScale(1),
    borderColor: themeSecond.borderLight,
  },
  emojiTabButtonActive: {
    backgroundColor: themeSecond.accentPurpleLight,
    borderColor: themeSecond.accentPurpleMedium,
  },
  emojiTabText: {
    color: themeSecond.textSoft,
    fontSize: moderateScale(12),
    fontWeight: "600",
  },
  emojiTabTextActive: {
    color: themeSecond.accentPurple,
  },
  emojiGridContent: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: moderateScale(10),
    paddingVertical: verticalScale(10),
    gap: moderateScale(8),
  },
  emojiItem: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(10),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: themeSecond.surfaceCard,
    borderWidth: moderateScale(1),
    borderColor: themeSecond.borderLight,
  },
  emojiText: {
    fontSize: moderateScale(20),
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(10),
    backgroundColor: themeSecond.bgDark,
    borderTopWidth: moderateScale(1),
    borderTopColor: themeSecond.borderLight,
    gap: moderateScale(8),
  },
  matchDeletedBanner: {
    marginHorizontal: moderateScale(12),
    marginBottom: verticalScale(6),
    backgroundColor: themeSecond.glassBg,
    borderWidth: moderateScale(1),
    borderColor: themeSecond.optionOrange,
    borderRadius: moderateScale(16),
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(10),
  },
  matchDeletedBannerText: {
    color: themeSecond.optionOrange,
    fontSize: moderateScale(12),
    fontWeight: "700",
    textAlign: "center",
  },
  attachButton: {
    width: moderateScale(44),
    height: moderateScale(44),
    alignItems: "center",
    justifyContent: "center",
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: themeSecond.glassBg,
    borderRadius: moderateScale(24),
    paddingHorizontal: moderateScale(16),
    paddingVertical: verticalScale(8),
    minHeight: moderateScale(44),
    maxHeight: verticalScale(120),
    borderWidth: moderateScale(1),
    borderColor: themeSecond.glassBorder,
  },
  textInput: {
    flex: 1,
    fontSize: moderateScale(15),
    color: themeSecond.textPrimary,
    paddingVertical: verticalScale(4),
    maxHeight: verticalScale(100),
  },
  emojiButton: {
    paddingLeft: moderateScale(8),
    paddingBottom: verticalScale(2),
  },
  emojiButtonActive: {
    opacity: 1,
  },
  sendButton: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(22),
    backgroundColor: themeSecond.surfaceWhiteSubtle,
    borderWidth: moderateScale(1),
    borderColor: themeSecond.glassBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonActive: {
    backgroundColor: themeSecond.primaryActionPurple,
    borderColor: themeSecond.accentPurpleMedium,
  },
});
