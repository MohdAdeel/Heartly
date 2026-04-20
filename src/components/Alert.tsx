import {
  Text,
  View,
  Modal,
  Animated,
  Pressable,
  StyleSheet,
} from "react-native";
import React, {
  useRef,
  useMemo,
  useState,
  useEffect,
  useContext,
  useCallback,
  createContext,
} from "react";
import { typography } from "../theme/typography";
import { themeSecond } from "../theme/colorSecond";
import Ionicons from "react-native-vector-icons/Ionicons";
import { moderateScale, verticalScale } from "react-native-size-matters";

type AlertVariant = "success" | "error" | "warning" | "info";
type AlertActionStyle = "default" | "cancel" | "destructive";

export type AlertAction = {
  label: string;
  onPress?: () => void;
  style?: AlertActionStyle;
};

export type AlertConfig = {
  variant?: AlertVariant;
  title: string;
  message?: string;
  dismissOnBackdropPress?: boolean;
  actions?: AlertAction[];
  autoHideMs?: number;
};

type AlertsContextValue = {
  showAlert: (config: AlertConfig) => void;
  hideAlert: () => void;
};

const AlertsContext = createContext<AlertsContextValue | undefined>(undefined);

const getVariantTheme = (variant: AlertVariant) => {
  switch (variant) {
    case "success":
      return {
        color: themeSecond.statusSuccess,
        icon: "checkmark-circle" as const,
        glow: "rgba(34, 197, 94, 0.25)",
      };
    case "error":
      return {
        color: themeSecond.statusError,
        icon: "alert-circle" as const,
        glow: "rgba(231, 76, 60, 0.25)",
      };
    case "warning":
      return {
        color: themeSecond.statusWarning,
        icon: "warning" as const,
        glow: "rgba(243, 156, 18, 0.25)",
      };
    case "info":
    default:
      return {
        color: themeSecond.optionBlue,
        icon: "information-circle" as const,
        glow: "rgba(52, 152, 219, 0.25)",
      };
  }
};

const getActionStyle = (style?: AlertActionStyle) => {
  switch (style) {
    case "destructive":
      return {
        color: themeSecond.statusError,
        bg: themeSecond.surfaceWhiteSubtle,
        border: "rgba(231, 76, 60, 0.4)",
      };
    case "cancel":
      return {
        color: themeSecond.textSoft,
        bg: themeSecond.surfaceWhiteSubtle,
        border: themeSecond.glassBorder,
      };
    case "default":
    default:
      return {
        color: themeSecond.textPrimary,
        bg: themeSecond.accentPurpleLight,
        border: themeSecond.accentPurpleMedium,
      };
  }
};

const AlertModal = ({
  alert,
  visible,
  onRequestClose,
  onHidden,
}: {
  alert: AlertConfig | null;
  visible: boolean;
  onRequestClose: () => void;
  onHidden: () => void;
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    if (!alert) {
      return;
    }

    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 240,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 75,
          useNativeDriver: true,
        }),
      ]).start();
      return;
    }

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 160,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 160,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHidden();
    });
  }, [alert, fadeAnim, onHidden, scaleAnim, visible]);

  if (!alert) {
    return null;
  }

  const theme = getVariantTheme(alert.variant ?? "info");
  const { color, icon, glow } = theme;
  const actions =
    alert.actions && alert.actions.length > 0
      ? alert.actions
      : [{ label: "OK", style: "default" as const }];

  return (
    <Modal
      animationType="none"
      transparent
      visible={visible || !!alert}
      statusBarTranslucent
      onRequestClose={onRequestClose}
    >
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <Pressable
          style={styles.backdrop}
          onPress={
            alert.dismissOnBackdropPress === false ? undefined : onRequestClose
          }
        />
        <Animated.View
          style={[
            styles.glassPanel,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.glassInner}>
            <View style={[styles.iconWrap, { backgroundColor: glow }]}>
              <Ionicons name={icon} size={moderateScale(32)} color={color} />
            </View>
            <Text style={styles.title}>{alert.title}</Text>
            {!!alert.message && (
              <Text style={styles.message}>{alert.message}</Text>
            )}
            <View style={styles.actionsRow}>
              {actions.map((action, index) => {
                const actionStyle = getActionStyle(action.style);
                return (
                  <Pressable
                    key={`${action.label}-${index}`}
                    style={[
                      styles.actionButton,
                      {
                        backgroundColor: actionStyle.bg,
                        borderColor: actionStyle.border,
                      },
                    ]}
                    onPress={() => {
                      onRequestClose();
                      if (action.onPress) {
                        setTimeout(() => action.onPress?.(), 160);
                      }
                    }}
                  >
                    <Text
                      style={[styles.actionText, { color: actionStyle.color }]}
                    >
                      {action.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export const AlertsProvider = ({ children }: { children: React.ReactNode }) => {
  const [alert, setAlert] = useState<AlertConfig | null>(null);
  const [visible, setVisible] = useState(false);
  const autoHideRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hideAlert = useCallback(() => {
    setVisible(false);
  }, []);

  const showAlert = useCallback((config: AlertConfig) => {
    if (autoHideRef.current) {
      clearTimeout(autoHideRef.current);
    }
    setAlert({
      ...config,
      variant: config.variant ?? "info",
      dismissOnBackdropPress: config.dismissOnBackdropPress ?? true,
    });
    setVisible(true);
  }, []);

  useEffect(() => {
    if (!visible || !alert?.autoHideMs) {
      return;
    }
    autoHideRef.current = setTimeout(() => {
      setVisible(false);
    }, alert.autoHideMs);
    return () => {
      if (autoHideRef.current) {
        clearTimeout(autoHideRef.current);
      }
    };
  }, [alert?.autoHideMs, visible]);

  const contextValue = useMemo(
    () => ({
      showAlert,
      hideAlert,
    }),
    [hideAlert, showAlert]
  );

  return (
    <AlertsContext.Provider value={contextValue}>
      {children}
      <AlertModal
        alert={alert}
        visible={visible}
        onRequestClose={hideAlert}
        onHidden={() => setAlert(null)}
      />
    </AlertsContext.Provider>
  );
};

export const useAlerts = () => {
  const context = useContext(AlertsContext);
  if (!context) {
    throw new Error("useAlerts must be used within AlertsProvider");
  }
  return context;
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: themeSecond.overlayBlack,
    padding: moderateScale(20),
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  glassPanel: {
    width: "100%",
    maxWidth: moderateScale(360),
    borderRadius: moderateScale(24),
    overflow: "hidden",
    backgroundColor: themeSecond.glassBg,
    borderWidth: 1,
    borderColor: themeSecond.glassBorder,
    shadowColor: themeSecond.shadowBlack,
    shadowOpacity: 0.25,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  glassInner: {
    paddingHorizontal: moderateScale(24),
    paddingVertical: verticalScale(26),
    alignItems: "center",
  },
  iconWrap: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(30),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: verticalScale(16),
  },
  title: {
    ...typography.h3,
    fontSize: moderateScale(20),
    textAlign: "center",
    color: themeSecond.textPrimary,
    fontWeight: "700",
    marginBottom: verticalScale(8),
  },
  message: {
    ...typography.bodySmall,
    fontSize: moderateScale(14),
    textAlign: "center",
    color: themeSecond.textSoft,
    marginBottom: verticalScale(20),
    lineHeight: moderateScale(20),
  },
  actionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: moderateScale(12),
    justifyContent: "center",
  },
  actionButton: {
    paddingHorizontal: moderateScale(20),
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(14),
    minWidth: moderateScale(100),
    alignItems: "center",
    borderWidth: 1,
  },
  actionText: {
    ...typography.bodyMedium,
    fontWeight: "600",
  },
});
