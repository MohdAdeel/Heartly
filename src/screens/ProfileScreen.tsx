import {
  Text,
  View,
  Modal,
  FlatList,
  Platform,
  Dimensions,
  ScrollView,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import {
  getOptionIcon,
  getSmokingIcon,
  getDrinkingIcon,
  getReligionIcon,
  getLanguageIcon,
  getInterestIcon,
  getPersonalityIcon,
  getInterestIconColor,
  getIntentionStageIcon,
  getPersonalityIconColor,
} from "../utils/optionIcons";
import {
  SkeletonBox,
  SkeletonShimmer,
  useShimmerAnimation,
} from "../components/SkeletonLoader";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useAlerts } from "../components/Alert";
import FastImage from "react-native-fast-image";
import { useAuth } from "../context/AuthContext";
import { themeSecond } from "../theme/colorSecond";
import Ionicons from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import React, { useRef, useState, useEffect } from "react";
import { getHardcodedProfileById } from "../constants/profiles";
import { useRoute, useNavigation } from "@react-navigation/native";
import type { MainStackScreenProps } from "../types/navigation.types";
import { moderateScale, verticalScale } from "react-native-size-matters";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const { width, height } = Dimensions.get("window");

type ProfileImage = {
  position: number;
  image_url: string;
};

const getPresenceStatus = (lastActiveAt?: string | null) => {
  if (!lastActiveAt) {
    return { isOnline: false, label: "Offline" };
  }
  return { isOnline: false, label: "Recently active" };
};

// Pill icon size (used in all tag pills)
const PILL_ICON_SIZE = moderateScale(20);

// Colored pill config: icon + color (pill bg/border use same hex with alpha)
const getPillStyle = (hexColor: string) => {
  const hex = hexColor.replace("#", "");
  return {
    backgroundColor: `#${hex}33`,
    borderColor: `#${hex}80`,
  };
};
const getReligionPill = (value: string) => ({
  icon: getReligionIcon(value),
  color: themeSecond.pillReligion,
});
const getMaritalPill = (value: string) => ({
  icon: getOptionIcon(3, value),
  color: themeSecond.pillMarital,
});
const getLanguagePill = (value: string) => ({
  icon: getLanguageIcon(value),
  color: themeSecond.pillLanguage,
});
const getDietPill = (value: string) => ({
  icon: getOptionIcon(14, value),
  color: themeSecond.pillDiet,
});
const getSmokingPill = (value: string) => ({
  icon: getSmokingIcon(value),
  color: themeSecond.pillSmoking,
});
const getDrinkingPill = (value: string) => ({
  icon: getDrinkingIcon(value),
  color: themeSecond.pillDrinking,
});

// Plans: questionId 9=living, 10=relocation, 11=children, 12=family
const PLANS_FIELDS: Array<{ key: string; questionId: number; color: string }> =
  [
    {
      key: "family_involvement_importance",
      questionId: 12,
      color: themeSecond.planFamily,
    },
    { key: "children_views", questionId: 11, color: themeSecond.planChildren },
    { key: "living_situation", questionId: 9, color: themeSecond.planLiving },
    {
      key: "relocation_preference",
      questionId: 10,
      color: themeSecond.planRelocation,
    },
  ];
const INTENTION_STAGES = [
  {
    label: "Chatting",
    icon: getIntentionStageIcon("Chatting"),
    color: themeSecond.intentionChatting,
  },
  {
    label: "Family",
    icon: getIntentionStageIcon("Family"),
    color: themeSecond.intentionFamily,
  },
  {
    label: "Marriage",
    icon: getIntentionStageIcon("Marriage"),
    color: themeSecond.intentionMarriage,
  },
];
const TIMELINE_STEPS = [
  { value: "Within 6 months", label: "0-6 mo" },
  { value: "Within 1 year", label: "6-12 mo" },
  { value: "Within 2 years", label: "1-2 yrs" },
  { value: "No rush", label: "No rush" },
];
const getPlansPill = (questionId: number, value: string, color: string) => ({
  icon: getOptionIcon(questionId, value),
  color,
});
const getTimelineIndex = (timeline: string) => {
  const normalized = timeline.toLowerCase();
  if (normalized.includes("6 months")) return 0;
  if (normalized.includes("1 year")) return 1;
  if (normalized.includes("2 years")) return 2;
  if (normalized.includes("no rush")) return 3;
  return -1;
};

const ProfileSecond = () => {
  const insets = useSafeAreaInsets();
  const route = useRoute<MainStackScreenProps<"ProfileScreen">["route"]>();
  const navigation =
    useNavigation<MainStackScreenProps<"ProfileScreen">["navigation"]>();
  const { profile: ownProfile, user: currentUser } = useAuth();
  const { showAlert } = useAlerts();
  const userId = route.params?.userId;
  const isViewingOwnProfile = !userId || userId === currentUser?.id;

  const [viewingProfile, setViewingProfile] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [isActing, setIsActing] = useState(false);
  const [isMatched, setIsMatched] = useState(false);
  const [isMatchStatusLoading] = useState(false);
  const [profileImages, setProfileImages] = useState<ProfileImage[]>([]);
  const [imagesLoading, setImagesLoading] = useState(false);
  const [isViewerVisible, setIsViewerVisible] = useState(false);
  const [viewerStartIndex, setViewerStartIndex] = useState(0);
  const [viewerIndex, setViewerIndex] = useState(0);
  const viewerListRef = useRef<FlatList<string>>(null);
  const wantsActionIcons = route.params?.showActionIcons === true;
  const shouldShowActionIcons =
    wantsActionIcons && !isViewingOwnProfile && !isMatched;

  useEffect(() => {
    if (
      !wantsActionIcons ||
      !currentUser?.id ||
      !userId ||
      isViewingOwnProfile
    ) {
      setIsMatched(false);
      return;
    }
    setIsMatched(false);
  }, [currentUser?.id, userId, isViewingOwnProfile, wantsActionIcons]);

  useEffect(() => {
    if (userId && userId !== currentUser?.id) {
      setLoadingProfile(true);
      setViewingProfile(getHardcodedProfileById(userId) || null);
      setLoadingProfile(false);
    }
  }, [userId, currentUser?.id]);

  useEffect(() => {
    const targetUserId = userId || currentUser?.id;
    if (!targetUserId) return;
    setImagesLoading(true);
    const found = getHardcodedProfileById(targetUserId);
    const localImages: ProfileImage[] = (found?.image_urls || []).map(
      (image_url, index) => ({
        image_url,
        position: index,
      })
    );
    setProfileImages(localImages);
    setImagesLoading(false);
  }, [userId, currentUser?.id]);

  useEffect(() => {
    if (profileImages.length === 0) return;

    const imageSources = profileImages
      .map((img) => img.image_url)
      .filter(Boolean)
      .map((uri) => ({
        uri,
        priority: FastImage.priority.high,
      }));

    if (imageSources.length > 0) {
      FastImage.preload(imageSources);
    }
  }, [profileImages]);

  const calculateAge = (dateOfBirth: string): number => {
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
  };

  const displayedProfile = isViewingOwnProfile ? ownProfile : viewingProfile;

  const getProfileData = () => {
    if (!displayedProfile) return null;
    const sortedImages = [...profileImages].sort(
      (a, b) => a.position - b.position
    );
    const photos = sortedImages.map((img) => img.image_url);
    const age = calculateAge(displayedProfile.date_of_birth || "");
    const languages = displayedProfile.languages || [];
    const interests = displayedProfile.interests || [];
    const personalities =
      displayedProfile.personalities ||
      (displayedProfile as any).personality ||
      [];

    return {
      name: displayedProfile.full_name || "User",
      age: age || 0,
      profession: displayedProfile.occupation || "Not specified",
      education: displayedProfile.education_level || "Not specified",
      location: displayedProfile.country || "Not specified",
      height: displayedProfile.height || "Not specified",
      bio: displayedProfile.bio || "No bio available",
      tags: [],
      isOnline: displayedProfile.isShowingOnlineStatus || false,
      lastActiveAt: displayedProfile.last_active_at || null,
      isVerified: displayedProfile.isVerified || false,
      religion: displayedProfile.religion || "Not specified",
      sect: displayedProfile.sect || "Not specified",
      caste: (displayedProfile as any).caste || "Not specified",
      marital_status: displayedProfile.marital_status || "Not specified",
      languages: languages.length > 0 ? languages : [],
      interests: Array.isArray(interests) ? interests : [],
      personalities: Array.isArray(personalities) ? personalities : [],
      skin_tone: displayedProfile.skin_tone || "Not specified",
      healthy_lifestyle_importance:
        displayedProfile.healthy_lifestyle_importance || "Not specified",
      religiosity_level: displayedProfile.religiosity_level || "Not specified",
      smoking_habit: displayedProfile.smoking_habit || "Not specified",
      drinking_habit: displayedProfile.drinking_habit || "Not specified",
      dietary_preference:
        displayedProfile.dietary_preference || "Not specified",
      family_involvement_importance:
        displayedProfile.family_involvement_importance || "Not specified",
      marriage_timeline: displayedProfile.marriage_timeline || "Not specified",
      relationship_preference:
        displayedProfile.relationship_preference || "Not specified",
      children_views: displayedProfile.children_views || "Not specified",
      living_situation: displayedProfile.living_situation || "Not specified",
      relocation_preference:
        displayedProfile.relocation_preference || "Not specified",
      partner_age_range_preference:
        displayedProfile.partner_age_range_preference || "Not specified",
      photos,
    };
  };

  const profileData = getProfileData();
  const currentPresenceStatus = getPresenceStatus(profileData?.lastActiveAt);
  const allPhotoUris = (profileData?.photos || []).filter(
    (uri): uri is string => typeof uri === "string" && uri.length > 0
  );
  const loading = loadingProfile && !isViewingOwnProfile;
  const loadingScreenData = loading || imagesLoading || isMatchStatusLoading;
  const shimmerAnim = useShimmerAnimation(loadingScreenData);
  const heroUri =
    profileImages.length > 0
      ? profileImages.find((img) => img.position === 0)?.image_url
      : null;

  const openImageViewer = (startIndex: number = 0) => {
    if (allPhotoUris.length === 0) return;
    const clampedIndex = Math.max(
      0,
      Math.min(startIndex, allPhotoUris.length - 1)
    );
    setViewerStartIndex(clampedIndex);
    setViewerIndex(clampedIndex);
    setIsViewerVisible(true);
  };

  useEffect(() => {
    if (!isViewerVisible) return;
    const timer = setTimeout(() => {
      viewerListRef.current?.scrollToIndex({
        index: viewerStartIndex,
        animated: false,
      });
    }, 0);
    return () => clearTimeout(timer);
  }, [isViewerVisible, viewerStartIndex]);

  const handleLike = async () => {
    if (!currentUser?.id || !userId || isActing) return;
    try {
      setIsActing(true);
      navigation.navigate("MainTabs", {
        screen: "Discover",
        params: { forceRefreshAt: Date.now() },
      });
    } catch (error: any) {
      showAlert({
        variant: "error",
        title: "Error",
        message: error?.message || "Failed to like profile. Please try again.",
      });
    } finally {
      setIsActing(false);
    }
  };

  const handleDislike = async () => {
    if (!currentUser?.id || !userId || isActing) return;
    try {
      setIsActing(true);
      navigation.navigate("MainTabs", {
        screen: "Discover",
        params: { forceRefreshAt: Date.now() },
      });
    } catch (error: any) {
      showAlert({
        variant: "error",
        title: "Error",
        message:
          error?.message || "Failed to dislike profile. Please try again.",
      });
    } finally {
      setIsActing(false);
    }
  };

  if (loadingScreenData || (loading && !displayedProfile)) {
    return (
      <View style={styles.container}>
        <SkeletonShimmer
          shimmerAnim={shimmerAnim}
          style={styles.skeletonHero}
        />
        <SafeAreaView
          style={styles.safeArea}
          edges={["bottom", "left", "right"]}
        >
          <View
            style={[
              styles.headerOverlay,
              {
                paddingTop: insets.top + verticalScale(6),
                paddingHorizontal: moderateScale(20),
              },
            ]}
          >
            <SkeletonBox
              shimmerAnim={shimmerAnim}
              width={moderateScale(36)}
              height={moderateScale(36)}
              borderRadius={moderateScale(18)}
            />
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[
              styles.scrollContent,
              { paddingTop: height * 0.38, minHeight: height },
            ]}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.glassWrap}>
              {wantsActionIcons && (
                <View style={styles.profileActionsWrap}>
                  <SkeletonBox
                    shimmerAnim={shimmerAnim}
                    width={moderateScale(42)}
                    height={moderateScale(42)}
                    borderRadius={moderateScale(21)}
                  />
                  <SkeletonBox
                    shimmerAnim={shimmerAnim}
                    width={moderateScale(42)}
                    height={moderateScale(42)}
                    borderRadius={moderateScale(21)}
                  />
                </View>
              )}

              <View style={styles.topRow}>
                <SkeletonBox
                  shimmerAnim={shimmerAnim}
                  width={moderateScale(110)}
                  height={moderateScale(26)}
                  borderRadius={moderateScale(16)}
                />
              </View>

              <View style={styles.nameRow}>
                <SkeletonBox
                  shimmerAnim={shimmerAnim}
                  width={moderateScale(180)}
                  height={moderateScale(28)}
                  borderRadius={moderateScale(8)}
                />
              </View>

              <SkeletonBox
                shimmerAnim={shimmerAnim}
                width={moderateScale(160)}
                height={moderateScale(18)}
                borderRadius={moderateScale(6)}
                style={{ marginBottom: verticalScale(8) }}
              />

              <View style={styles.locationRow}>
                <SkeletonBox
                  shimmerAnim={shimmerAnim}
                  width={moderateScale(14)}
                  height={moderateScale(14)}
                  borderRadius={moderateScale(7)}
                />
                <SkeletonBox
                  shimmerAnim={shimmerAnim}
                  width={moderateScale(140)}
                  height={moderateScale(16)}
                  borderRadius={moderateScale(6)}
                />
              </View>

              <View style={styles.tagsRow}>
                {[1, 2, 3].map((item) => (
                  <SkeletonBox
                    key={`header-pill-${item}`}
                    shimmerAnim={shimmerAnim}
                    width={moderateScale(88)}
                    height={moderateScale(34)}
                    borderRadius={moderateScale(18)}
                  />
                ))}
              </View>

              {[1, 2, 3, 4, 5].map((section) => (
                <View key={`section-${section}`} style={styles.section}>
                  <SkeletonBox
                    shimmerAnim={shimmerAnim}
                    width={moderateScale(120)}
                    height={moderateScale(20)}
                    borderRadius={moderateScale(6)}
                    style={{ marginBottom: verticalScale(12) }}
                  />
                  <View style={styles.tagsRow}>
                    {[1, 2, 3, 4].map((item) => (
                      <SkeletonBox
                        key={`section-${section}-pill-${item}`}
                        shimmerAnim={shimmerAnim}
                        width={moderateScale(92)}
                        height={moderateScale(34)}
                        borderRadius={moderateScale(18)}
                      />
                    ))}
                  </View>
                </View>
              ))}

              <View style={styles.section}>
                <SkeletonBox
                  shimmerAnim={shimmerAnim}
                  width={moderateScale(120)}
                  height={moderateScale(20)}
                  borderRadius={moderateScale(6)}
                  style={{ marginBottom: verticalScale(12) }}
                />
                <View style={styles.galleryRow}>
                  <SkeletonShimmer
                    shimmerAnim={shimmerAnim}
                    style={styles.galleryFeature}
                  />
                  <View style={styles.galleryThumbs}>
                    <SkeletonShimmer
                      shimmerAnim={shimmerAnim}
                      style={[styles.galleryThumb, styles.galleryThumbFirst]}
                    />
                    <SkeletonShimmer
                      shimmerAnim={shimmerAnim}
                      style={styles.galleryThumb}
                    />
                  </View>
                </View>
              </View>

              <View style={styles.bottomSpacing} />
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }

  if (!profileData) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Ionicons
          name="person-outline"
          size={moderateScale(64)}
          color={themeSecond.textSoft}
        />
        <Text style={styles.loadingText}>No profile data available</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="chevron-back"
            size={moderateScale(24)}
            color={themeSecond.textPrimary}
          />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{
          uri: heroUri || "",
        }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Bottom gradient for readability (like HomeSecond card) */}
        <LinearGradient
          colors={[
            "transparent",
            themeSecond.overlayDarkLight,
            themeSecond.overlayDarkHeavy,
          ]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
        <SafeAreaView
          style={styles.safeArea}
          edges={["bottom", "left", "right"]}
        >
          {/* Same vertical offset as Home filter row: safe area + 6 */}
          <View
            style={[
              styles.headerOverlay,
              {
                paddingTop: insets.top + verticalScale(6),
                paddingHorizontal: moderateScale(20),
              },
            ]}
          >
            <TouchableOpacity
              style={styles.backButton}
              activeOpacity={0.8}
              onPress={() => navigation.goBack()}
            >
              <Ionicons
                name="chevron-back"
                size={moderateScale(24)}
                color={themeSecond.textPrimary}
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[
              styles.scrollContent,
              {
                paddingTop: height * 0.38,
                minHeight: height,
              },
            ]}
            showsVerticalScrollIndicator={false}
          >
            {/* Glass panel - starts at collarbone level, frosted so image shows through */}
            <View style={styles.glassWrap}>
              {shouldShowActionIcons && (
                <View style={styles.profileActionsWrap}>
                  <TouchableOpacity
                    style={[styles.profileActionButton, styles.rejectAction]}
                    activeOpacity={0.9}
                    disabled={isActing}
                    onPress={handleDislike}
                  >
                    <Ionicons
                      name="close"
                      size={moderateScale(20)}
                      color={themeSecond.textPrimary}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.profileActionButton, styles.likeAction]}
                    activeOpacity={0.9}
                    disabled={isActing}
                    onPress={handleLike}
                  >
                    <Ionicons
                      name="heart"
                      size={moderateScale(20)}
                      color={themeSecond.textPrimary}
                    />
                  </TouchableOpacity>
                </View>
              )}
              {/* Online badge + name row */}
              <View style={styles.topRow}>
                <View style={styles.onlineBadge}>
                  <View
                    style={[
                      styles.onlineDot,
                      !currentPresenceStatus.isOnline &&
                        styles.onlineDotOffline,
                    ]}
                  />
                  <Text style={styles.onlineText}>
                    {currentPresenceStatus.label}
                  </Text>
                </View>
              </View>
              <View style={styles.nameRow}>
                <Text style={styles.userName}>
                  {profileData.name}, {profileData.age}
                </Text>
                {profileData.isVerified && (
                  <Ionicons
                    name="checkmark-circle"
                    size={moderateScale(18)}
                    color={themeSecond.textMuted}
                  />
                )}
              </View>
              {(profileData.profession || profileData.education) && (
                <View style={styles.locationRow}>
                  {profileData.profession && (
                    <>
                      <Ionicons
                        name="briefcase-outline"
                        size={moderateScale(18)}
                        color={themeSecond.accentPurple}
                      />
                      <Text style={styles.locationText}>
                        {profileData.profession}
                      </Text>
                    </>
                  )}
                  {profileData.profession && profileData.education && (
                    <Text style={styles.locationText}> · </Text>
                  )}
                  {profileData.education && (
                    <>
                      <Ionicons
                        name="school-outline"
                        size={moderateScale(18)}
                        color={themeSecond.accentPurple}
                      />
                      <Text style={styles.locationText}>
                        {profileData.education}
                      </Text>
                    </>
                  )}
                </View>
              )}

              {/* Location and height */}
              <View style={styles.locationRow}>
                <Ionicons
                  name="location"
                  size={moderateScale(18)}
                  color={themeSecond.accentPurple}
                />
                <Text style={styles.locationText}>{profileData.location}</Text>

                {profileData.height &&
                  profileData.height !== "Not specified" && (
                    <>
                      <Text style={styles.locationText}> · </Text>
                      <Ionicons
                        name="resize"
                        size={moderateScale(18)}
                        color={themeSecond.accentPurple}
                      />
                      <Text style={styles.locationText}>
                        {profileData.height}
                      </Text>
                    </>
                  )}
              </View>

              {/* Tags */}
              <View style={styles.tagsRow}>
                {profileData.tags.map((tag) => (
                  <View key={tag} style={styles.tagPill}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
                {profileData.marital_status &&
                  profileData.marital_status !== "Not specified" &&
                  (() => {
                    const { icon, color } = getMaritalPill(
                      profileData.marital_status
                    );
                    const pillStyle = getPillStyle(color);
                    return (
                      <View
                        key="marital"
                        style={[styles.tagPill, styles.pillWithIcon, pillStyle]}
                      >
                        <View style={styles.pillIconWrap}>
                          <Ionicons
                            name={icon}
                            size={PILL_ICON_SIZE}
                            color={color}
                          />
                        </View>
                        <Text style={styles.tagText}>
                          {profileData.marital_status}
                        </Text>
                      </View>
                    );
                  })()}
              </View>

              <View style={styles.galleryLabel}>
                <Text style={styles.sectionTitle}>Bio</Text>
              </View>
              {/* Bio */}
              <Text style={styles.bioText}>{profileData.bio}</Text>

              {/* Profile gallery – only when 2+ images (cover is in background) */}
              {profileData.photos && profileData.photos.length >= 2 && (
                <View style={[styles.section, styles.galleryWrap]}>
                  <View style={styles.galleryLabel}>
                    <Text style={styles.sectionTitle}>Photos</Text>
                  </View>

                  {/* 4+ images: feature + 2 thumbs (no cover in this section) */}
                  {profileData.photos.length >= 4 && (
                    <View style={styles.galleryRow}>
                      <View style={styles.galleryFeature}>
                        <TouchableOpacity
                          activeOpacity={0.9}
                          onPress={() => openImageViewer(1)}
                        >
                          <FastImage
                            source={{
                              uri: profileData.photos[1],
                              priority: FastImage.priority.high,
                              cache: FastImage.cacheControl.immutable,
                            }}
                            style={styles.galleryImage}
                            resizeMode={FastImage.resizeMode.cover}
                          />
                        </TouchableOpacity>
                      </View>
                      <View style={styles.galleryThumbs}>
                        <View
                          style={[
                            styles.galleryThumb,
                            styles.galleryThumbFirst,
                            styles.galleryThumbTiltRight,
                          ]}
                        >
                          <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => openImageViewer(2)}
                          >
                            <FastImage
                              source={{
                                uri: profileData.photos[2],
                                priority: FastImage.priority.high,
                                cache: FastImage.cacheControl.immutable,
                              }}
                              style={styles.galleryImage}
                              resizeMode={FastImage.resizeMode.cover}
                            />
                          </TouchableOpacity>
                        </View>
                        <View
                          style={[
                            styles.galleryThumb,
                            styles.galleryThumbTiltLeft,
                          ]}
                        >
                          <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => openImageViewer(3)}
                          >
                            <FastImage
                              source={{
                                uri: profileData.photos[3],
                                priority: FastImage.priority.high,
                                cache: FastImage.cacheControl.immutable,
                              }}
                              style={styles.galleryImage}
                              resizeMode={FastImage.resizeMode.cover}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  )}

                  {/* 3 images: two cards side-by-side with tilt */}
                  {profileData.photos.length === 3 && (
                    <View style={styles.galleryTwoRow}>
                      <View
                        style={[
                          styles.galleryTwoCard,
                          styles.galleryTwoCardLeft,
                        ]}
                      >
                        <TouchableOpacity
                          activeOpacity={0.9}
                          onPress={() => openImageViewer(1)}
                        >
                          <FastImage
                            source={{
                              uri: profileData.photos[1],
                              priority: FastImage.priority.high,
                              cache: FastImage.cacheControl.immutable,
                            }}
                            style={styles.galleryImage}
                            resizeMode={FastImage.resizeMode.cover}
                          />
                        </TouchableOpacity>
                      </View>
                      <View
                        style={[
                          styles.galleryTwoCard,
                          styles.galleryTwoCardRight,
                        ]}
                      >
                        <TouchableOpacity
                          activeOpacity={0.9}
                          onPress={() => openImageViewer(2)}
                        >
                          <FastImage
                            source={{
                              uri: profileData.photos[2],
                              priority: FastImage.priority.high,
                              cache: FastImage.cacheControl.immutable,
                            }}
                            style={styles.galleryImage}
                            resizeMode={FastImage.resizeMode.cover}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}

                  {/* 2 images: single standout card (cover is background) */}
                  {profileData.photos.length === 2 && (
                    <View style={styles.gallerySingleWrap}>
                      <View style={styles.gallerySingleCard}>
                        <TouchableOpacity
                          activeOpacity={0.9}
                          onPress={() => openImageViewer(1)}
                        >
                          <FastImage
                            source={{
                              uri: profileData.photos[1],
                              priority: FastImage.priority.high,
                              cache: FastImage.cacheControl.immutable,
                            }}
                            style={styles.galleryImage}
                            resizeMode={FastImage.resizeMode.cover}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>
              )}

              {/* Marriage intentions graph */}
              {profileData.marriage_timeline &&
                profileData.marriage_timeline !== "Not specified" && (
                  <View style={styles.section}>
                    <View style={styles.intentionsCard}>
                      <Text style={styles.sectionTitle}>
                        Marriage Intentions of {profileData.name}
                      </Text>
                      {(() => {
                        const timelineIndex = getTimelineIndex(
                          profileData.marriage_timeline
                        );
                        const visibleSteps =
                          timelineIndex >= 0
                            ? TIMELINE_STEPS.slice(0, timelineIndex + 1)
                            : TIMELINE_STEPS;
                        const getIntentionForStep = (
                          i: number,
                          total: number
                        ) => {
                          if (total === 1) return INTENTION_STAGES[2]; // Marriage only
                          return i === total - 1
                            ? INTENTION_STAGES[2] // Marriage on last
                            : INTENTION_STAGES[i]; // Chatting, Family, ...
                        };
                        return (
                          <>
                            <View style={styles.timelineRow}>
                              <View style={styles.timelineStart}>
                                <Text style={styles.timelineStartText}>
                                  {" "}
                                  Match Timeline
                                </Text>
                              </View>
                              <View
                                style={[
                                  styles.timelineTrack,
                                  styles.timelineTrackStack,
                                ]}
                              >
                                <View
                                  style={[
                                    styles.timelineLine,
                                    styles.timelineLineAbsolute,
                                  ]}
                                />
                                <View
                                  style={[
                                    styles.timelineStepsRow,
                                    visibleSteps.length === 1 &&
                                      styles.timelineStepsRowSingle,
                                  ]}
                                >
                                  {visibleSteps.map((step, index) => {
                                    const stage = getIntentionForStep(
                                      index,
                                      visibleSteps.length
                                    );
                                    const isActive =
                                      index === visibleSteps.length - 1;
                                    return (
                                      <View
                                        key={step.value}
                                        style={styles.timelineStepColumn}
                                      >
                                        <View
                                          style={[styles.timelineIntentionPill]}
                                        >
                                          <Ionicons
                                            name={stage.icon}
                                            size={moderateScale(10)}
                                            color={stage.color}
                                          />
                                          <Text
                                            style={
                                              styles.timelineIntentionPillText
                                            }
                                          >
                                            {stage.label}
                                          </Text>
                                        </View>
                                        <View
                                          style={[
                                            styles.timelineTick,
                                            isActive &&
                                              styles.timelineTickActive,
                                            isActive &&
                                              styles.timelineTickHeart,
                                            {
                                              backgroundColor: `${stage.color}${
                                                isActive ? "33" : "33"
                                              }`,
                                              borderColor: `${stage.color}${
                                                isActive ? "CC" : "99"
                                              }`,
                                            },
                                          ]}
                                        >
                                          {isActive ? (
                                            <Ionicons
                                              name="heart"
                                              size={moderateScale(12)}
                                              color={stage.color}
                                            />
                                          ) : null}
                                        </View>
                                        <Text
                                          style={[
                                            styles.timelineStepLabel,
                                            styles.timelineLabelActive,
                                          ]}
                                        >
                                          {step.label}
                                        </Text>
                                      </View>
                                    );
                                  })}
                                </View>
                              </View>
                            </View>
                          </>
                        );
                      })()}
                      <View style={styles.timelineBadge}>
                        <Ionicons
                          name="time-outline"
                          size={moderateScale(12)}
                          color={themeSecond.accentPurple}
                        />
                        <Text style={styles.timelineBadgeText}>
                          {profileData.marriage_timeline}
                        </Text>
                      </View>
                    </View>
                  </View>
                )}

              {/* Essentials: religion, languages */}
              {profileData.religion &&
                profileData.religion !== "Not specified" && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Essentials</Text>
                    <View style={styles.tagsRow}>
                      {(() => {
                        const { icon, color } = getReligionPill(
                          profileData.religion
                        );
                        return (
                          <View
                            key="religion"
                            style={[styles.tagPill, styles.pillWithIcon]}
                          >
                            <View style={styles.pillIconWrap}>
                              <Ionicons
                                name={icon}
                                size={PILL_ICON_SIZE}
                                color={color}
                              />
                            </View>
                            <Text style={styles.tagText}>
                              {profileData.religion}
                            </Text>
                          </View>
                        );
                      })()}
                    </View>
                  </View>
                )}

              {/* Languages */}
              {profileData.languages && profileData.languages.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Languages</Text>
                  <View style={styles.tagsRow}>
                    {profileData.languages.map((lang: string) => {
                      const { icon, color } = getLanguagePill(lang);
                      return (
                        <View
                          key={lang}
                          style={[styles.tagPill, styles.pillWithIcon]}
                        >
                          <View style={styles.pillIconWrap}>
                            <Ionicons
                              name={icon}
                              size={PILL_ICON_SIZE}
                              color={color}
                            />
                          </View>
                          <Text style={styles.tagText}>{lang}</Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              )}

              {/* Dietary Preferences */}
              {(profileData.dietary_preference ||
                profileData.smoking_habit ||
                profileData.drinking_habit) && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Dietary Preferences</Text>
                  <View style={styles.tagsRow}>
                    {profileData.dietary_preference &&
                      profileData.dietary_preference !== "Not specified" &&
                      (() => {
                        const { icon, color } = getDietPill(
                          profileData.dietary_preference
                        );
                        // const pillStyle = getPillStyle(color);
                        return (
                          <View
                            key="diet"
                            style={[
                              styles.tagPill,
                              styles.pillWithIcon,
                              // pillStyle,
                            ]}
                          >
                            <View style={styles.pillIconWrap}>
                              <Ionicons
                                name={icon}
                                size={PILL_ICON_SIZE}
                                color={color}
                              />
                            </View>
                            <Text style={styles.tagText}>
                              {profileData.dietary_preference}
                            </Text>
                          </View>
                        );
                      })()}
                    {profileData.smoking_habit &&
                      profileData.smoking_habit !== "Not specified" &&
                      (() => {
                        const { icon, color } = getSmokingPill(
                          profileData.smoking_habit
                        );
                        // const pillStyle = getPillStyle(color);
                        return (
                          <View
                            key="smoking"
                            style={[
                              styles.tagPill,
                              styles.pillWithIcon,
                              // pillStyle,
                            ]}
                          >
                            <View style={styles.pillIconWrap}>
                              <MaterialCommunityIcons
                                name={icon}
                                size={PILL_ICON_SIZE}
                                color={color}
                              />
                            </View>
                            <Text style={styles.tagText}>
                              {profileData.smoking_habit}
                            </Text>
                          </View>
                        );
                      })()}
                    {profileData.drinking_habit &&
                      profileData.drinking_habit !== "Not specified" &&
                      (() => {
                        const { icon, color } = getDrinkingPill(
                          profileData.drinking_habit
                        );
                        // const pillStyle = getPillStyle(color);
                        return (
                          <View
                            key="drinking"
                            style={[
                              styles.tagPill,
                              styles.pillWithIcon,
                              // pillStyle,
                            ]}
                          >
                            <View style={styles.pillIconWrap}>
                              <Ionicons
                                name={icon}
                                size={PILL_ICON_SIZE}
                                color={color}
                              />
                            </View>
                            <Text style={styles.tagText}>
                              {profileData.drinking_habit}
                            </Text>
                          </View>
                        );
                      })()}
                  </View>
                </View>
              )}

              {/* Interests */}
              {profileData.interests && profileData.interests.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Interests</Text>
                  <View style={styles.tagsRow}>
                    {profileData.interests.map((interest: string) => {
                      const icon = getInterestIcon(interest);
                      const color = getInterestIconColor(interest);
                      return (
                        <View
                          key={interest}
                          style={[styles.tagPill, styles.pillWithIcon]}
                        >
                          <View style={styles.pillIconWrap}>
                            <Ionicons
                              name={icon}
                              size={PILL_ICON_SIZE}
                              color={color}
                            />
                          </View>
                          <Text style={styles.tagText}>{interest}</Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              )}

              {/* Personality */}
              {profileData.personalities &&
                profileData.personalities.length > 0 && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Personality</Text>
                    <View style={styles.tagsRow}>
                      {profileData.personalities.map((trait: string) => {
                        const icon = getPersonalityIcon(trait);
                        const color = getPersonalityIconColor(trait);
                        return (
                          <View
                            key={trait}
                            style={[styles.tagPill, styles.pillWithIcon]}
                          >
                            <View style={styles.pillIconWrap}>
                              <Ionicons
                                name={icon}
                                size={PILL_ICON_SIZE}
                                color={color}
                              />
                            </View>
                            <Text style={styles.tagText}>{trait}</Text>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                )}

              {/* Marriage & plans */}
              {(profileData.family_involvement_importance ||
                profileData.children_views ||
                profileData.living_situation ||
                profileData.relocation_preference) && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Plans</Text>
                  <View style={styles.tagsRow}>
                    {PLANS_FIELDS.map(({ key, questionId, color }) => {
                      const value =
                        profileData[key as keyof typeof profileData];
                      if (
                        typeof value !== "string" ||
                        !value ||
                        value === "Not specified"
                      )
                        return null;
                      const { icon } = getPlansPill(questionId, value, color);
                      return (
                        <View
                          key={key}
                          style={[styles.tagPill, styles.pillWithIcon]}
                        >
                          <View style={styles.pillIconWrap}>
                            <Ionicons
                              name={icon}
                              size={PILL_ICON_SIZE}
                              color={color}
                            />
                          </View>
                          <Text style={styles.tagText}>{value}</Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              )}

              <View style={styles.bottomSpacing} />
            </View>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>

      <Modal
        visible={isViewerVisible}
        animationType="fade"
        transparent={false}
        onRequestClose={() => setIsViewerVisible(false)}
      >
        <View style={styles.viewerContainer}>
          <FlatList
            ref={viewerListRef}
            data={allPhotoUris}
            keyExtractor={(item, index) => `${item}-${index}`}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={viewerStartIndex}
            getItemLayout={(_, index) => ({
              length: width,
              offset: width * index,
              index,
            })}
            onMomentumScrollEnd={(event) => {
              const nextIndex = Math.round(
                event.nativeEvent.contentOffset.x / width
              );
              setViewerIndex(nextIndex);
            }}
            renderItem={({ item }) => (
              <View style={styles.viewerImageWrap}>
                <FastImage
                  source={{
                    uri: item,
                    priority: FastImage.priority.high,
                    cache: FastImage.cacheControl.immutable,
                  }}
                  style={styles.viewerImage}
                  resizeMode={FastImage.resizeMode.contain}
                />
              </View>
            )}
          />

          <TouchableOpacity
            style={styles.viewerCloseButton}
            onPress={() => setIsViewerVisible(false)}
          >
            <Ionicons
              name="close"
              size={moderateScale(28)}
              color={themeSecond.textPrimary}
            />
          </TouchableOpacity>

          {allPhotoUris.length > 1 && (
            <Text style={styles.viewerCounter}>
              {viewerIndex + 1} / {allPhotoUris.length}
            </Text>
          )}
        </View>
      </Modal>
    </View>
  );
};

export default ProfileSecond;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeSecond.bgDark,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: themeSecond.textSoft,
    fontSize: moderateScale(14),
    marginTop: verticalScale(12),
  },
  backgroundImage: {
    width,
    height,
    ...(Platform.OS === "android" && { minHeight: height }),
  },
  skeletonHero: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.52,
    backgroundColor: themeSecond.surfaceCardDark,
  },
  safeArea: {
    flex: 1,
  },
  headerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  backButton: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    backgroundColor: themeSecond.surfaceWhiteSubtle,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: moderateScale(1),
    borderColor: themeSecond.borderMedium,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 0,
    paddingBottom: verticalScale(40),
  },
  glassWrap: {
    width: "100%",
    minHeight: height,
    flex: 1,
    marginTop: verticalScale(60),
    borderRadius: moderateScale(24),
    padding: moderateScale(18),
    overflow: "hidden",
    backgroundColor: themeSecond.glassBg,
    borderWidth: moderateScale(1),
    borderColor: themeSecond.glassBorder,
    shadowColor: themeSecond.shadowBlack,
    shadowOpacity: 0.2,
    shadowRadius: moderateScale(20),
    shadowOffset: { width: 0, height: verticalScale(8) },
    elevation: moderateScale(10),
  },
  galleryWrap: {
    width: "100%",
    overflow: "visible",
  },
  galleryLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(6),
  },
  galleryRow: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
  },
  galleryFeature: {
    flex: 0.88,
    minWidth: 0,
    marginRight: moderateScale(10),
    borderRadius: moderateScale(14),
    overflow: "hidden",
    aspectRatio: 0.72,
    borderWidth: moderateScale(2),
    borderColor: themeSecond.accentPurpleStrong,
    shadowColor: themeSecond.accentPurple,
    shadowOffset: { width: 0, height: verticalScale(3) },
    shadowOpacity: 0.3,
    shadowRadius: moderateScale(8),
    elevation: moderateScale(6),
  },
  galleryThumbs: {
    flex: 1,
    minWidth: 0,
    overflow: "visible",
  },
  galleryThumb: {
    flex: 1,
    minWidth: 0,
    borderRadius: moderateScale(12),
    overflow: "hidden",
    aspectRatio: 1,
    borderWidth: moderateScale(2),
    borderColor: themeSecond.accentPurpleMedium,
    shadowColor: themeSecond.shadowBlack,
    shadowOffset: { width: 0, height: verticalScale(2) },
    shadowOpacity: 0.2,
    shadowRadius: moderateScale(6),
    elevation: moderateScale(4),
  },
  galleryThumbFirst: {
    marginBottom: moderateScale(8),
  },
  galleryThumbTiltRight: {
    transform: [{ rotate: "2.5deg" }],
  },
  galleryThumbTiltLeft: {
    transform: [{ rotate: "-2.5deg" }],
  },
  galleryThumbPlaceholder: {
    backgroundColor: themeSecond.surfaceCard,
  },
  galleryImage: {
    width: "100%",
    height: "100%",
  },
  galleryFeatureBadge: {
    position: "absolute",
    bottom: moderateScale(8),
    left: moderateScale(8),
    paddingHorizontal: moderateScale(8),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(10),
    backgroundColor: themeSecond.overlayBlack,
    borderWidth: moderateScale(1),
    borderColor: themeSecond.borderLight,
  },
  galleryFeatureBadgeText: {
    color: themeSecond.textPrimary,
    fontSize: moderateScale(10),
    fontWeight: "700",
  },
  galleryTwoRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    gap: moderateScale(16),
  },
  galleryTwoCard: {
    flex: 1,
    minWidth: 0,
    borderRadius: moderateScale(18),
    overflow: "hidden",
    aspectRatio: 0.85,
    borderWidth: moderateScale(2),
    borderColor: themeSecond.accentPurpleMedium,
    shadowColor: themeSecond.accentPurple,
    shadowOffset: { width: 0, height: verticalScale(4) },
    shadowOpacity: 0.25,
    shadowRadius: moderateScale(12),
    elevation: moderateScale(8),
  },
  galleryTwoCardLeft: {
    transform: [{ rotate: "-4deg" }],
  },
  galleryTwoCardRight: {
    transform: [{ rotate: "4deg" }],
  },
  gallerySingleWrap: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  gallerySingleCard: {
    width: "75%",
    maxWidth: moderateScale(280),
    borderRadius: moderateScale(20),
    overflow: "hidden",
    aspectRatio: 0.9,
    borderWidth: moderateScale(2),
    borderColor: themeSecond.accentPurpleMedium,
    shadowColor: themeSecond.accentPurple,
    shadowOffset: { width: 0, height: verticalScale(6) },
    shadowOpacity: 0.3,
    shadowRadius: moderateScale(16),
    elevation: moderateScale(10),
    transform: [{ rotate: "-2deg" }],
  },
  topRow: {
    flexDirection: "row",
    marginBottom: verticalScale(6),
  },
  onlineBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: themeSecond.pillBg,
    borderWidth: moderateScale(1),
    borderColor: themeSecond.pillBorder,
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(5),
    borderRadius: moderateScale(16),
    gap: moderateScale(6),
  },
  onlineDot: {
    width: moderateScale(8),
    height: moderateScale(8),
    borderRadius: moderateScale(4),
    backgroundColor: themeSecond.onlineGreen,
    shadowColor: themeSecond.onlineGreen,
    shadowOpacity: 0.8,
    shadowRadius: moderateScale(4),
    shadowOffset: { width: 0, height: 0 },
  },
  onlineDotOffline: {
    backgroundColor: themeSecond.textMuted,
    shadowColor: themeSecond.textMuted,
    shadowOpacity: 0.2,
  },
  onlineText: {
    fontSize: moderateScale(12),
    color: themeSecond.textPrimary,
    fontWeight: "600",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(6),
    marginBottom: verticalScale(4),
  },
  userName: {
    fontSize: moderateScale(22),
    fontWeight: "700",
    color: themeSecond.textPrimary,
    letterSpacing: moderateScale(0.3),
  },
  subtitle: {
    fontSize: moderateScale(14),
    color: themeSecond.textSoft,
    marginBottom: verticalScale(8),
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(4),
    marginBottom: verticalScale(12),
  },
  locationText: {
    fontSize: moderateScale(14),
    color: themeSecond.textSoft,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: moderateScale(8),
    marginBottom: verticalScale(14),
  },
  tagPill: {
    backgroundColor: themeSecond.pillBg,
    borderWidth: moderateScale(1),
    borderColor: themeSecond.pillBorder,
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(18),
  },
  pillWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(6),
  },
  pillIconWrap: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: verticalScale(0.5) },
    shadowOpacity: 0.2,
    shadowRadius: moderateScale(0.5),
    elevation: moderateScale(1.5),
  },
  tagText: {
    fontSize: moderateScale(13),
    color: themeSecond.textPrimary,
    fontWeight: "500",
  },
  bioText: {
    fontSize: moderateScale(14),
    color: themeSecond.textSoft,
    lineHeight: moderateScale(22),
  },
  section: {
    marginTop: verticalScale(18),
  },
  sectionTitle: {
    fontSize: moderateScale(16),
    fontWeight: "500",
    color: themeSecond.textMuted,
    marginBottom: verticalScale(8),
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(6),
  },
  intentionsCard: {
    borderRadius: moderateScale(18),
    padding: moderateScale(14),
    backgroundColor: themeSecond.surfaceCardDark,
    borderWidth: moderateScale(1),
    borderColor: themeSecond.borderMedium,
  },
  intentionsPillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: moderateScale(8),
    marginBottom: verticalScale(12),
  },
  intentionsPill: {
    paddingHorizontal: moderateScale(10),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(14),
  },
  intentionsPillText: {
    fontSize: moderateScale(12),
    color: themeSecond.textPrimary,
    fontWeight: "600",
  },
  timelineRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  timelineStart: {
    width: moderateScale(48),
    alignItems: "center",
    justifyContent: "center",
    gap: verticalScale(4),
  },
  timelineStartIcon: {
    width: moderateScale(22),
    height: moderateScale(22),
    borderRadius: moderateScale(11),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: themeSecond.accentPurpleLight,
    borderWidth: moderateScale(1),
    borderColor: themeSecond.accentPurpleMedium,
  },
  timelineStartText: {
    fontSize: moderateScale(10),
    color: themeSecond.accentPurple,
    fontWeight: "600",
  },
  timelineTrack: {
    flex: 1,
    position: "relative",
    justifyContent: "center",
    paddingHorizontal: moderateScale(6),
    height: moderateScale(24),
  },
  timelineTrackStack: {
    height: verticalScale(88),
    paddingVertical: 0,
  },
  timelineLineAbsolute: {
    position: "absolute",
    left: moderateScale(38),
    right: moderateScale(38),
    top: "50%",
    marginTop: verticalScale(3),
    height: verticalScale(2),
  },
  timelineStepsRow: {
    position: "absolute",
    left: moderateScale(6),
    right: moderateScale(6),
    top: 0,
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timelineStepsRowSingle: {
    justifyContent: "flex-end",
  },
  timelineStepColumn: {
    alignItems: "center",
    justifyContent: "center",
    gap: verticalScale(10),
  },
  timelineLine: {
    height: verticalScale(2),
    backgroundColor: themeSecond.accentPurple,
    borderRadius: moderateScale(2),
  },
  timelineTicksRow: {
    position: "absolute",
    left: moderateScale(6),
    right: moderateScale(6),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timelineTick: {
    width: moderateScale(10),
    height: moderateScale(10),
    borderRadius: moderateScale(5),
    backgroundColor: themeSecond.tickInactiveBg,
    borderWidth: moderateScale(1),
    borderColor: themeSecond.tickInactiveBorder,
  },
  timelineTickActive: {
    backgroundColor: themeSecond.accentPurple,
    borderColor: themeSecond.accentPurpleSolid,
    shadowColor: themeSecond.accentPurple,
    shadowOpacity: 0.7,
    shadowRadius: moderateScale(6),
    shadowOffset: { width: 0, height: 0 },
    elevation: moderateScale(6),
  },
  timelineTickHeart: {
    width: moderateScale(22),
    height: moderateScale(22),
    borderRadius: moderateScale(11),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: themeSecond.accentPurpleLight,
    borderWidth: moderateScale(1),
    borderColor: themeSecond.accentPurpleMedium,
  },
  timelineLabelsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: verticalScale(6),
    paddingLeft: moderateScale(48),
  },
  timelineIntentionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: verticalScale(6),
    paddingLeft: moderateScale(48),
    paddingRight: moderateScale(6),
  },
  timelineIntentionCell: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  timelineIntentionPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(4),
    paddingHorizontal: moderateScale(6),
    paddingVertical: verticalScale(3),
    borderRadius: moderateScale(12),
    borderWidth: moderateScale(1),
  },
  timelineIntentionPillText: {
    fontSize: moderateScale(9),
    color: themeSecond.textPrimary,
    fontWeight: "600",
  },
  timelineLabel: {
    flex: 1,
    textAlign: "center",
    fontSize: moderateScale(10),
    color: themeSecond.textSoft,
  },
  timelineStepLabel: {
    textAlign: "center",
    fontSize: moderateScale(10),
    color: themeSecond.textSoft,
  },
  timelineLabelActive: {
    color: themeSecond.textPrimary,
    fontWeight: "600",
  },
  timelineBadge: {
    alignSelf: "flex-start",
    marginTop: verticalScale(10),
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(6),
    paddingHorizontal: moderateScale(10),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(12),
    backgroundColor: themeSecond.accentPurpleLight,
    borderWidth: moderateScale(1),
    borderColor: themeSecond.accentPurpleMedium,
  },
  timelineBadgeText: {
    fontSize: moderateScale(12),
    color: themeSecond.textPrimary,
    fontWeight: "600",
  },
  detailText: {
    fontSize: moderateScale(13),
    color: themeSecond.textSoft,
    lineHeight: moderateScale(20),
  },
  bottomSpacing: {
    height: verticalScale(24),
  },
  profileActionsWrap: {
    position: "absolute",
    top: moderateScale(14),
    right: moderateScale(14),
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: moderateScale(10),
    zIndex: 20,
  },
  profileActionButton: {
    width: moderateScale(42),
    height: moderateScale(42),
    borderRadius: moderateScale(21),
    alignItems: "center",
    justifyContent: "center",
    borderWidth:
      Platform.OS === "android" ? moderateScale(1) : moderateScale(1.3),
    ...(Platform.OS === "ios"
      ? {
          shadowColor: themeSecond.shadowPurple,
          shadowOpacity: 0.35,
          shadowRadius: moderateScale(10),
          shadowOffset: { width: 0, height: verticalScale(4) },
        }
      : {
          elevation: moderateScale(1.5),
        }),
  },
  rejectAction: {
    backgroundColor:
      Platform.OS === "android"
        ? "rgba(255, 77, 109, 0.28)"
        : "rgba(255, 77, 109, 0.32)",
    borderColor:
      Platform.OS === "android"
        ? "rgba(255, 77, 109, 0.72)"
        : "rgba(255, 77, 109, 0.7)",
  },
  likeAction: {
    backgroundColor:
      Platform.OS === "android"
        ? "rgba(139, 92, 246, 0.30)"
        : "rgba(139, 92, 246, 0.36)",
    borderColor:
      Platform.OS === "android"
        ? "rgba(139, 92, 246, 0.76)"
        : "rgba(139, 92, 246, 0.8)",
  },
  viewerContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  viewerImageWrap: {
    width,
    height,
    justifyContent: "center",
    alignItems: "center",
  },
  viewerImage: {
    width,
    height: height * 0.9,
  },
  viewerCloseButton: {
    position: "absolute",
    top: verticalScale(56),
    right: moderateScale(20),
    zIndex: 10,
  },
  viewerCounter: {
    position: "absolute",
    bottom: verticalScale(36),
    color: themeSecond.textPrimary,
    fontSize: moderateScale(14),
    fontWeight: "600",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    paddingHorizontal: moderateScale(10),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(12),
  },
});
