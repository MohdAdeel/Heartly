import {
  View,
  Text,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { themeSecond } from "../theme/colorSecond";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";
import { HARD_CODED_PROFILES } from "../constants/profiles";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useCallback, useMemo, useState } from "react";
import type { MainStackParamList } from "../types/navigation.types";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { moderateScale, verticalScale, scale } from "react-native-size-matters";

const { width } = Dimensions.get("window");

type InteractionItem = {
  id: string;
  name: string;
  age: number;
  location: string;
  action: "liked" | "passed";
  imageUrl: string | null;
};

function calculateAge(dateOfBirth: string | null | undefined): number {
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
}

function mapProfilesToItems(): InteractionItem[] {
  return HARD_CODED_PROFILES.map((profile, index) => ({
    id: profile.id,
    name: profile.full_name?.trim() || "User",
    age: calculateAge(profile.date_of_birth),
    location: profile.country?.trim() || "—",
    action: index % 2 === 0 ? "liked" : "passed",
    imageUrl: profile.image_urls?.[0] || null,
  }));
}

function chunkIntoPages<T>(items: T[], pageSize: number): T[][] {
  const pages: T[][] = [];
  for (let i = 0; i < items.length; i += pageSize) {
    pages.push(items.slice(i, i + pageSize));
  }
  return pages;
}

const InteractionMiniCard = ({
  item,
  cardWidth,
  gradientColors,
  onPress,
}: {
  item: InteractionItem;
  cardWidth: number;
  gradientColors: string[];
  onPress: () => void;
}) => (
  <TouchableOpacity
    style={[styles.recentCardWrap, { width: cardWidth }]}
    activeOpacity={0.88}
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={`${item.name}, ${
      item.action === "liked" ? "liked" : "passed"
    }`}
  >
    <View style={styles.recentCardGlow}>
      <View style={styles.recentCard}>
        {item.imageUrl ? (
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.recentCardImage}
          />
        ) : (
          <View
            style={[styles.recentCardImage, styles.recentCardImagePlaceholder]}
          >
            <Ionicons
              name="person"
              size={moderateScale(28)}
              color={themeSecond.textMuted}
            />
          </View>
        )}
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.recentCardGradient}
        />
        <View
          style={[
            styles.recentActionBadge,
            item.action === "liked"
              ? styles.recentBadgeLiked
              : styles.recentBadgePassed,
          ]}
        >
          <Ionicons
            name={item.action === "liked" ? "heart" : "close"}
            size={moderateScale(11)}
            color={themeSecond.textPrimary}
          />
          <Text style={styles.recentActionBadgeText}>
            {item.action === "liked" ? "Liked" : "Passed"}
          </Text>
        </View>
        <View style={styles.recentCardFooter}>
          <Text style={styles.recentCardName} numberOfLines={1}>
            {item.name}, {item.age}
          </Text>
          <View style={styles.recentLocationRow}>
            <Ionicons
              name="location"
              size={moderateScale(11)}
              color={themeSecond.textMuted}
            />
            <Text style={styles.recentLocationText} numberOfLines={1}>
              {item.location}
            </Text>
          </View>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

const Interactions = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const [items] = useState<InteractionItem[]>(mapProfilesToItems);

  const interactionPages = useMemo(() => chunkIntoPages(items, 4), [items]);

  const layout = useMemo(() => {
    const scrollPad = moderateScale(16) * 2;
    const glassPad = moderateScale(18) * 2;
    const innerContentWidth = width - scrollPad - glassPad;
    const colGap = moderateScale(8);
    const rowGap = moderateScale(8);
    const cardWidth = (innerContentWidth - colGap) / 2;
    const pageGap = moderateScale(12);
    return {
      innerContentWidth,
      cardWidth,
      colGap,
      rowGap,
      pageGap,
      snapInterval: innerContentWidth + pageGap,
    };
  }, []);

  const recentCardGradientColors = useMemo(
    () => ["transparent", "rgba(14, 11, 22, 0.52)", "rgba(14, 11, 22, 0.94)"],
    []
  );

  const openProfile = useCallback(
    (userId: string) => {
      navigation.navigate("ProfileScreen", { userId });
    },
    [navigation]
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerIconCircle}>
            <Ionicons
              name="heart"
              size={moderateScale(22)}
              color={themeSecond.accentPurple}
            />
          </View>
          <View>
            <Text style={styles.headerTitle}>Interactions</Text>
            <Text style={styles.headerSubtitle}>
              Likes and passes from Discover
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={[styles.glassCard, styles.recentInteractionsCard]}>
          <View style={styles.recentHeaderRow}>
            <View style={styles.sectionTitleLeft}>
              <View
                style={[
                  styles.sectionIconCircle,
                  styles.recentInteractionsIcon,
                ]}
              >
                <Ionicons
                  name="git-compare-outline"
                  size={moderateScale(20)}
                  color={themeSecond.accentPurple}
                />
              </View>
              <View style={styles.recentTitleBlock}>
                <Text style={styles.sectionTitle}>Recent interactions</Text>
                <Text style={styles.recentSubtitle}>
                  Profiles you liked or passed on Discover
                </Text>
              </View>
            </View>
          </View>
          {items.length === 0 ? (
            <View style={styles.recentStateBox}>
              <Ionicons
                name="heart-outline"
                size={moderateScale(40)}
                color={themeSecond.textMuted}
              />
              <Text style={styles.recentEmptyTitle}>No interactions yet</Text>
              <Text style={styles.recentEmptySubtitle}>
                Likes and passes from Discover will show up here.
              </Text>
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              decelerationRate="fast"
              snapToInterval={layout.snapInterval}
              snapToAlignment="start"
              disableIntervalMomentum
              contentContainerStyle={styles.recentScrollContent}
            >
              {interactionPages.map((page, pageIndex) => {
                const cells: (InteractionItem | null)[] = [...page];
                while (cells.length < 4) {
                  cells.push(null);
                }
                const isLast = pageIndex === interactionPages.length - 1;
                return (
                  <View
                    key={`page-${pageIndex}`}
                    style={[
                      styles.gridPage,
                      {
                        width: layout.innerContentWidth,
                        marginRight: isLast ? 0 : layout.pageGap,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.gridRow,
                        { gap: layout.colGap, marginBottom: layout.rowGap },
                      ]}
                    >
                      {cells
                        .slice(0, 2)
                        .map((item, i) =>
                          item ? (
                            <InteractionMiniCard
                              key={item.id}
                              item={item}
                              cardWidth={layout.cardWidth}
                              gradientColors={recentCardGradientColors}
                              onPress={() => openProfile(item.id)}
                            />
                          ) : (
                            <View
                              key={`empty-t-${pageIndex}-${i}`}
                              style={[
                                styles.gridCellPlaceholder,
                                { width: layout.cardWidth },
                              ]}
                            />
                          )
                        )}
                    </View>
                    <View style={[styles.gridRow, { gap: layout.colGap }]}>
                      {cells
                        .slice(2, 4)
                        .map((item, i) =>
                          item ? (
                            <InteractionMiniCard
                              key={item.id}
                              item={item}
                              cardWidth={layout.cardWidth}
                              gradientColors={recentCardGradientColors}
                              onPress={() => openProfile(item.id)}
                            />
                          ) : (
                            <View
                              key={`empty-b-${pageIndex}-${i}`}
                              style={[
                                styles.gridCellPlaceholder,
                                { width: layout.cardWidth },
                              ]}
                            />
                          )
                        )}
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Interactions;

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
    paddingBottom: verticalScale(100),
  },
  glassCard: {
    borderRadius: moderateScale(24),
    padding: moderateScale(18),
    marginBottom: verticalScale(14),
    backgroundColor: themeSecond.glassBg,
    borderWidth: moderateScale(1),
    borderColor: themeSecond.glassBorder,
  },
  recentInteractionsCard: {
    borderColor: themeSecond.borderMedium,
    backgroundColor: "rgba(24, 20, 38, 0.98)",
    ...Platform.select({
      ios: {
        shadowColor: themeSecond.shadowPurple,
        shadowOffset: { width: 0, height: verticalScale(2) },
        shadowOpacity: 0.22,
        shadowRadius: moderateScale(12),
        elevation: 0,
      },
      android: {
        shadowColor: "transparent",
        shadowOpacity: 0,
        shadowRadius: 0,
        shadowOffset: { width: 0, height: 0 },
        elevation: moderateScale(4),
      },
      default: {},
    }),
  },
  recentHeaderRow: {
    marginBottom: verticalScale(14),
  },
  sectionTitleLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(10),
  },
  sectionIconCircle: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    backgroundColor: themeSecond.accentPurpleMedium,
    alignItems: "center",
    justifyContent: "center",
  },
  recentInteractionsIcon: {
    backgroundColor: "rgba(168, 85, 247, 0.22)",
    borderWidth: moderateScale(1),
    borderColor: themeSecond.borderMedium,
  },
  recentTitleBlock: {
    flex: 1,
    flexShrink: 1,
  },
  sectionTitle: {
    color: themeSecond.textPrimary,
    fontSize: moderateScale(16),
    fontWeight: "700",
  },
  recentSubtitle: {
    color: themeSecond.textMuted,
    fontSize: moderateScale(11),
    marginTop: verticalScale(3),
    lineHeight: moderateScale(15),
  },
  recentScrollContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingBottom: verticalScale(2),
  },
  gridPage: {
    flexShrink: 0,
  },
  gridRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  gridCellPlaceholder: {
    aspectRatio: 0.68,
  },
  recentCardWrap: {
    flexShrink: 0,
  },
  recentCardGlow: {
    borderRadius: moderateScale(18),
    padding: scale(2),
    backgroundColor: "rgba(168, 85, 247, 0.12)",
    borderWidth: moderateScale(1),
    borderColor: themeSecond.borderMedium,
    ...Platform.select({
      ios: {
        shadowColor: themeSecond.shadowPurple,
        shadowOpacity: 0.34,
        shadowRadius: moderateScale(12),
        shadowOffset: { width: 0, height: verticalScale(4) },
        elevation: 0,
      },
      android: {
        shadowColor: "transparent",
        shadowOpacity: 0,
        shadowRadius: 0,
        shadowOffset: { width: 0, height: 0 },
        elevation: moderateScale(6),
      },
      default: {
        shadowColor: themeSecond.shadowPurple,
        shadowOpacity: 0.34,
        shadowRadius: moderateScale(12),
        shadowOffset: { width: 0, height: verticalScale(4) },
        elevation: 0,
      },
    }),
  },
  recentCard: {
    borderRadius: moderateScale(16),
    overflow: "hidden",
    backgroundColor: themeSecond.surfaceCardDark,
    borderWidth: moderateScale(1),
    borderColor: themeSecond.borderStrong,
    aspectRatio: 0.68,
  },
  recentCardImage: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "cover",
  },
  recentCardImagePlaceholder: {
    backgroundColor: themeSecond.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  recentStateBox: {
    minHeight: verticalScale(220),
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(28),
    paddingHorizontal: moderateScale(16),
  },
  recentEmptyTitle: {
    marginTop: verticalScale(12),
    color: themeSecond.textPrimary,
    fontSize: moderateScale(16),
    fontWeight: "700",
  },
  recentEmptySubtitle: {
    marginTop: verticalScale(6),
    color: themeSecond.textMuted,
    fontSize: moderateScale(13),
    textAlign: "center",
    maxWidth: "88%",
  },
  recentCardGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "58%",
  },
  recentActionBadge: {
    position: "absolute",
    top: moderateScale(8),
    right: moderateScale(8),
    flexDirection: "row",
    alignItems: "center",
    gap: scale(4),
    paddingHorizontal: moderateScale(8),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(12),
    borderWidth: moderateScale(1),
  },
  recentBadgeLiked: {
    backgroundColor: themeSecond.primaryActionPurple,
    borderColor: themeSecond.accentPurpleLight,
  },
  recentBadgePassed: {
    backgroundColor: themeSecond.surfaceModal,
    borderColor: themeSecond.borderMedium,
  },
  recentActionBadgeText: {
    color: themeSecond.textPrimary,
    fontSize: moderateScale(10),
    fontWeight: "700",
    letterSpacing: moderateScale(0.2),
  },
  recentCardFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: moderateScale(10),
    paddingBottom: moderateScale(10),
    paddingTop: verticalScale(20),
  },
  recentCardName: {
    color: themeSecond.textPrimary,
    fontSize: moderateScale(13),
    fontWeight: "700",
    letterSpacing: moderateScale(0.2),
    marginBottom: verticalScale(2),
  },
  recentLocationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(3),
  },
  recentLocationText: {
    flex: 1,
    color: themeSecond.textSoft,
    fontSize: moderateScale(10),
  },
});
