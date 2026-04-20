import {
  View,
  Text,
  ViewStyle,
  TextStyle,
  Pressable,
  StyleSheet,
} from "react-native";
import React from "react";
import { typography } from "../theme/typography";
import { themeSecond } from "../theme/colorSecond";
import Ionicons from "react-native-vector-icons/Ionicons";
import { moderateScale } from "react-native-size-matters";

interface ButtonProps {
  title: string;
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  iconName?: string;
  iconColor?: string;
  inverted?: boolean;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  iconName,
  iconColor: iconColorProp,
  inverted = false,
  disabled = false,
}) => {
  const defaultIconColor = inverted
    ? themeSecond.primaryActionPurple
    : "#FFFFFF";
  const iconColor = iconColorProp ?? defaultIconColor;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, inverted && styles.invertedButton, style]}
    >
      <View style={styles.content}>
        {iconName && <Ionicons name={iconName} size={20} color={iconColor} />}
        <Text style={[styles.text, inverted && styles.invertedText, textStyle]}>
          {title}
        </Text>
      </View>
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    backgroundColor: themeSecond.primaryActionPurple,
    borderRadius: moderateScale(12),
    paddingVertical: moderateScale(16),
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  invertedButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: moderateScale(2),
    borderColor: themeSecond.primaryActionPurple,
  },
  text: {
    ...typography.button,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  invertedText: {
    color: themeSecond.primaryActionPurple,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: moderateScale(10),
  },
});
