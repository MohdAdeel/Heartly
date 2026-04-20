import React from 'react';
import { themeSecond } from '../theme/colorSecond';
import { ConnectionError } from '../context/AuthContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';

interface ConnectionIssueScreenProps {
  onRetry: () => Promise<void>;
  error: ConnectionError;
}

const ConnectionIssueScreen: React.FC<ConnectionIssueScreenProps> = ({
  onRetry,
  error,
}) => {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        <View style={styles.iconWrapper}>
          <View style={styles.iconInner}>
            <Ionicons
              name="cloud-offline"
              size={moderateScale(48)}
              color={themeSecond.accentPurple}
            />
          </View>
        </View>
        <Text style={styles.title}>Connection Unavailable</Text>
        <Text style={styles.subtitle}>
          We could not reach the servers. Check your connection or try again in
          a moment.
        </Text>
        <View style={styles.errorCard}>
          <Text style={styles.errorLabel}>Error details</Text>
          <Text style={styles.errorMessage}>{error.message}</Text>
          <Text style={styles.errorCode}>
            Status: {error.status ?? 'Unknown'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={onRetry}
          activeOpacity={0.85}
        >
          <Ionicons
            name="refresh"
            size={moderateScale(20)}
            color={themeSecond.textPrimary}
            style={styles.retryIcon}
          />
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeSecond.bgDark,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: moderateScale(24),
  },
  iconWrapper: {
    width: moderateScale(140),
    height: moderateScale(140),
    borderRadius: moderateScale(70),
    padding: moderateScale(3),
    backgroundColor: themeSecond.avatarRingBg,
    borderWidth: moderateScale(1.5),
    borderColor: themeSecond.accentPurpleMedium,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(24),
    shadowColor: themeSecond.shadowPurple,
    shadowOpacity: 0.35,
    shadowRadius: moderateScale(16),
    shadowOffset: { width: 0, height: 0 },
    elevation: moderateScale(12),
  },
  iconInner: {
    width: '100%',
    height: '100%',
    borderRadius: moderateScale(70),
    backgroundColor: themeSecond.accentPurpleLight,
    borderWidth: moderateScale(1),
    borderColor: themeSecond.accentPurpleMedium,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: moderateScale(22),
    fontWeight: '700',
    color: themeSecond.textPrimary,
    textAlign: 'center',
    marginBottom: verticalScale(10),
  },
  subtitle: {
    fontSize: moderateScale(14),
    color: themeSecond.textMuted,
    textAlign: 'center',
    lineHeight: moderateScale(22),
    marginBottom: verticalScale(20),
    paddingHorizontal: moderateScale(8),
  },
  errorCard: {
    width: '100%',
    marginBottom: verticalScale(24),
    padding: moderateScale(16),
    backgroundColor: themeSecond.surfaceCard,
    borderRadius: moderateScale(16),
    borderWidth: moderateScale(1),
    borderColor: themeSecond.borderLight,
    borderLeftWidth: moderateScale(3),
    borderLeftColor: themeSecond.statusError,
  },
  errorLabel: {
    fontSize: moderateScale(12),
    fontWeight: '600',
    color: themeSecond.statusError,
    marginBottom: verticalScale(6),
    textTransform: 'uppercase',
    letterSpacing: moderateScale(0.5),
  },
  errorMessage: {
    fontSize: moderateScale(13),
    color: themeSecond.textPrimary,
    marginBottom: verticalScale(4),
  },
  errorCode: {
    fontSize: moderateScale(12),
    color: themeSecond.textSoft,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: themeSecond.primaryActionPurple,
    borderRadius: moderateScale(16),
    paddingVertical: verticalScale(14),
    paddingHorizontal: moderateScale(32),
    minWidth: moderateScale(160),
    borderWidth: moderateScale(1),
    borderColor: themeSecond.accentPurpleMedium,
    shadowColor: themeSecond.shadowPurple,
    shadowOpacity: 0.5,
    shadowRadius: moderateScale(12),
    shadowOffset: { width: 0, height: verticalScale(4) },
    elevation: moderateScale(8),
  },
  retryIcon: {
    marginRight: moderateScale(8),
  },
  retryText: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: themeSecond.textPrimary,
  },
});

export default ConnectionIssueScreen;
