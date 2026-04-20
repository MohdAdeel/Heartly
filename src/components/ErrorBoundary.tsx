/**
 * ERROR BOUNDARY COMPONENT
 * ========================
 * Catches JavaScript errors in child components and displays a fallback UI.
 *
 * WHAT IT CATCHES:
 * - Errors during rendering
 * - Errors in lifecycle methods
 * - Errors in constructors
 *
 * WHAT IT DOES NOT CATCH:
 * - Event handlers (use try-catch)
 * - Async code (use try-catch)
 * - Server-side errors
 *
 * USAGE:
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 */

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { typography } from "../theme/typography";
import { themeSecond } from "../theme/colorSecond";
import React, { Component, ReactNode } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import { moderateScale, verticalScale } from "react-native-size-matters";

// ============================================
// TYPES
// ============================================

interface Props {
  children: ReactNode;
  /** Optional: Name of the screen/component being wrapped */
  screenName?: string;
  /** Optional: Custom fallback component */
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

// ============================================
// ERROR BOUNDARY CLASS
// ============================================

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  /**
   * Called when an error is thrown
   * Updates state to trigger fallback UI
   */
  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  /**
   * Called after an error is caught
   * Perfect for logging errors
   */
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Store error info for display
    this.setState({ errorInfo });

    console.error("ErrorBoundary caught an error", {
      error,
      screen: this.props.screenName,
      componentStack: errorInfo.componentStack,
    });
  }

  /**
   * Reset error state to try rendering again
   */
  handleRetry = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  /**
   * Render fallback UI when error occurs
   */
  renderFallback(): ReactNode {
    const { error } = this.state;
    const { fallback } = this.props;

    // Use custom fallback if provided
    if (fallback) {
      return fallback;
    }

    // Default fallback UI
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          {/* Error Icon */}
          <View style={styles.iconContainer}>
            <Ionicons
              name="warning-outline"
              size={moderateScale(60)}
              color={themeSecond.statusError}
            />
          </View>

          {/* Title */}
          <Text style={styles.title}>Oops! Something went wrong</Text>

          {/* Message */}
          <Text style={styles.message}>
            We encountered an unexpected error. Don't worry, we've logged it and
            will fix it soon.
          </Text>

          {/* Error Details (Development Only) */}
          {__DEV__ && error && (
            <ScrollView style={styles.errorBox}>
              <Text style={styles.errorTitle}>Error Details:</Text>
              <Text style={styles.errorText}>{error.message}</Text>
            </ScrollView>
          )}

          {/* Retry Button */}
          <TouchableOpacity
            style={styles.retryButton}
            onPress={this.handleRetry}
            activeOpacity={0.8}
          >
            <Ionicons
              name="refresh"
              size={moderateScale(20)}
              color={themeSecond.textPrimary}
            />
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>

          {/* Help Text */}
          <Text style={styles.helpText}>
            If the problem persists, please restart the app
          </Text>
        </View>
      </View>
    );
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.renderFallback();
    }

    return this.props.children;
  }
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeSecond.bgDark,
    justifyContent: "center",
    alignItems: "center",
    padding: moderateScale(20),
  },
  content: {
    alignItems: "center",
    maxWidth: moderateScale(320),
  },
  iconContainer: {
    width: moderateScale(100),
    height: moderateScale(100),
    borderRadius: moderateScale(50),
    backgroundColor: `${themeSecond.statusError}15`,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(24),
  },
  title: {
    ...typography.h2,
    color: themeSecond.textPrimary,
    textAlign: "center",
    marginBottom: verticalScale(12),
  },
  message: {
    ...typography.bodyMedium,
    color: themeSecond.textSoft,
    textAlign: "center",
    lineHeight: moderateScale(22),
    marginBottom: verticalScale(24),
  },
  errorBox: {
    backgroundColor: "#FFF0F0",
    borderRadius: moderateScale(12),
    padding: moderateScale(12),
    marginBottom: verticalScale(24),
    maxHeight: verticalScale(120),
    width: "100%",
  },
  errorTitle: {
    ...typography.bodySmall,
    color: themeSecond.statusError,
    fontWeight: "600",
    marginBottom: verticalScale(4),
  },
  errorText: {
    ...typography.caption,
    color: themeSecond.statusError,
    fontFamily: "monospace",
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: themeSecond.primaryActionPurple,
    paddingVertical: verticalScale(14),
    paddingHorizontal: moderateScale(32),
    borderRadius: moderateScale(12),
    gap: moderateScale(8),
    marginBottom: verticalScale(16),
  },
  retryText: {
    ...typography.button,
    color: themeSecond.textPrimary,
    fontWeight: "600",
  },
  helpText: {
    ...typography.caption,
    color: themeSecond.textSoft,
    textAlign: "center",
  },
});

export default ErrorBoundary;
