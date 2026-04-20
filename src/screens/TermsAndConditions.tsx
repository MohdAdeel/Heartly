import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import { fonts } from '../theme/fonts';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale, verticalScale } from 'react-native-size-matters';

const TermsAndConditions = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={['#090714', '#0B0818', '#0C0919']}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.bgGlowTop} />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="chevron-back"
            size={moderateScale(18)}
            color="#F8F5FF"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms & Conditions</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.topDivider} />

        <View style={styles.updatedPill}>
          <Ionicons
            name="ellipse"
            size={moderateScale(5)}
            color="#B68BFF"
            style={styles.updatedDot}
          />
          <Text style={styles.updatedPillText}>UPDATED OCT 2024</Text>
        </View>

        <Text style={styles.mainTitle}>Welcome to Izdivaaj</Text>
        <Text style={styles.mainBody}>
          Please read these terms carefully before using Izdivaaj. By accessing
          or using the app, you agree to be bound by these terms and our privacy
          policy.
        </Text>

        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <View style={styles.cardIconWrap}>
              <Ionicons
                name="person"
                size={moderateScale(12)}
                color="#A855F7"
              />
            </View>
            <Text style={styles.cardTitle}>1. User Responsibilities</Text>
          </View>
          <Text style={styles.cardBody}>
            You are responsible for your use of the services and for any content
            you provide, including compliance with applicable laws, rules, and
            regulations.
          </Text>
          <View style={styles.checkRow}>
            <Text style={styles.checkMark}>✓</Text>
            <Text style={styles.checkText}>
              You must be at least 18 years old to use this service.
            </Text>
          </View>
          <View style={styles.checkRow}>
            <Text style={styles.checkMark}>✓</Text>
            <Text style={styles.checkText}>
              You agree to provide accurate, current, and complete information
              during registration.
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <View style={styles.cardIconWrap}>
              <Ionicons name="ban" size={moderateScale(12)} color="#A855F7" />
            </View>
            <Text style={styles.cardTitle}>2. Prohibited Activities</Text>
            <View style={styles.importantChip}>
              <Text style={styles.importantChipText}>IMPORTANT</Text>
            </View>
          </View>
          <Text style={styles.cardBody}>
            To maintain a safe and respectful community, the following behaviors
            are strictly prohibited on our platform:
          </Text>
          <View style={styles.grayList}>
            <Text style={styles.grayListText}>
              • Harassment, bullying, or hate speech.
            </Text>
            <Text style={styles.grayListText}>
              • Creating fake accounts or impersonation.
            </Text>
            <Text style={styles.grayListText}>
              • Commercial activities or spamming.
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <View style={styles.cardIconWrap}>
              <Ionicons
                name="shield-checkmark"
                size={moderateScale(12)}
                color="#A855F7"
              />
            </View>
            <Text style={styles.cardTitle}>3. Privacy & Data Handling</Text>
          </View>
          <Text style={styles.cardBody}>
            Your privacy is our priority. We collect, store, and process your
            data in accordance with our Privacy Policy. We do not sell your
            personal data to third-parties. By using the app, you consent to our
            data practices.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <View style={styles.cardIconWrap}>
              <Ionicons name="card" size={moderateScale(12)} color="#A855F7" />
            </View>
            <Text style={styles.cardTitle}>4. Payments & Subscriptions</Text>
          </View>
          <Text style={styles.cardBody}>
            Premium features require a paid subscription. Subscriptions
            automatically renew unless canceled at least 24 hours before the end
            of the current period. Refunds are subject to Apple/Google Play
            store policies.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090714',
  },
  bgGlowTop: {
    position: 'absolute',
    top: verticalScale(66),
    left: -moderateScale(28),
    width: moderateScale(116),
    height: moderateScale(56),
    borderRadius: moderateScale(56),
    backgroundColor: 'rgba(156, 81, 255, 0.14)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(10),
    backgroundColor: 'rgba(13, 10, 29, 0.95)',
    borderBottomLeftRadius: moderateScale(14),
    borderBottomRightRadius: moderateScale(14),
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  backButton: {
    width: moderateScale(24),
    height: moderateScale(24),
    borderRadius: moderateScale(12),
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'rgba(255, 255, 255, 0.12)',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  headerPlaceholder: {
    width: moderateScale(24),
    height: moderateScale(24),
  },
  headerTitle: {
    color: '#F8F5FF',
    fontSize: moderateScale(15.5),
    fontFamily: fonts.semiBold,
  },
  scrollContent: {
    paddingHorizontal: moderateScale(10),
    paddingBottom: verticalScale(26),
  },
  topDivider: {
    marginTop: verticalScale(2),
    marginBottom: verticalScale(10),
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  updatedPill: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(10),
    backgroundColor: 'rgba(111, 52, 191, 0.38)',
    borderColor: 'rgba(168, 85, 247, 0.4)',
    borderWidth: 1,
    borderRadius: moderateScale(20),
    paddingHorizontal: moderateScale(11),
    paddingVertical: verticalScale(4),
  },
  updatedDot: {
    marginRight: moderateScale(5),
  },
  updatedPillText: {
    color: '#CFAEFF',
    fontSize: moderateScale(9.8),
    letterSpacing: 0.5,
    fontFamily: fonts.semiBold,
  },
  mainTitle: {
    color: '#F3EEFF',
    fontSize: moderateScale(35),
    lineHeight: verticalScale(40),
    fontFamily: fonts.regular,
    marginBottom: verticalScale(14),
  },
  mainBody: {
    color: '#C6BFD8',
    fontSize: moderateScale(12.2),
    lineHeight: verticalScale(18),
    fontFamily: fonts.regular,
    marginBottom: verticalScale(10),
  },
  card: {
    borderWidth: 1,
    borderRadius: moderateScale(12),
    borderColor: 'rgba(255, 255, 255, 0.12)',
    backgroundColor: 'rgba(16, 15, 31, 0.92)',
    paddingHorizontal: moderateScale(10),
    paddingVertical: verticalScale(10),
    marginBottom: verticalScale(10),
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIconWrap: {
    width: moderateScale(20),
    height: moderateScale(20),
    borderRadius: moderateScale(10),
    backgroundColor: 'rgba(168, 85, 247, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: moderateScale(7),
  },
  cardTitle: {
    flex: 1,
    color: '#F2EDFC',
    fontSize: moderateScale(15),
    fontFamily: fonts.semiBold,
  },
  importantChip: {
    marginLeft: moderateScale(6),
    backgroundColor: 'rgba(255, 92, 92, 0.18)',
    borderColor: 'rgba(255, 92, 92, 0.35)',
    borderWidth: 1,
    borderRadius: moderateScale(7),
    paddingHorizontal: moderateScale(5),
    paddingVertical: verticalScale(1),
  },
  importantChipText: {
    color: '#FF8F8F',
    fontSize: moderateScale(7.5),
    fontFamily: fonts.semiBold,
  },
  cardBody: {
    marginTop: verticalScale(8),
    color: '#C6BFD8',
    fontSize: moderateScale(11.6),
    lineHeight: verticalScale(17),
    fontFamily: fonts.regular,
  },
  checkRow: {
    marginTop: verticalScale(7),
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkMark: {
    color: '#22C55E',
    fontSize: moderateScale(11),
    marginTop: verticalScale(1),
    marginRight: moderateScale(6),
    fontFamily: fonts.semiBold,
  },
  checkText: {
    flex: 1,
    color: '#BCB5CF',
    fontSize: moderateScale(11),
    lineHeight: verticalScale(15.5),
    fontFamily: fonts.regular,
  },
  grayList: {
    marginTop: verticalScale(8),
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: moderateScale(8),
    paddingHorizontal: moderateScale(8),
    paddingVertical: verticalScale(7),
  },
  grayListText: {
    color: '#B8B2CA',
    fontSize: moderateScale(10.8),
    lineHeight: verticalScale(15),
    marginBottom: verticalScale(4),
    fontFamily: fonts.regular,
  },
});

export default TermsAndConditions;
