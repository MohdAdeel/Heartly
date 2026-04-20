import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import { fonts } from '../theme/fonts';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale, verticalScale } from 'react-native-size-matters';

const AboutUs = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={['#090714', '#0B0818', '#0C0919']}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.bgGlowTop} />
      <View style={styles.bgGlowRight} />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="chevron-back"
            size={moderateScale(20)}
            color="#F8F5FF"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About Us</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.heroWrap}>
          <View style={styles.heroIconOuter}>
            <View style={styles.heroIconInner}>
              <Image
                source={require('../../assets/Images/logoIzdivaaj-removebg-preview.png')}
                style={styles.heroAppIcon}
                resizeMode="contain"
              />
            </View>
          </View>
          <Text style={styles.brandTitle}>Izdivaaj</Text>
          <Text style={styles.brandSubTitle}>Find Your Perfect Match</Text>
        </View>

        <View style={styles.storyCard}>
          <View style={styles.rowTitle}>
            <Ionicons name="book" size={moderateScale(15)} color="#B56CFF" />
            <Text style={styles.rowTitleText}>Our Story</Text>
          </View>
          <Text style={styles.storyText}>
            Born from the idea that true connections go beyond surface level. We
            built Aura to match energies, passions, and life goals. It’s not
            just about swiping; it’s about finding someone who resonates with
            your frequency in a world full of noise.
          </Text>
        </View>

        <View style={styles.twoColRow}>
          <View style={styles.smallCard}>
            <View style={styles.smallIconPurple}>
              <Ionicons
                name="compass"
                size={moderateScale(14)}
                color="#B56CFF"
              />
            </View>
            <Text style={styles.smallTitle}>Mission</Text>
            <Text style={styles.smallText}>
              To foster genuine, deep connections through intelligent,
              vibe-based matching.
            </Text>
          </View>
          <View style={styles.smallCard}>
            <View style={styles.smallIconBlue}>
              <Ionicons name="eye" size={moderateScale(14)} color="#38BDF8" />
            </View>
            <Text style={styles.smallTitle}>Vision</Text>
            <Text style={styles.smallText}>
              A world where every swipe leads to a meaningful conversation and
              lasting bond.
            </Text>
          </View>
        </View>

        <View style={styles.valuesCard}>
          <View style={styles.rowTitle}>
            <Ionicons name="star" size={moderateScale(14)} color="#B56CFF" />
            <Text style={styles.rowTitleText}>Core Values</Text>
          </View>
          <View style={styles.valueItem}>
            <View style={styles.valueIconGreen}>
              <Ionicons
                name="shield-checkmark"
                size={moderateScale(14)}
                color="#22C55E"
              />
            </View>
            <View>
              <Text style={styles.valueTitle}>Authenticity First</Text>
              <Text style={styles.valueSub}>
                Verified profiles and real intentions.
              </Text>
            </View>
          </View>
          <View style={styles.valueItem}>
            <View style={styles.valueIconRed}>
              <Ionicons
                name="lock-closed"
                size={moderateScale(14)}
                color="#EF4444"
              />
            </View>
            <View>
              <Text style={styles.valueTitle}>Privacy & Safety</Text>
              <Text style={styles.valueSub}>
                Your data is encrypted and protected.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.ctaCard}>
          <LinearGradient
            colors={['rgba(255, 153, 51, 0.28)', 'rgba(168, 85, 247, 0.28)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <Text style={styles.ctaTopText}>READY TO FIND YOUR MATCH?</Text>
          <TouchableOpacity activeOpacity={0.9} style={styles.ctaButton}>
            <LinearGradient
              colors={['#B05BFF', '#8E3DFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.ctaButtonGradient}
            >
              <Text style={styles.ctaButtonText}>Join The Community</Text>
              <Ionicons
                name="arrow-forward"
                size={moderateScale(15)}
                color="#FFFFFF"
              />
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
  bgGlowTop: {
    position: 'absolute',
    top: verticalScale(76),
    left: -moderateScale(36),
    width: moderateScale(128),
    height: moderateScale(62),
    borderRadius: moderateScale(60),
    backgroundColor: 'rgba(156, 81, 255, 0.15)',
  },
  bgGlowRight: {
    position: 'absolute',
    top: verticalScale(448),
    right: -moderateScale(48),
    width: moderateScale(132),
    height: moderateScale(132),
    borderRadius: moderateScale(66),
    backgroundColor: 'rgba(144, 64, 255, 0.17)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(14),
    paddingVertical: verticalScale(10),
    backgroundColor: 'rgba(13, 10, 29, 0.95)',
    borderBottomLeftRadius: moderateScale(14),
    borderBottomRightRadius: moderateScale(14),
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  headerButton: {
    width: moderateScale(26),
    height: moderateScale(26),
    borderRadius: moderateScale(13),
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'rgba(255, 255, 255, 0.12)',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  headerTitle: {
    color: '#F8F5FF',
    fontFamily: fonts.semiBold,
    fontSize: moderateScale(16),
  },
  headerPlaceholder: {
    width: moderateScale(26),
    height: moderateScale(26),
  },
  scrollContent: {
    paddingHorizontal: moderateScale(12),
    paddingTop: verticalScale(14),
    paddingBottom: verticalScale(24),
  },
  heroWrap: {
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  heroIconOuter: {
    width: moderateScale(88),
    height: moderateScale(88),
    borderRadius: moderateScale(44),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(168, 85, 247, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.35)',
  },
  heroIconInner: {
    width: moderateScale(64),
    height: moderateScale(64),
    borderRadius: moderateScale(32),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(51, 27, 81, 0.9)',
  },
  heroAppIcon: {
    width: moderateScale(78),
    height: moderateScale(78),
  },
  brandTitle: {
    marginTop: verticalScale(10),
    color: '#F3EEFF',
    fontSize: moderateScale(32),
    lineHeight: verticalScale(45),
    fontFamily: fonts.regular,
    textAlign: 'center',
  },
  brandSubTitle: {
    marginTop: verticalScale(4),
    color: '#BFB8D3',
    fontSize: moderateScale(11),
    letterSpacing: 0.5,
    fontFamily: fonts.medium,
  },
  storyCard: {
    borderRadius: moderateScale(14),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    backgroundColor: 'rgba(16, 15, 31, 0.9)',
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(12),
    marginBottom: verticalScale(10),
  },
  rowTitle: {
    // flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  rowTitleText: {
    marginLeft: moderateScale(7),
    color: '#F4F0FC',
    fontSize: moderateScale(18),
    fontFamily: fonts.semiBold,
  },
  storyText: {
    color: '#C6BFD8',
    fontSize: moderateScale(11.4),
    lineHeight: verticalScale(17),
    fontFamily: fonts.regular,
  },
  twoColRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(10),
  },
  smallCard: {
    width: '48.5%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: moderateScale(12),
    backgroundColor: 'rgba(16, 15, 31, 0.9)',
    paddingHorizontal: moderateScale(10),
    paddingVertical: verticalScale(11),
  },
  smallIconPurple: {
    width: moderateScale(22),
    height: moderateScale(22),
    borderRadius: moderateScale(11),
    backgroundColor: 'rgba(168, 85, 247, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(8),
  },
  smallIconBlue: {
    width: moderateScale(22),
    height: moderateScale(22),
    borderRadius: moderateScale(11),
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(8),
  },
  smallTitle: {
    color: '#F4F0FC',
    fontSize: moderateScale(13),
    fontFamily: fonts.semiBold,
    marginBottom: verticalScale(4),
  },
  smallText: {
    color: '#9B94AF',
    fontSize: moderateScale(10.6),
    lineHeight: verticalScale(14.5),
    fontFamily: fonts.regular,
  },
  valuesCard: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: moderateScale(14),
    backgroundColor: 'rgba(16, 15, 31, 0.9)',
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(12),
    marginBottom: verticalScale(12),
  },
  valueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: moderateScale(10),
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    paddingHorizontal: moderateScale(10),
    paddingVertical: verticalScale(8),
    marginBottom: verticalScale(8),
  },
  valueIconGreen: {
    width: moderateScale(22),
    height: moderateScale(22),
    borderRadius: moderateScale(11),
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: moderateScale(9),
  },
  valueIconRed: {
    width: moderateScale(22),
    height: moderateScale(22),
    borderRadius: moderateScale(11),
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: moderateScale(9),
  },
  valueTitle: {
    color: '#EFEAFB',
    fontSize: moderateScale(11.6),
    fontFamily: fonts.semiBold,
  },
  valueSub: {
    marginTop: verticalScale(1),
    color: '#A49DB7',
    fontSize: moderateScale(10.2),
    fontFamily: fonts.regular,
  },
  ctaCard: {
    overflow: 'hidden',
    borderRadius: moderateScale(14),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(22, 14, 39, 0.95)',
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(12),
  },
  ctaTopText: {
    color: '#CAB6EA',
    fontSize: moderateScale(10.3),
    letterSpacing: 0.5,
    textAlign: 'center',
    fontFamily: fonts.medium,
  },
  ctaButton: {
    marginTop: verticalScale(10),
    borderRadius: moderateScale(10),
    overflow: 'hidden',
  },
  ctaButtonGradient: {
    paddingVertical: verticalScale(10),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: moderateScale(6),
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: moderateScale(12.8),
    fontFamily: fonts.semiBold,
  },
});

export default AboutUs;
