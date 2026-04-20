import React from "react";
import { themeSecond } from "../theme/colorSecond";
import Ionicons from "react-native-vector-icons/Ionicons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { moderateScale, verticalScale } from "react-native-size-matters";

interface InfoItemProps {
  icon: string;
  label: string;
  value: string;
  onPress?: () => void;
  hasError?: boolean;
}

const InfoItem: React.FC<InfoItemProps> = ({
  icon,
  label,
  value,
  onPress,
  hasError = false,
}) => (
  <View style={styles.container}>
    <Text style={styles.label}>{label}</Text>

    <TouchableOpacity
      style={[styles.inputContainer, hasError && styles.inputContainerError]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons
        name={icon}
        size={moderateScale(20)}
        color={themeSecond.accentPurple}
        style={styles.leftIcon}
      />

      <Text style={styles.value}>{value}</Text>

      <Ionicons
        name="chevron-forward"
        size={moderateScale(20)}
        color={themeSecond.textSoft}
        style={styles.rightIcon}
      />
    </TouchableOpacity>
  </View>
);

export default InfoItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeSecond.bgDark,
  },
  label: {
    color: themeSecond.textPrimary,
    fontSize: moderateScale(14),
    marginTop: verticalScale(12),
    marginBottom: moderateScale(4),
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: moderateScale(16),
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(22),
    borderColor: themeSecond.borderLight,
    borderWidth: 1,
  },
  inputContainerError: {
    borderColor: "#FF3B30",
    borderWidth: 1.5,
  },
  leftIcon: {
    marginLeft: moderateScale(6),
    marginRight: moderateScale(15),
  },
  value: {
    flex: 1,
    fontSize: moderateScale(16),
    color: themeSecond.textPrimary,
  },
  rightIcon: {
    marginLeft: moderateScale(8),
  },
});
