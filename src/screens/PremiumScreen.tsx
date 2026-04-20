import {
  Text,
  View,
  Platform,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import { themeSecond } from '../theme/colorSecond';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MainStackScreenProps } from '../types/navigation.types';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { comparisonFeatures, pricingPlans } from '../constants/MultiSelects';

const PremiumScreen = () => {
  const navigation =
    useNavigation<MainStackScreenProps<'PremiumScreen'>['navigation']>();
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header — InboxSecond style */}
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
        <Text style={styles.headerTitle}>Go Premium</Text>
        <View style={styles.headerIconCirclePlaceholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero — glow ring + gradient */}
        <View style={styles.heroWrap}>
          <View style={styles.heroGlowBorder}>
            <View style={styles.heroInner}>
              <LinearGradient
                colors={[
                  themeSecond.accentPurpleSubtle,
                  themeSecond.surfaceCardDark,
                ]}
                style={StyleSheet.absoluteFill}
              />
              <View style={styles.logoRing}>
                <Ionicons
                  name="diamond"
                  size={moderateScale(44)}
                  color={themeSecond.accentPurple}
                />
              </View>
            </View>
          </View>
          <Text style={styles.punchline}>Find Your Perfect Match, Faster</Text>
          <Text style={styles.heroDescription}>
            Unlock premium features to connect with more people and find your
            ideal partner
          </Text>
        </View>

        {/* Features — glass card + icon rows */}
        <View style={styles.glassCard}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.sectionIconCircle}>
              <Ionicons
                name="sparkles"
                size={moderateScale(18)}
                color={themeSecond.accentPurple}
              />
            </View>
            <Text style={styles.sectionTitle}>What you get</Text>
          </View>
          {[
            {
              icon: 'heart',
              heading: 'See Who Likes You',
              description: 'Discover who has shown interest in your profile',
            },
            {
              icon: 'funnel',
              heading: 'Advanced Filters',
              description: 'Filter matches by education, location, and more',
            },
            {
              icon: 'rocket',
              heading: '1 Free Boost Monthly',
              description: 'Get your profile seen by more people every month',
            },
          ].map((item, idx, arr) => (
            <View
              key={item.heading}
              style={[
                styles.featureRow,
                idx === arr.length - 1 && styles.featureRowLast,
              ]}
            >
              <View style={styles.featureIconWrap}>
                <Ionicons
                  name={item.icon}
                  size={moderateScale(22)}
                  color={themeSecond.accentPurple}
                />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureHeading}>{item.heading}</Text>
                <Text style={styles.featureDescription}>
                  {item.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Comparison — glass table */}
        <View style={[styles.glassCard, styles.comparisonCard]}>
          <View style={styles.comparisonTitleRow}>
            <Text style={styles.comparisonTitleText}>Plan Comparison</Text>
          </View>
          <View style={styles.comparisonHeader}>
            <View style={[styles.comparisonCell, styles.cellFeature]}>
              <Text style={styles.comparisonHeaderText}>Features</Text>
            </View>
            <View style={styles.comparisonCell}>
              <Text style={styles.comparisonHeaderText}>Free</Text>
            </View>
            <View style={[styles.comparisonCell, styles.cellPremium]}>
              <Text style={styles.comparisonHeaderTextPremium}>Premium</Text>
            </View>
          </View>
          {comparisonFeatures.map((item, index) => (
            <View
              key={index}
              style={[
                styles.comparisonRow,
                index === comparisonFeatures.length - 1 &&
                  styles.comparisonRowLast,
              ]}
            >
              <View style={[styles.comparisonCell, styles.cellFeature]}>
                <Text style={styles.comparisonFeatureText}>{item.feature}</Text>
              </View>
              <View style={styles.comparisonCell}>
                {typeof item.free === 'boolean' ? (
                  item.free ? (
                    <Ionicons
                      name="checkmark-circle"
                      size={moderateScale(20)}
                      color={themeSecond.statusSuccess}
                    />
                  ) : (
                    <Ionicons
                      name="close-circle"
                      size={moderateScale(20)}
                      color={themeSecond.textSoft}
                    />
                  )
                ) : (
                  <Text style={styles.comparisonText}>{item.free}</Text>
                )}
              </View>
              <View style={[styles.comparisonCell, styles.cellPremium]}>
                {typeof item.premium === 'boolean' ? (
                  item.premium ? (
                    <Ionicons
                      name="checkmark-circle"
                      size={moderateScale(20)}
                      color={themeSecond.statusSuccess}
                    />
                  ) : (
                    <Ionicons
                      name="close-circle"
                      size={moderateScale(20)}
                      color={themeSecond.textSoft}
                    />
                  )
                ) : (
                  <Text style={styles.comparisonTextPremium}>
                    {item.premium}
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Pricing — glass cards with glow on selected */}
        <View style={styles.pricingSection}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.sectionIconCircle}>
              <Ionicons
                name="card"
                size={moderateScale(18)}
                color={themeSecond.accentPurple}
              />
            </View>
            <Text style={styles.sectionTitle}>Choose your plan</Text>
          </View>
          <View style={styles.pricingContainer}>
            {pricingPlans.map(plan => {
              const isSelected = selectedPlan === plan.months;
              return (
                <TouchableOpacity
                  key={plan.months}
                  style={[
                    styles.pricingCardWrap,
                    plan.isBestValue && styles.pricingCardWrapBestValue,
                    isSelected && styles.pricingCardWrapSelected,
                  ]}
                  onPress={() => setSelectedPlan(plan.months)}
                  activeOpacity={0.85}
                >
                  {plan.isBestValue && (
                    <View style={styles.bestValueBadge}>
                      <Text style={styles.bestValueText}>Best Value</Text>
                    </View>
                  )}
                  <View
                    style={[
                      styles.pricingCard,
                      isSelected && styles.pricingCardSelected,
                    ]}
                  >
                    <View style={styles.pricingContent}>
                      <View style={styles.pricingLeft}>
                        {isSelected && <View style={styles.selectedDot} />}
                        <Text style={styles.pricingMonths}>
                          {plan.months} {plan.months === 1 ? 'Month' : 'Months'}
                        </Text>
                      </View>
                      <View style={styles.pricingRight}>
                        <Text style={styles.pricingAmount}>{plan.price}</Text>
                        <Text style={styles.pricingPerMonth}>
                          {plan.perMonth}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* CTA — primary purple button */}
        <TouchableOpacity
          style={[
            styles.subscribeButton,
            !selectedPlan && styles.subscribeButtonDisabled,
          ]}
          activeOpacity={0.85}
          disabled={!selectedPlan}
          onPress={() => {
            if (selectedPlan) {
              console.log('Subscribe to plan:', selectedPlan);
            }
          }}
        >
          <Text
            style={[
              styles.subscribeButtonText,
              !selectedPlan && styles.subscribeButtonTextDisabled,
            ]}
          >
            Subscribe to Premium
          </Text>
          {selectedPlan && (
            <Ionicons
              name="arrow-forward"
              size={moderateScale(20)}
              color={themeSecond.textPrimary}
            />
          )}
        </TouchableOpacity>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default PremiumScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeSecond.bgDark,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(16),
    paddingVertical: verticalScale(12),
    backgroundColor: themeSecond.bgDark,
  },
  headerIconCircle: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: themeSecond.glassBg,
    borderWidth: 1,
    borderColor: themeSecond.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIconCirclePlaceholder: {
    width: moderateScale(40),
    height: moderateScale(40),
  },
  headerTitle: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: themeSecond.textPrimary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: moderateScale(20),
    paddingTop: verticalScale(8),
  },
  heroWrap: {
    alignItems: 'center',
    marginBottom: verticalScale(28),
    paddingTop: verticalScale(12),
  },
  heroGlowBorder: {
    padding: 3,
    borderRadius: 9999,
    marginBottom: verticalScale(20),
    shadowColor: themeSecond.shadowPurple,
    shadowOpacity: 0.5,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 0 },
    elevation: 20,
  },
  heroInner: {
    width: moderateScale(100),
    height: moderateScale(100),
    borderRadius: moderateScale(50),
    overflow: 'hidden',
    backgroundColor: themeSecond.surfaceCardDark,
    borderWidth: 1.5,
    borderColor: themeSecond.accentPurpleMedium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoRing: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  punchline: {
    fontSize: moderateScale(24),
    fontWeight: '700',
    color: themeSecond.textPrimary,
    textAlign: 'center',
    marginBottom: verticalScale(10),
    letterSpacing: moderateScale(0.3),
  },
  heroDescription: {
    fontSize: moderateScale(14),
    color: themeSecond.textMuted,
    textAlign: 'center',
    paddingHorizontal: moderateScale(16),
    lineHeight: moderateScale(22),
  },
  glassCard: {
    borderRadius: moderateScale(24),
    padding: moderateScale(18),
    marginBottom: verticalScale(14),
    backgroundColor: themeSecond.glassBg,
    borderWidth: moderateScale(1),
    borderColor: themeSecond.glassBorder,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(10),
    marginBottom: verticalScale(14),
  },
  sectionIconCircle: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    backgroundColor: themeSecond.accentPurpleMedium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: themeSecond.textPrimary,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(10),
    borderBottomWidth: moderateScale(1),
    borderBottomColor: themeSecond.borderLight,
  },
  featureRowLast: {
    borderBottomWidth: 0,
  },
  featureIconWrap: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(14),
    backgroundColor: themeSecond.accentPurpleLight,
    borderWidth: moderateScale(1),
    borderColor: themeSecond.accentPurpleMedium,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: moderateScale(14),
  },
  featureContent: {
    flex: 1,
  },
  featureHeading: {
    fontSize: moderateScale(15),
    fontWeight: '600',
    color: themeSecond.textPrimary,
    marginBottom: verticalScale(2),
  },
  featureDescription: {
    fontSize: moderateScale(12),
    color: themeSecond.textSoft,
    lineHeight: moderateScale(18),
  },
  comparisonCard: {
    overflow: 'hidden',
  },
  comparisonTitleRow: {
    paddingVertical: verticalScale(12),
    paddingHorizontal: moderateScale(4),
    borderBottomWidth: moderateScale(1),
    borderBottomColor: themeSecond.borderMedium,
    marginBottom: verticalScale(8),
  },
  comparisonTitleText: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: themeSecond.textPrimary,
    textAlign: 'center',
  },
  comparisonHeader: {
    flexDirection: 'row',
    paddingVertical: verticalScale(12),
    paddingHorizontal: moderateScale(8),
    borderBottomWidth: moderateScale(1),
    borderBottomColor: themeSecond.borderLight,
  },
  comparisonHeaderText: {
    fontSize: moderateScale(12),
    fontWeight: '600',
    color: themeSecond.textMuted,
    textAlign: 'center',
  },
  comparisonHeaderTextPremium: {
    fontSize: moderateScale(12),
    fontWeight: '700',
    color: themeSecond.accentPurple,
    textAlign: 'center',
  },
  comparisonRow: {
    flexDirection: 'row',
    borderBottomWidth: moderateScale(1),
    borderBottomColor: themeSecond.borderLight,
    paddingVertical: verticalScale(12),
    paddingHorizontal: moderateScale(8),
  },
  comparisonRowLast: {
    borderBottomWidth: 0,
  },
  comparisonCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellFeature: {
    flex: 1.4,
    alignItems: 'flex-start',
  },
  cellPremium: {
    backgroundColor: themeSecond.accentPurpleSubtle,
  },
  comparisonFeatureText: {
    fontSize: moderateScale(12),
    color: themeSecond.textPrimary,
  },
  comparisonText: {
    fontSize: moderateScale(11),
    color: themeSecond.textMuted,
    textAlign: 'center',
  },
  comparisonTextPremium: {
    fontSize: moderateScale(11),
    color: themeSecond.accentPurple,
    fontWeight: '600',
    textAlign: 'center',
  },
  pricingSection: {
    marginBottom: verticalScale(24),
  },
  pricingContainer: {
    gap: moderateScale(12),
  },
  pricingCardWrap: {
    position: 'relative',
    borderRadius: moderateScale(20),
  },
  pricingCardWrapBestValue: Platform.select({
    ios: {
      shadowColor: themeSecond.shadowPurple,
      shadowOpacity: 0.35,
      shadowRadius: moderateScale(16),
      shadowOffset: { width: 0, height: verticalScale(4) },
    },
    android: {
      // Softer elevation on Android to avoid heavy inner purple glow
      elevation: 4,
    },
    default: {},
  }),
  pricingCardWrapSelected: Platform.select({
    ios: {
      shadowColor: themeSecond.shadowPurple,
      shadowOpacity: 0.5,
      shadowRadius: moderateScale(20),
      shadowOffset: { width: 0, height: 0 },
    },
    android: {
      // Use elevation only on Android so selected state is clear but not messy
      elevation: 6,
    },
    default: {},
  }),
  pricingCard: {
    borderRadius: moderateScale(20),
    padding: moderateScale(18),
    backgroundColor: themeSecond.surfaceWhiteSubtle,
    borderWidth: moderateScale(1.5),
    borderColor: themeSecond.glassBorder,
    overflow: 'hidden',
  },
  pricingCardSelected: {
    backgroundColor:
      Platform.OS === 'android'
        ? themeSecond.surfaceWhiteSubtle
        : themeSecond.accentPurpleSubtle,
    borderColor: themeSecond.accentPurpleMedium,
    borderWidth: moderateScale(2),
  },
  bestValueBadge: {
    position: 'absolute',
    top: verticalScale(-10),
    right: moderateScale(20),
    zIndex: 1,
    backgroundColor: themeSecond.primaryActionPurple,
    paddingHorizontal: moderateScale(14),
    paddingVertical: verticalScale(5),
    borderRadius: moderateScale(14),
    borderWidth: moderateScale(1),
    borderColor: themeSecond.accentPurpleMedium,
  },
  bestValueText: {
    fontSize: moderateScale(11),
    color: themeSecond.textPrimary,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: moderateScale(0.8),
  },
  pricingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pricingLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(10),
  },
  selectedDot: {
    width: moderateScale(10),
    height: moderateScale(10),
    borderRadius: moderateScale(5),
    backgroundColor: themeSecond.accentPurple,
  },
  pricingMonths: {
    fontSize: moderateScale(16),
    color: themeSecond.textPrimary,
    fontWeight: '600',
  },
  pricingRight: {
    alignItems: 'flex-end',
  },
  pricingAmount: {
    fontSize: moderateScale(20),
    fontWeight: '700',
    color: themeSecond.accentPurple,
  },
  pricingPerMonth: {
    fontSize: moderateScale(11),
    color: themeSecond.textSoft,
    marginTop: verticalScale(2),
  },
  subscribeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: moderateScale(10),
    backgroundColor: themeSecond.buttonPrimaryBg,
    paddingVertical: verticalScale(18),
    borderRadius: moderateScale(24),
    borderWidth: moderateScale(1),
    borderColor: themeSecond.buttonPrimaryBorder,
    shadowColor: themeSecond.primaryActionPurple,
    shadowOffset: { width: 0, height: verticalScale(4) },
    shadowOpacity: 0.45,
    shadowRadius: moderateScale(12),
    elevation: moderateScale(8),
  },
  subscribeButtonDisabled: {
    backgroundColor: themeSecond.surfaceRaised,
    borderColor: themeSecond.borderLight,
    shadowOpacity: 0,
    elevation: 0,
  },
  subscribeButtonText: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: themeSecond.textPrimary,
  },
  subscribeButtonTextDisabled: {
    color: themeSecond.textSoft,
  },
  bottomSpacing: {
    height: verticalScale(40),
  },
});
