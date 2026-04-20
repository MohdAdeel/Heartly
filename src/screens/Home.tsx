import {
  View,
  Text,
  Image,
  Easing,
  Animated,
  Platform,
  ScrollView,
  StatusBar,
  RefreshControl,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import {
  scale,
  ScaledSheet,
  moderateScale,
  verticalScale,
} from "react-native-size-matters";
import type {
  MainStackParamList,
  BottomTabScreenPropsType,
} from "../types/navigation.types";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useAlerts } from "../components/Alert";
import { useAuth } from "../context/AuthContext";
import { themeSecond } from "../theme/colorSecond";
import type { FilterParams } from "../types/filter";
import { useFilters } from "../context/FilterContext";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import { getHardcodedProfiles } from "../constants/profiles";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import React, { useCallback, useEffect, useRef, useState } from "react";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

type HomeScreenProps = BottomTabScreenPropsType<"Discover">;

// Match User Interface (aligned with Home.tsx)
interface MatchUser {
  id: string;
  name: string;
  age: number;
  profession: string;
  location: string;
  height: string;
  religion: string;
  education: string;
  isPremium: boolean;
  lastActiveAt?: string | null;
}

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const getPresenceStatus = (lastActiveAt?: string | null) => {
  if (!lastActiveAt) {
    return { isOnline: false, label: "Offline" };
  }
  return { isOnline: false, label: "Recently active" };
};

const getPrimaryImageForUser = (userId: string) =>
  getHardcodedProfiles().find((profile) => profile.id === userId)
    ?.image_urls?.[0] || "";

const HomeSecond = ({ navigation, route }: HomeScreenProps) => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const tabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();
  const topInset =
    Platform.OS === "android"
      ? Math.max(StatusBar.currentHeight ?? 0, verticalScale(8))
      : insets.top;
  const horizontalPadding = clamp(screenWidth * 0.05, scale(14), scale(20));
  const headerTopGap = clamp(
    screenWidth * 0.008,
    verticalScale(2),
    verticalScale(6)
  );
  const headerBottomGap = clamp(
    screenWidth * 0.025,
    verticalScale(8),
    verticalScale(12)
  );
  const cardTopGap = clamp(
    screenHeight * 0.02,
    verticalScale(10),
    verticalScale(18)
  );
  const bottomTabClearance = tabBarHeight + insets.bottom + verticalScale(44);
  const containerPaddingTop = topInset + headerTopGap;
  const notifyButtonSize = clamp(screenWidth * 0.1, scale(34), scale(40));
  const notifyButtonRadius = notifyButtonSize / 2;
  const headerLogoWidth = clamp(screenWidth * 0.24, scale(80), scale(94));
  const headerLogoHeight = clamp(
    screenHeight * 0.075,
    verticalScale(52),
    verticalScale(64)
  );
  const cardWidth = clamp(screenWidth * 0.86, scale(260), scale(360));
  const maxCardHeight = Math.max(
    verticalScale(340),
    screenHeight -
      containerPaddingTop -
      headerLogoHeight -
      headerBottomGap -
      cardTopGap -
      bottomTabClearance
  );
  const cardHeight = Math.min(cardWidth / 0.58, maxCardHeight);
  const iconSizes = {
    default: clamp(screenWidth * 0.052, moderateScale(18), moderateScale(22)),
    small: clamp(screenWidth * 0.046, moderateScale(16), moderateScale(20)),
    location: clamp(screenWidth * 0.036, moderateScale(12), moderateScale(15)),
    empty: clamp(screenWidth * 0.14, moderateScale(48), moderateScale(60)),
    placeholder: clamp(screenWidth * 0.1, moderateScale(34), moderateScale(44)),
    avatarFallback: clamp(
      screenWidth * 0.05,
      moderateScale(18),
      moderateScale(22)
    ),
  };
  const stackNavigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const { user } = useAuth();
  const { showAlert } = useAlerts();
  const { filters, lastUpdatedAt } = useFilters();
  const [matches, setMatches] = useState<MatchUser[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const likeProgress = useRef(new Animated.Value(0)).current;
  const dislikeOverlayProgress = useRef(new Animated.Value(0)).current;
  const dislikeShakeProgress = useRef(new Animated.Value(0)).current;

  const calculateAge = useCallback((dateOfBirth: string): number => {
    if (!dateOfBirth) return 0;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  }, []);

  const transformProfileToMatch = useCallback(
    (profileData: any): MatchUser => {
      const age = calculateAge(profileData.date_of_birth || "");
      return {
        id: profileData.id,
        name: profileData.full_name || "User",
        age: age || 0,
        profession: profileData.occupation || "Not specified",
        location: profileData.country || "Not specified",
        height: profileData.height || "Not specified",
        religion: profileData.religion || "Not specified",
        education: profileData.education_level || "Not specified",
        isPremium: profileData.isPremium || false,
        lastActiveAt: profileData.last_active_at || null,
      };
    },
    [calculateAge]
  );

  const fetchMatches = useCallback(
    async (filters?: FilterParams | null) => {
      try {
        setLoading(true);
        const profiles = getHardcodedProfiles(filters);
        const transformedMatches = profiles.map(transformProfileToMatch);
        setMatches(transformedMatches);
        setCurrentIndex(0);
      } catch (error) {
        console.error("Error fetching matches:", error);
        setMatches([]);
      } finally {
        setLoading(false);
      }
    },
    [transformProfileToMatch]
  );

  // Fetch matches whenever filters change
  useEffect(() => {
    fetchMatches(filters);
  }, [fetchMatches, filters, lastUpdatedAt]);

  useEffect(() => {
    if (!route.params?.forceRefreshAt) return;
    fetchMatches(filters);
  }, [fetchMatches, filters, route.params?.forceRefreshAt]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchMatches(filters);
    } finally {
      setRefreshing(false);
    }
  }, [fetchMatches, filters]);

  const likeOpacity = likeProgress.interpolate({
    inputRange: [0, 0.15, 0.7, 1],
    outputRange: [0, 1, 0.85, 0],
  });
  const likeScale = likeProgress.interpolate({
    inputRange: [0, 0.3, 0.7, 1],
    outputRange: [0.6, 1.2, 1, 0.9],
  });
  const likeRingScale = likeProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 1.7],
  });
  const likeRingOpacity = likeProgress.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [0, 0.6, 0],
  });
  const likeFloatOpacity = likeProgress.interpolate({
    inputRange: [0, 0.2, 0.7, 1],
    outputRange: [0, 1, 0.7, 0],
  });
  const likeFloatScale = likeProgress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.6, 1, 0.85],
  });
  const likeFloatYPrimary = likeProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -verticalScale(90)],
  });
  const likeFloatYSecondary = likeProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [verticalScale(8), -verticalScale(70)],
  });
  const likeFloatYThird = likeProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [verticalScale(14), -verticalScale(60)],
  });
  const likeFloatXLeft = likeProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [-scale(10), -scale(52)],
  });
  const likeFloatXRight = likeProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [scale(10), scale(52)],
  });
  const likeFloatXCenter = likeProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, scale(14)],
  });
  const dislikeOpacity = dislikeOverlayProgress.interpolate({
    inputRange: [0, 0.2, 0.7, 1],
    outputRange: [0, 1, 0.7, 0],
  });
  const dislikeScale = dislikeOverlayProgress.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [0.6, 1.05, 0.92],
  });
  const dislikeRingScale = dislikeOverlayProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 1.3],
  });
  const cardOpacity = dislikeOverlayProgress.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [1, 0.92, 0.85],
  });
  const cardShakeTranslateX = dislikeShakeProgress.interpolate({
    inputRange: [-1, 1],
    outputRange: [-scale(12), scale(12)],
  });

  const playLikeAnimation = () =>
    new Promise<void>((resolve) => {
      likeProgress.stopAnimation();
      likeProgress.setValue(0);
      Animated.timing(likeProgress, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }).start(() => {
        likeProgress.setValue(0);
        resolve();
      });
    });

  const playDislikeAnimation = () =>
    new Promise<void>((resolve) => {
      dislikeOverlayProgress.stopAnimation();
      dislikeShakeProgress.stopAnimation();
      dislikeOverlayProgress.setValue(0);
      dislikeShakeProgress.setValue(0);
      Animated.parallel([
        Animated.timing(dislikeOverlayProgress, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(dislikeShakeProgress, {
            toValue: -1,
            duration: 60,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(dislikeShakeProgress, {
            toValue: 1,
            duration: 80,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(dislikeShakeProgress, {
            toValue: -1,
            duration: 80,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(dislikeShakeProgress, {
            toValue: 1,
            duration: 80,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(dislikeShakeProgress, {
            toValue: 0,
            duration: 70,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        dislikeOverlayProgress.setValue(0);
        dislikeShakeProgress.setValue(0);
        resolve();
      });
    });

  const handleCardPress = (userId: string) => {
    stackNavigation.navigate("ProfileScreen", {
      userId,
      showActionIcons: true,
    });
  };

  const handleConnect = async (userId: string) => {
    if (isAnimating) return;
    if (!user?.id) {
      showAlert({
        variant: "error",
        title: "Error",
        message: "Not authenticated",
      });
      return;
    }
    try {
      setIsAnimating(true);
      await playLikeAnimation();
      setCurrentIndex((prev) => prev + 1);
    } catch (error: any) {
      console.error("Error liking profile:", error);
      showAlert({
        variant: "error",
        title: "Error",
        message: error.message || "Failed to like profile. Please try again.",
      });
    } finally {
      setIsAnimating(false);
    }
  };

  const handleReject = async (userId: string) => {
    if (isAnimating) return;
    if (!user?.id) {
      console.error("Not authenticated");
      return;
    }
    setIsAnimating(true);
    try {
      await playDislikeAnimation();
      setCurrentIndex((prev) => prev + 1);
    } finally {
      setIsAnimating(false);
    }
  };

  const currentMatch = matches[currentIndex];
  const currentPresenceStatus = getPresenceStatus(currentMatch?.lastActiveAt);

  const skeletonNameSize = {
    width: Math.min(cardWidth * 0.45, scale(150)),
    height: clamp(screenHeight * 0.024, verticalScale(16), verticalScale(22)),
    marginBottom: verticalScale(6),
  };

  const skeletonMetaSize = {
    width: Math.min(cardWidth * 0.28, scale(96)),
    height: clamp(screenHeight * 0.018, verticalScale(12), verticalScale(16)),
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          paddingTop: containerPaddingTop,
          paddingHorizontal: horizontalPadding,
        },
      ]}
      edges={["left", "right"]}
    >
      <View style={[styles.header, { marginBottom: headerBottomGap }]}>
        <TouchableOpacity
          style={[
            styles.notifyButton,
            {
              width: notifyButtonSize,
              height: notifyButtonSize,
              borderRadius: notifyButtonRadius,
            },
          ]}
          activeOpacity={0.8}
          onPress={() => stackNavigation.navigate("FilterScreen")}
        >
          <Ionicons
            name="filter-outline"
            size={iconSizes.default}
            color={themeSecond.textPrimary}
          />
        </TouchableOpacity>
        <Image
          source={require("../../assets/Images/logoIzdivaaj-removebg-preview.png")}
          style={[
            styles.headerLogo,
            { width: headerLogoWidth, height: headerLogoHeight },
          ]}
          resizeMode="contain"
        />
        <View style={styles.notifyButtonWrap}>
          <TouchableOpacity
            style={[
              styles.notifyButton,
              {
                width: notifyButtonSize,
                height: notifyButtonSize,
                borderRadius: notifyButtonRadius,
              },
            ]}
            activeOpacity={0.8}
            onPress={() => stackNavigation.navigate("NotificationScreen")}
          >
            <Ionicons
              name="notifications-outline"
              size={iconSizes.default}
              color={themeSecond.textPrimary}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.homeContent,
          { paddingBottom: bottomTabClearance },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading ? (
          <View style={[styles.cardWrap, { marginTop: cardTopGap }]}>
            <View style={styles.cardGlowBorder}>
              <View
                style={[styles.card, { width: cardWidth, height: cardHeight }]}
              >
                <View style={[styles.cardImage, styles.skeletonImage]} />
                <View style={styles.glassWrap}>
                  <View style={styles.glassRow}>
                    <View style={[styles.statusPill, styles.skeletonBox]} />
                  </View>
                  <View style={styles.profileRow}>
                    <View style={[styles.profileAvatar, styles.skeletonBox]} />
                    <View>
                      <View style={[styles.skeletonBox, skeletonNameSize]} />
                      <View style={[styles.skeletonBox, skeletonMetaSize]} />
                    </View>
                  </View>
                  <View style={styles.actionRow}>
                    <View style={[styles.actionButton, styles.skeletonBox]} />
                    <View
                      style={[
                        styles.actionButton,
                        styles.primaryAction,
                        styles.skeletonBox,
                      ]}
                    />
                    <View style={[styles.actionButton, styles.skeletonBox]} />
                  </View>
                </View>
              </View>
            </View>
          </View>
        ) : !currentMatch ? (
          <View style={styles.emptyWrap}>
            <Ionicons
              name="heart-outline"
              size={iconSizes.empty}
              color={themeSecond.headerLavender}
            />
            <Text style={styles.emptyTitle}>No more matches</Text>
            <Text style={styles.emptySubtitle}>
              Adjust your filters to see more
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.cardWrap, { marginTop: cardTopGap }]}
            activeOpacity={0.95}
            disabled={isAnimating}
            onPress={() => handleCardPress(currentMatch.id)}
          >
            <View style={styles.cardGlowBorder}>
              <Animated.View
                style={[
                  styles.card,
                  { width: cardWidth, height: cardHeight },
                  {
                    opacity: cardOpacity,
                    transform: [{ translateX: cardShakeTranslateX }],
                  },
                ]}
              >
                {currentMatch.id ? (
                  <Image
                    source={{
                      uri: getPrimaryImageForUser(currentMatch.id),
                    }}
                    style={styles.cardImage}
                  />
                ) : (
                  <View style={[styles.cardImage, styles.imagePlaceholder]}>
                    <Ionicons
                      name="images"
                      size={iconSizes.placeholder}
                      color={themeSecond.headerLavender}
                    />
                  </View>
                )}

                <LinearGradient
                  colors={[
                    "transparent",
                    themeSecond.overlayDarkLight,
                    themeSecond.overlayDarkHeavy,
                  ]}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                  style={styles.bottomGradient}
                />

                <View style={styles.glassWrap}>
                  <View style={styles.glassRow}>
                    <View style={styles.statusPill}>
                      <View
                        style={[
                          styles.statusDot,
                          !currentPresenceStatus.isOnline &&
                            styles.statusDotOffline,
                        ]}
                      />
                      <Text style={styles.statusText}>
                        {currentPresenceStatus.label}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.profileRow}>
                    {currentMatch.id ? (
                      <Image
                        source={{
                          uri: getPrimaryImageForUser(currentMatch.id),
                        }}
                        style={styles.profileAvatar}
                      />
                    ) : (
                      <View
                        style={[
                          styles.profileAvatar,
                          styles.avatarPlaceholderSmall,
                        ]}
                      >
                        <Ionicons
                          name="person"
                          size={iconSizes.avatarFallback}
                          color={themeSecond.headerLavender}
                        />
                      </View>
                    )}
                    <View>
                      <Text style={styles.profileName}>
                        {currentMatch.name}, {currentMatch.age}
                      </Text>
                      <View style={styles.locationRow}>
                        <Ionicons
                          name="location"
                          size={iconSizes.location}
                          color={themeSecond.textMuted}
                        />
                        <Text style={styles.locationText}>
                          {currentMatch.location}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      activeOpacity={0.9}
                      disabled={isAnimating}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleReject(currentMatch.id);
                      }}
                    >
                      <Ionicons
                        name="close"
                        size={iconSizes.default}
                        color={themeSecond.iconLight}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.primaryAction]}
                      activeOpacity={0.9}
                      disabled={isAnimating}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleConnect(currentMatch.id);
                      }}
                    >
                      <Ionicons
                        name="heart"
                        size={iconSizes.default}
                        color={themeSecond.textPrimary}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      activeOpacity={0.9}
                      disabled={isAnimating}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleCardPress(currentMatch.id);
                      }}
                    >
                      <Ionicons
                        name="chatbubble-ellipses"
                        size={iconSizes.small}
                        color={themeSecond.iconLight}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <View pointerEvents="none" style={styles.animationLayer}>
                  <Animated.View
                    style={[
                      styles.likeRing,
                      {
                        opacity: likeRingOpacity,
                        transform: [{ scale: likeRingScale }],
                      },
                    ]}
                  />
                  <Animated.View
                    style={[
                      styles.likeHeart,
                      {
                        opacity: likeOpacity,
                        transform: [{ scale: likeScale }],
                      },
                    ]}
                  >
                    <Ionicons
                      name="heart"
                      size={moderateScale(90)}
                      color={themeSecond.primaryActionPurple}
                    />
                  </Animated.View>
                  <Animated.View
                    style={[
                      styles.floatingHeart,
                      {
                        opacity: likeFloatOpacity,
                        transform: [
                          { translateX: likeFloatXLeft },
                          { translateY: likeFloatYPrimary },
                          { scale: likeFloatScale },
                        ],
                      },
                    ]}
                  >
                    <Ionicons
                      name="heart"
                      size={moderateScale(26)}
                      color={themeSecond.headerLavender}
                    />
                  </Animated.View>
                  <Animated.View
                    style={[
                      styles.floatingHeart,
                      {
                        opacity: likeFloatOpacity,
                        transform: [
                          { translateX: likeFloatXRight },
                          { translateY: likeFloatYSecondary },
                          { scale: likeFloatScale },
                        ],
                      },
                    ]}
                  >
                    <Ionicons
                      name="heart"
                      size={moderateScale(24)}
                      color={themeSecond.textPrimary}
                    />
                  </Animated.View>
                  <Animated.View
                    style={[
                      styles.floatingHeart,
                      {
                        opacity: likeFloatOpacity,
                        transform: [
                          { translateX: likeFloatXCenter },
                          { translateY: likeFloatYThird },
                          { scale: likeFloatScale },
                        ],
                      },
                    ]}
                  >
                    <Ionicons
                      name="heart"
                      size={moderateScale(22)}
                      color={themeSecond.iconLight}
                    />
                  </Animated.View>
                  <Animated.View
                    style={[
                      styles.dislikeRing,
                      {
                        opacity: dislikeOpacity,
                        transform: [{ scale: dislikeRingScale }],
                      },
                    ]}
                  />
                  <Animated.View
                    style={[
                      styles.dislikeIcon,
                      {
                        opacity: dislikeOpacity,
                        transform: [{ scale: dislikeScale }],
                      },
                    ]}
                  >
                    <Ionicons
                      name="close-circle"
                      size={moderateScale(96)}
                      color={themeSecond.statusError}
                    />
                  </Animated.View>
                </View>
              </Animated.View>
            </View>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeSecond;

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeSecond.bgDark,
  },
  homeContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLogo: {
    width: scale(86),
    height: verticalScale(60),
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(12),
  },
  avatarRing: {
    width: scale(46),
    height: scale(46),
    borderRadius: moderateScale(23),
    padding: scale(2),
    backgroundColor: themeSecond.avatarRingBg,
    borderWidth: moderateScale(1.5),
    borderColor: themeSecond.avatarRingBorder,
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: moderateScale(22),
  },
  greeting: {
    color: themeSecond.headerLavender,
    fontSize: moderateScale(12),
  },
  name: {
    color: themeSecond.textPrimary,
    fontSize: moderateScale(18),
    fontWeight: "600",
  },
  notifyButtonWrap: {
    position: "relative",
  },
  notifyButton: {
    width: scale(36),
    height: scale(36),
    borderRadius: moderateScale(18),
    backgroundColor: themeSecond.surfaceWhiteSubtle,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: moderateScale(1),
    borderColor: themeSecond.borderMedium,
  },
  notificationBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    width: scale(10),
    height: scale(10),
    borderRadius: scale(5),
    backgroundColor: themeSecond.statusError,
    borderWidth: moderateScale(1.5),
    borderColor: themeSecond.bgDark,
  },
  cardWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  cardGlowBorder: {
    padding: scale(3),
    borderRadius: moderateScale(32),
    backgroundColor: "transparent",
    shadowColor: themeSecond.shadowPurple,
    shadowOpacity: 0.4,
    shadowRadius: moderateScale(20),
    shadowOffset: { width: scale(0), height: verticalScale(0) },
    elevation: moderateScale(25),
  },
  card: {
    borderRadius: moderateScale(28),
    overflow: "hidden",
    backgroundColor: themeSecond.cardBg,
    borderWidth: moderateScale(1.5),
    borderColor: themeSecond.accentPurpleMedium,
  },
  cardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  skeletonImage: {
    backgroundColor: themeSecond.surfaceMuted,
  },
  skeletonBox: {
    backgroundColor: themeSecond.surfaceWhiteLight,
  },
  imagePlaceholder: {
    backgroundColor: themeSecond.surfaceImagePlaceholder,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarPlaceholder: {
    backgroundColor: themeSecond.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarPlaceholderSmall: {
    backgroundColor: themeSecond.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(48),
  },
  emptyTitle: {
    color: themeSecond.textMuted,
    fontSize: moderateScale(18),
    fontWeight: "600",
    marginTop: verticalScale(16),
  },
  emptySubtitle: {
    color: themeSecond.headerLavender,
    fontSize: moderateScale(14),
    marginTop: verticalScale(4),
  },
  topGlowOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "50%",
  },
  bottomGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "45%",
  },
  glassWrap: {
    position: "absolute",
    left: scale(14),
    right: scale(14),
    bottom: verticalScale(16),
    borderRadius: moderateScale(24),
    padding: moderateScale(16),
    backgroundColor: themeSecond.glassBg,
    borderWidth: moderateScale(1),
    borderColor: themeSecond.glassBorder,
    ...Platform.select({
      ios: {
        shadowColor: themeSecond.shadowWhite,
        shadowOpacity: 0.18,
        shadowRadius: moderateScale(16),
        shadowOffset: { width: scale(0), height: verticalScale(8) },
        elevation: 0,
      },
      android: {
        shadowColor: "transparent",
        elevation: 0,
        backgroundColor: "rgba(18, 16, 28, 0.78)",
      },
      default: {
        shadowColor: "transparent",
        elevation: 0,
      },
    }),
  },
  glassRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: verticalScale(8),
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(6),
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(5),
    borderRadius: moderateScale(16),
    backgroundColor: themeSecond.surfaceWhiteMedium,
    borderWidth: moderateScale(1),
    borderColor: themeSecond.borderStrong,
  },
  statusDot: {
    width: scale(8),
    height: scale(8),
    borderRadius: moderateScale(4),
    backgroundColor: themeSecond.onlineGreen,
    shadowColor: themeSecond.shadowOnline,
    shadowOpacity: 0.8,
    shadowRadius: moderateScale(4),
    shadowOffset: { width: scale(0), height: verticalScale(0) },
  },
  statusDotOffline: {
    backgroundColor: themeSecond.textMuted,
    shadowColor: "transparent",
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  statusText: {
    color: themeSecond.textMuted,
    fontSize: moderateScale(12),
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(10),
    marginBottom: verticalScale(14),
  },
  profileAvatar: {
    width: scale(40),
    height: scale(40),
    borderRadius: moderateScale(20),
    borderWidth: moderateScale(2),
    borderColor: themeSecond.accentPurpleStrong,
  },
  profileName: {
    color: themeSecond.textPrimary,
    fontSize: moderateScale(20),
    fontWeight: "700",
    letterSpacing: moderateScale(0.3),
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(4),
    marginTop: verticalScale(2),
  },
  locationText: {
    color: themeSecond.textSoft,
    fontSize: moderateScale(12),
  },
  animationLayer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  likeRing: {
    position: "absolute",
    width: scale(180),
    height: scale(180),
    borderRadius: scale(90),
    borderWidth: moderateScale(2),
    borderColor: themeSecond.accentPurpleLight,
  },
  likeHeart: {
    position: "absolute",
  },
  floatingHeart: {
    position: "absolute",
  },
  dislikeRing: {
    position: "absolute",
    width: scale(150),
    height: scale(150),
    borderRadius: scale(75),
    borderWidth: moderateScale(2),
    borderColor: themeSecond.statusError,
  },
  dislikeIcon: {
    position: "absolute",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: scale(18),
  },
  actionButton: {
    width: scale(48),
    height: scale(48),
    borderRadius: moderateScale(24),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: themeSecond.surfaceModal,
    borderWidth: moderateScale(1),
    borderColor: themeSecond.borderLight,
  },
  primaryAction: {
    width: scale(54),
    height: scale(54),
    borderRadius: moderateScale(27),
    backgroundColor: themeSecond.primaryActionPurple,
    borderWidth: 0,
    shadowColor: themeSecond.shadowPurple,
    shadowOpacity: 0.6,
    shadowRadius: moderateScale(12),
    shadowOffset: { width: scale(0), height: verticalScale(4) },
    elevation: moderateScale(10),
  },
  tabBar: {
    marginTop: verticalScale(18),
    marginBottom: verticalScale(10),
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: scale(24),
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(28),
    backgroundColor: themeSecond.surfaceRaised,
    borderWidth: moderateScale(1),
    borderColor: themeSecond.borderLight,
  },
  tabButton: {
    width: scale(40),
    height: scale(40),
    borderRadius: moderateScale(20),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: themeSecond.overlayBlack,
  },
});
