import { fonts } from "./fonts";
import { themeSecond } from "./colorSecond";
import { moderateScale } from "react-native-size-matters";

export const typography = {
  h1: {
    fontFamily: fonts.regular,
    fontSize: moderateScale(30),
    color: themeSecond.textPrimary,
  },
  h2: {
    fontFamily: fonts.regular,
    fontSize: moderateScale(24),
    color: themeSecond.textPrimary,
  },
  h3: {
    fontFamily: fonts.regular,
    fontSize: moderateScale(20),
    color: themeSecond.textPrimary,
  },
  body: {
    fontFamily: fonts.regular,
    fontSize: moderateScale(18),
    color: themeSecond.textPrimary,
  },
  bodyMedium: {
    fontFamily: fonts.medium,
    fontSize: moderateScale(16),
    color: themeSecond.textPrimary,
  },
  caption: {
    fontFamily: fonts.regular,
    fontSize: moderateScale(12),
    color: themeSecond.textSoft,
  },
  bodySmall: {
    fontFamily: fonts.regular,
    fontSize: moderateScale(14),
    color: themeSecond.textPrimary,
  },
  button: {
    fontFamily: fonts.medium,
    fontSize: moderateScale(16),
  },
  secButton: {
    fontSize: moderateScale(20),
    fontFamily: fonts.bold,
    color: themeSecond.textPrimary,
  },
};
