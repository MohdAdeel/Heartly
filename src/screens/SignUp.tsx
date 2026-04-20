import {
  Text,
  View,
  Image,
  Easing,
  Animated,
  Platform,
  TextInput,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import Button from "../components/Button";
import { useSignUp } from "../hooks/useSignUp";
import { useAlerts } from "../components/Alert";
import { useAuth } from "../context/AuthContext";
import { typography } from "../theme/typography";
import { themeSecond } from "../theme/colorSecond";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthStackScreenProps } from "../types/navigation.types";
import { moderateScale, verticalScale } from "react-native-size-matters";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const DURATION = 520;
const SMOOTH = Easing.bezier(0.33, 1, 0.68, 1);
const SMOOTH_OUT = Easing.out(Easing.cubic);

const SignUp = () => {
  const navigation =
    useNavigation<AuthStackScreenProps<"SignUp">["navigation"]>();
  const { showAlert } = useAlerts();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signUp, loading, error, clearError } = useSignUp();
  const { login } = useAuth();

  // Entrance animations
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.9)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(verticalScale(28))).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleTranslateY = useRef(
    new Animated.Value(verticalScale(20))
  ).current;
  const formOpacity = useRef(new Animated.Value(0)).current;
  const formTranslateY = useRef(new Animated.Value(verticalScale(56))).current;
  const formScale = useRef(new Animated.Value(0.96)).current;
  const social1 = useRef(new Animated.Value(0)).current;
  const social2 = useRef(new Animated.Value(0)).current;
  const social3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const run = () => {
      // 1. Logo: fade in then gentle scale spring
      Animated.sequence([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: DURATION * 0.45,
          useNativeDriver: true,
          easing: SMOOTH,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 6,
          tension: 65,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // 2. Title
        Animated.parallel([
          Animated.timing(titleOpacity, {
            toValue: 1,
            duration: DURATION,
            useNativeDriver: true,
            easing: SMOOTH,
          }),
          Animated.timing(titleTranslateY, {
            toValue: 0,
            duration: DURATION,
            useNativeDriver: true,
            easing: SMOOTH,
          }),
        ]).start(() => {
          // 3. Subtitle
          Animated.parallel([
            Animated.timing(subtitleOpacity, {
              toValue: 1,
              duration: DURATION,
              useNativeDriver: true,
              easing: SMOOTH,
            }),
            Animated.timing(subtitleTranslateY, {
              toValue: 0,
              duration: DURATION,
              useNativeDriver: true,
              easing: SMOOTH,
            }),
          ]).start(() => {
            // 4. Form card + social buttons cascade
            Animated.parallel([
              Animated.timing(formOpacity, {
                toValue: 1,
                duration: DURATION + 80,
                useNativeDriver: true,
                easing: SMOOTH,
              }),
              Animated.timing(formTranslateY, {
                toValue: 0,
                duration: DURATION + 80,
                useNativeDriver: true,
                easing: SMOOTH_OUT,
              }),
              Animated.timing(formScale, {
                toValue: 1,
                duration: DURATION + 80,
                useNativeDriver: true,
                easing: SMOOTH,
              }),
            ]).start(() => {
              const stagger = 70;
              Animated.stagger(stagger, [
                Animated.timing(social1, {
                  toValue: 1,
                  duration: 280,
                  useNativeDriver: true,
                  easing: SMOOTH,
                }),
                Animated.timing(social2, {
                  toValue: 1,
                  duration: 280,
                  useNativeDriver: true,
                  easing: SMOOTH,
                }),
                Animated.timing(social3, {
                  toValue: 1,
                  duration: 280,
                  useNativeDriver: true,
                  easing: SMOOTH,
                }),
              ]).start();
            });
          });
        });
      });
    };
    run();
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => clearError(), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleSignUp = async () => {
    clearError();
    const result = await signUp({
      fullName,
      email,
      password,
      confirmPassword,
    });

    if (result.success) {
      login({ email: email.trim() });
    } else if (result.error?.field === "general") {
      showAlert({
        variant: "error",
        title: "Sign Up Failed",
        message: result.error.message,
      });
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/Images/SignupScreen.png")}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <LinearGradient
        colors={[
          "rgba(8, 10, 18, 0.55)",
          "rgba(8, 10, 18, 0.7)",
          "rgba(8, 10, 18, 0.78)",
          "rgba(8, 10, 18, 0.85)",
        ]}
        style={styles.backgroundOverlay}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : verticalScale(8)}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          >
            <View style={styles.hero}>
              <Animated.View
                style={[
                  styles.logoWrap,
                  {
                    opacity: logoOpacity,
                    transform: [{ scale: logoScale }],
                  },
                ]}
              >
                <Image
                  source={require("../../assets/Images/logoIzdivaaj-removebg-preview.png")}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </Animated.View>
              <Animated.Text
                style={[
                  styles.title,
                  {
                    opacity: titleOpacity,
                    transform: [{ translateY: titleTranslateY }],
                  },
                ]}
              >
                Create Account
              </Animated.Text>
              <Animated.Text
                style={[
                  styles.subtitle,
                  {
                    opacity: subtitleOpacity,
                    transform: [{ translateY: subtitleTranslateY }],
                  },
                ]}
              >
                Join us and find your perfect match
              </Animated.Text>
            </View>

            <Animated.View
              style={[
                styles.glassWrap,
                {
                  opacity: formOpacity,
                  transform: [
                    { translateY: formTranslateY },
                    { scale: formScale },
                  ],
                },
              ]}
            >
              <View style={styles.socialRow}>
                <TouchableOpacity
                  style={styles.socialGoogleBtn}
                  activeOpacity={0.7}
                  disabled={loading}
                >
                  <MaterialCommunityIcons
                    name="google"
                    size={moderateScale(22)}
                    color="#fff"
                  />
                  <Text style={styles.socialGoogleBtnText}>
                    Continue with Google
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or sign up with email</Text>
                <View style={styles.dividerLine} />
              </View>

              <TextInput
                style={[
                  styles.input,
                  error?.field === "fullName" && styles.inputError,
                ]}
                placeholder="Full Name"
                placeholderTextColor={themeSecond.textSoft}
                value={fullName}
                onChangeText={(text) => {
                  setFullName(text);
                  if (error?.field === "fullName") clearError();
                }}
                editable={!loading}
              />
              {error?.field === "fullName" && (
                <Text style={styles.errorText}>{error.message}</Text>
              )}

              <TextInput
                style={[
                  styles.input,
                  error?.field === "email" && styles.inputError,
                ]}
                placeholder="Email Address"
                placeholderTextColor={themeSecond.textSoft}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (error?.field === "email") clearError();
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />
              {error?.field === "email" && (
                <Text style={styles.errorText}>{error.message}</Text>
              )}

              <View style={styles.passwordContainer}>
                <TextInput
                  style={[
                    styles.input,
                    styles.passwordInput,
                    error?.field === "password" && styles.inputError,
                  ]}
                  placeholder="Password"
                  placeholderTextColor={themeSecond.textSoft}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (error?.field === "password") clearError();
                  }}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  editable={!loading}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={moderateScale(20)}
                    color={themeSecond.textSoft}
                  />
                </TouchableOpacity>
              </View>
              {error?.field === "password" && (
                <Text style={styles.errorText}>{error.message}</Text>
              )}

              <View style={styles.passwordContainer}>
                <TextInput
                  style={[
                    styles.input,
                    styles.passwordInput,
                    error?.field === "confirmPassword" && styles.inputError,
                  ]}
                  placeholder="Confirm Password"
                  placeholderTextColor={themeSecond.textSoft}
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (error?.field === "confirmPassword") clearError();
                  }}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  editable={!loading}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                >
                  <Ionicons
                    name={showConfirmPassword ? "eye-off" : "eye"}
                    size={moderateScale(20)}
                    color={themeSecond.textSoft}
                  />
                </TouchableOpacity>
              </View>
              {error?.field === "confirmPassword" && (
                <Text style={styles.errorText}>{error.message}</Text>
              )}

              {error?.field === "general" && (
                <Text style={styles.errorText}>{error.message}</Text>
              )}

              <Button
                title={loading ? "CREATING ACCOUNT..." : "SIGN UP"}
                onPress={handleSignUp}
                disabled={loading}
                style={styles.signUpBtn}
                textStyle={styles.signUpBtnText}
              />

              <View style={styles.loginRow}>
                <Text style={styles.loginLabel}>
                  Already have an account?{" "}
                  <Text
                    style={styles.loginLink}
                    onPress={() => navigation.navigate("Login")}
                  >
                    LOGIN
                  </Text>
                </Text>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeSecond.bgDark,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
  },
  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: moderateScale(20),
    // paddingTop: verticalScale(10),
    paddingBottom: verticalScale(40),
  },
  hero: {
    alignItems: "center",
    marginBottom: verticalScale(28),
  },
  logoWrap: {
    // marginBottom: verticalScale(16),
  },
  logo: {
    width: moderateScale(130),
    height: moderateScale(130),
  },
  title: {
    ...typography.h1,
    fontSize: moderateScale(26),
    color: themeSecond.textPrimary,
    textAlign: "center",
    letterSpacing: moderateScale(0.5),
  },
  subtitle: {
    ...typography.body,
    fontSize: moderateScale(14),
    color: themeSecond.textSoft,
    textAlign: "center",
    marginTop: verticalScale(8),
  },
  glassWrap: {
    width: "100%",
    borderRadius: moderateScale(24),
    padding: moderateScale(22),
    overflow: "hidden",
    backgroundColor: themeSecond.glassBg,
    borderWidth: moderateScale(1),
    borderColor: themeSecond.glassBorder,
    shadowColor: themeSecond.shadowBlack,
    shadowOpacity: 0.25,
    shadowRadius: moderateScale(24),
    shadowOffset: { width: 0, height: verticalScale(12) },
    elevation: moderateScale(12),
  },
  socialRow: {
    width: "100%",
    marginBottom: verticalScale(20),
  },
  socialGoogleBtn: {
    width: "100%",
    minHeight: moderateScale(52),
    borderRadius: moderateScale(14),
    backgroundColor: themeSecond.surfaceWhiteSubtle,
    borderWidth: moderateScale(1),
    borderColor: themeSecond.glassBorder,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: moderateScale(10),
    paddingHorizontal: moderateScale(14),
  },
  socialGoogleBtnText: {
    color: themeSecond.textPrimary,
    fontSize: moderateScale(15),
    fontWeight: "600",
  },
  socialIconBtn: {
    width: moderateScale(52),
    height: moderateScale(52),
    borderRadius: moderateScale(26),
    backgroundColor: themeSecond.surfaceWhiteSubtle,
    borderWidth: moderateScale(1),
    borderColor: themeSecond.glassBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(20),
    gap: moderateScale(12),
  },
  dividerLine: {
    flex: 1,
    height: verticalScale(1),
    backgroundColor: themeSecond.borderMedium,
  },
  dividerText: {
    fontSize: moderateScale(12),
    color: themeSecond.textSoft,
    fontWeight: "500",
  },
  input: {
    backgroundColor: themeSecond.surfaceWhiteSubtle,
    borderWidth: moderateScale(1),
    borderColor: themeSecond.borderLight,
    borderRadius: moderateScale(14),
    paddingHorizontal: moderateScale(18),
    paddingVertical: verticalScale(16),
    marginBottom: verticalScale(14),
    fontSize: moderateScale(16),
    color: themeSecond.textPrimary,
  },
  inputError: {
    borderColor: themeSecond.statusError,
    borderWidth: moderateScale(1.5),
  },
  errorText: {
    color: themeSecond.statusError,
    fontSize: moderateScale(12),
    marginTop: verticalScale(-8),
    marginBottom: verticalScale(10),
  },
  passwordContainer: {
    position: "relative",
  },
  passwordInput: {
    paddingRight: moderateScale(48),
  },
  eyeIcon: {
    position: "absolute",
    right: moderateScale(16),
    top: verticalScale(16),
    padding: moderateScale(4),
  },
  signUpBtn: {
    width: "100%",
    alignSelf: "stretch",
    marginTop: verticalScale(8),
    marginBottom: verticalScale(20),
    backgroundColor: themeSecond.accentPurple,
    borderRadius: moderateScale(14),
    shadowColor: themeSecond.shadowPurple,
    shadowOpacity: 0.4,
    shadowRadius: moderateScale(12),
    shadowOffset: { width: 0, height: verticalScale(4) },
    elevation: moderateScale(8),
  },
  signUpBtnText: {
    color: themeSecond.textPrimary,
    fontWeight: "700",
    letterSpacing: moderateScale(1),
  },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginLabel: {
    ...typography.bodySmall,
    color: themeSecond.textSoft,
  },
  loginLink: {
    ...typography.bodySmall,
    color: themeSecond.accentPurple,
    fontWeight: "700",
    letterSpacing: moderateScale(0.5),
  },
});

export default SignUp;
