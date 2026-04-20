import {
  Text,
  View,
  Modal,
  Easing,
  Switch,
  Animated,
  Pressable,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import {
  SkeletonBox,
  SkeletonShimmer,
  useShimmerAnimation,
} from "../components/SkeletonLoader";
import { getInitials } from "../utils/helpers";
import FastImage from "react-native-fast-image";
import { useAuth } from "../context/AuthContext";
import { themeSecond } from "../theme/colorSecond";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { getHardcodedProfileById } from "../constants/profiles";
import AccountStatusRibbon from "../components/AccountStatusRibbon";
import { BottomTabScreenPropsType } from "../types/navigation.types";
import { moderateScale, verticalScale } from "react-native-size-matters";

type ProfileImage = {
  id: string;
  image_url: string;
  position: number;
};

const SettingScreen = () => {
  const { logout, profile, user } = useAuth();
  const navigation =
    useNavigation<BottomTabScreenPropsType<"Settings">["navigation"]>();
  const [hideProfile, setHideProfile] = useState(false);
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);
  const [savingPrivacyKey, setSavingPrivacyKey] = useState<
    null | "hideProfile" | "showOnlineStatus" | "readReceipts"
  >(null);

  const [profileImages, setProfileImages] = useState<ProfileImage[]>([]);
  const [imagesLoading, setImagesLoading] = useState(false);
  const [hasLoadedImagesOnce, setHasLoadedImagesOnce] = useState(false);

  useEffect(() => {
    if (profile) {
      setHideProfile(profile.isProfileHidden ?? false);
      setShowOnlineStatus(profile.isShowingOnlineStatus ?? true);
      setReadReceipts(profile.isReadReceiptsOn ?? true);
    }
  }, [profile]);

  const fetchProfileImages = async (showLoader: boolean = true) => {
    try {
      if (showLoader) {
        setImagesLoading(true);
      }
      const fallbackProfile = getHardcodedProfileById("profile-1");
      const images: ProfileImage[] = (fallbackProfile?.image_urls || []).map(
        (image_url, position) => ({
          id: `settings-local-image-${position}`,
          image_url,
          position,
        })
      );
      setProfileImages(images);
    } catch (error) {
      console.error("Error fetching profile images:", error);
      setProfileImages([]);
    } finally {
      if (showLoader) {
        setImagesLoading(false);
      }
      setHasLoadedImagesOnce(true);
    }
  };

  useEffect(() => {
    if (!user?.id) {
      setHasLoadedImagesOnce(false);
      return;
    }
    fetchProfileImages(true);
  }, [user?.id]);

  const getImageByPosition = (position: number): ProfileImage | undefined => {
    return profileImages.find((img) => img.position === position);
  };

  const isLoading = !profile || (imagesLoading && !hasLoadedImagesOnce);
  const shimmerAnim = useShimmerAnimation(isLoading);

  const freeBadgePulseAnim = useRef(new Animated.Value(1)).current;
  const freeBadgeOpacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!profile?.isPremium) {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(freeBadgePulseAnim, {
            toValue: 1.06,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(freeBadgePulseAnim, {
            toValue: 1,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
      const shimmerAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(freeBadgeOpacityAnim, {
            toValue: 0.75,
            duration: 2500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(freeBadgeOpacityAnim, {
            toValue: 1,
            duration: 2500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
      const startDelay = setTimeout(() => {
        pulseAnimation.start();
        shimmerAnimation.start();
      }, 100);
      return () => {
        clearTimeout(startDelay);
        pulseAnimation.stop();
        shimmerAnimation.stop();
        freeBadgePulseAnim.setValue(1);
        freeBadgeOpacityAnim.setValue(1);
      };
    } else {
      freeBadgePulseAnim.setValue(1);
      freeBadgeOpacityAnim.setValue(1);
    }
  }, [profile?.isPremium]);

  const handleHideProfileToggle = async (value: boolean) => {
    if (!user?.id) return;
    setHideProfile(value);
    setSavingPrivacyKey("hideProfile");
    console.log("SettingScreen update:", {
      userId: user.id,
      field: "isProfileHidden",
      value,
    });
    setSavingPrivacyKey(null);
  };

  const handleShowOnlineStatusToggle = async (value: boolean) => {
    if (!user?.id) return;
    setShowOnlineStatus(value);
    setSavingPrivacyKey("showOnlineStatus");
    console.log("SettingScreen update:", {
      userId: user.id,
      field: "isShowingOnlineStatus",
      value,
    });
    setSavingPrivacyKey(null);
  };

  const handleReadReceiptsToggle = async (value: boolean) => {
    if (!user?.id) return;
    setReadReceipts(value);
    setSavingPrivacyKey("readReceipts");
    console.log("SettingScreen update:", {
      userId: user.id,
      field: "isReadReceiptsOn",
      value,
    });
    setSavingPrivacyKey(null);
  };

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showCloseAccountModal, setShowCloseAccountModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [showReopenAccountModal, setShowReopenAccountModal] = useState(false);
  const [showReverseDeletionModal, setShowReverseDeletionModal] =
    useState(false);

  const handleCloseAccount = async () => {
    if (!user?.id) return;
    console.log("SettingScreen action:", {
      userId: user.id,
      action: "closeAccountTemporarily",
    });
    setShowCloseAccountModal(false);
  };

  const handleDeleteAccount = async () => {
    if (!user?.id) return;
    console.log("SettingScreen action:", {
      userId: user.id,
      action: "deleteAccountPermanently",
    });
    setShowDeleteAccountModal(false);
  };

  const handleReopenAccount = async () => {
    if (!user?.id) return;
    console.log("SettingScreen action:", {
      userId: user.id,
      action: "reopenClosedAccount",
    });
    setShowReopenAccountModal(false);
  };

  const handleReverseDeletion = async () => {
    if (!user?.id) return;
    console.log("SettingScreen action:", {
      userId: user.id,
      action: "reverseAccountDeletion",
    });
    setShowReverseDeletionModal(false);
  };

  const renderSettingItem = (
    icon: string,
    label: string,
    description: string,
    iconColor: string,
    iconBgColor: string,
    onPress?: () => void,
    showArrow: boolean = true
  ) => (
    <TouchableOpacity
      style={styles.settingRow}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      <View style={styles.settingRowLeft}>
        <View
          style={[styles.settingIconCircle, { backgroundColor: iconBgColor }]}
        >
          <Ionicons
            name={icon as any}
            size={moderateScale(20)}
            color={iconColor}
          />
        </View>
        <View style={styles.settingTextWrap}>
          <Text style={styles.settingLabel}>{label}</Text>
          <Text style={styles.settingDescription}>{description}</Text>
        </View>
      </View>
      {showArrow && (
        <Ionicons
          name="chevron-forward"
          size={moderateScale(18)}
          color={themeSecond.textSoft}
        />
      )}
    </TouchableOpacity>
  );

  const renderToggleItem = (
    icon: string,
    label: string,
    description: string,
    iconColor: string,
    iconBgColor: string,
    value: boolean,
    onValueChange: (value: boolean) => void,
    switchDisabled?: boolean
  ) => (
    <View style={styles.settingRow}>
      <View style={styles.settingRowLeft}>
        <View
          style={[styles.settingIconCircle, { backgroundColor: iconBgColor }]}
        >
          <Ionicons
            name={icon as any}
            size={moderateScale(20)}
            color={iconColor}
          />
        </View>
        <View style={styles.settingTextWrap}>
          <Text style={styles.settingLabel}>{label}</Text>
          <Text style={styles.settingDescription}>{description}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={switchDisabled}
        trackColor={{
          false: themeSecond.surfaceWhiteLight,
          true: themeSecond.accentPurpleLight,
        }}
        thumbColor={themeSecond.textPrimary}
        ios_backgroundColor={themeSecond.surfaceWhiteLight}
      />
    </View>
  );

  const renderAccountItem = (
    icon: string,
    label: string,
    description: string,
    iconColor: string,
    iconBgColor: string,
    onPress: () => void,
    isDestructive: boolean = false
  ) => (
    <TouchableOpacity
      style={styles.settingRow}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.settingRowLeft}>
        <View
          style={[styles.settingIconCircle, { backgroundColor: iconBgColor }]}
        >
          <Ionicons
            name={icon as any}
            size={moderateScale(20)}
            color={iconColor}
          />
        </View>
        <View style={styles.settingTextWrap}>
          <Text
            style={[
              styles.settingLabel,
              isDestructive && styles.settingLabelDestructive,
            ]}
          >
            {label}
          </Text>
          <Text style={styles.settingDescription}>{description}</Text>
        </View>
      </View>
      <Ionicons
        name="chevron-forward"
        size={moderateScale(18)}
        color={themeSecond.textSoft}
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerIconCircle}>
            <Ionicons
              name="settings-sharp"
              size={moderateScale(22)}
              color={themeSecond.accentPurple}
            />
          </View>
          <View>
            <Text style={styles.headerTitle}>Settings</Text>
            <Text style={styles.headerSubtitle}>
              Manage your account preferences
            </Text>
          </View>
        </View>
      </View>

      <AccountStatusRibbon />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {isLoading ? (
          <>
            <View style={styles.section}>
              <View style={styles.glassCard}>
                <View style={styles.profileContent}>
                  <View style={styles.profileLeft}>
                    <SkeletonShimmer
                      shimmerAnim={shimmerAnim}
                      style={styles.avatarSkeleton}
                    />
                    <View style={styles.userInfo}>
                      <SkeletonBox
                        shimmerAnim={shimmerAnim}
                        width={moderateScale(140)}
                        height={moderateScale(18)}
                        borderRadius={moderateScale(6)}
                        style={{ marginBottom: verticalScale(6) }}
                      />
                      <SkeletonBox
                        shimmerAnim={shimmerAnim}
                        width={moderateScale(100)}
                        height={moderateScale(12)}
                        borderRadius={moderateScale(4)}
                      />
                    </View>
                  </View>
                </View>
                <View style={styles.statsRow}>
                  {[1, 2, 3].map((i) => (
                    <View key={i} style={styles.statItem}>
                      <SkeletonBox
                        shimmerAnim={shimmerAnim}
                        width={moderateScale(24)}
                        height={moderateScale(24)}
                        borderRadius={moderateScale(12)}
                      />
                      <SkeletonBox
                        shimmerAnim={shimmerAnim}
                        width={moderateScale(50)}
                        height={moderateScale(10)}
                        borderRadius={moderateScale(4)}
                        style={{ marginTop: verticalScale(4) }}
                      />
                    </View>
                  ))}
                </View>
              </View>
            </View>
            <View style={styles.section}>
              <View style={styles.sectionTitleRow}>
                <SkeletonBox
                  shimmerAnim={shimmerAnim}
                  width={moderateScale(32)}
                  height={moderateScale(32)}
                  borderRadius={moderateScale(10)}
                />
                <SkeletonBox
                  shimmerAnim={shimmerAnim}
                  width={moderateScale(160)}
                  height={moderateScale(16)}
                  style={{ marginLeft: moderateScale(15) }}
                  borderRadius={moderateScale(4)}
                />
              </View>
              <View style={styles.glassCard}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <View key={i} style={styles.settingRow}>
                    <SkeletonBox
                      shimmerAnim={shimmerAnim}
                      width={moderateScale(40)}
                      height={moderateScale(40)}
                      borderRadius={moderateScale(12)}
                    />
                    <View
                      style={{
                        flex: 1,
                        marginLeft: moderateScale(12),
                      }}
                    >
                      <SkeletonBox
                        shimmerAnim={shimmerAnim}
                        width={moderateScale(120)}
                        height={moderateScale(14)}
                        borderRadius={moderateScale(4)}
                        style={{ marginBottom: verticalScale(6) }}
                      />
                      <SkeletonBox
                        shimmerAnim={shimmerAnim}
                        width={moderateScale(180)}
                        height={moderateScale(10)}
                        borderRadius={moderateScale(4)}
                      />
                    </View>
                    <SkeletonBox
                      shimmerAnim={shimmerAnim}
                      width={moderateScale(44)}
                      height={moderateScale(24)}
                      borderRadius={moderateScale(12)}
                    />
                  </View>
                ))}
              </View>
            </View>
            <View style={styles.bottomSpacing} />
          </>
        ) : (
          <>
            <View style={styles.section}>
              <View style={styles.glassCard}>
                <View style={styles.profileContent}>
                  <View style={styles.profileLeft}>
                    <View style={styles.avatarRing}>
                      <View style={styles.avatarInner}>
                        {getImageByPosition(0) ? (
                          <FastImage
                            source={{ uri: getImageByPosition(0)!.image_url }}
                            style={styles.avatar}
                            resizeMode={FastImage.resizeMode.cover}
                          />
                        ) : (
                          <View style={styles.avatarPlaceholder}>
                            <Text style={styles.avatarInitials}>
                              {getInitials(profile?.full_name || "")}
                            </Text>
                          </View>
                        )}
                      </View>
                      {profile?.isVerified && (
                        <View style={styles.verifiedBadge}>
                          <Ionicons
                            name="checkmark"
                            size={moderateScale(12)}
                            color={themeSecond.textPrimary}
                          />
                        </View>
                      )}
                    </View>
                    <View style={styles.userInfo}>
                      <Text style={styles.userName} numberOfLines={1}>
                        {profile?.full_name || "User"}
                      </Text>
                      <Text style={styles.userEmail} numberOfLines={1}>
                        {user?.email || ""}
                      </Text>
                      {profile?.isPremium ? (
                        <View style={[styles.badge, styles.badgePremium]}>
                          <Ionicons
                            name="star"
                            size={moderateScale(11)}
                            color="#FFD700"
                            style={{ marginRight: moderateScale(4) }}
                          />
                          <Text style={styles.badgeTextPremium}>Premium</Text>
                        </View>
                      ) : (
                        <Animated.View
                          style={{
                            transform: [{ scale: freeBadgePulseAnim }],
                            opacity: freeBadgeOpacityAnim,
                          }}
                        >
                          <TouchableOpacity
                            style={styles.badge}
                            activeOpacity={0.7}
                            onPress={() =>
                              navigation
                                .getParent()
                                ?.navigate("PremiumScreen" as never)
                            }
                          >
                            <Text style={styles.badgeText}>Free</Text>
                            <Ionicons
                              name="arrow-forward"
                              size={moderateScale(11)}
                              color={themeSecond.textPrimary}
                            />
                          </TouchableOpacity>
                        </Animated.View>
                      )}
                    </View>
                  </View>
                </View>
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <View
                      style={[
                        styles.statIcon,
                        { backgroundColor: themeSecond.accentPurpleLight },
                      ]}
                    >
                      <Ionicons
                        name="image"
                        size={moderateScale(14)}
                        color={themeSecond.accentPurple}
                      />
                    </View>
                    <Text style={styles.statLabel}>
                      {profileImages.length} Photos
                    </Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <View
                      style={[
                        styles.statIcon,
                        {
                          backgroundColor: hideProfile
                            ? themeSecond.tagBlueBg
                            : themeSecond.tagGreenBg,
                        },
                      ]}
                    >
                      <Ionicons
                        name={hideProfile ? "eye-off" : "eye"}
                        size={moderateScale(14)}
                        color={
                          hideProfile
                            ? themeSecond.optionBlue
                            : themeSecond.optionGreen
                        }
                      />
                    </View>
                    <Text style={styles.statLabel}>
                      {hideProfile ? "Hidden" : "Visible"}
                    </Text>
                  </View>
                  <View style={styles.statDivider} />
                  <TouchableOpacity
                    style={styles.statItem}
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate("Profile" as never)}
                  >
                    <View
                      style={[
                        styles.statIcon,
                        { backgroundColor: themeSecond.accentPurpleLight },
                      ]}
                    >
                      <Ionicons
                        name="create-outline"
                        size={moderateScale(14)}
                        color={themeSecond.accentPurple}
                      />
                    </View>
                    <Text style={styles.statLabel}>Edit Profile</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionTitleRow}>
                <View
                  style={[
                    styles.sectionIconCircle,
                    { backgroundColor: themeSecond.accentPurpleLight },
                  ]}
                >
                  <Ionicons
                    name="shield-checkmark"
                    size={moderateScale(16)}
                    color={themeSecond.accentPurple}
                  />
                </View>
                <Text style={styles.sectionTitle}>Privacy & Visibility</Text>
              </View>
              <View style={styles.glassCard}>
                {renderToggleItem(
                  "eye-off-outline",
                  "Hide Profile",
                  "Hidden from search results",
                  themeSecond.accentPurple,
                  themeSecond.accentPurpleLight,
                  hideProfile,
                  handleHideProfileToggle,
                  savingPrivacyKey === "hideProfile"
                )}
                {renderToggleItem(
                  "radio-button-on",
                  "Show Online Status",
                  "Let others see when you're online",
                  themeSecond.optionBlue,
                  themeSecond.tagBlueBg,
                  showOnlineStatus,
                  handleShowOnlineStatusToggle,
                  savingPrivacyKey === "showOnlineStatus"
                )}
                {renderToggleItem(
                  "checkmark-done",
                  "Read Receipts",
                  "Show when you've read messages",
                  themeSecond.optionTeal,
                  themeSecond.tagGreenBg,
                  readReceipts,
                  handleReadReceiptsToggle,
                  savingPrivacyKey === "readReceipts"
                )}
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionTitleRow}>
                <View
                  style={[
                    styles.sectionIconCircle,
                    { backgroundColor: themeSecond.tagGreenBg },
                  ]}
                >
                  <Ionicons
                    name="heart-circle"
                    size={moderateScale(16)}
                    color={themeSecond.optionGreen}
                  />
                </View>
                <Text style={styles.sectionTitle}>Safety & Support</Text>
              </View>
              <View style={styles.glassCard}>
                {renderSettingItem(
                  "ban-outline",
                  "Blocked Users",
                  "Manage blocked users",
                  themeSecond.optionRed,
                  themeSecond.iconHeartBg,
                  () => {},
                  true
                )}
                {renderSettingItem(
                  "help-buoy-outline",
                  "Help & Support",
                  "Get help and contact support",
                  themeSecond.optionTeal,
                  themeSecond.tagBlueBg,
                  () =>
                    navigation.getParent()?.navigate("HelpAndSupport" as never),
                  true
                )}
                {renderSettingItem(
                  "shield-checkmark-outline",
                  "Privacy Policy",
                  "Read our privacy policy",
                  themeSecond.optionTeal,
                  themeSecond.accentPurpleLight,
                  () =>
                    navigation.getParent()?.navigate("PrivacyPolicy" as never),
                  true
                )}
                {renderSettingItem(
                  "document-text-outline",
                  "Terms & Conditions",
                  "Read our terms and conditions",
                  themeSecond.optionGreen,
                  themeSecond.tagReligionBg,
                  () =>
                    navigation
                      .getParent()
                      ?.navigate("TermsAndConditions" as never),
                  true
                )}
                {renderSettingItem(
                  "card-outline",
                  "Payment & Refund Policy",
                  "Read our payment and refund policy",
                  themeSecond.optionGreen,
                  themeSecond.tagBlueBg,
                  () =>
                    navigation
                      .getParent()
                      ?.navigate("PaymentAndRefundPolicy" as never),
                  true
                )}
                {renderSettingItem(
                  "information-circle-outline",
                  "About Us",
                  "Read about us",
                  themeSecond.optionGreen,
                  themeSecond.surfaceWhiteSubtle,
                  () => navigation.getParent()?.navigate("AboutUs" as never),
                  true
                )}
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionTitleRow}>
                <View
                  style={[
                    styles.sectionIconCircle,
                    { backgroundColor: themeSecond.accentPurpleLight },
                  ]}
                >
                  <Ionicons
                    name="settings-outline"
                    size={moderateScale(16)}
                    color={themeSecond.accentPurple}
                  />
                </View>
                <Text style={styles.sectionTitle}>Account</Text>
              </View>
              <View style={styles.glassCard}>
                {renderAccountItem(
                  "log-out-outline",
                  "Logout",
                  "Sign out of your account",
                  themeSecond.optionOrange,
                  themeSecond.iconPersonBg,
                  () => setShowLogoutModal(true)
                )}
                {profile?.isAccountTemporaryClosed
                  ? renderAccountItem(
                      "checkmark-circle-outline",
                      "Reopen Account",
                      "Reactivate your account",
                      themeSecond.optionGreen,
                      themeSecond.tagGreenBg,
                      () => setShowReopenAccountModal(true)
                    )
                  : renderAccountItem(
                      "time-outline",
                      "Close Account Temporarily",
                      "Hide profile temporarily",
                      themeSecond.optionYellow,
                      themeSecond.iconPersonBg,
                      () => setShowCloseAccountModal(true)
                    )}
                {profile?.isAccountRequestToDelete
                  ? renderAccountItem(
                      "refresh-circle-outline",
                      "Reverse Deletion",
                      "Cancel account deletion",
                      themeSecond.optionGreen,
                      themeSecond.tagGreenBg,
                      () => setShowReverseDeletionModal(true)
                    )
                  : renderAccountItem(
                      "trash-outline",
                      "Delete Account",
                      "Permanently delete your account",
                      themeSecond.statusError,
                      themeSecond.iconHeartBg,
                      () => setShowDeleteAccountModal(true),
                      true
                    )}
              </View>
            </View>

            <View style={styles.bottomSpacing} />
          </>
        )}
      </ScrollView>

      <Modal
        visible={showLogoutModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowLogoutModal(false)}
        >
          <Pressable
            style={styles.modalContent}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={[styles.modalIconCircle, styles.modalIconDanger]}>
              <Ionicons
                name="log-out-outline"
                size={moderateScale(36)}
                color={themeSecond.statusError}
              />
            </View>
            <Text style={styles.modalTitle}>Log out?</Text>
            <Text style={styles.modalMessage}>
              You can sign in again anytime.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowLogoutModal(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalActionBtn, styles.modalActionDanger]}
                onPress={async () => {
                  setShowLogoutModal(false);
                  await logout();
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.modalActionText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        visible={showCloseAccountModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCloseAccountModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowCloseAccountModal(false)}
        >
          <Pressable
            style={styles.modalContent}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={[styles.modalIconCircle, styles.modalIconWarning]}>
              <Ionicons
                name="time-outline"
                size={moderateScale(36)}
                color={themeSecond.statusWarning}
              />
            </View>
            <Text style={styles.modalTitle}>Close account temporarily?</Text>
            <Text style={styles.modalMessage}>
              Your profile will be hidden. You can reactivate by signing in
              again.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowCloseAccountModal(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalActionBtn, styles.modalActionWarning]}
                onPress={handleCloseAccount}
                activeOpacity={0.8}
              >
                <Text style={styles.modalActionText}>Close Account</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        visible={showDeleteAccountModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteAccountModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowDeleteAccountModal(false)}
        >
          <Pressable
            style={styles.modalContent}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={[styles.modalIconCircle, styles.modalIconDanger]}>
              <Ionicons
                name="trash-outline"
                size={moderateScale(36)}
                color={themeSecond.statusError}
              />
            </View>
            <Text style={styles.modalTitle}>Delete account permanently?</Text>
            <Text style={styles.modalMessage}>
              All data will be permanently deleted. This cannot be undone.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowDeleteAccountModal(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalActionBtn, styles.modalActionDanger]}
                onPress={handleDeleteAccount}
                activeOpacity={0.8}
              >
                <Text style={styles.modalActionText}>Delete Forever</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        visible={showReopenAccountModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowReopenAccountModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowReopenAccountModal(false)}
        >
          <Pressable
            style={styles.modalContent}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={[styles.modalIconCircle, styles.modalIconSuccess]}>
              <Ionicons
                name="checkmark-circle-outline"
                size={moderateScale(36)}
                color={themeSecond.statusSuccess}
              />
            </View>
            <Text style={styles.modalTitle}>Reopen your account?</Text>
            <Text style={styles.modalMessage}>
              Your account will be visible to others again.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowReopenAccountModal(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalActionBtn, styles.modalActionSuccess]}
                onPress={handleReopenAccount}
                activeOpacity={0.8}
              >
                <Text style={styles.modalActionText}>Open Account</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        visible={showReverseDeletionModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowReverseDeletionModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowReverseDeletionModal(false)}
        >
          <Pressable
            style={styles.modalContent}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={[styles.modalIconCircle, styles.modalIconSuccess]}>
              <Ionicons
                name="refresh-circle-outline"
                size={moderateScale(36)}
                color={themeSecond.statusSuccess}
              />
            </View>
            <Text style={styles.modalTitle}>Reverse account deletion?</Text>
            <Text style={styles.modalMessage}>
              Your deletion request will be cancelled and your account will
              remain active.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowReverseDeletionModal(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalActionBtn, styles.modalActionSuccess]}
                onPress={handleReverseDeletion}
                activeOpacity={0.8}
              >
                <Text style={styles.modalActionText}>Reverse Deletion</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

export default SettingScreen;

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
    borderBottomWidth: moderateScale(1),
    borderBottomColor: themeSecond.borderLight,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(12),
  },
  headerIconCircle: {
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
  scrollView: { flex: 1 },
  scrollContent: {
    padding: moderateScale(16),
    paddingBottom: verticalScale(24),
  },
  section: {
    marginBottom: verticalScale(20),
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(10),
    paddingHorizontal: moderateScale(4),
  },
  sectionIconCircle: {
    width: moderateScale(34),
    height: moderateScale(34),
    borderRadius: moderateScale(10),
    alignItems: "center",
    justifyContent: "center",
    marginRight: moderateScale(10),
  },
  sectionTitle: {
    fontSize: moderateScale(16),
    fontWeight: "700",
    color: themeSecond.textPrimary,
  },
  glassCard: {
    borderRadius: moderateScale(20),
    padding: moderateScale(14),
    backgroundColor: themeSecond.glassBg,
    borderWidth: moderateScale(1),
    borderColor: themeSecond.glassBorder,
    overflow: "hidden",
  },
  profileContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: verticalScale(12),
  },
  profileLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatarRing: {
    width: moderateScale(64),
    height: moderateScale(64),
    borderRadius: moderateScale(32),
    padding: moderateScale(2),
    backgroundColor: themeSecond.avatarRingBg,
    borderWidth: moderateScale(1.5),
    borderColor: themeSecond.avatarRingBorder,
    marginRight: moderateScale(14),
    position: "relative",
  },
  avatarInner: {
    width: "100%",
    height: "100%",
    borderRadius: moderateScale(30),
    overflow: "hidden",
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: moderateScale(30),
  },
  avatarPlaceholder: {
    flex: 1,
    backgroundColor: themeSecond.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: {
    fontSize: moderateScale(22),
    fontWeight: "700",
    color: themeSecond.accentPurple,
  },
  avatarSkeleton: {
    width: moderateScale(64),
    height: moderateScale(64),
    borderRadius: moderateScale(32),
    marginRight: moderateScale(14),
  },
  verifiedBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: moderateScale(22),
    height: moderateScale(22),
    borderRadius: moderateScale(11),
    backgroundColor: themeSecond.onlineGreen,
    borderWidth: moderateScale(2),
    borderColor: themeSecond.bgDark,
    alignItems: "center",
    justifyContent: "center",
  },
  userInfo: {
    flex: 1,
    justifyContent: "center",
  },
  userName: {
    fontSize: moderateScale(17),
    fontWeight: "700",
    color: themeSecond.textPrimary,
    marginBottom: verticalScale(2),
  },
  userEmail: {
    fontSize: moderateScale(12),
    color: themeSecond.textSoft,
    marginBottom: verticalScale(8),
  },
  badge: {
    flexDirection: "row",
    alignSelf: "flex-start",
    alignItems: "center",
    paddingHorizontal: moderateScale(10),
    paddingVertical: verticalScale(5),
    borderRadius: moderateScale(14),
    backgroundColor: themeSecond.pillBg,
    borderWidth: moderateScale(1),
    borderColor: themeSecond.pillBorder,
    gap: moderateScale(4),
  },
  badgePremium: {
    backgroundColor: themeSecond.accentPurpleLight,
    borderColor: themeSecond.accentPurpleMedium,
  },
  badgeText: {
    fontSize: moderateScale(11),
    fontWeight: "600",
    color: themeSecond.textPrimary,
  },
  badgeTextPremium: {
    fontSize: moderateScale(11),
    fontWeight: "700",
    color: themeSecond.textPrimary,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: verticalScale(12),
    borderTopWidth: moderateScale(1),
    borderTopColor: themeSecond.borderLight,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(6),
  },
  statIcon: {
    width: moderateScale(26),
    height: moderateScale(26),
    borderRadius: moderateScale(13),
    alignItems: "center",
    justifyContent: "center",
  },
  statLabel: {
    fontSize: moderateScale(11),
    fontWeight: "600",
    color: themeSecond.textMuted,
  },
  statDivider: {
    width: moderateScale(1),
    height: moderateScale(18),
    backgroundColor: themeSecond.borderMedium,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: verticalScale(12),
    paddingHorizontal: moderateScale(4),
    borderBottomWidth: moderateScale(1),
    borderBottomColor: themeSecond.borderLight,
    minHeight: verticalScale(56),
  },
  settingRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: moderateScale(12),
  },
  settingIconCircle: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(12),
    alignItems: "center",
    justifyContent: "center",
    marginRight: moderateScale(12),
  },
  settingTextWrap: {
    flex: 1,
  },
  settingLabel: {
    fontSize: moderateScale(14),
    fontWeight: "600",
    color: themeSecond.textPrimary,
    marginBottom: verticalScale(2),
  },
  settingLabelDestructive: {
    color: themeSecond.statusError,
  },
  settingDescription: {
    fontSize: moderateScale(11),
    color: themeSecond.textSoft,
    lineHeight: moderateScale(15),
  },
  bottomSpacing: {
    height: verticalScale(32),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: themeSecond.overlayBlack,
    justifyContent: "center",
    alignItems: "center",
    padding: moderateScale(20),
  },
  modalContent: {
    backgroundColor: themeSecond.surfaceModal,
    borderRadius: moderateScale(24),
    width: "100%",
    maxWidth: moderateScale(340),
    paddingVertical: verticalScale(28),
    paddingHorizontal: moderateScale(22),
    alignItems: "center",
    borderWidth: moderateScale(1),
    borderColor: themeSecond.glassBorder,
  },
  modalIconCircle: {
    width: moderateScale(72),
    height: moderateScale(72),
    borderRadius: moderateScale(36),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: verticalScale(16),
  },
  modalIconDanger: {
    backgroundColor: themeSecond.iconHeartBg,
    borderWidth: moderateScale(2),
    borderColor: themeSecond.statusError,
  },
  modalIconWarning: {
    backgroundColor: themeSecond.accentPurpleLight,
    borderWidth: moderateScale(2),
    borderColor: themeSecond.statusWarning,
  },
  modalIconSuccess: {
    backgroundColor: themeSecond.tagGreenBg,
    borderWidth: moderateScale(2),
    borderColor: themeSecond.statusSuccess,
  },
  modalTitle: {
    fontSize: moderateScale(18),
    fontWeight: "700",
    color: themeSecond.textPrimary,
    marginBottom: verticalScale(8),
    textAlign: "center",
  },
  modalMessage: {
    fontSize: moderateScale(14),
    color: themeSecond.textSoft,
    textAlign: "center",
    lineHeight: moderateScale(20),
    marginBottom: verticalScale(24),
    paddingHorizontal: moderateScale(8),
  },
  modalButtons: {
    flexDirection: "row",
    width: "100%",
    gap: moderateScale(12),
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(14),
    backgroundColor: themeSecond.surfaceWhiteSubtle,
    borderWidth: moderateScale(1),
    borderColor: themeSecond.borderMedium,
    alignItems: "center",
    justifyContent: "center",
  },
  modalCancelText: {
    fontSize: moderateScale(15),
    fontWeight: "600",
    color: themeSecond.textPrimary,
  },
  modalActionBtn: {
    flex: 1,
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(14),
    alignItems: "center",
    justifyContent: "center",
  },
  modalActionDanger: {
    backgroundColor: themeSecond.statusError,
  },
  modalActionWarning: {
    backgroundColor: themeSecond.statusWarning,
  },
  modalActionSuccess: {
    backgroundColor: themeSecond.statusSuccess,
  },
  modalActionText: {
    fontSize: moderateScale(15),
    fontWeight: "600",
    color: themeSecond.textPrimary,
  },
});
