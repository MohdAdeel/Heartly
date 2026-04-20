import {
  View,
  Text,
  Platform,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import React from "react";
import { themeSecond } from "../theme/colorSecond";
import Ionicons from "react-native-vector-icons/Ionicons";
import { moderateScale, verticalScale } from "react-native-size-matters";

interface GetVerifiedTileProps {
  onPress?: () => void;
  isLoading?: boolean;
}

const GetVerifiedTile: React.FC<GetVerifiedTileProps> = ({
  onPress,
  isLoading = false,
}) => {
  const { width } = useWindowDimensions();
  const isSmallDevice = width < 375;

  return (
    <View style={styles.cardWrap}>
      <View style={styles.glassCard}>
        <View style={styles.headerRow}>
          <View style={styles.iconCircle}>
            <Ionicons
              name="shield-checkmark"
              size={moderateScale(20)}
              color={themeSecond.accentPurple}
            />
          </View>
          <Text
            style={[styles.title, isSmallDevice && styles.titleSmall]}
            numberOfLines={1}
          >
            Get Verified
          </Text>
          <View style={styles.statusPill}>
            <Text style={styles.statusText}>Pending</Text>
          </View>
        </View>

        <Text
          style={[styles.description, isSmallDevice && styles.descriptionSmall]}
        >
          Verified profiles get 3x more matches and build trust instantly.
        </Text>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={isLoading ? undefined : onPress}
          activeOpacity={0.85}
          disabled={isLoading}
        >
          <Ionicons name="camera" size={18} color={themeSecond.textPrimary} />
          <Text style={styles.primaryButtonText}>
            {isLoading ? "Verifying..." : "Take Selfie Verification"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default GetVerifiedTile;

const styles = StyleSheet.create({
  cardWrap: {
    width: "100%",
    alignSelf: "center",
    marginBottom: verticalScale(14),
  },
  glassCard: {
    borderRadius: moderateScale(24),
    padding: moderateScale(18),
    borderWidth: moderateScale(1),
    ...Platform.select({
      ios: {
        backgroundColor: themeSecond.glassBg,
        borderColor: themeSecond.glassBorder,
        shadowColor: themeSecond.shadowPurple,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: moderateScale(12),
        elevation: 0,
      },
      android: {
        backgroundColor: "rgba(24, 20, 38, 0.98)",
        borderColor: themeSecond.borderMedium,
        shadowColor: "transparent",
        shadowOpacity: 0,
        shadowRadius: 0,
        shadowOffset: { width: 0, height: 0 },
        elevation: moderateScale(4),
      },
      default: {},
    }),
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(12),
    flexWrap: "wrap",
    gap: moderateScale(10),
  },
  iconCircle: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        backgroundColor: themeSecond.accentPurpleMedium,
      },
      android: {
        backgroundColor: "rgba(168, 85, 247, 0.22)",
        borderWidth: moderateScale(1),
        borderColor: themeSecond.borderMedium,
      },
      default: { backgroundColor: themeSecond.accentPurpleMedium },
    }),
  },
  title: {
    flex: 1,
    flexShrink: 1,
    color: themeSecond.textPrimary,
    fontSize: moderateScale(16),
    fontWeight: "700",
  },
  titleSmall: {
    fontSize: moderateScale(15),
  },
  statusPill: {
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(5),
    borderRadius: moderateScale(16),
    borderWidth: moderateScale(1),
    ...Platform.select({
      ios: {
        backgroundColor: themeSecond.surfaceWhiteMedium,
        borderColor: themeSecond.borderMedium,
      },
      android: {
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        borderColor: themeSecond.borderStrong,
      },
      default: {
        backgroundColor: themeSecond.surfaceWhiteMedium,
        borderColor: themeSecond.borderMedium,
      },
    }),
  },
  statusText: {
    color: themeSecond.statusWarning,
    fontSize: moderateScale(11),
    fontWeight: "600",
  },
  description: {
    ...Platform.select({
      ios: { color: themeSecond.textSoft },
      android: { color: themeSecond.textMuted },
      default: { color: themeSecond.textSoft },
    }),
    fontSize: moderateScale(13),
    lineHeight: moderateScale(20),
    marginBottom: verticalScale(14),
  },
  descriptionSmall: {
    fontSize: moderateScale(12),
    lineHeight: moderateScale(18),
    marginBottom: verticalScale(12),
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: moderateScale(10),
    paddingVertical: verticalScale(14),
    paddingHorizontal: moderateScale(20),
    borderRadius: moderateScale(24),
    borderWidth: moderateScale(1),
    backgroundColor: themeSecond.buttonPrimaryBg,
    borderColor: themeSecond.buttonPrimaryBorder,
    ...Platform.select({
      ios: {
        shadowColor: themeSecond.buttonPrimaryBg,
        shadowOffset: { width: 0, height: verticalScale(4) },
        shadowOpacity: 0.45,
        shadowRadius: moderateScale(10),
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
        shadowColor: themeSecond.buttonPrimaryBg,
        shadowOffset: { width: 0, height: verticalScale(4) },
        shadowOpacity: 0.45,
        shadowRadius: moderateScale(10),
        elevation: 0,
      },
    }),
  },
  primaryButtonText: {
    color: themeSecond.textPrimary,
    fontSize: moderateScale(15),
    fontWeight: "700",
  },
});
