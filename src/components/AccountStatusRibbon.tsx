/**
 * ACCOUNT STATUS RIBBON
 * =====================
 * Displays warning/danger ribbons for account status
 * Shows yellow ribbon if account is temporarily closed
 * Shows red ribbon if account deletion is requested
 * Shows both stacked if both conditions are true
 */

import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useRef } from "react";
import { typography } from "../theme/typography";
import { useAuth } from "../context/AuthContext";
import { themeSecond } from "../theme/colorSecond";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { BottomTabScreenPropsType } from "../types/navigation.types";
import { moderateScale, verticalScale } from "react-native-size-matters";

interface RibbonProps {
  message: string;
  buttonText: string;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  iconColor: string;
  iconName: string;
  buttonBackgroundColor: string;
  animationValue: Animated.Value;
}

const Ribbon: React.FC<RibbonProps> = ({
  message,
  buttonText,
  backgroundColor,
  borderColor,
  textColor,
  iconColor,
  iconName,
  buttonBackgroundColor,
  animationValue,
}) => {
  const navigation =
    useNavigation<BottomTabScreenPropsType<"Settings">["navigation"]>();

  const handleButtonPress = () => {
    navigation.navigate("Settings");
  };

  return (
    <Animated.View
      style={[
        styles.ribbon,
        {
          backgroundColor,
          borderColor,
          opacity: animationValue,
          transform: [
            {
              translateY: animationValue.interpolate({
                inputRange: [0, 1],
                outputRange: [-20, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View style={styles.ribbonContent}>
        <View style={styles.messageContainer}>
          <Ionicons
            name={iconName}
            size={moderateScale(20)}
            color={iconColor}
            style={styles.icon}
          />
          <Text style={[styles.message, { color: textColor }]}>{message}</Text>
        </View>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: buttonBackgroundColor }]}
          onPress={handleButtonPress}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>{buttonText}</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const AccountStatusRibbon: React.FC = () => {
  const { profile } = useAuth();

  // Animation values for each ribbon
  const closedAnim = useRef(new Animated.Value(0)).current;
  const deletionAnim = useRef(new Animated.Value(0)).current;

  const isClosed = profile?.isAccountTemporaryClosed === true;
  const isDeletionRequested = profile?.isAccountRequestToDelete === true;

  // Animate closed ribbon
  useEffect(() => {
    Animated.timing(closedAnim, {
      toValue: isClosed ? 1 : 0,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, [isClosed, closedAnim]);

  // Animate deletion ribbon
  useEffect(() => {
    Animated.timing(deletionAnim, {
      toValue: isDeletionRequested ? 1 : 0,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, [isDeletionRequested, deletionAnim]);

  // Don't render anything if neither condition is true
  if (!isClosed && !isDeletionRequested) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Yellow Ribbon - Temporarily Closed (shown first) */}
      {isClosed && (
        <Ribbon
          message="Your profile is temporarily closed"
          buttonText="Open Account"
          backgroundColor="#FEF3C7"
          borderColor="#FDE68A"
          textColor="#92400E"
          iconColor="#F59E0B"
          iconName="warning-outline"
          buttonBackgroundColor="#F59E0B"
          animationValue={closedAnim}
        />
      )}

      {/* Red Ribbon - Account Deletion (shown second) */}
      {isDeletionRequested && (
        <Ribbon
          message="Your account will be deleted at any moment. If you want to continue, please reverse the deletion"
          buttonText="Reverse Deletion"
          backgroundColor="#FEE2E2"
          borderColor="#FECACA"
          textColor="#991B1B"
          iconColor={themeSecond.statusError}
          iconName="alert-circle-outline"
          buttonBackgroundColor={themeSecond.statusError}
          animationValue={deletionAnim}
        />
      )}
    </View>
  );
};

export default AccountStatusRibbon;

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  ribbon: {
    borderBottomWidth: 1,
    paddingVertical: verticalScale(12),
    paddingHorizontal: moderateScale(16),
  },
  ribbonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: moderateScale(8),
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    flexShrink: 1,
  },
  icon: {
    marginRight: moderateScale(8),
  },
  message: {
    ...typography.bodySmall,
    flex: 1,
    flexShrink: 1,
    lineHeight: moderateScale(18),
  },
  button: {
    paddingHorizontal: moderateScale(16),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(8),
    minWidth: moderateScale(100),
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    ...typography.bodySmall,
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
