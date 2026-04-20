import {
  Text,
  View,
  Easing,
  Linking,
  Animated,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { themeSecond } from "../theme/colorSecond";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState, useRef, useCallback } from "react";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { moderateScale, verticalScale, scale } from "react-native-size-matters";

// Sparkle particle component for celebration effect
const SparkleParticle: React.FC<{
  delay: number;
  startX: number;
  startY: number;
  index: number;
}> = ({ delay, startX, startY, index }) => {
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timeout = setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: 1,
            duration: 2000 + index * 100,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }, delay);

    return () => clearTimeout(timeout);
  }, [animValue, delay, index]);

  const angle = (index * 45 + 22.5) * (Math.PI / 180);
  const distance = moderateScale(80) + (index % 3) * moderateScale(30);
  const halfDist = distance * 0.5;
  const offsetY1 = verticalScale(20);
  const offsetY2 = verticalScale(40);

  const translateX = animValue.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0, Math.cos(angle) * halfDist, Math.cos(angle) * distance],
  });

  const translateY = animValue.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [
      0,
      Math.sin(angle) * halfDist - offsetY1,
      Math.sin(angle) * distance + offsetY2,
    ],
  });

  const opacity = animValue.interpolate({
    inputRange: [0, 0.1, 0.4, 0.8, 1],
    outputRange: [0, 1, 1, 0.3, 0],
  });

  const scale = animValue.interpolate({
    inputRange: [0, 0.2, 0.5, 1],
    outputRange: [0, 1.2, 1, 0.3],
  });

  const rotate = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", `${180 + index * 45}deg`],
  });

  const particleColors = [
    themeSecond.accentPurple,
    themeSecond.primaryActionPurple,
    themeSecond.headerLavender,
    themeSecond.accentPurpleSolid,
    themeSecond.optionPurple,
  ];
  const color = particleColors[index % particleColors.length];
  const size = moderateScale(6) + (index % 4) * moderateScale(2);
  const borderRadius = index % 2 === 0 ? size / 2 : moderateScale(2);

  return (
    <Animated.View
      style={[
        styles.sparkleParticle,
        {
          left: startX,
          top: startY,
          width: size,
          height: size,
          backgroundColor: color,
          borderRadius,
          opacity,
          transform: [{ translateX }, { translateY }, { scale }, { rotate }],
        },
      ]}
    />
  );
};

// Golden shimmer effect component
const GoldenShimmer: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isActive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnim, {
            toValue: 1,
            duration: 2500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.delay(1000),
          Animated.timing(shimmerAnim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [isActive, shimmerAnim]);

  const shimmerDistance = scale(350);
  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-shimmerDistance, shimmerDistance],
  });

  if (!isActive) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.shimmerOverlay,
        {
          transform: [{ translateX }],
        },
      ]}
    >
      <LinearGradient
        colors={[
          "transparent",
          themeSecond.accentPurpleLight,
          themeSecond.accentPurpleMedium,
          themeSecond.accentPurpleLight,
          "transparent",
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.shimmerGradient}
      />
    </Animated.View>
  );
};

// Pulsing glow ring component
const GlowRing: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isActive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();

      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 8000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [isActive, pulseAnim, rotateAnim]);

  const scale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.15],
  });

  const opacity = pulseAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.4, 0.8, 0.4],
  });

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  if (!isActive) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.glowRingContainer,
        {
          opacity,
          transform: [{ scale }, { rotate }],
        },
      ]}
    >
      <LinearGradient
        colors={[
          themeSecond.accentPurple,
          themeSecond.primaryActionPurple,
          themeSecond.accentPurple,
          themeSecond.accentPurpleSolid,
          themeSecond.accentPurple,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.glowRing}
      />
    </Animated.View>
  );
};

type QuestionnaireStackParamList = {
  InitialProfileSetupScreen: undefined;
  FaceVerificationScreen: undefined;
};

type FaceVerificationNavigationProp = NativeStackNavigationProp<
  QuestionnaireStackParamList,
  "FaceVerificationScreen"
>;

const parseQueryParams = (url: string) => {
  const queryString = url.split("?")[1];

  if (!queryString) {
    return {};
  }

  return queryString.split("&").reduce<Record<string, string>>((acc, pair) => {
    if (!pair) {
      return acc;
    }

    const [rawKey, rawValue = ""] = pair.split("=");

    if (!rawKey) {
      return acc;
    }

    acc[decodeURIComponent(rawKey)] = decodeURIComponent(rawValue);

    return acc;
  }, {});
};

const FaceVerificationScreen: React.FC = () => {
  const navigation = useNavigation<FaceVerificationNavigationProp>();
  const { user, profile } = useAuth();
  const [showVerifiedPrompt, setShowVerifiedPrompt] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);

  // Animation values for luxurious celebration effect
  const cardScale = useRef(new Animated.Value(0)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardTranslateY = useRef(new Animated.Value(verticalScale(50))).current;
  const checkmarkScale = useRef(new Animated.Value(0)).current;
  const checkmarkRotate = useRef(new Animated.Value(0)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(verticalScale(20))).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleTranslateY = useRef(
    new Animated.Value(verticalScale(20))
  ).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const buttonTranslateY = useRef(
    new Animated.Value(verticalScale(30))
  ).current;
  const borderGlow = useRef(new Animated.Value(0)).current;

  const runCelebrationAnimation = useCallback(() => {
    // Reset all values
    cardScale.setValue(0);
    cardOpacity.setValue(0);
    cardTranslateY.setValue(verticalScale(50));
    checkmarkScale.setValue(0);
    checkmarkRotate.setValue(0);
    glowOpacity.setValue(0);
    titleOpacity.setValue(0);
    titleTranslateY.setValue(verticalScale(20));
    subtitleOpacity.setValue(0);
    subtitleTranslateY.setValue(verticalScale(20));
    buttonOpacity.setValue(0);
    buttonTranslateY.setValue(verticalScale(30));
    borderGlow.setValue(0);

    // Show sparkles
    setShowSparkles(true);

    // Orchestrated animation sequence
    Animated.sequence([
      // Phase 1: Card entrance with spring bounce
      Animated.parallel([
        Animated.spring(cardScale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(cardTranslateY, {
          toValue: 0,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Phase 2: Checkmark with dramatic entrance (delayed)
    setTimeout(() => {
      Animated.parallel([
        Animated.spring(checkmarkScale, {
          toValue: 1,
          tension: 100,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.timing(checkmarkRotate, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }),
        Animated.timing(glowOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }, 200);

    // Phase 3: Border glow pulse
    setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(borderGlow, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(borderGlow, {
            toValue: 0,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
        ])
      ).start();
    }, 400);

    // Phase 4: Title entrance (staggered)
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(titleTranslateY, {
          toValue: 0,
          tension: 80,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    }, 450);

    // Phase 5: Subtitle entrance (staggered)
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(subtitleOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(subtitleTranslateY, {
          toValue: 0,
          tension: 80,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    }, 600);

    // Phase 6: Button entrance (final)
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(buttonOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(buttonTranslateY, {
          toValue: 0,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    }, 750);
  }, [
    cardScale,
    cardOpacity,
    cardTranslateY,
    checkmarkScale,
    checkmarkRotate,
    glowOpacity,
    titleOpacity,
    titleTranslateY,
    subtitleOpacity,
    subtitleTranslateY,
    buttonOpacity,
    buttonTranslateY,
    borderGlow,
  ]);

  useEffect(() => {
    if (!profile?.isVerified) {
      return;
    }

    setShowVerifiedPrompt(true);
    // Small delay to ensure state is set before animation
    setTimeout(() => {
      runCelebrationAnimation();
    }, 100);
  }, [profile?.isVerified, runCelebrationAnimation]);

  useEffect(() => {
    const handleDeepLink = async ({ url }: { url: string }) => {
      const params = parseQueryParams(url);
      const status = params.status;
      const verificationsessionid = params.verificationSessionId;

      console.log("Face verification deep link", {
        status,
        verificationsessionid,
        params,
      });

      if (!status || !verificationsessionid || !user?.id) {
        return;
      }

      const profileUpdatePayload = {
        isVerified: status === "Approved",
        verificationsessionid,
        updated_at: new Date().toISOString(),
      };

      console.log("User profile update requested", {
        userId: user.id,
        ...profileUpdatePayload,
      });
    };

    const subscription = Linking.addEventListener("url", handleDeepLink);

    return () => {
      subscription.remove();
    };
  }, [user?.id]);

  const handleStartVerification = () => {
    console.log("User tapped Face Verification");
  };

  // Interpolated animation values
  const checkmarkRotateInterpolate = checkmarkRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["-180deg", "0deg"],
  });

  const borderColor = borderGlow.interpolate({
    inputRange: [0, 1],
    outputRange: [
      themeSecond.accentPurpleMedium,
      themeSecond.accentPurpleSolid,
    ],
  });

  const shadowOpacity = borderGlow.interpolate({
    inputRange: [0, 1],
    outputRange: [0.15, 0.4],
  });

  // Sparkle positions (centered around checkmark)
  const sparkleParticles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    delay: i * 80,
    startX: moderateScale(140),
    startY: moderateScale(45),
  }));

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.pageHeader}>
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
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Face Verification</Text>
          {!showVerifiedPrompt && (
            <View style={styles.headerChip}>
              <Ionicons
                name="shield-checkmark"
                size={moderateScale(10)}
                color={themeSecond.onlineGreen}
              />
              <Text style={styles.headerChipText}>Secure & private</Text>
            </View>
          )}
        </View>
        <View style={styles.headerIconCirclePlaceholder} />
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {!showVerifiedPrompt && (
          <>
            {/* Ambient gradient */}
            <LinearGradient
              colors={[
                themeSecond.accentPurpleSubtle,
                "transparent",
                "transparent",
              ]}
              locations={[0, 0.4, 1]}
              style={styles.ambientGradient}
            />
            {/* Scan frame – futuristic face alignment */}
            <View style={styles.scanSection}>
              <View style={styles.scanFrameOuter}>
                <View style={styles.scanFrameMid}>
                  <View style={styles.scanFrameInner}>
                    <View style={styles.scanCenter}>
                      <Ionicons
                        name="scan-outline"
                        size={moderateScale(44)}
                        color={themeSecond.accentPurple}
                      />
                      <Text style={styles.scanLabel}>
                        Position your face{"\n"}in the frame
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* Timeline steps */}
            <View style={styles.timelineSection}>
              <Text style={styles.timelineSectionTitle}>How it works</Text>
              <View style={styles.timeline}>
                <View style={styles.timelineLine} />
                {[
                  {
                    num: "1",
                    title: "Good lighting",
                    desc: "Face the camera in a well-lit area",
                    icon: "sunny-outline" as const,
                  },
                  {
                    num: "2",
                    title: "Hold still",
                    desc: "Keep your face centered for a few seconds",
                    icon: "scan-outline" as const,
                  },
                  {
                    num: "3",
                    title: "Get verified",
                    desc: "Receive your verified badge instantly",
                    icon: "shield-checkmark-outline" as const,
                  },
                ].map((step, idx) => (
                  <View key={step.num} style={styles.timelineRow}>
                    <View style={styles.timelineNodeWrap}>
                      <View style={styles.timelineNode}>
                        <Text style={styles.timelineNodeNum}>{step.num}</Text>
                      </View>
                      {idx < 2 && <View style={styles.timelineDot} />}
                    </View>
                    <View style={styles.timelineContent}>
                      <View style={styles.timelineIconSmall}>
                        <Ionicons
                          name={step.icon}
                          size={moderateScale(16)}
                          color={themeSecond.accentPurple}
                        />
                      </View>
                      <Text style={styles.timelineTitle}>{step.title}</Text>
                      <Text style={styles.timelineDesc}>{step.desc}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* CTA */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={handleStartVerification}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={[
                    themeSecond.accentPurple,
                    themeSecond.primaryActionPurple,
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.primaryBtnGradient}
                >
                  <Ionicons
                    name="camera"
                    size={moderateScale(24)}
                    color={themeSecond.textPrimary}
                  />
                  <Text style={styles.primaryBtnText}>Start verification</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.skipBtn}
                onPress={() => navigation.goBack()}
                activeOpacity={0.7}
              >
                <Text style={styles.skipText}>Skip for now</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {showVerifiedPrompt ? (
          <View style={styles.verifiedWrapper}>
            {/* Outer wrapper for JS-driven animations (borderColor, shadowOpacity) */}
            <Animated.View
              style={[
                styles.verifiedCardBorderWrapper,
                {
                  borderColor: borderColor,
                  shadowOpacity: shadowOpacity,
                },
              ]}
            >
              {/* Inner wrapper for native-driven animations (opacity, transform) */}
              <Animated.View
                style={[
                  styles.verifiedCardLuxury,
                  {
                    opacity: cardOpacity,
                    transform: [
                      { scale: cardScale },
                      { translateY: cardTranslateY },
                    ],
                  },
                ]}
              >
                {/* Golden shimmer effect */}
                <GoldenShimmer isActive={showVerifiedPrompt} />

                {/* Background gradient glow */}
                <LinearGradient
                  colors={[
                    themeSecond.bgDark,
                    themeSecond.surfaceCardDark,
                    themeSecond.bgDark,
                  ]}
                  style={styles.verifiedGradientBg}
                />

                {/* Sparkle particles */}
                {showSparkles &&
                  sparkleParticles.map((particle) => (
                    <SparkleParticle
                      key={particle.id}
                      index={particle.id}
                      delay={particle.delay}
                      startX={particle.startX}
                      startY={particle.startY}
                    />
                  ))}

                {/* Checkmark with glow ring */}
                <View style={styles.checkmarkContainer}>
                  <GlowRing isActive={showVerifiedPrompt} />
                  <Animated.View
                    style={[
                      styles.checkmarkWrapper,
                      {
                        opacity: glowOpacity,
                        transform: [
                          { scale: checkmarkScale },
                          { rotate: checkmarkRotateInterpolate },
                        ],
                      },
                    ]}
                  >
                    <LinearGradient
                      colors={[
                        themeSecond.accentPurple,
                        themeSecond.primaryActionPurple,
                        themeSecond.accentPurple,
                      ]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.checkmarkGradient}
                    >
                      <View style={styles.checkmarkInner}>
                        <Ionicons
                          name="checkmark"
                          size={moderateScale(36)}
                          color={themeSecond.textPrimary}
                        />
                      </View>
                    </LinearGradient>
                  </Animated.View>
                </View>

                {/* Crown/Premium badge */}
                <Animated.View
                  style={[
                    styles.premiumBadge,
                    {
                      opacity: glowOpacity,
                      transform: [{ scale: checkmarkScale }],
                    },
                  ]}
                >
                  <LinearGradient
                    colors={[
                      themeSecond.accentPurple,
                      themeSecond.primaryActionPurple,
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.premiumBadgeGradient}
                  >
                    <Ionicons
                      name="shield-checkmark"
                      size={moderateScale(12)}
                      color={themeSecond.textPrimary}
                    />
                    <Text style={styles.premiumBadgeText}>VERIFIED</Text>
                  </LinearGradient>
                </Animated.View>

                {/* Animated title */}
                <Animated.View
                  style={[
                    styles.verifiedCopyLuxury,
                    {
                      opacity: titleOpacity,
                      transform: [{ translateY: titleTranslateY }],
                    },
                  ]}
                >
                  <Text style={styles.verifiedTitleLuxury}>You're all set</Text>
                  <Text style={styles.verifiedTitleAccent}>
                    You're now verified
                  </Text>
                </Animated.View>

                {/* Animated subtitle */}
                <Animated.View
                  style={{
                    opacity: subtitleOpacity,
                    transform: [{ translateY: subtitleTranslateY }],
                  }}
                >
                  <Text style={styles.verifiedSubtitleLuxury}>
                    Your profile shows the verified badge. Build trust with
                    matches.
                  </Text>
                </Animated.View>

                {/* Animated button */}
                <Animated.View
                  style={[
                    styles.buttonContainer,
                    {
                      opacity: buttonOpacity,
                      transform: [{ translateY: buttonTranslateY }],
                    },
                  ]}
                >
                  <TouchableOpacity
                    style={styles.luxuryButton}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={[
                        themeSecond.accentPurple,
                        themeSecond.primaryActionPurple,
                        themeSecond.accentPurple,
                      ]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.luxuryButtonGradient}
                    >
                      <Text style={styles.luxuryButtonText}>Continue</Text>
                      <Ionicons
                        name="arrow-forward"
                        size={moderateScale(18)}
                        color={themeSecond.textPrimary}
                      />
                    </LinearGradient>
                  </TouchableOpacity>
                </Animated.View>
                {/* Close inner native-driven wrapper */}
              </Animated.View>
              {/* Close outer JS-driven wrapper */}
            </Animated.View>
          </View>
        ) : null}

        {!showVerifiedPrompt && (
          <View style={styles.footerNote}>
            <Ionicons
              name="lock-closed"
              size={moderateScale(14)}
              color={themeSecond.textSoft}
            />
            <Text style={styles.footerText}>
              Your selfie is used only for verification and never shared.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default FaceVerificationScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: themeSecond.bgDark,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: moderateScale(20),
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(40),
  },
  ambientGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: verticalScale(280),
    pointerEvents: "none",
  },
  scanSection: {
    alignItems: "center",
    marginBottom: verticalScale(32),
  },
  scanFrameOuter: {
    width: moderateScale(200),
    height: moderateScale(200),
    borderRadius: moderateScale(100),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: moderateScale(2),
    borderColor: themeSecond.accentPurpleMedium,
    backgroundColor: themeSecond.accentPurpleSubtle,
    shadowColor: themeSecond.shadowPurple,
    shadowOpacity: 0.4,
    shadowRadius: moderateScale(24),
    shadowOffset: { width: 0, height: 0 },
    elevation: moderateScale(12),
  },
  scanFrameMid: {
    width: moderateScale(168),
    height: moderateScale(168),
    borderRadius: moderateScale(84),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: moderateScale(1),
    borderColor: themeSecond.accentPurpleLight,
  },
  scanFrameInner: {
    width: moderateScale(140),
    height: moderateScale(140),
    borderRadius: moderateScale(70),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: themeSecond.surfaceCardDark,
    borderWidth: moderateScale(1),
    borderColor: themeSecond.borderLight,
  },
  scanCenter: {
    alignItems: "center",
    justifyContent: "center",
  },
  scanLabel: {
    fontSize: moderateScale(12),
    color: themeSecond.textMuted,
    textAlign: "center",
    marginTop: verticalScale(10),
    lineHeight: moderateScale(18),
  },
  timelineSection: {
    marginBottom: verticalScale(28),
  },
  timelineSectionTitle: {
    fontSize: moderateScale(14),
    fontWeight: "700",
    color: themeSecond.textPrimary,
    letterSpacing: moderateScale(0.5),
    marginBottom: verticalScale(16),
    textTransform: "uppercase",
    opacity: 0.9,
  },
  timeline: {
    position: "relative",
  },
  timelineLine: {
    position: "absolute",
    left: moderateScale(18),
    top: moderateScale(28),
    bottom: moderateScale(28),
    width: moderateScale(2),
    backgroundColor: themeSecond.accentPurpleLight,
    borderRadius: moderateScale(1),
    opacity: 0.6,
  },
  timelineRow: {
    flexDirection: "row",
    marginBottom: verticalScale(20),
  },
  timelineNodeWrap: {
    alignItems: "center",
    width: moderateScale(40),
  },
  timelineNode: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    backgroundColor: themeSecond.accentPurpleLight,
    borderWidth: moderateScale(1.5),
    borderColor: themeSecond.accentPurpleMedium,
    alignItems: "center",
    justifyContent: "center",
  },
  timelineNodeNum: {
    fontSize: moderateScale(14),
    fontWeight: "800",
    color: themeSecond.accentPurple,
  },
  timelineDot: {
    width: moderateScale(4),
    height: moderateScale(4),
    borderRadius: moderateScale(2),
    backgroundColor: themeSecond.accentPurpleMedium,
    marginTop: verticalScale(4),
    opacity: 0.8,
  },
  timelineContent: {
    flex: 1,
    marginLeft: moderateScale(12),
  },
  timelineIconSmall: {
    width: moderateScale(28),
    height: moderateScale(28),
    borderRadius: moderateScale(14),
    backgroundColor: themeSecond.surfaceWhiteSubtle,
    borderWidth: moderateScale(1),
    borderColor: themeSecond.borderLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: verticalScale(6),
  },
  timelineTitle: {
    fontSize: moderateScale(15),
    fontWeight: "700",
    color: themeSecond.textPrimary,
    marginBottom: verticalScale(2),
  },
  timelineDesc: {
    fontSize: moderateScale(12),
    color: themeSecond.textSoft,
    lineHeight: moderateScale(18),
  },
  actions: {
    marginTop: verticalScale(8),
    alignItems: "center",
    gap: verticalScale(14),
  },
  primaryBtn: {
    width: "100%",
    minHeight: verticalScale(56),
    borderRadius: moderateScale(16),
    overflow: "hidden",
    shadowColor: themeSecond.shadowPurple,
    shadowOpacity: 0.45,
    shadowRadius: moderateScale(12),
    shadowOffset: { width: 0, height: verticalScale(4) },
    elevation: moderateScale(10),
  },
  primaryBtnGradient: {
    flex: 1,
    width: "100%",
    minHeight: verticalScale(56),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: moderateScale(12),
  },
  primaryBtnText: {
    fontSize: moderateScale(17),
    fontWeight: "700",
    color: themeSecond.textPrimary,
    letterSpacing: moderateScale(0.3),
  },
  skipBtn: {
    paddingVertical: verticalScale(10),
    paddingHorizontal: moderateScale(16),
  },
  skipText: {
    fontSize: moderateScale(14),
    color: themeSecond.textMuted,
    fontWeight: "500",
  },
  pageHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: themeSecond.bgDark,
    paddingHorizontal: moderateScale(16),
    paddingTop: verticalScale(8),
    paddingBottom: verticalScale(12),
    borderBottomWidth: moderateScale(1),
    borderBottomColor: themeSecond.borderLight,
  },
  headerIconCircle: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: themeSecond.glassBg,
    borderWidth: moderateScale(1),
    borderColor: themeSecond.glassBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  headerIconCirclePlaceholder: {
    width: moderateScale(40),
    height: moderateScale(40),
  },
  headerTitle: {
    fontSize: moderateScale(18),
    fontWeight: "700",
    color: themeSecond.textPrimary,
  },
  headerCenter: {
    alignItems: "center",
    justifyContent: "center",
  },
  headerChip: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: verticalScale(2),
    gap: moderateScale(4),
    paddingHorizontal: moderateScale(8),
    paddingVertical: verticalScale(2),
    borderRadius: moderateScale(10),
    backgroundColor: themeSecond.surfaceWhiteSubtle,
    borderWidth: moderateScale(1),
    borderColor: themeSecond.borderLight,
  },
  headerChipText: {
    fontSize: moderateScale(10),
    color: themeSecond.textMuted,
    fontWeight: "600",
    letterSpacing: moderateScale(0.3),
  },
  verifiedWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: verticalScale(380),
    width: "100%",
  },
  verifiedCardBorderWrapper: {
    width: "100%",
    maxWidth: moderateScale(340),
    borderRadius: moderateScale(24),
    borderWidth: moderateScale(1.5),
    shadowColor: themeSecond.shadowPurple,
    shadowRadius: moderateScale(24),
    shadowOffset: { width: 0, height: verticalScale(8) },
    elevation: moderateScale(12),
    backgroundColor: "transparent",
    overflow: "hidden",
  },
  verifiedCardLuxury: {
    width: "100%",
    backgroundColor: themeSecond.glassBg,
    borderRadius: moderateScale(22),
    padding: moderateScale(24),
    paddingTop: moderateScale(32),
    alignItems: "center",
    overflow: "hidden",
    borderWidth: moderateScale(1),
    borderColor: themeSecond.glassBorder,
  },
  verifiedGradientBg: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: moderateScale(24),
    opacity: 0.5,
  },
  sparkleParticle: {
    position: "absolute",
    shadowColor: themeSecond.shadowPurple,
    shadowOpacity: 0.6,
    shadowRadius: moderateScale(4),
    shadowOffset: { width: 0, height: 0 },
  },
  shimmerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  shimmerGradient: {
    flex: 1,
    width: moderateScale(100),
  },
  glowRingContainer: {
    position: "absolute",
    width: moderateScale(100),
    height: moderateScale(100),
    borderRadius: moderateScale(50),
    justifyContent: "center",
    alignItems: "center",
  },
  glowRing: {
    width: "100%",
    height: "100%",
    borderRadius: moderateScale(50),
    opacity: 0.5,
  },
  checkmarkContainer: {
    width: moderateScale(90),
    height: moderateScale(90),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(16),
  },
  checkmarkWrapper: {
    width: moderateScale(80),
    height: moderateScale(80),
    borderRadius: moderateScale(40),
    shadowColor: themeSecond.shadowPurple,
    shadowOpacity: 0.5,
    shadowRadius: moderateScale(20),
    shadowOffset: { width: 0, height: 0 },
    elevation: moderateScale(10),
  },
  checkmarkGradient: {
    width: "100%",
    height: "100%",
    borderRadius: moderateScale(40),
    padding: moderateScale(3),
    justifyContent: "center",
    alignItems: "center",
  },
  checkmarkInner: {
    flex: 1,
    width: "100%",
    backgroundColor: themeSecond.glassBg,
    borderRadius: moderateScale(40),
    justifyContent: "center",
    alignItems: "center",
  },
  premiumBadge: {
    marginBottom: verticalScale(12),
  },
  premiumBadgeGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(20),
    gap: moderateScale(6),
  },
  premiumBadgeText: {
    fontSize: moderateScale(10),
    color: themeSecond.textPrimary,
    fontWeight: "800",
    letterSpacing: moderateScale(1.5),
  },
  verifiedCopyLuxury: {
    alignItems: "center",
    marginBottom: verticalScale(8),
  },
  verifiedTitleLuxury: {
    fontSize: moderateScale(20),
    fontWeight: "700",
    color: themeSecond.textPrimary,
    textAlign: "center",
    marginBottom: verticalScale(4),
  },
  verifiedTitleAccent: {
    fontSize: moderateScale(20),
    fontWeight: "800",
    color: themeSecond.accentPurple,
    textAlign: "center",
  },
  verifiedSubtitleLuxury: {
    fontSize: moderateScale(14),
    color: themeSecond.textMuted,
    textAlign: "center",
    marginBottom: verticalScale(20),
    paddingHorizontal: moderateScale(8),
    lineHeight: moderateScale(22),
  },
  buttonContainer: {
    width: "100%",
  },
  luxuryButton: {
    width: "100%",
    borderRadius: moderateScale(16),
    overflow: "hidden",
    shadowColor: themeSecond.shadowPurple,
    shadowOpacity: 0.4,
    shadowRadius: moderateScale(12),
    shadowOffset: { width: 0, height: verticalScale(6) },
    elevation: moderateScale(6),
  },
  luxuryButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(16),
    gap: moderateScale(8),
  },
  luxuryButtonText: {
    fontSize: moderateScale(16),
    color: themeSecond.textPrimary,
    fontWeight: "700",
  },
  secondaryAction: {
    paddingVertical: verticalScale(8),
  },
  secondaryText: {
    fontSize: moderateScale(14),
    color: themeSecond.textMuted,
  },
  footerNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(8),
    justifyContent: "center",
    marginTop: verticalScale(16),
  },
  footerText: {
    fontSize: moderateScale(12),
    color: themeSecond.textSoft,
  },
});
