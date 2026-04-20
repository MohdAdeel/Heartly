import Button from '../components/Button';
import { typography } from '../theme/typography';
import React, { useEffect, useRef } from 'react';
import { themeSecond } from '../theme/colorSecond';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthStackScreenProps } from '../types/navigation.types';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { View, Text, Image, Easing, Animated, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const FEATURES = [
  {
    icon: 'heart-circle' as const,
    label: 'Smart Matchmaking',
    sub: 'AI-powered compatibility',
  },
  {
    icon: 'shield-checkmark' as const,
    label: 'Verified Profiles',
    sub: 'Authentic connections',
  },
  {
    icon: 'sparkles' as const,
    label: 'Meaningful Connections',
    sub: 'Built for the long term',
  },
];

const GettingStartedScreen = () => {
  const navigation =
    useNavigation<AuthStackScreenProps<'GettingStartedScreen'>['navigation']>();

  const heroOpacity = useRef(new Animated.Value(0)).current;
  const heroTranslateY = useRef(new Animated.Value(verticalScale(24))).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardTranslateY = useRef(new Animated.Value(verticalScale(32))).current;
  const ctaOpacity = useRef(new Animated.Value(0)).current;
  const ctaScale = useRef(new Animated.Value(1)).current;

  const float1 = useRef(new Animated.Value(0)).current;
  const float2 = useRef(new Animated.Value(0)).current;
  const float3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const duration = 600;
    const delayCard = 200;
    const delayCta = 400;

    Animated.parallel([
      Animated.timing(heroOpacity, {
        toValue: 1,
        duration,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(heroTranslateY, {
        toValue: 0,
        duration,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();

    Animated.sequence([
      Animated.delay(delayCard),
      Animated.parallel([
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
        Animated.timing(cardTranslateY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
      ]),
    ]).start();

    Animated.sequence([
      Animated.delay(delayCard + delayCta),
      Animated.timing(ctaOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();
  }, [heroOpacity, heroTranslateY, cardOpacity, cardTranslateY, ctaOpacity]);

  useEffect(() => {
    const createFloatLoop = (
      anim: Animated.Value,
      delta: number,
      dur: number,
    ) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: delta,
            duration: dur,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
          }),
          Animated.timing(anim, {
            toValue: -delta,
            duration: dur,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
          }),
        ]),
      );

    createFloatLoop(float1, verticalScale(8), 3000).start();
    createFloatLoop(float2, -verticalScale(6), 3500).start();
    createFloatLoop(float3, verticalScale(10), 2800).start();
  }, [float1, float2, float3]);

  const handleGetStarted = () => {
    Animated.sequence([
      Animated.timing(ctaScale, {
        toValue: 0.96,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(ctaScale, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
        easing: Easing.out(Easing.elastic(1.5)),
      }),
    ]).start(() => navigation.navigate('Login'));
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[
          themeSecond.bgDark,
          themeSecond.bgDark,
          themeSecond.surfaceDark,
          themeSecond.bgDark,
        ]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
      <LinearGradient
        colors={[
          'transparent',
          themeSecond.accentPurpleSubtle,
          themeSecond.accentPurpleSubtle,
          'transparent',
        ]}
        style={styles.glowOverlay}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      {/* Floating decorative icons */}
      <Animated.View
        style={[
          styles.floatIcon,
          styles.floatIcon1,
          { transform: [{ translateY: float1 }] },
        ]}
      >
        <Ionicons
          name="heart"
          size={moderateScale(20)}
          color={themeSecond.accentPurpleMedium}
        />
      </Animated.View>
      <Animated.View
        style={[
          styles.floatIcon,
          styles.floatIcon2,
          { transform: [{ translateY: float2 }] },
        ]}
      >
        <MaterialCommunityIcons
          name="diamond-stone"
          size={moderateScale(18)}
          color={themeSecond.glassBorder}
        />
      </Animated.View>
      <Animated.View
        style={[
          styles.floatIcon,
          styles.floatIcon3,
          { transform: [{ translateY: float3 }] },
        ]}
      >
        <Ionicons
          name="sparkles"
          size={moderateScale(16)}
          color={themeSecond.accentPurpleLight}
        />
      </Animated.View>

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.content}>
          {/* Hero */}
          <Animated.View
            style={[
              styles.hero,
              {
                opacity: heroOpacity,
                transform: [{ translateY: heroTranslateY }],
              },
            ]}
          >
            <View style={styles.logoWrap}>
              <Image
                source={require('../../assets/Images/logoIzdivaaj-removebg-preview.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.appName}>Where Hearts Connect</Text>
            <Text style={styles.tagline}>
              Everyone deserves a special someone.
            </Text>
          </Animated.View>

          {/* Glass feature card */}
          <Animated.View
            style={[
              styles.glassCard,
              {
                opacity: cardOpacity,
                transform: [{ translateY: cardTranslateY }],
              },
            ]}
          >
            {FEATURES.map((item, index) => (
              <View
                key={item.label}
                style={[
                  styles.featureRow,
                  index < FEATURES.length - 1 && styles.featureRowBorder,
                ]}
              >
                <View style={styles.featureIconWrap}>
                  <Ionicons
                    name={item.icon}
                    size={moderateScale(22)}
                    color={themeSecond.accentPurple}
                  />
                </View>
                <View style={styles.featureTextWrap}>
                  <Text style={styles.featureLabel}>{item.label}</Text>
                  <Text style={styles.featureSub}>{item.sub}</Text>
                </View>
              </View>
            ))}
          </Animated.View>

          {/* CTA */}
          <Animated.View
            style={[
              styles.ctaWrap,
              {
                opacity: ctaOpacity,
                transform: [{ scale: ctaScale }],
              },
            ]}
          >
            <Button
              title="Get Started"
              onPress={handleGetStarted}
              iconName="arrow-forward"
              iconColor={themeSecond.textPrimary}
              style={styles.ctaButton}
              textStyle={styles.ctaText}
            />
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeSecond.bgDark,
  },
  glowOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.6,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: moderateScale(20),
  },
  content: {
    flex: 1,
    paddingTop: verticalScale(40),
    paddingBottom: verticalScale(32),
    justifyContent: 'space-between',
  },
  floatIcon: {
    position: 'absolute',
    opacity: 0.7,
  },
  floatIcon1: {
    top: verticalScale(80),
    left: moderateScale(24),
  },
  floatIcon2: {
    top: verticalScale(140),
    right: moderateScale(28),
  },
  floatIcon3: {
    bottom: verticalScale(180),
    left: moderateScale(32),
  },
  hero: {
    alignItems: 'center',
  },
  logoWrap: {
    // marginBottom: verticalScale(20),
  },
  logo: {
    width: moderateScale(200),
    height: moderateScale(200),
  },
  appName: {
    ...typography.h1,
    fontSize: moderateScale(26),
    color: themeSecond.textPrimary,
    textAlign: 'center',
    letterSpacing: moderateScale(0.5),
    marginBottom: verticalScale(8),
  },
  tagline: {
    ...typography.body,
    fontSize: moderateScale(14),
    color: themeSecond.textSoft,
    textAlign: 'center',
    // maxWidth: '90%',
  },
  glassCard: {
    width: '100%',
    borderRadius: moderateScale(24),
    padding: moderateScale(20),
    overflow: 'hidden',
    backgroundColor: themeSecond.glassBg,
    borderWidth: moderateScale(1),
    borderColor: themeSecond.glassBorder,
    shadowColor: themeSecond.shadowBlack,
    shadowOpacity: 0.25,
    shadowRadius: moderateScale(24),
    shadowOffset: { width: 0, height: verticalScale(12) },
    elevation: moderateScale(12),
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(14),
  },
  featureRowBorder: {
    borderBottomWidth: moderateScale(1),
    borderBottomColor: themeSecond.borderLight,
  },
  featureIconWrap: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(22),
    backgroundColor: themeSecond.accentPurpleSubtle,
    borderWidth: moderateScale(1),
    borderColor: themeSecond.accentPurpleLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: moderateScale(16),
  },
  featureTextWrap: {
    flex: 1,
  },
  featureLabel: {
    ...typography.bodyMedium,
    fontSize: moderateScale(15),
    fontWeight: '700',
    color: themeSecond.textPrimary,
    marginBottom: verticalScale(2),
  },
  featureSub: {
    fontSize: moderateScale(12),
    color: themeSecond.textSoft,
  },
  ctaWrap: {
    paddingTop: verticalScale(8),
  },
  ctaButton: {
    width: '100%',
    alignSelf: 'stretch',
    backgroundColor: themeSecond.accentPurple,
    borderRadius: moderateScale(14),
    overflow: 'hidden',
    shadowColor: themeSecond.shadowPurple,
    shadowOpacity: 0.4,
    shadowRadius: moderateScale(12),
    shadowOffset: { width: 0, height: verticalScale(4) },
    elevation: moderateScale(8),
  },
  ctaText: {
    color: themeSecond.textPrimary,
    fontWeight: '700',
    letterSpacing: moderateScale(1),
  },
});

export default GettingStartedScreen;
