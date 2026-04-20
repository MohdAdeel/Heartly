import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { fonts } from "../theme/fonts";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale, verticalScale } from "react-native-size-matters";

const dataTypes = [
  { icon: "person", label: "Profile Data" },
  { icon: "location", label: "Location Data" },
  { icon: "stats-chart", label: "Usage Data" },
];

const usageItems = [
  { icon: "heart", label: "Matchmaking" },
  { icon: "shield-checkmark", label: "Security" },
  { icon: "analytics", label: "Analytics" },
  { icon: "chatbox-ellipses", label: "Communication" },
];

const PrivacyPolicy = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <LinearGradient
        colors={["#090714", "#0B0818", "#0C0919"]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.glowOrbTop} />
      <View style={styles.glowOrbBottom} />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="chevron-back"
            size={moderateScale(18)}
            color="#F8F5FF"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={styles.headerButtonPlaceholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.updatedPill}>
          <Ionicons
            name="ellipse"
            size={moderateScale(5)}
            color="#B68BFF"
            style={{ marginRight: moderateScale(5) }}
          />
          <Text style={styles.updatedPillText}>UPDATED OCT 2024</Text>
        </View>

        <Text style={styles.pageTitle}>Your Privacy Matters</Text>
        <Text style={styles.pageSubtitle}>
          We are committed to protecting your personal information and your
          right to privacy.
        </Text>

        <View style={styles.sectionHeadingRow}>
          <View
            style={[
              styles.sectionIndexCircle,
              { backgroundColor: "rgba(168, 85, 247, 0.25)" },
            ]}
          >
            <Text style={styles.sectionIndexText}>1</Text>
          </View>
          <Text style={styles.sectionHeadingText}>Information We Collect</Text>
        </View>
        <View style={styles.mainCard}>
          <Text style={styles.mainCardBody}>
            We collect personal information that you voluntarily provide to us
            when you register in the app, express an interest in obtaining
            information about us or our products and services.
          </Text>

          {dataTypes.map((item) => (
            <View key={item.label} style={styles.bulletRow}>
              <Ionicons
                name={item.icon as any}
                size={moderateScale(14)}
                color="#9B5DFF"
              />
              <Text style={styles.bulletText}>
                <Text style={styles.bulletLabel}>{item.label}: </Text>
                Keep your information secure and relevant.
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionHeadingRow}>
          <View
            style={[
              styles.sectionIndexCircle,
              { backgroundColor: "rgba(34, 197, 94, 0.22)" },
            ]}
          >
            <Text style={styles.sectionIndexText}>2</Text>
          </View>
          <Text style={styles.sectionHeadingText}>How We Use Information</Text>
        </View>
        <Text style={styles.subText}>
          We use personal information collected via our App for a variety of
          business purposes described below:
        </Text>
        <View style={styles.usageGrid}>
          {usageItems.map((item) => (
            <View key={item.label} style={styles.usageCard}>
              <Ionicons
                name={item.icon as any}
                size={moderateScale(14)}
                color="#9B5DFF"
              />
              <Text style={styles.usageLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionHeadingRow}>
          <View
            style={[
              styles.sectionIndexCircle,
              { backgroundColor: "rgba(148, 163, 184, 0.25)" },
            ]}
          >
            <Text style={styles.sectionIndexText}>3</Text>
          </View>
          <Text style={styles.sectionHeadingText}> Your Privacy Rights</Text>
        </View>
        <TouchableOpacity style={styles.rightRow} activeOpacity={0.85}>
          <View style={styles.rightRowLeft}>
            <Ionicons name="eye" size={moderateScale(13)} color="#D5D1E5" />
            <Text style={styles.rightRowText}>Access Your Data</Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={moderateScale(14)}
            color="#8F88A3"
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.rightRow} activeOpacity={0.85}>
          <View style={styles.rightRowLeft}>
            <Ionicons name="trash" size={moderateScale(13)} color="#D5D1E5" />
            <Text style={styles.rightRowText}>Delete Account & Data</Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={moderateScale(14)}
            color="#8F88A3"
          />
        </TouchableOpacity>

        <View style={styles.ctaCard}>
          <Text style={styles.ctaTitle}>Privacy Questions?</Text>
          <Text style={styles.ctaSubTitle}>
            Our Data Protection Officer is here to help clarify any concerns.
          </Text>
          <TouchableOpacity style={styles.ctaButton} activeOpacity={0.9}>
            <LinearGradient
              colors={["#B05BFF", "#8E3DFF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.ctaButtonGradient}
            >
              <Text style={styles.ctaButtonText}>Contact Privacy Team</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#090714",
  },
  glowOrbTop: {
    position: "absolute",
    top: verticalScale(76),
    left: -moderateScale(36),
    width: moderateScale(128),
    height: moderateScale(62),
    borderRadius: moderateScale(60),
    backgroundColor: "rgba(156, 81, 255, 0.15)",
  },
  glowOrbBottom: {
    position: "absolute",
    top: verticalScale(448),
    right: -moderateScale(48),
    width: moderateScale(132),
    height: moderateScale(132),
    borderRadius: moderateScale(66),
    backgroundColor: "rgba(144, 64, 255, 0.17)",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: moderateScale(14),
    paddingVertical: verticalScale(10),
    backgroundColor: "rgba(13, 10, 29, 0.95)",
    borderBottomLeftRadius: moderateScale(14),
    borderBottomRightRadius: moderateScale(14),
    borderBottomWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
  },
  headerButton: {
    width: moderateScale(26),
    height: moderateScale(26),
    borderRadius: moderateScale(13),
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "rgba(255, 255, 255, 0.12)",
    backgroundColor: "rgba(255, 255, 255, 0.04)",
  },
  headerButtonPlaceholder: {
    width: moderateScale(26),
    height: moderateScale(26),
  },
  headerTitle: {
    color: "#F8F5FF",
    fontFamily: fonts.semiBold,
    fontSize: moderateScale(16),
  },
  scrollContent: {
    paddingHorizontal: moderateScale(12),
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(24),
  },
  updatedPill: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(111, 52, 191, 0.38)",
    borderColor: "rgba(168, 85, 247, 0.42)",
    borderWidth: 1,
    borderRadius: moderateScale(20),
    paddingHorizontal: moderateScale(11),
    paddingVertical: verticalScale(4),
  },
  updatedPillText: {
    color: "#CFAEFF",
    fontSize: moderateScale(9.8),
    letterSpacing: 0.5,
    fontFamily: fonts.semiBold,
  },
  pageTitle: {
    marginTop: verticalScale(12),
    color: "#F3EEFF",
    fontSize: moderateScale(35),
    lineHeight: verticalScale(41),
    textAlign: "center",
    fontFamily: fonts.regular,
  },
  pageSubtitle: {
    marginTop: verticalScale(8),
    color: "#BFB8D3",
    fontSize: moderateScale(12.4),
    lineHeight: verticalScale(17.5),
    textAlign: "center",
    fontFamily: fonts.regular,
  },
  sectionHeadingRow: {
    marginTop: verticalScale(15),
    marginBottom: verticalScale(8),
    flexDirection: "row",
    alignItems: "center",
  },
  sectionIndexCircle: {
    width: moderateScale(18),
    height: moderateScale(18),
    borderRadius: moderateScale(9),
    alignItems: "center",
    justifyContent: "center",
    marginRight: moderateScale(7),
  },
  sectionIndexText: {
    color: "#F1EAFE",
    fontSize: moderateScale(11),
    fontFamily: fonts.semiBold,
  },
  sectionHeadingText: {
    color: "#E2DAF2",
    fontSize: moderateScale(13),
    fontFamily: fonts.semiBold,
  },
  mainCard: {
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    backgroundColor: "rgba(16, 15, 31, 0.9)",
    paddingHorizontal: moderateScale(11),
    paddingVertical: verticalScale(11),
  },
  mainCardBody: {
    color: "#CBC4DE",
    fontSize: moderateScale(11.5),
    lineHeight: verticalScale(16.5),
    fontFamily: fonts.regular,
  },
  bulletRow: {
    marginTop: verticalScale(9),
    flexDirection: "row",
    alignItems: "flex-start",
  },
  bulletText: {
    marginLeft: moderateScale(8),
    flex: 1,
    color: "#B8B1CD",
    fontSize: moderateScale(11.3),
    lineHeight: verticalScale(15.5),
    fontFamily: fonts.regular,
  },
  bulletLabel: {
    color: "#E2DAF2",
    fontFamily: fonts.semiBold,
  },
  subText: {
    marginBottom: verticalScale(9),
    color: "#B8B1CD",
    fontSize: moderateScale(11.5),
    lineHeight: verticalScale(16),
    fontFamily: fonts.regular,
  },
  usageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: verticalScale(8),
  },
  usageCard: {
    width: "48.5%",
    borderRadius: moderateScale(10),
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.11)",
    backgroundColor: "rgba(16, 15, 31, 0.86)",
    paddingHorizontal: moderateScale(10),
    paddingVertical: verticalScale(10),
  },
  usageLabel: {
    marginTop: verticalScale(6),
    color: "#D8D2E9",
    fontSize: moderateScale(11),
    fontFamily: fonts.medium,
  },
  rightRow: {
    height: verticalScale(40),
    borderRadius: moderateScale(10),
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    backgroundColor: "rgba(16, 15, 31, 0.9)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: moderateScale(11),
    marginBottom: verticalScale(8),
  },
  rightRowLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  rightRowText: {
    marginLeft: moderateScale(8),
    color: "#F0ECF9",
    fontSize: moderateScale(11.4),
    fontFamily: fonts.medium,
  },
  ctaCard: {
    marginTop: verticalScale(14),
    borderWidth: 1,
    borderRadius: moderateScale(14),
    borderColor: "rgba(181, 121, 255, 0.4)",
    backgroundColor: "rgba(34, 21, 57, 0.5)",
    paddingHorizontal: moderateScale(14),
    paddingVertical: verticalScale(13),
  },
  ctaTitle: {
    color: "#F8F3FF",
    fontSize: moderateScale(15.5),
    textAlign: "center",
    fontFamily: fonts.semiBold,
  },
  ctaSubTitle: {
    marginTop: verticalScale(6),
    color: "#BEB5D3",
    fontSize: moderateScale(11.2),
    textAlign: "center",
    lineHeight: verticalScale(15),
    fontFamily: fonts.regular,
  },
  ctaButton: {
    marginTop: verticalScale(12),
    borderRadius: moderateScale(10),
    overflow: "hidden",
  },
  ctaButtonGradient: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(10),
  },
  ctaButtonText: {
    color: "#FFFFFF",
    fontSize: moderateScale(12.8),
    fontFamily: fonts.semiBold,
  },
});

export default PrivacyPolicy;
