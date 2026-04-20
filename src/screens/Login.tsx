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
} from 'react-native';
import Button from '../components/Button';
import { useSignIn } from '../hooks/useSignIn';
import { useAlerts } from '../components/Alert';
import { typography } from '../theme/typography';
import { useAuth } from '../context/AuthContext';
import { themeSecond } from '../theme/colorSecond';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthStackScreenProps } from '../types/navigation.types';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ANIM_DURATION = 600;
const SMOOTH = Easing.bezier(0.25, 0.1, 0.25, 1);

const Login = () => {
  const { login } = useAuth();
  const { signIn, loading, error, clearError } = useSignIn();
  const { showAlert } = useAlerts();
  const navigation =
    useNavigation<AuthStackScreenProps<'Login'>['navigation']>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Entrance animations
  const logoScale = useRef(new Animated.Value(0.88)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const heroOpacity = useRef(new Animated.Value(0)).current;
  const heroTranslateY = useRef(new Animated.Value(verticalScale(30))).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleTranslateY = useRef(
    new Animated.Value(verticalScale(24)),
  ).current;
  const formOpacity = useRef(new Animated.Value(0)).current;
  const formTranslateY = useRef(new Animated.Value(verticalScale(50))).current;
  const formScale = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    const runEntrance = () => {
      // 1. Logo: fade in then gentle scale spring
      Animated.sequence([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: ANIM_DURATION * 0.5,
          useNativeDriver: true,
          easing: SMOOTH,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 7,
          tension: 60,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // 2. Title: fade + slide up
        Animated.parallel([
          Animated.timing(heroOpacity, {
            toValue: 1,
            duration: ANIM_DURATION,
            useNativeDriver: true,
            easing: SMOOTH,
          }),
          Animated.timing(heroTranslateY, {
            toValue: 0,
            duration: ANIM_DURATION,
            useNativeDriver: true,
            easing: SMOOTH,
          }),
        ]).start(() => {
          // 3. Subtitle: fade + slide up
          Animated.parallel([
            Animated.timing(subtitleOpacity, {
              toValue: 1,
              duration: ANIM_DURATION,
              useNativeDriver: true,
              easing: SMOOTH,
            }),
            Animated.timing(subtitleTranslateY, {
              toValue: 0,
              duration: ANIM_DURATION,
              useNativeDriver: true,
              easing: SMOOTH,
            }),
          ]).start(() => {
            // 4. Form: slide up + fade + scale
            Animated.parallel([
              Animated.timing(formOpacity, {
                toValue: 1,
                duration: ANIM_DURATION + 100,
                useNativeDriver: true,
                easing: SMOOTH,
              }),
              Animated.timing(formTranslateY, {
                toValue: 0,
                duration: ANIM_DURATION + 100,
                useNativeDriver: true,
                easing: Easing.out(Easing.cubic),
              }),
              Animated.timing(formScale, {
                toValue: 1,
                duration: ANIM_DURATION + 100,
                useNativeDriver: true,

                easing: SMOOTH,
              }),
            ]).start();
          });
        });
      });
    };
    runEntrance();
  }, [
    formOpacity,
    formScale,
    formTranslateY,
    heroOpacity,
    heroTranslateY,
    logoOpacity,
    logoScale,
    subtitleOpacity,
    subtitleTranslateY,
  ]);

  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [clearError, email, error, password]);

  const handleLogin = async () => {
    clearError();
    if (!email.trim() || !password.trim()) {
      showAlert({
        variant: 'error',
        title: 'Missing info',
        message: 'Please enter both email and password.',
        autoHideMs: 2000,
      });
      return;
    }
    const result = await signIn({
      email: email.trim(),
      password: password,
    });
    if (result.success) {
      login({ email: email.trim() });
    } else if (result.error) {
      showAlert({
        variant: 'error',
        title: 'Sign In Failed',
        message: result.error.message,
      });
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/Images/coupleVerticalSignIn.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <LinearGradient
        colors={[
          'rgba(8, 10, 18, 0.55)',
          'rgba(8, 10, 18, 0.7)',
          'rgba(8, 10, 18, 0.78)',
          'rgba(8, 10, 18, 0.85)',
        ]}
        style={styles.backgroundOverlay}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : verticalScale(8)}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          >
            {/* Hero: logo + headline */}
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
                  source={require('../../assets/Images/logoIzdivaaj-removebg-preview.png')}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </Animated.View>
              <Animated.Text
                style={[
                  styles.title,
                  {
                    opacity: heroOpacity,
                    transform: [{ translateY: heroTranslateY }],
                  },
                ]}
              >
                Sign In to Your Account
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
                Sign in to find your perfect match
              </Animated.Text>
            </View>

            {/* Glass form panel (same idea as ProfileSecond glassWrap) */}
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
                {/* <TouchableOpacity
                  style={styles.socialIconBtn}
                  activeOpacity={0.7}
                  onPress={() => {}}
                >
                  <MaterialCommunityIcons
                    name="facebook"
                    size={moderateScale(28)}
                    color="#1877F2"
                  />
                </TouchableOpacity> */}
                {/* <TouchableOpacity
                  style={styles.socialIconBtn}
                  activeOpacity={0.7}
                  onPress={handleXSignIn}
                  disabled={googleLoading || xLoading || loading}
                >
                  <MaterialCommunityIcons
                    name="close-thick"
                    size={moderateScale(28)}
                    color="#000000"
                  />
                </TouchableOpacity> */}
              </View>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or sign in with email</Text>
                <View style={styles.dividerLine} />
              </View>

              <TextInput
                style={[
                  styles.input,
                  error?.field === 'email' && styles.inputError,
                ]}
                placeholder="Email Address"
                placeholderTextColor={themeSecond.textSoft}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
              {error?.field === 'email' && (
                <Text style={styles.errorText}>{error.message}</Text>
              )}

              <View style={styles.passwordContainer}>
                <TextInput
                  style={[
                    styles.input,
                    styles.passwordInput,
                    error?.field === 'password' && styles.inputError,
                  ]}
                  placeholder="Password"
                  placeholderTextColor={themeSecond.textSoft}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={moderateScale(20)}
                    color={themeSecond.textSoft}
                  />
                </TouchableOpacity>
              </View>
              {error?.field === 'password' && (
                <Text style={styles.errorText}>{error.message}</Text>
              )}
              {error?.field === 'general' && (
                <Text style={styles.errorText}>{error.message}</Text>
              )}

              <Button
                title={loading ? 'SIGNING IN...' : 'LOGIN'}
                onPress={handleLogin}
                disabled={loading}
                style={styles.loginBtn}
                textStyle={styles.loginBtnText}
              />

              <View style={styles.signupRow}>
                <Text style={styles.signupLabel}>
                  Don't have an account?{' '}
                  <Text
                    style={styles.signupLink}
                    onPress={() => navigation.navigate('SignUp')}
                  >
                    SIGN UP
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
    // paddingTop: verticalScale(15),
    paddingBottom: verticalScale(40),
  },
  hero: {
    alignItems: 'center',
    marginBottom: verticalScale(28),
  },
  logoWrap: {
    // marginBottom: verticalScale(16),
  },
  logo: {
    width: moderateScale(150),
    height: moderateScale(150),
  },
  title: {
    ...typography.h1,
    fontSize: moderateScale(26),
    color: themeSecond.textPrimary,
    textAlign: 'center',
    letterSpacing: moderateScale(0.5),
  },
  subtitle: {
    ...typography.body,
    fontSize: moderateScale(14),
    color: themeSecond.textSoft,
    textAlign: 'center',
    marginTop: verticalScale(8),
  },
  glassWrap: {
    width: '100%',
    borderRadius: moderateScale(24),
    padding: moderateScale(22),
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
  socialRow: {
    width: '100%',
    marginBottom: verticalScale(20),
  },
  socialGoogleBtn: {
    width: '100%',
    minHeight: moderateScale(52),
    borderRadius: moderateScale(14),
    backgroundColor: themeSecond.surfaceWhiteSubtle,
    borderWidth: moderateScale(1),
    borderColor: themeSecond.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: moderateScale(10),
    paddingHorizontal: moderateScale(14),
  },
  socialGoogleBtnText: {
    color: themeSecond.textPrimary,
    fontSize: moderateScale(15),
    fontWeight: '600',
  },
  socialIconBtn: {
    width: moderateScale(52),
    height: moderateScale(52),
    borderRadius: moderateScale(26),
    backgroundColor: themeSecond.surfaceWhiteSubtle,
    borderWidth: moderateScale(1),
    borderColor: themeSecond.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontWeight: '500',
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
    position: 'relative',
    marginBottom: verticalScale(14),
  },
  passwordInput: {
    paddingRight: moderateScale(48),
  },
  eyeIcon: {
    position: 'absolute',
    right: moderateScale(16),
    top: verticalScale(16),
    padding: moderateScale(4),
  },
  loginBtn: {
    width: '100%',
    alignSelf: 'stretch',
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
  loginBtnText: {
    color: themeSecond.textPrimary,
    fontWeight: '700',
    letterSpacing: moderateScale(1),
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupLabel: {
    ...typography.bodySmall,
    color: themeSecond.textSoft,
  },
  signupLink: {
    ...typography.bodySmall,
    color: themeSecond.accentPurple,
    fontWeight: '700',
    letterSpacing: moderateScale(0.5),
  },
});

export default Login;
