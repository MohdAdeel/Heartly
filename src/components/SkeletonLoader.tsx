/**
 * SKELETON LOADER COMPONENT
 * =========================
 * Reusable skeleton loading components with smooth shimmer animations
 * for use across all screens in the app.
 */

import {
  View,
  Animated,
  Dimensions,
  ViewStyle,
  DimensionValue,
} from "react-native";
import React, { useRef, useEffect } from "react";
import { moderateScale, verticalScale } from "react-native-size-matters";

const { width } = Dimensions.get("window");

// Shimmer animation hook
export const useShimmerAnimation = (isLoading: boolean) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isLoading) {
      const shimmerAnimation = Animated.loop(
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        { iterations: -1 }
      );
      shimmerAnimation.start();
      return () => shimmerAnimation.stop();
    } else {
      shimmerAnim.setValue(0);
    }
  }, [isLoading, shimmerAnim]);

  return shimmerAnim;
};

// Base Skeleton Shimmer Component
interface SkeletonShimmerProps {
  style: ViewStyle | ViewStyle[];
  shimmerAnim: Animated.Value;
}

export const SkeletonShimmer: React.FC<SkeletonShimmerProps> = ({
  style,
  shimmerAnim,
}) => {
  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-width * 1.5, width * 1.5],
  });

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 0.3, 0.5, 0.7, 1],
    outputRange: [0.12, 0.24, 0.4, 0.24, 0.12],
  });

  return (
    <View style={[style, { overflow: "hidden", backgroundColor: "#E3E3E3" }]}>
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "#ECECEC",
        }}
      />
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          width: width * 0.4,
          backgroundColor: "#F8F8F8",
          transform: [{ translateX }],
          opacity,
          shadowColor: "#F8F8F8",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.25,
          shadowRadius: 8,
          elevation: 3,
        }}
      />
    </View>
  );
};

// Generic Skeleton Box Component
interface SkeletonBoxProps {
  width?: DimensionValue;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle | ViewStyle[];
  shimmerAnim: Animated.Value;
}

export const SkeletonBox: React.FC<SkeletonBoxProps> = ({
  width: boxWidth = "100%",
  height = moderateScale(20),
  borderRadius = moderateScale(8),
  style,
  shimmerAnim,
}) => {
  return (
    <SkeletonShimmer
      shimmerAnim={shimmerAnim}
      style={[
        {
          width: boxWidth,
          height,
          borderRadius,
        },
        ...(style ? (Array.isArray(style) ? style : [style]) : []),
      ]}
    />
  );
};

// Profile Screen Specific Skeletons
interface ProfileSkeletonProps {
  shimmerAnim: Animated.Value;
  styles?: any;
}

export const SkeletonMainImage: React.FC<ProfileSkeletonProps> = ({
  shimmerAnim,
  styles,
}) => (
  <View style={styles?.mainImageContainer}>
    <SkeletonShimmer shimmerAnim={shimmerAnim} style={styles?.mainImage} />
  </View>
);

export const SkeletonUserInfo: React.FC<ProfileSkeletonProps> = ({
  shimmerAnim,
  styles,
}) => (
  <View style={styles?.userInfoSection}>
    <View style={styles?.nameRow}>
      <View style={styles?.nameContainer}>
        <SkeletonBox
          shimmerAnim={shimmerAnim}
          width={moderateScale(180)}
          height={moderateScale(28)}
          borderRadius={moderateScale(8)}
        />
        <SkeletonBox
          shimmerAnim={shimmerAnim}
          width={moderateScale(20)}
          height={moderateScale(20)}
          borderRadius={moderateScale(10)}
          style={{ marginLeft: moderateScale(8) }}
        />
      </View>
    </View>
    <View style={styles?.professionStatusRow}>
      <SkeletonBox
        shimmerAnim={shimmerAnim}
        width={moderateScale(120)}
        height={moderateScale(18)}
        borderRadius={moderateScale(6)}
      />
    </View>
    <View style={styles?.locationHeightRow}>
      <SkeletonBox
        shimmerAnim={shimmerAnim}
        width="48%"
        height={moderateScale(36)}
        borderRadius={moderateScale(20)}
      />
      <SkeletonBox
        shimmerAnim={shimmerAnim}
        width="48%"
        height={moderateScale(36)}
        borderRadius={moderateScale(20)}
        style={{ marginLeft: moderateScale(10) }}
      />
    </View>
  </View>
);

export const SkeletonSection: React.FC<ProfileSkeletonProps> = ({
  shimmerAnim,
  styles,
}) => (
  <View style={styles?.section}>
    <SkeletonBox
      shimmerAnim={shimmerAnim}
      width={moderateScale(100)}
      height={moderateScale(20)}
      borderRadius={moderateScale(6)}
      style={{ marginBottom: verticalScale(12) }}
    />
    <View style={styles?.bioContainer}>
      <SkeletonBox
        shimmerAnim={shimmerAnim}
        width="100%"
        height={moderateScale(16)}
        borderRadius={moderateScale(4)}
        style={{ marginBottom: verticalScale(8) }}
      />
      <SkeletonBox
        shimmerAnim={shimmerAnim}
        width="95%"
        height={moderateScale(16)}
        borderRadius={moderateScale(4)}
        style={{ marginBottom: verticalScale(8) }}
      />
      <SkeletonBox
        shimmerAnim={shimmerAnim}
        width="85%"
        height={moderateScale(16)}
        borderRadius={moderateScale(4)}
      />
    </View>
  </View>
);

export const SkeletonEssentials: React.FC<ProfileSkeletonProps> = ({
  shimmerAnim,
  styles,
}) => (
  <View style={styles?.section}>
    <SkeletonBox
      shimmerAnim={shimmerAnim}
      width={moderateScale(100)}
      height={moderateScale(20)}
      borderRadius={moderateScale(6)}
      style={{ marginBottom: verticalScale(12) }}
    />
    <View style={styles?.essentialsContainer}>
      {[1, 2, 3, 4].map((index) => (
        <View key={index} style={styles?.essentialItem}>
          <SkeletonBox
            shimmerAnim={shimmerAnim}
            width={moderateScale(36)}
            height={moderateScale(36)}
            borderRadius={moderateScale(10)}
            style={{ marginRight: moderateScale(12) }}
          />
          <View style={styles?.essentialContent}>
            <SkeletonBox
              shimmerAnim={shimmerAnim}
              width={moderateScale(80)}
              height={moderateScale(14)}
              borderRadius={moderateScale(4)}
              style={{ marginBottom: verticalScale(6) }}
            />
            <SkeletonBox
              shimmerAnim={shimmerAnim}
              width={moderateScale(120)}
              height={moderateScale(16)}
              borderRadius={moderateScale(4)}
            />
          </View>
        </View>
      ))}
    </View>
  </View>
);

export const SkeletonInterests: React.FC<ProfileSkeletonProps> = ({
  shimmerAnim,
  styles,
}) => (
  <View style={styles?.section}>
    <SkeletonBox
      shimmerAnim={shimmerAnim}
      width={moderateScale(100)}
      height={moderateScale(20)}
      borderRadius={moderateScale(6)}
      style={{ marginBottom: verticalScale(12) }}
    />
    <View style={styles?.interestsContainer}>
      {[1, 2, 3, 4, 5].map((index) => (
        <SkeletonBox
          key={index}
          shimmerAnim={shimmerAnim}
          width={moderateScale(90)}
          height={moderateScale(36)}
          borderRadius={moderateScale(20)}
        />
      ))}
    </View>
  </View>
);

export const SkeletonPhotos: React.FC<ProfileSkeletonProps> = ({
  shimmerAnim,
  styles,
}) => (
  <View style={styles?.section}>
    <SkeletonBox
      shimmerAnim={shimmerAnim}
      width={moderateScale(120)}
      height={moderateScale(20)}
      borderRadius={moderateScale(6)}
      style={{ marginBottom: verticalScale(12) }}
    />
    <View style={styles?.photosGallery}>
      <SkeletonShimmer
        shimmerAnim={shimmerAnim}
        style={[
          {
            flex: 1.2,
            height: verticalScale(320),
            borderRadius: moderateScale(20),
          },
        ]}
      />
      <View style={styles?.photosRightColumn}>
        {[1, 2, 3].map((index) => (
          <SkeletonShimmer
            key={index}
            shimmerAnim={shimmerAnim}
            style={[
              {
                flex: 1,
                borderRadius: moderateScale(18),
              },
            ]}
          />
        ))}
      </View>
    </View>
  </View>
);

export const SkeletonActionButtons: React.FC<ProfileSkeletonProps> = ({
  shimmerAnim,
  styles,
}) => (
  <View style={styles?.actionButtonsContainer}>
    <SkeletonBox
      shimmerAnim={shimmerAnim}
      width="78%"
      height={moderateScale(56)}
      borderRadius={moderateScale(14)}
    />
    <SkeletonBox
      shimmerAnim={shimmerAnim}
      width={moderateScale(56)}
      height={moderateScale(56)}
      borderRadius={moderateScale(14)}
      style={{ marginLeft: moderateScale(12) }}
    />
  </View>
);
