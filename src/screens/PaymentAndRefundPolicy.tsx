import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import { fonts } from '../theme/fonts';
import { themeSecond } from '../theme/colorSecond';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale, verticalScale } from 'react-native-size-matters';

const acceptedPayments = [
  {
    id: 'visa',
    label: 'Credit Card',
    icon: 'card-outline' as const,
    prefix: 'VISA',
  },
  { id: 'apple', label: 'Apple Pay', icon: 'logo-apple' as const },
  { id: 'google', label: 'Google Pay', icon: 'logo-google' as const },
  { id: 'crypto', label: 'Crypto', icon: 'wallet-outline' as const },
];

const refundRows = [
  {
    id: 'guarantee',
    icon: 'checkmark' as const,
    title: '14-Day Guarantee',
    text: 'Full refunds are available within 14 days of your initial premium purchase if no matches have been initiated.',
    colors: ['rgba(24, 47, 39, 0.95)', 'rgba(19, 35, 33, 0.95)'],
    glow: 'rgba(34, 197, 94, 0.28)',
    iconBg: 'rgba(34, 197, 94, 0.2)',
    iconColor: '#22C55E',
  },
  {
    id: 'renewal',
    icon: 'refresh' as const,
    title: 'Subscription Auto-Renewal',
    text: 'Cancel at least 24 hours before your billing cycle ends to avoid being charged for the next period.',
    colors: ['rgba(47, 31, 71, 0.95)', 'rgba(31, 23, 52, 0.95)'],
    glow: 'rgba(168, 85, 247, 0.3)',
    iconBg: 'rgba(168, 85, 247, 0.22)',
    iconColor: '#A855F7',
  },
  {
    id: 'nonrefundable',
    icon: 'close' as const,
    title: 'Non-Refundable Items',
    text: 'One-time purchases like Super Likes, Boosts, and Read Receipts are final and non-refundable.',
    colors: ['rgba(63, 29, 42, 0.95)', 'rgba(41, 22, 31, 0.95)'],
    glow: 'rgba(239, 68, 68, 0.25)',
    iconBg: 'rgba(239, 68, 68, 0.2)',
    iconColor: '#EF4444',
  },
];

const PaymentAndRefundPolicy = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={['#090714', '#0B0818', '#0C0919']}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="chevron-back"
            size={moderateScale(20)}
            color={themeSecond.textPrimary}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment & Refund</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.pillDate}>
          <Ionicons
            name="ellipse"
            size={moderateScale(5)}
            color="#B68BFF"
            style={styles.pillDot}
          />
          <Text style={styles.pillDateText}>UPDATED OCT 2024</Text>
        </View>

        <Text style={styles.pageTitle}>Transparent Policies</Text>
        <Text style={styles.pageSubtitle}>
          We believe in fair, clear, and secure transactions. Review our payment
          and refund guidelines below.
        </Text>

        <Text style={styles.sectionTitle}>ACCEPTED PAYMENTS</Text>
        <View style={styles.paymentGrid}>
          {acceptedPayments.map(item => (
            <View key={item.id} style={styles.paymentCard}>
              {item.prefix ? (
                <View style={styles.visaBadge}>
                  <Text style={styles.visaText}>{item.prefix}</Text>
                </View>
              ) : (
                <Ionicons
                  name={item.icon}
                  size={moderateScale(26)}
                  color={themeSecond.textPrimary}
                />
              )}
              <Text style={styles.paymentLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>REFUND ELIGIBILITY</Text>
        {refundRows.map(item => (
          <LinearGradient
            key={item.id}
            colors={item.colors}
            style={styles.refundCard}
          >
            <View style={[styles.cornerGlow, { backgroundColor: item.glow }]} />
            <View style={styles.refundRow}>
              <View
                style={[
                  styles.refundIconWrap,
                  { backgroundColor: item.iconBg },
                ]}
              >
                <Ionicons
                  name={item.icon}
                  size={moderateScale(14)}
                  color={item.iconColor}
                />
              </View>
              <View style={styles.refundTextBox}>
                <Text style={styles.refundTitle}>{item.title}</Text>
                <Text style={styles.refundBody}>{item.text}</Text>
              </View>
            </View>
          </LinearGradient>
        ))}

        <View style={styles.supportCard}>
          <Text style={styles.supportTitle}>Need to request a refund?</Text>
          <Text style={styles.supportSubtitle}>
            Our support team is ready to review your case.
          </Text>
          <TouchableOpacity activeOpacity={0.9} style={styles.supportButton}>
            <LinearGradient
              colors={['#B05BFF', '#8E3DFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.supportButtonGradient}
            >
              <Text style={styles.supportButtonText}>
                Contact Billing Support
              </Text>
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
    backgroundColor: '#090714',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(14),
    paddingVertical: verticalScale(10),
    backgroundColor: 'rgba(13, 10, 29, 0.95)',
    borderBottomLeftRadius: moderateScale(16),
    borderBottomRightRadius: moderateScale(16),
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  backButton: {
    width: moderateScale(30),
    height: moderateScale(30),
    borderRadius: moderateScale(15),
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  headerPlaceholder: {
    width: moderateScale(30),
    height: moderateScale(30),
  },
  headerTitle: {
    color: '#F8F5FF',
    fontSize: moderateScale(18.5),
    fontFamily: fonts.semiBold,
  },
  scrollContent: {
    paddingHorizontal: moderateScale(14),
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(26),
  },
  pillDate: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(6),
    backgroundColor: 'rgba(111, 52, 191, 0.38)',
    borderColor: 'rgba(168, 85, 247, 0.42)',
    borderWidth: 1,
    borderRadius: moderateScale(20),
    paddingHorizontal: moderateScale(11),
    paddingVertical: verticalScale(4),
  },
  pillDot: {
    marginRight: moderateScale(5),
  },
  pillDateText: {
    color: '#CFAEFF',
    fontSize: moderateScale(9.8),
    letterSpacing: 0.5,
    fontFamily: fonts.semiBold,
  },
  pageTitle: {
    marginTop: verticalScale(12),
    color: '#F8F3FF',
    fontSize: moderateScale(37),
    lineHeight: verticalScale(43),
    fontFamily: fonts.regular,
    // fontWeight: 'semibold',
    textAlign: 'center',
  },
  pageSubtitle: {
    marginTop: verticalScale(8),
    textAlign: 'center',
    color: '#C8C0DB',
    fontSize: moderateScale(12.2),
    lineHeight: verticalScale(18),
    fontFamily: fonts.regular,
  },
  sectionTitle: {
    marginTop: verticalScale(19),
    marginBottom: verticalScale(10),
    color: '#AFA8C3',
    fontSize: moderateScale(13),
    letterSpacing: 0.7,
    fontFamily: fonts.semiBold,
  },
  paymentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: verticalScale(10),
  },
  paymentCard: {
    width: '48%',
    borderRadius: moderateScale(14),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.09)',
    backgroundColor: 'rgba(16, 15, 31, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    height: verticalScale(78),
  },
  visaBadge: {
    minWidth: moderateScale(35),
    borderRadius: moderateScale(3),
    paddingHorizontal: moderateScale(5),
    paddingVertical: verticalScale(2),
    backgroundColor: '#FCFCFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  visaText: {
    color: '#191735',
    fontSize: moderateScale(9),
    letterSpacing: 0.2,
    fontFamily: fonts.bold,
  },
  paymentLabel: {
    marginTop: verticalScale(10),
    color: '#F4F1FC',
    fontSize: moderateScale(12.6),
    fontFamily: fonts.medium,
  },
  refundCard: {
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: moderateScale(14),
    marginBottom: verticalScale(10),
    minHeight: verticalScale(84),
  },
  cornerGlow: {
    position: 'absolute',
    right: -moderateScale(24),
    top: -moderateScale(18),
    width: moderateScale(80),
    height: moderateScale(80),
    borderRadius: moderateScale(40),
  },
  refundRow: {
    flexDirection: 'row',
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(12),
  },
  refundIconWrap: {
    width: moderateScale(28),
    height: moderateScale(28),
    borderRadius: moderateScale(14),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: moderateScale(10),
    marginTop: verticalScale(1),
  },
  refundTextBox: {
    flex: 1,
  },
  refundTitle: {
    color: '#F4F0FC',
    fontSize: moderateScale(16),
    marginBottom: verticalScale(4),
    fontFamily: fonts.semiBold,
  },
  refundBody: {
    color: '#CBC4DE',
    fontSize: moderateScale(12.5),
    lineHeight: verticalScale(17),
    fontFamily: fonts.regular,
  },
  supportCard: {
    marginTop: verticalScale(16),
    borderWidth: 1,
    borderRadius: moderateScale(14),
    borderColor: 'rgba(181, 121, 255, 0.4)',
    backgroundColor: 'rgba(34, 21, 57, 0.5)',
    paddingHorizontal: moderateScale(14),
    paddingVertical: verticalScale(13),
  },
  supportTitle: {
    color: '#F8F3FF',
    fontSize: moderateScale(16.5),
    textAlign: 'center',
    fontFamily: fonts.semiBold,
  },
  supportSubtitle: {
    marginTop: verticalScale(8),
    color: '#BEB5D3',
    fontSize: moderateScale(12.5),
    textAlign: 'center',
    fontFamily: fonts.regular,
  },
  supportButton: {
    marginTop: verticalScale(14),
    borderRadius: moderateScale(10),
    overflow: 'hidden',
  },
  supportButtonGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(11),
  },
  supportButtonText: {
    color: '#FFFFFF',
    fontSize: moderateScale(13.8),
    fontFamily: fonts.semiBold,
  },
});

export default PaymentAndRefundPolicy;
