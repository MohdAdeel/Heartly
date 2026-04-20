import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { fonts } from "../theme/fonts";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale, verticalScale } from "react-native-size-matters";

const topics = ["All Topics", "Account", "Safety", "Billing", "Matching"];

const faqs = [
  "How does the vibe-matching algorithm work?",
  "How do I verify my profile?",
  "Can I pause my account temporarily?",
];

const HelpAndSupport = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <LinearGradient
        colors={["#090714", "#0B0818", "#0C0919"]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.bgGlowTop} />
      <View style={styles.bgGlowRight} />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Ionicons
            name="chevron-back"
            size={moderateScale(18)}
            color="#F8F5FF"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroWrap}>
          <View style={styles.heroIconOuter}>
            <View style={styles.heroIconInner}>
              <Ionicons
                name="headset-outline"
                size={moderateScale(40)}
                color="#D7B4FF"
              />
            </View>
          </View>
          <Text style={styles.heroTitle}>How can we help?</Text>
          <Text style={styles.heroSubTitle}>
            Find answers or reach out to our team.
          </Text>
        </View>

        <View style={styles.searchBar}>
          <Ionicons
            name="search-outline"
            size={moderateScale(15)}
            color="#8E88A4"
          />
          <TextInput
            placeholder="Search for articles, topics..."
            placeholderTextColor="#8E88A4"
            style={styles.searchInput}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
          {topics.map((item, index) => (
            <TouchableOpacity
              key={item}
              activeOpacity={0.85}
              style={[styles.chip, index === 0 && styles.activeChip]}
            >
              <Text
                style={[styles.chipText, index === 0 && styles.activeChipText]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>FREQUENTLY ASKED</Text>
        {faqs.map((item) => (
          <TouchableOpacity
            key={item}
            style={styles.faqCard}
            activeOpacity={0.85}
          >
            <Text style={styles.faqText}>{item}</Text>
            <Ionicons
              name="chevron-down"
              size={moderateScale(14)}
              color="#9A93AD"
            />
          </TouchableOpacity>
        ))}

        <TouchableOpacity activeOpacity={0.85} style={styles.viewAllBtn}>
          <Text style={styles.viewAllText}>View All FAQs</Text>
          <Ionicons
            name="arrow-forward"
            size={moderateScale(12)}
            color="#9A50FF"
          />
        </TouchableOpacity>

        <Text style={[styles.sectionTitle, styles.needHelpTitle]}>
          STILL NEED HELP?
        </Text>
        <View style={styles.supportGrid}>
          <TouchableOpacity style={styles.supportCard} activeOpacity={0.88}>
            <View style={styles.supportIconPurple}>
              <Ionicons
                name="chatbubble-ellipses"
                size={moderateScale(14)}
                color="#AE61FF"
              />
            </View>
            <Text style={styles.supportCardTitle}>Live Chat</Text>
            <Text style={styles.supportCardSub}>Usually replies in 5m</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.supportCard} activeOpacity={0.88}>
            <View style={styles.supportIconBlue}>
              <Ionicons name="mail" size={moderateScale(14)} color="#37C2FF" />
            </View>
            <Text style={styles.supportCardTitle}>Email Us</Text>
            <Text style={styles.supportCardSub}>support@auramatch.com</Text>
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
  bgGlowTop: {
    position: "absolute",
    top: verticalScale(76),
    left: -moderateScale(36),
    width: moderateScale(128),
    height: moderateScale(62),
    borderRadius: moderateScale(60),
    backgroundColor: "rgba(156, 81, 255, 0.15)",
  },
  bgGlowRight: {
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
  backButton: {
    width: moderateScale(26),
    height: moderateScale(26),
    borderRadius: moderateScale(13),
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: "#F8F5FF",
    fontFamily: fonts.semiBold,
    fontSize: moderateScale(16),
  },
  headerPlaceholder: {
    width: moderateScale(26),
    height: moderateScale(26),
  },
  content: {
    paddingHorizontal: moderateScale(12),
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(24),
  },
  heroWrap: {
    alignItems: "center",
  },
  heroIconOuter: {
    width: moderateScale(82),
    height: moderateScale(82),
    borderRadius: moderateScale(41),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(168, 85, 247, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(168, 85, 247, 0.35)",
  },
  heroIconInner: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(30),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(51, 27, 81, 0.9)",
  },
  heroTitle: {
    marginTop: verticalScale(16),
    color: "#F3EEFF",
    fontSize: moderateScale(36),
    lineHeight: verticalScale(42),
    fontFamily: fonts.headingBold,
    textAlign: "center",
  },
  heroSubTitle: {
    marginTop: verticalScale(6),
    color: "#BFB8D3",
    fontSize: moderateScale(12.8),
    fontFamily: fonts.regular,
    textAlign: "center",
  },
  searchBar: {
    marginTop: verticalScale(16),
    height: verticalScale(42),
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.11)",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: moderateScale(12),
  },
  searchInput: {
    flex: 1,
    color: "#ECE7F7",
    marginLeft: moderateScale(8),
    fontSize: moderateScale(12.5),
    fontFamily: fonts.regular,
    paddingVertical: 0,
  },
  chipsRow: {
    marginTop: verticalScale(12),
    paddingRight: moderateScale(20),
    gap: moderateScale(8),
  },
  chip: {
    height: verticalScale(30),
    paddingHorizontal: moderateScale(12),
    borderRadius: moderateScale(15),
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.14)",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  activeChip: {
    backgroundColor: "rgba(155, 93, 255, 0.35)",
    borderColor: "rgba(168, 85, 247, 0.45)",
  },
  chipText: {
    color: "#D4CDE8",
    fontSize: moderateScale(11.2),
    fontFamily: fonts.medium,
  },
  activeChipText: {
    color: "#FFFFFF",
  },
  sectionTitle: {
    marginTop: verticalScale(16),
    marginBottom: verticalScale(8),
    color: "#B2ABC5",
    fontSize: moderateScale(12.5),
    letterSpacing: 0.4,
    fontFamily: fonts.semiBold,
  },
  faqCard: {
    height: verticalScale(44),
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    backgroundColor: "rgba(16, 15, 31, 0.92)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: moderateScale(12),
    marginBottom: verticalScale(8),
  },
  faqText: {
    color: "#F0ECF9",
    fontSize: moderateScale(12.4),
    fontFamily: fonts.medium,
    flex: 1,
    marginRight: moderateScale(8),
  },
  viewAllBtn: {
    marginTop: verticalScale(10),
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(5),
  },
  viewAllText: {
    color: "#9A50FF",
    fontSize: moderateScale(12.2),
    fontFamily: fonts.semiBold,
  },
  needHelpTitle: {
    marginTop: verticalScale(20),
  },
  supportGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  supportCard: {
    width: "48.5%",
    minHeight: verticalScale(92),
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    backgroundColor: "rgba(16, 15, 31, 0.9)",
    alignItems: "center",
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(10),
    paddingHorizontal: moderateScale(8),
  },
  supportIconPurple: {
    width: moderateScale(28),
    height: moderateScale(28),
    borderRadius: moderateScale(14),
    backgroundColor: "rgba(168, 85, 247, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: verticalScale(8),
  },
  supportIconBlue: {
    width: moderateScale(28),
    height: moderateScale(28),
    borderRadius: moderateScale(14),
    backgroundColor: "rgba(56, 189, 248, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: verticalScale(8),
  },
  supportCardTitle: {
    color: "#F4F0FC",
    fontSize: moderateScale(13.5),
    fontFamily: fonts.semiBold,
  },
  supportCardSub: {
    marginTop: verticalScale(3),
    color: "#908AA4",
    fontSize: moderateScale(10.4),
    fontFamily: fonts.regular,
    textAlign: "center",
  },
});

export default HelpAndSupport;
