import {
  View,
  Text,
  Image,
  Easing,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { typography } from '../theme/typography';
import React, { useEffect, useRef } from 'react';
import { themeSecond } from '../theme/colorSecond';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const SplashScreen: React.FC = () => {

  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.6)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(verticalScale(20))).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const taglineTranslateY = useRef(
    new Animated.Value(verticalScale(16)),
  ).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;

  const float1 = useRef(new Animated.Value(0)).current;
  const float2 = useRef(new Animated.Value(0)).current;
  const float3 = useRef(new Animated.Value(0)).current;

  const dot1Opacity = useRef(new Animated.Value(0.4)).current;
  const dot2Opacity = useRef(new Animated.Value(0.4)).current;
  const dot3Opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const duration = 700;
    const delayTitle = 250;
    const delayTagline = 450;

    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: duration,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 6,
        tension: 60,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.sequence([
      Animated.delay(delayTitle),
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
        Animated.timing(titleTranslateY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
      ]),
    ]).start();

    Animated.sequence([
      Animated.delay(delayTagline),
      Animated.parallel([
        Animated.timing(taglineOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
        Animated.timing(taglineTranslateY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
      ]),
    ]).start();

    Animated.sequence([
      Animated.delay(600),
      Animated.timing(glowOpacity, {
        toValue: 0.5,
        duration: 1200,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
      }),
    ]).start();
  }, [
    logoOpacity,
    logoScale,
    titleOpacity,
    titleTranslateY,
    taglineOpacity,
    taglineTranslateY,
    glowOpacity,
  ]);

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

    createFloatLoop(float1, verticalScale(6), 3200).start();
    createFloatLoop(float2, -verticalScale(8), 3800).start();
    createFloatLoop(float3, verticalScale(5), 2600).start();
  }, [float1, float2, float3]);

  useEffect(() => {
    const stagger = 200;
    const createDotPulse = (anim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
          }),
          Animated.timing(anim, {
            toValue: 0.4,
            duration: 400,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
          }),
        ]),
      );
    createDotPulse(dot1Opacity, 0).start();
    createDotPulse(dot2Opacity, stagger).start();
    createDotPulse(dot3Opacity, stagger * 2).start();
  }, [dot1Opacity, dot2Opacity, dot3Opacity]);

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
      <Animated.View
        style={[
          styles.glowOverlay,
          {
            opacity: glowOpacity,
          },
        ]}
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
          size={moderateScale(22)}
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
          size={moderateScale(20)}
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
          size={moderateScale(18)}
          color={themeSecond.accentPurpleLight}
        />
      </Animated.View>

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.content}>
          <Animated.View
            style={[
              styles.hero,
              {
                opacity: logoOpacity,
                transform: [{ scale: logoScale }],
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
            <Animated.View
              style={{
                opacity: titleOpacity,
                transform: [{ translateY: titleTranslateY }],
              }}
            >
              <Text style={styles.appName}>Where Hearts Connect</Text>
            </Animated.View>
            <Animated.View
              style={{
                opacity: taglineOpacity,
                transform: [{ translateY: taglineTranslateY }],
              }}
            >
              <Text style={styles.tagline}>
                Everyone deserves a special someone.
              </Text>
            </Animated.View>
          </Animated.View>

          {/* Subtle loading indicator */}
          <Animated.View
            style={[
              styles.loadingWrap,
              {
                opacity: taglineOpacity,
              },
            ]}
          >
            <View style={styles.loadingDots}>
              <Animated.View
                style={[styles.loadingDot, { opacity: dot1Opacity }]}
              />
              <Animated.View
                style={[styles.loadingDot, { opacity: dot2Opacity }]}
              />
              <Animated.View
                style={[styles.loadingDot, { opacity: dot3Opacity }]}
              />
            </View>
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeSecond.bgDark,
  },
  glowOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.5,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: moderateScale(20),
  },
  content: {
    flex: 1,
    // paddingTop: verticalScale(SCREEN_HEIGHT * 0.12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatIcon: {
    position: 'absolute',
    opacity: 0.6,
  },
  floatIcon1: {
    top: SCREEN_HEIGHT * 0.14,
    left: moderateScale(28),
  },
  floatIcon2: {
    top: SCREEN_HEIGHT * 0.24,
    right: moderateScale(32),
  },
  floatIcon3: {
    bottom: SCREEN_HEIGHT * 0.28,
    left: moderateScale(36),
  },
  hero: {
    alignItems: 'center',
  },
  logoWrap: {
    // marginBottom: verticalScale(24),
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
    marginBottom: verticalScale(10),
  },
  tagline: {
    ...typography.body,
    fontSize: moderateScale(14),
    color: themeSecond.textSoft,
    textAlign: 'center',
  },
  loadingWrap: {
    marginTop: verticalScale(48),
  },
  loadingDots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: moderateScale(8),
  },
  loadingDot: {
    width: moderateScale(6),
    height: moderateScale(6),
    borderRadius: moderateScale(3),
    backgroundColor: themeSecond.accentPurpleMedium,
  },
});
