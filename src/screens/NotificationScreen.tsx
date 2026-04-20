import {
  Text,
  View,
  Image,
  Animated,
  StyleSheet,
  ScrollView,
  SectionList,
  TouchableOpacity,
} from "react-native";
import { getInitials } from "../utils/helpers";
import { useAuth } from "../context/AuthContext";
import { themeSecond } from "../theme/colorSecond";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import AccountStatusRibbon from "../components/AccountStatusRibbon";
import { HARDCODED_NOTIFICATIONS } from "../constants/notifications";
import type { MainStackParamList } from "../types/navigation.types";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { moderateScale, verticalScale } from "react-native-size-matters";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

// Notification Types (UI shape)
interface Notification {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string | null;
  message: string;
  timestamp: string;
  type: "like" | "match" | "system";
  isRead: boolean;
}

const triggerShieldAnimation = (
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

type NotificationSection = { title: string; data: Notification[] };

const AnimatedShieldIcon = ({ animationKey }: { animationKey: number }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animationKey > 0) {
      const firstTimer = setTimeout(
        () => triggerShieldAnimation(scaleAnim, shakeAnim, moderateScale(5)),
        1000
      );
      const interval = setInterval(
        () => triggerShieldAnimation(scaleAnim, shakeAnim, moderateScale(5)),
        5000
      );
      return () => {
        clearTimeout(firstTimer);
        clearInterval(interval);
      };
    }
  }, [animationKey, scaleAnim, shakeAnim]);

  return (
    <Animated.View
      style={{ transform: [{ scale: scaleAnim }, { translateX: shakeAnim }] }}
    >
      <Ionicons
        name="shield"
        size={moderateScale(22)}
        color={themeSecond.statusError}
      />
    </Animated.View>
  );
};

const AnimatedHeartIcon = () => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const heartbeat = () => {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.3,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.delay(100),
        Animated.timing(scaleAnim, {
          toValue: 1.25,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.delay(800),
      ]).start(() => heartbeat());
    };
    heartbeat();
  }, [scaleAnim]);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Ionicons
        name="heart"
        size={moderateScale(14)}
        color={themeSecond.optionHeart}
      />
    </Animated.View>
  );
};

const NotificationScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const { profile } = useAuth();
  const [isUserVerified] = useState(profile?.isVerified);
  const [animationTrigger, setAnimationTrigger] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>(
    HARDCODED_NOTIFICATIONS
  );

  const handleDeleteNotification = useCallback((notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  }, []);

  const handleClearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  useEffect(() => setAnimationTrigger(1), []);

  const renderNotificationItem = ({
    item: notification,
  }: {
    item: Notification;
    section: NotificationSection;
  }) => {
    return (
      <View style={styles.notificationRow}>
        <TouchableOpacity
          style={styles.notificationRowMain}
          activeOpacity={0.7}
          onPress={() =>
            navigation.navigate("ProfileScreen", {
              userId: notification.userId,
              showActionIcons: true,
            })
          }
        >
          <View style={styles.avatarRing}>
            <View style={styles.avatarInner}>
              {notification.userAvatar ? (
                <Image
                  source={{ uri: notification.userAvatar }}
                  style={styles.avatar}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarText}>
                    {getInitials(notification.userName)}
                  </Text>
                </View>
              )}
            </View>
            {(notification.type === "like" ||
              notification.type === "match") && (
              <View style={styles.heartBadge}>
                <AnimatedHeartIcon />
              </View>
            )}
          </View>

          <View style={styles.notificationContent}>
            <Text
              style={[
                styles.userName,
                !notification.isRead && styles.userNameBold,
              ]}
              numberOfLines={1}
            >
              {notification.userName}
            </Text>
            <Text
              style={[
                styles.notificationMessage,
                !notification.isRead && styles.notificationMessageUnread,
              ]}
              numberOfLines={1}
            >
              {notification.message}
              {(notification.type === "like" ||
                notification.type === "match") && (
                <Text style={styles.visitText}> · Visit profile</Text>
              )}
            </Text>
          </View>

          <View style={styles.rightMeta}>
            <Text style={styles.timestamp}>{notification.timestamp}</Text>
            <Ionicons
              name="chevron-forward"
              size={moderateScale(18)}
              color={themeSecond.textSoft}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteNotification(notification.id)}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name="close"
            size={moderateScale(20)}
            color={themeSecond.textSoft}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const newList = notifications.filter((n) => !n.isRead);
  const earlierList = notifications.filter((n) => n.isRead);
  const sections: NotificationSection[] = [];
  if (newList.length > 0) {
    sections.push({ title: "New", data: newList });
  }
  if (earlierList.length > 0) {
    sections.push({ title: "Earlier", data: earlierList });
  }

  const isEmpty = notifications.length === 0;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
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
        <Text style={styles.headerTitle}>Notifications</Text>
        {notifications.length > 0 ? (
          <TouchableOpacity
            style={styles.clearAllButton}
            onPress={handleClearAllNotifications}
            activeOpacity={0.7}
          >
            <Text style={styles.clearAllButtonText}>Clear all</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.headerIconCircle} />
        )}
      </View>

      <AccountStatusRibbon />

      {isEmpty ? (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContentEmpty}
          showsVerticalScrollIndicator={false}
        >
          {!isUserVerified && (
            <TouchableOpacity
              style={styles.verificationAlert}
              activeOpacity={0.8}
              onPress={() => navigation.navigate("FaceVerificationScreen")}
            >
              <View style={styles.verificationAlertLeft}>
                <View style={styles.verificationAlertIcon}>
                  <AnimatedShieldIcon animationKey={animationTrigger} />
                </View>
                <View style={styles.verificationAlertText}>
                  <Text style={styles.verificationAlertTitle}>
                    You're not verified
                  </Text>
                  <Text style={styles.verificationAlertSubtitle}>
                    Get verified to increase your matches
                  </Text>
                </View>
              </View>
              <Ionicons
                name="chevron-forward"
                size={moderateScale(20)}
                color={themeSecond.textSoft}
              />
            </TouchableOpacity>
          )}
          <View style={styles.emptyState}>
            <View style={styles.emptyIconCircle}>
              <Ionicons
                name="notifications-outline"
                size={moderateScale(48)}
                color={themeSecond.accentPurple}
              />
            </View>
            <Text style={styles.emptyTitle}>No Notifications</Text>
            <Text style={styles.emptySubtitle}>
              You're all caught up! New notifications will appear here.
            </Text>
          </View>
          <View style={styles.bottomSpacing} />
        </ScrollView>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={renderNotificationItem}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionTitle}>{title}</Text>
          )}
          stickySectionHeadersEnabled={false}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListHeaderComponent={
            !isUserVerified ? (
              <TouchableOpacity
                style={styles.verificationAlert}
                activeOpacity={0.8}
                onPress={() => navigation.navigate("FaceVerificationScreen")}
              >
                <View style={styles.verificationAlertLeft}>
                  <View style={styles.verificationAlertIcon}>
                    <AnimatedShieldIcon animationKey={animationTrigger} />
                  </View>
                  <View style={styles.verificationAlertText}>
                    <Text style={styles.verificationAlertTitle}>
                      You're not verified
                    </Text>
                    <Text style={styles.verificationAlertSubtitle}>
                      Get verified to increase your matches
                    </Text>
                  </View>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={moderateScale(20)}
                  color={themeSecond.textSoft}
                />
              </TouchableOpacity>
            ) : null
          }
          ListEmptyComponent={null}
        />
      )}
    </SafeAreaView>
  );
};

export default NotificationScreen;

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
  },
  headerIconCircle: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    // backgroundColor: themeSecond.glassBg,
    borderWidth: moderateScale(1),
    // borderColor: themeSecond.glassBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: moderateScale(18),
    fontWeight: "700",
    color: themeSecond.textPrimary,
  },
  clearAllButton: {
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(8),
    justifyContent: "center",
    alignItems: "center",
  },
  clearAllButtonText: {
    fontSize: moderateScale(14),
    fontWeight: "600",
    color: themeSecond.accentPurple,
  },
  scrollView: {
    flex: 1,
  },
  scrollContentEmpty: {
    flexGrow: 1,
    paddingHorizontal: moderateScale(16),
    paddingTop: moderateScale(16),
  },
  listContent: {
    paddingHorizontal: moderateScale(16),
    paddingBottom: verticalScale(100),
  },
  sectionTitle: {
    fontSize: moderateScale(22),
    fontWeight: "700",
    color: themeSecond.textPrimary,
    marginTop: verticalScale(16),
    marginBottom: verticalScale(10),
  },
  notificationRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: verticalScale(12),
    gap: moderateScale(14),
  },
  notificationRowMain: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(14),
  },
  deleteButton: {
    padding: moderateScale(4),
    alignItems: "center",
    justifyContent: "center",
  },
  separator: {
    height: verticalScale(1),
    backgroundColor: themeSecond.borderLight,
    marginLeft: moderateScale(66),
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
  avatarText: {
    fontSize: moderateScale(16),
    fontWeight: "700",
    color: themeSecond.accentPurple,
  },
  heartBadge: {
    position: "absolute",
    bottom: moderateScale(-2),
    right: moderateScale(-2),
    width: moderateScale(24),
    height: moderateScale(24),
    borderRadius: moderateScale(12),
    backgroundColor: themeSecond.bgDark,
    borderWidth: moderateScale(2),
    borderColor: themeSecond.glassBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  notificationContent: {
    flex: 1,
    minWidth: 0,
  },
  userName: {
    fontSize: moderateScale(15),
    fontWeight: "500",
    color: themeSecond.textPrimary,
    marginBottom: verticalScale(2),
  },
  userNameBold: {
    fontWeight: "700",
  },
  timestamp: {
    fontSize: moderateScale(12),
    color: themeSecond.textSoft,
  },
  notificationMessage: {
    fontSize: moderateScale(13),
    color: themeSecond.textSoft,
  },
  notificationMessageUnread: {
    color: themeSecond.textMuted,
    fontWeight: "500",
  },
  visitText: {
    color: themeSecond.accentPurple,
    fontWeight: "600",
  },
  rightMeta: {
    alignItems: "flex-end",
    gap: verticalScale(4),
  },
  verificationAlert: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: themeSecond.surfaceCard,
    borderRadius: moderateScale(16),
    marginBottom: verticalScale(24),
    marginTop: verticalScale(16),
    padding: moderateScale(16),
    borderWidth: moderateScale(1),
    borderColor: themeSecond.borderLight,
    borderLeftWidth: moderateScale(3),
    borderLeftColor: themeSecond.statusError,
  },
  verificationAlertLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: moderateScale(12),
  },
  verificationAlertIcon: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(10),
    backgroundColor: "rgba(231, 76, 60, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  verificationAlertText: {
    flex: 1,
  },
  verificationAlertTitle: {
    fontSize: moderateScale(15),
    fontWeight: "600",
    color: themeSecond.statusError,
    marginBottom: verticalScale(2),
  },
  verificationAlertSubtitle: {
    fontSize: moderateScale(13),
    color: themeSecond.textSoft,
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
  bottomSpacing: {
    height: verticalScale(40),
  },
});
