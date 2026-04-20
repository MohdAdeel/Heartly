import {
  Text,
  View,
  Modal,
  Image,
  FlatList,
  Platform,
  Animated,
  Vibration,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import {
  HARD_CODED_CONVERSATIONS,
  type ConversationItem,
} from "../constants/conversations";
import {
  SkeletonBox,
  SkeletonShimmer,
  useShimmerAnimation,
} from "../components/SkeletonLoader";
import { themeSecond } from "../theme/colorSecond";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import { getInitials, formatRelativeTime } from "../utils/helpers";
import type { MainStackParamList } from "../types/navigation.types";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { moderateScale, verticalScale } from "react-native-size-matters";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

const getCurrentUser = async () => ({ id: "local-user" });
const supabase = {
  channel: (..._args: any[]) => ({
    on(..._args: any[]) {
      return this;
    },
    subscribe(..._args: any[]) {
      return this;
    },
  }),
  removeChannel(..._args: any[]) {},
};

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
    <View style={styles.typingChip}>
      <Text style={styles.typingLabel}>Typing</Text>
      <View style={styles.typingDots}>
        <Animated.View
          style={[
            styles.dot,
            {
              opacity: dot1Anim,
              transform: [
                {
                  scale: dot1Anim.interpolate({
                    inputRange: [0.3, 1],
                    outputRange: [0.8, 1.15],
                  }),
                },
              ],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.dot,
            {
              opacity: dot2Anim,
              transform: [
                {
                  scale: dot2Anim.interpolate({
                    inputRange: [0.3, 1],
                    outputRange: [0.8, 1.15],
                  }),
                },
              ],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.dot,
            {
              opacity: dot3Anim,
              transform: [
                {
                  scale: dot3Anim.interpolate({
                    inputRange: [0.3, 1],
                    outputRange: [0.8, 1.15],
                  }),
                },
              ],
            },
          ]}
        />
      </View>
    </View>
  );
};

const triggerAnimation = (
  scaleAnim: Animated.Value,
  shakeAnim: Animated.Value,
  shakeAmount: number
) => {
  scaleAnim.setValue(1);
  shakeAnim.setValue(0);

  Animated.parallel([
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.3,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]),
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: -shakeAmount,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: shakeAmount,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -shakeAmount,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: shakeAmount,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]),
  ]).start();
};

const AnimatedUnreadBadge = ({
  count,
  animationKey,
}: {
  count: number;
  animationKey: number;
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animationKey > 0) {
      const firstTimer = setTimeout(
        () => triggerAnimation(scaleAnim, shakeAnim, moderateScale(5)),
        2000
      );
      const interval = setInterval(
        () => triggerAnimation(scaleAnim, shakeAnim, moderateScale(5)),
        7000
      );
      return () => {
        clearTimeout(firstTimer);
        clearInterval(interval);
      };
    }
  }, [animationKey, scaleAnim, shakeAnim]);

  return (
    <Animated.View
      style={[
        styles.unreadBadge,
        { transform: [{ scale: scaleAnim }, { translateX: shakeAnim }] },
      ]}
    >
      <Text style={styles.unreadCount}>{count}</Text>
    </Animated.View>
  );
};

const InboxScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const [searchQuery, setSearchQuery] = useState("");
  const [animationTrigger, setAnimationTrigger] = useState(0);
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authUserId, setAuthUserId] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [typingByConversation, setTypingByConversation] = useState<
    Record<string, boolean>
  >({});
  const [selectedConversationIds, setSelectedConversationIds] = useState<
    Set<string>
  >(() => new Set());
  const [isActionsMenuVisible, setIsActionsMenuVisible] = useState(false);
  const menuAnim = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useShimmerAnimation(loading);
  const typingChannelsRef = useRef<
    Record<string, ReturnType<typeof supabase.channel>>
  >({});
  const typingTimeoutsRef = useRef<
    Record<string, ReturnType<typeof setTimeout>>
  >({});

  const loadConversations = useCallback(async (silent = false) => {
    if (!silent) {
      setLoading(true);
    }
    setError(null);
    try {
      const data = HARD_CODED_CONVERSATIONS.map((item) => ({ ...item }));
      setConversations(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load conversations"
      );
      setConversations([]);
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    setAnimationTrigger(1);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loadCurrentUser = async () => {
      const user = await getCurrentUser();
      if (!cancelled) {
        setAuthUserId(user?.id || "");
      }
    };
    loadCurrentUser();
    return () => {
      cancelled = true;
    };
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadConversations(true);
    } finally {
      setRefreshing(false);
    }
  }, [loadConversations]);

  useFocusEffect(
    useCallback(() => {
      setAnimationTrigger((prev) => prev + 1);
      // Always refetch with loader visible
      loadConversations(false);
    }, [loadConversations])
  );

  useEffect(() => {
    if (!authUserId) return;

    const conversationIds = new Set(conversations.map((c) => c.id));

    // Subscribe newly loaded conversations for typing broadcasts.
    conversations.forEach((c) => {
      if (typingChannelsRef.current[c.id]) return;

      const channel = supabase
        .channel(`chat-messages-${c.id}`)
        .on("broadcast", { event: "typing" }, (payload: any) => {
          const data = payload?.payload as
            | {
                conversation_id?: string;
                sender_id?: string;
                is_typing?: boolean;
              }
            | undefined;

          if (!data?.conversation_id || data.conversation_id !== c.id) return;
          if (!data.sender_id || data.sender_id === authUserId) return;

          const isTyping = !!data.is_typing;

          setTypingByConversation((prev) => ({
            ...prev,
            [c.id]: isTyping,
          }));

          if (typingTimeoutsRef.current[c.id]) {
            clearTimeout(typingTimeoutsRef.current[c.id]);
            delete typingTimeoutsRef.current[c.id];
          }

          if (isTyping) {
            typingTimeoutsRef.current[c.id] = setTimeout(() => {
              setTypingByConversation((prev) => ({
                ...prev,
                [c.id]: false,
              }));
              delete typingTimeoutsRef.current[c.id];
            }, 2000);
          }
        })
        .subscribe();

      typingChannelsRef.current[c.id] = channel;
    });

    // Cleanup channels that are no longer in the inbox list.
    Object.keys(typingChannelsRef.current).forEach((conversationId) => {
      if (!conversationIds.has(conversationId)) {
        const channel = typingChannelsRef.current[conversationId];
        supabase.removeChannel(channel);
        delete typingChannelsRef.current[conversationId];
      }
    });
  }, [conversations, authUserId]);

  useEffect(() => {
    return () => {
      Object.values(typingChannelsRef.current).forEach((channel) => {
        supabase.removeChannel(channel);
      });
      typingChannelsRef.current = {};

      Object.values(typingTimeoutsRef.current).forEach((timeout) => {
        clearTimeout(timeout);
      });
      typingTimeoutsRef.current = {};
    };
  }, []);

  useEffect(() => {
    let channelUser1: ReturnType<typeof supabase.channel> | null = null;
    let channelUser2: ReturnType<typeof supabase.channel> | null = null;
    let messagesChannel: ReturnType<typeof supabase.channel> | null = null;
    let cancelled = false;

    const bootstrapRealtime = async () => {
      const user = await getCurrentUser();
      const userId = user?.id || "";
      if (!userId || cancelled) return;

      const onConversationChanged = () => {
        setAnimationTrigger((prev) => prev + 1);
        loadConversations(true);
      };

      // Keep these channels alive while screen is mounted, even when blurred.
      channelUser1 = supabase
        .channel(`inbox-conversations-user1-${userId}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "conversations",
            filter: `user1_id=eq.${userId}`,
          },
          onConversationChanged
        )
        .subscribe();

      channelUser2 = supabase
        .channel(`inbox-conversations-user2-${userId}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "conversations",
            filter: `user2_id=eq.${userId}`,
          },
          onConversationChanged
        )
        .subscribe();

      messagesChannel = supabase
        .channel(`inbox-messages-${userId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `sender_id=neq.${userId}`,
          },
          (payload: any) => {
            const incoming = payload.new as {
              conversation_id?: string;
              message_text?: string | null;
              created_at?: string | null;
            };

            setAnimationTrigger((prev) => prev + 1);

            // Optimistic local row update for instant UI response.
            if (incoming?.conversation_id) {
              let foundConversation = false;
              setConversations((prev) => {
                const next = prev.map((c) => {
                  if (c.id !== incoming.conversation_id) return c;
                  foundConversation = true;
                  return {
                    ...c,
                    last_message: incoming.message_text ?? c.last_message,
                    last_message_at: incoming.created_at ?? c.last_message_at,
                    unread_count: (c.unread_count || 0) + 1,
                  };
                });

                if (!foundConversation) return next;

                // Move updated conversation to top immediately.
                next.sort((a, b) => {
                  const aTime = a.last_message_at
                    ? new Date(a.last_message_at).getTime()
                    : 0;
                  const bTime = b.last_message_at
                    ? new Date(b.last_message_at).getTime()
                    : 0;
                  return bTime - aTime;
                });
                return next;
              });
            }

            // Keep backend as source of truth for edge cases.
            loadConversations(true);
          }
        )
        .subscribe();
    };

    bootstrapRealtime();

    return () => {
      cancelled = true;
      if (channelUser1) supabase.removeChannel(channelUser1);
      if (channelUser2) supabase.removeChannel(channelUser2);
      if (messagesChannel) supabase.removeChannel(messagesChannel);
    };
  }, [loadConversations]);

  const filteredConversations = conversations.filter((c) => {
    const name = (c.other_user_name || "").toLowerCase();
    return name.includes(searchQuery.toLowerCase());
  });

  const displayName = (c: ConversationItem) =>
    c.other_user_name?.trim() || "Unknown";

  const selectedCount = selectedConversationIds.size;
  const shouldShowUnmute = conversations.some(
    (c) => selectedConversationIds.has(c.id) && c.is_muted === true
  );
  const muteMenuLabel = shouldShowUnmute ? "Unmute" : "Mute";
  const shouldShowMarkAsRead = conversations.some(
    (c) => selectedConversationIds.has(c.id) && c.is_marked_unread === true
  );
  const markUnreadMenuLabel = shouldShowMarkAsRead
    ? "Mark as read"
    : "Mark as unread";

  const closeActionsMenu = useCallback(() => {
    Animated.timing(menuAnim, {
      toValue: 0,
      duration: 140,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) setIsActionsMenuVisible(false);
    });
  }, [menuAnim]);

  const openActionsMenu = useCallback(() => {
    setIsActionsMenuVisible(true);
    Animated.timing(menuAnim, {
      toValue: 1,
      duration: 160,
      useNativeDriver: true,
    }).start();
  }, [menuAnim]);

  const toggleConversationSelected = useCallback((conversationId: string) => {
    setSelectedConversationIds((prev) => {
      const next = new Set(prev);
      if (next.has(conversationId)) {
        next.delete(conversationId);
      } else {
        next.add(conversationId);
      }
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedConversationIds(new Set());
  }, []);

  const handleAction = useCallback(
    async (actionKey: string) => {
      const selectedIds = [...selectedConversationIds];

      try {
        if (actionKey === "mute") {
          // Optimistic UI
          setConversations((prev) =>
            prev.map((c) =>
              selectedIds.includes(c.id)
                ? { ...c, is_muted: !(c.is_muted === true) }
                : c
            )
          );

          return;
        } else if (actionKey === "mark_unread") {
          // Optimistic UI
          setConversations((prev) =>
            prev.map((c) =>
              selectedIds.includes(c.id)
                ? { ...c, is_marked_unread: !(c.is_marked_unread === true) }
                : c
            )
          );

          return;
        } else if (actionKey === "delete_chat") {
          setConversations((prev) =>
            prev.filter(
              (conversation) => !selectedIds.includes(conversation.id)
            )
          );
          return;
        } else if (actionKey === "delete_match") {
          setConversations((prev) =>
            prev.filter(
              (conversation) => !selectedIds.includes(conversation.id)
            )
          );
          return;
        }
      } catch (e) {
        console.error("Inbox action failed:", actionKey, e);
      } finally {
        closeActionsMenu();
        clearSelection();
      }
    },
    [
      closeActionsMenu,
      clearSelection,
      loadConversations,
      selectedConversationIds,
    ]
  );

  const renderMessageItem = ({ item }: { item: ConversationItem }) => {
    const isOnline = false;
    const isSelected = selectedConversationIds.has(item.id);
    const isSelectionMode = selectedCount > 0;
    const isMatchDeleted = item.is_match_deleted === true;
    const previewText = isMatchDeleted
      ? "Match is Deleted"
      : item.last_message || "You matched! Start chatting now!";

    return (
      <TouchableOpacity
        style={[styles.messageRow, isSelected && styles.messageRowSelected]}
        activeOpacity={0.7}
        onPress={() => {
          if (isSelectionMode) {
            toggleConversationSelected(item.id);
            return;
          }
          navigation.navigate("ChatScreen", {
            conversationId: item.id,
            userId: item.other_user_id,
            userName: displayName(item),
            userAvatar: item.other_user_avatar_url,
          });
        }}
        onLongPress={() => {
          Vibration.vibrate(20);
          toggleConversationSelected(item.id);
        }}
      >
        {item.is_marked_unread === true && (
          <View style={styles.markedUnreadDot} />
        )}
        <View style={styles.avatarRing}>
          <View style={styles.avatarInner}>
            {item.other_user_avatar_url ? (
              <Image
                source={{ uri: item.other_user_avatar_url }}
                style={styles.avatar}
                resizeMode="cover"
              />
            ) : (
              <View
                style={[
                  styles.avatarPlaceholder,
                  styles.avatarPlaceholderMinHeight,
                ]}
              >
                <Text style={styles.avatarText}>
                  {getInitials(displayName(item))}
                </Text>
              </View>
            )}
          </View>
          {isOnline && <View style={styles.onlineIndicator} />}
        </View>

        <View style={styles.messageContent}>
          <Text
            style={[
              styles.userName,
              (item.unread_count || 0) > 0 && styles.userNameBold,
            ]}
            numberOfLines={1}
          >
            {displayName(item)}
          </Text>
          {typingByConversation[item.id] ? (
            <AnimatedTypingDots />
          ) : (
            <Text
              style={[
                styles.lastMessage,
                (item.unread_count || 0) > 0 && styles.lastMessageUnread,
              ]}
              numberOfLines={1}
            >
              {previewText}
            </Text>
          )}
        </View>

        <View style={styles.rightMeta}>
          <Text style={styles.timestamp}>
            {item.last_message_at
              ? formatRelativeTime(item.last_message_at)
              : "—"}
          </Text>
          {item.is_muted === true && (
            <View style={styles.mutedIconWrap}>
              <Ionicons
                name="notifications-off-outline"
                size={moderateScale(16)}
                color={themeSecond.textSoft}
              />
            </View>
          )}
          {(item.unread_count || 0) > 0 && (
            <AnimatedUnreadBadge
              count={item.unread_count || 0}
              animationKey={animationTrigger}
            />
          )}
          {isSelected && (
            <View style={styles.selectedCheck}>
              <Ionicons
                name="checkmark"
                size={moderateScale(14)}
                color={themeSecond.textPrimary}
              />
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };
  const renderEmptyState = () => {
    if (loading) {
      return (
        <View style={styles.loadingSkeletonContainer}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <View key={`inbox-skeleton-${item}`} style={styles.loadingRow}>
              <SkeletonShimmer
                shimmerAnim={shimmerAnim}
                style={styles.loadingAvatar}
              />
              <View style={styles.loadingContent}>
                <SkeletonBox
                  shimmerAnim={shimmerAnim}
                  width={moderateScale(120)}
                  height={moderateScale(15)}
                  borderRadius={moderateScale(6)}
                  style={{ marginBottom: verticalScale(8) }}
                />
                <SkeletonBox
                  shimmerAnim={shimmerAnim}
                  width="88%"
                  height={moderateScale(12)}
                  borderRadius={moderateScale(6)}
                />
              </View>
              <View style={styles.loadingMeta}>
                <SkeletonBox
                  shimmerAnim={shimmerAnim}
                  width={moderateScale(42)}
                  height={moderateScale(10)}
                  borderRadius={moderateScale(5)}
                  style={{ marginBottom: verticalScale(10) }}
                />
                <SkeletonShimmer
                  shimmerAnim={shimmerAnim}
                  style={styles.loadingUnreadDot}
                />
              </View>
            </View>
          ))}
        </View>
      );
    }
    if (error) {
      return (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconCircle}>
            <Ionicons
              name="alert-circle-outline"
              size={moderateScale(48)}
              color={themeSecond.optionOrange}
            />
          </View>
          <Text style={styles.emptyTitle}>Couldn't load conversations</Text>
          <Text style={styles.emptySubtitle}>{error}</Text>
        </View>
      );
    }
    return (
      <View style={styles.emptyState}>
        <View style={styles.emptyIconCircle}>
          <Ionicons
            name="chatbubbles-outline"
            size={moderateScale(48)}
            color={themeSecond.accentPurple}
          />
        </View>
        <Text style={styles.emptyTitle}>No Messages Yet</Text>
        <Text style={styles.emptySubtitle}>
          Start connecting with matches to begin conversations
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Modal
        visible={isActionsMenuVisible}
        transparent
        animationType="none"
        onRequestClose={closeActionsMenu}
      >
        <TouchableOpacity
          style={styles.menuBackdrop}
          activeOpacity={1}
          onPress={closeActionsMenu}
        >
          <Animated.View
            style={[
              styles.actionsMenu,
              {
                opacity: menuAnim,
                transform: [
                  {
                    scale: menuAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.98, 1],
                    }),
                  },
                  {
                    translateY: menuAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-6, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.actionsMenuTitle}>
              {selectedCount > 0 ? `${selectedCount} selected` : "Options"}
            </Text>

            <TouchableOpacity
              style={styles.menuItem}
              activeOpacity={0.75}
              onPress={() => handleAction("mute")}
            >
              <View style={styles.menuItemIconCircle}>
                <Ionicons
                  name="notifications-off-outline"
                  size={moderateScale(18)}
                  color={themeSecond.textPrimary}
                />
              </View>
              <Text style={styles.menuItemText}>{muteMenuLabel}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              activeOpacity={0.75}
              onPress={() => handleAction("mark_unread")}
            >
              <View style={styles.menuItemIconCircle}>
                <Ionicons
                  name="mail-unread-outline"
                  size={moderateScale(18)}
                  color={themeSecond.textPrimary}
                />
              </View>
              <Text style={styles.menuItemText}>{markUnreadMenuLabel}</Text>
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            {/* <TouchableOpacity
              style={styles.menuItem}
              activeOpacity={0.75}
              onPress={() => handleAction('block')}
            >
              <View style={styles.menuItemIconCircle}>
                <Ionicons
                  name="ban-outline"
                  size={moderateScale(18)}
                  color={themeSecond.optionOrange}
                />
              </View>
              <Text style={styles.menuItemTextDanger}>Block</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              activeOpacity={0.75}
              onPress={() => handleAction('report')}
            >
              <View style={styles.menuItemIconCircle}>
                <Ionicons
                  name="flag-outline"
                  size={moderateScale(18)}
                  color={themeSecond.optionOrange}
                />
              </View>
              <Text style={styles.menuItemTextDanger}>Report</Text>
            </TouchableOpacity> */}

            <View style={styles.menuDivider} />

            <TouchableOpacity
              style={styles.menuItem}
              activeOpacity={0.75}
              onPress={() => handleAction("delete_chat")}
            >
              <View style={styles.menuItemIconCircle}>
                <Ionicons
                  name="trash-outline"
                  size={moderateScale(18)}
                  color={themeSecond.optionOrange}
                />
              </View>
              <Text style={styles.menuItemTextDanger}>Delete chat</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              activeOpacity={0.75}
              onPress={() => handleAction("delete_match")}
            >
              <View style={styles.menuItemIconCircle}>
                <Ionicons
                  name="person-remove-outline"
                  size={moderateScale(18)}
                  color={themeSecond.optionOrange}
                />
              </View>
              <Text style={styles.menuItemTextDanger}>Delete match</Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View
            style={styles.headerIconCircleAccent}
            accessibilityRole="image"
            accessibilityLabel="Messages"
          >
            <Ionicons
              name="chatbubbles-outline"
              size={moderateScale(22)}
              color={themeSecond.accentPurple}
            />
          </View>
          <View style={styles.headerTitleBlock}>
            <Text style={styles.headerTitle}>
              {selectedCount > 0 ? `${selectedCount} Selected` : "Messages"}
            </Text>
            <Text style={styles.headerSubtitle}>
              {selectedCount > 0
                ? "Use the menu for bulk actions"
                : "Your conversations"}
            </Text>
          </View>
        </View>
        {selectedCount > 0 ? (
          <TouchableOpacity
            style={styles.headerIconCircle}
            onPress={() => {
              if (isActionsMenuVisible) {
                closeActionsMenu();
                return;
              }
              openActionsMenu();
            }}
            activeOpacity={0.7}
          >
            <Ionicons
              name="ellipsis-vertical"
              size={moderateScale(22)}
              color={themeSecond.textPrimary}
            />
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.searchWrap}>
        <View style={styles.searchBar}>
          <Ionicons
            name="search"
            size={moderateScale(20)}
            color={themeSecond.textSoft}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor={themeSecond.textSoft}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery("")}
              hitSlop={{
                top: moderateScale(12),
                bottom: moderateScale(12),
                left: moderateScale(12),
                right: moderateScale(12),
              }}
            >
              <Ionicons
                name="close-circle"
                size={moderateScale(20)}
                color={themeSecond.textSoft}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.storiesScroll}
        style={styles.storiesScrollView}
      >
        {storyUsers.map(renderStoryItem)}
      </ScrollView> */}

      <Text style={styles.sectionTitle}>Chat</Text>

      <FlatList
        data={filteredConversations}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          filteredConversations.length === 0 && styles.listContentEmpty,
        ]}
        refreshing={refreshing}
        onRefresh={onRefresh}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
};

export default InboxScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeSecond.bgDark,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: moderateScale(16),
    paddingVertical: verticalScale(12),
    backgroundColor: themeSecond.bgDark,
    borderBottomWidth: moderateScale(1),
    borderBottomColor: themeSecond.borderLight,
  },
  headerLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(12),
    minWidth: 0,
    marginRight: moderateScale(8),
  },
  headerTitleBlock: {
    flex: 1,
    minWidth: 0,
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
  headerIconCircleAccent: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(22),
    backgroundColor: themeSecond.accentPurpleLight,
    borderWidth: moderateScale(1),
    borderColor: themeSecond.accentPurpleMedium,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: moderateScale(18),
    fontWeight: "700",
    color: themeSecond.textPrimary,
  },
  headerSubtitle: {
    fontSize: moderateScale(12),
    color: themeSecond.textSoft,
    marginTop: verticalScale(2),
  },
  searchWrap: {
    paddingHorizontal: moderateScale(16),
    marginVertical: verticalScale(12),
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: themeSecond.glassBg,
    borderRadius: moderateScale(14),
    paddingHorizontal: moderateScale(14),
    paddingVertical: verticalScale(12),
    gap: moderateScale(10),
    borderWidth: moderateScale(1),
    borderColor: themeSecond.glassBorder,
  },
  searchInput: {
    flex: 1,
    fontSize: moderateScale(15),
    color: themeSecond.textPrimary,
    padding: 0,
  },
  storiesScrollView: {
    maxHeight: verticalScale(100),
  },
  storiesScroll: {
    paddingHorizontal: moderateScale(16),
    paddingBottom: verticalScale(16),
  },
  storyItem: {
    alignItems: "center",
    width: moderateScale(72),
    marginRight: moderateScale(16),
  },
  storyAvatarRing: {
    position: "relative",
    width: moderateScale(64),
    height: moderateScale(64),
    borderRadius: moderateScale(32),
    padding: moderateScale(2),
    backgroundColor: themeSecond.avatarRingBg,
    borderWidth: moderateScale(2),
    borderColor: themeSecond.accentPurpleMedium,
    marginBottom: verticalScale(6),
    alignItems: "center",
    justifyContent: "center",
    shadowColor: themeSecond.accentPurple,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: moderateScale(8),
    elevation: moderateScale(4),
  },
  storyAvatarInner: {
    width: "100%",
    height: "100%",
    borderRadius: moderateScale(30),
    overflow: "hidden",
  },
  storyAvatar: {
    width: "100%",
    height: "100%",
    borderRadius: moderateScale(30),
  },
  storyAvatarPlaceholder: {
    flex: 1,
    backgroundColor: themeSecond.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  storyAvatarText: {
    fontSize: moderateScale(18),
    fontWeight: "700",
    color: themeSecond.accentPurple,
  },
  storyOnlineDot: {
    position: "absolute",
    bottom: moderateScale(2),
    right: moderateScale(2),
    width: moderateScale(14),
    height: moderateScale(14),
    borderRadius: moderateScale(7),
    backgroundColor: themeSecond.onlineGreen,
    borderWidth: moderateScale(2),
    borderColor: themeSecond.bgDark,
  },
  storyName: {
    fontSize: moderateScale(12),
    color: themeSecond.textPrimary,
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: moderateScale(22),
    fontWeight: "700",
    color: themeSecond.textPrimary,
    paddingHorizontal: moderateScale(16),
    marginVertical: verticalScale(10),
  },
  listContent: {
    paddingHorizontal: moderateScale(16),
    paddingBottom: verticalScale(100),
  },
  listContentEmpty: {
    flexGrow: 1,
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: verticalScale(12),
    gap: moderateScale(14),
  },
  markedUnreadDot: {
    width: moderateScale(8),
    height: moderateScale(8),
    borderRadius: moderateScale(4),
    backgroundColor: themeSecond.optionOrange,
  },
  messageRowSelected: {
    ...Platform.select({
      ios: {
        backgroundColor: themeSecond.glassBg,
        borderWidth: moderateScale(1),
        borderColor: themeSecond.accentPurpleMedium,
        borderRadius: moderateScale(16),
        paddingHorizontal: moderateScale(10),
        shadowColor: themeSecond.accentPurple,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: moderateScale(10),
      },
      android: {
        backgroundColor: themeSecond.accentPurpleLight,
        borderWidth: moderateScale(1),
        borderColor: themeSecond.accentPurpleMedium,
        borderRadius: moderateScale(16),
        paddingHorizontal: moderateScale(10),
        overflow: "hidden",
      },
      default: {
        backgroundColor: themeSecond.glassBg,
        borderWidth: moderateScale(1),
        borderColor: themeSecond.accentPurpleMedium,
        borderRadius: moderateScale(16),
        paddingHorizontal: moderateScale(10),
      },
    }),
  },
  avatarRing: {
    position: "relative",
    width: moderateScale(52),
    height: moderateScale(52),
    borderRadius: moderateScale(26),
    padding: moderateScale(2),
    backgroundColor: themeSecond.avatarRingBg,
    borderWidth: moderateScale(1.5),
    borderColor: themeSecond.accentPurpleMedium,
  },
  avatarInner: {
    width: "100%",
    height: "100%",
    borderRadius: moderateScale(24),
    overflow: "hidden",
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: moderateScale(24),
  },
  avatarPlaceholder: {
    flex: 1,
    backgroundColor: themeSecond.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarPlaceholderMinHeight: {
    minHeight: moderateScale(48),
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
  messageContent: {
    flex: 1,
    minWidth: 0,
  },
  userName: {
    fontSize: moderateScale(15),
    color: themeSecond.textPrimary,
    fontWeight: "500",
    marginBottom: verticalScale(2),
  },
  userNameBold: {
    fontWeight: "700",
  },
  lastMessage: {
    fontSize: moderateScale(13),
    color: themeSecond.textSoft,
  },
  lastMessageUnread: {
    color: themeSecond.textMuted,
    fontWeight: "500",
  },
  rightMeta: {
    alignItems: "flex-end",
    gap: verticalScale(4),
  },
  mutedIconWrap: {
    paddingTop: verticalScale(1),
  },
  selectedCheck: {
    width: moderateScale(22),
    height: moderateScale(22),
    borderRadius: moderateScale(11),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: themeSecond.accentPurpleMedium,
    borderWidth: moderateScale(1),
    borderColor: themeSecond.glassBorder,
    marginTop: verticalScale(2),
  },
  timestamp: {
    fontSize: moderateScale(12),
    color: themeSecond.textSoft,
  },
  unreadBadge: {
    backgroundColor: themeSecond.optionOrange,
    minWidth: moderateScale(22),
    height: moderateScale(22),
    borderRadius: moderateScale(11),
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: moderateScale(6),
  },
  unreadCount: {
    fontSize: moderateScale(11),
    color: themeSecond.textPrimary,
    fontWeight: "700",
  },
  separator: {
    height: verticalScale(1),
    backgroundColor: themeSecond.borderLight,
    marginLeft: moderateScale(66),
  },
  loadingSkeletonContainer: {
    flex: 1,
    width: "100%",
    paddingHorizontal: moderateScale(6),
    paddingTop: verticalScale(6),
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(14),
    paddingVertical: verticalScale(12),
  },
  loadingAvatar: {
    width: moderateScale(52),
    height: moderateScale(52),
    borderRadius: moderateScale(26),
  },
  loadingContent: {
    flex: 1,
    minWidth: 0,
  },
  loadingMeta: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  loadingUnreadDot: {
    width: moderateScale(18),
    height: moderateScale(18),
    borderRadius: moderateScale(9),
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: verticalScale(80),
    paddingHorizontal: moderateScale(40),
  },
  emptyIconCircle: {
    width: moderateScale(96),
    height: moderateScale(96),
    borderRadius: moderateScale(48),
    backgroundColor: themeSecond.accentPurpleLight,
    borderWidth: moderateScale(1),
    borderColor: themeSecond.accentPurpleMedium,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: verticalScale(20),
  },
  emptyTitle: {
    fontSize: moderateScale(18),
    fontWeight: "700",
    color: themeSecond.textPrimary,
    marginBottom: verticalScale(8),
  },
  emptySubtitle: {
    fontSize: moderateScale(14),
    color: themeSecond.textSoft,
    textAlign: "center",
    lineHeight: moderateScale(22),
  },
  typingDots: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(4),
  },
  typingChip: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: themeSecond.accentPurpleLight,
    borderColor: themeSecond.accentPurpleMedium,
    borderWidth: moderateScale(1),
    borderRadius: moderateScale(999),
    paddingHorizontal: moderateScale(8),
    paddingVertical: verticalScale(3),
    marginTop: verticalScale(1),
  },
  typingLabel: {
    fontSize: moderateScale(12),
    color: themeSecond.accentPurple,
    fontWeight: "600",
    marginRight: moderateScale(5),
  },
  dot: {
    width: moderateScale(5),
    height: moderateScale(5),
    borderRadius: moderateScale(2.5),
    backgroundColor: themeSecond.accentPurple,
  },
  menuBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  actionsMenu: {
    position: "absolute",
    top: verticalScale(74),
    right: moderateScale(16),
    width: moderateScale(260),
    backgroundColor: themeSecond.glassBg,
    borderWidth: moderateScale(1),
    borderColor: themeSecond.glassBorder,
    borderRadius: moderateScale(16),
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: moderateScale(10) },
    shadowOpacity: 0.35,
    shadowRadius: moderateScale(18),
    elevation: moderateScale(8),
  },
  actionsMenuTitle: {
    paddingHorizontal: moderateScale(14),
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(10),
    fontSize: moderateScale(12),
    color: themeSecond.textSoft,
    fontWeight: "600",
  },
  menuDivider: {
    height: verticalScale(1),
    backgroundColor: themeSecond.borderLight,
    marginLeft: moderateScale(14),
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: moderateScale(14),
    paddingVertical: verticalScale(12),
    gap: moderateScale(10),
  },
  menuItemIconCircle: {
    width: moderateScale(34),
    height: moderateScale(34),
    borderRadius: moderateScale(17),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: themeSecond.surfaceCard,
    borderWidth: moderateScale(1),
    borderColor: themeSecond.borderLight,
  },
  menuItemText: {
    flex: 1,
    fontSize: moderateScale(14),
    color: themeSecond.textPrimary,
    fontWeight: "600",
  },
  menuItemTextDanger: {
    flex: 1,
    fontSize: moderateScale(14),
    color: themeSecond.optionOrange,
    fontWeight: "700",
  },
});
