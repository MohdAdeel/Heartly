import {
  Text,
  View,
  Modal,
  Image,
  Platform,
  Animated,
  FlatList,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  launchImageLibrary,
  ImagePickerResponse,
} from "react-native-image-picker";
import {
  casteIndia,
  titleOptions,
  castePakistan,
  heightOptions,
  locationOptions,
  religionOptions,
  interestsOptions,
  languagesOptions,
  casteAfghanistan,
  personalityOptions,
  IslamSectionOptions,
  SikhismSectionOptions,
  JudaismSectionOptions,
  formatCountryWithFlag,
  JainismSectionOptions,
  HinduismSectionOptions,
  BuddhismSectionOptions,
  ChristianitySectionOptions,
  relationshipPreferenceOptions,
} from "../constants/MultiSelects";
import {
  getInterestIcon,
  getInterestIconColor,
  getPersonalityIcon,
  getPersonalityIconColor,
} from "../utils/optionIcons";
import Button from "../components/Button";
import { useAlerts } from "../components/Alert";
import { useAuth } from "../context/AuthContext";
import { typography } from "../theme/typography";
import { themeSecond } from "../theme/colorSecond";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import React, { useState, useRef, useEffect } from "react";
import GetVerifiedTile from "../components/GetVerifiedTile";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale, verticalScale } from "react-native-size-matters";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

type ProfileImage = {
  id: string;
  image_url: string;
  position: number;
};

type QuestionnaireStackParamList = {
  InitialProfileSetupScreen: undefined;
  FaceVerificationScreen: undefined;
};

type InitialProfileSetupScreenNavigationProp = NativeStackNavigationProp<
  QuestionnaireStackParamList,
  "InitialProfileSetupScreen"
>;

const MAX_INTERESTS = 10;
const MAX_PERSONALITY_OPTIONS = 5;

const InitialProfileSetupScreen = () => {
  // Get user and profile from auth context
  const { user, profile } = useAuth();
  const navigation = useNavigation<InitialProfileSetupScreenNavigationProp>();
  const { showAlert } = useAlerts();
  // Form state
  const [bio, setBio] = useState("");
  const [selectedTitle, setSelectedTitle] = useState<string>("");
  const [selectedHeight, setSelectedHeight] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedReligion, setSelectedReligion] = useState<string>("");
  const [selectedSect, setSelectedSect] = useState<string>("");
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedPersonality, setSelectedPersonality] = useState<string[]>([]);
  const [selectedRelationshipPreference, setSelectedRelationshipPreference] =
    useState<string>("");
  const [selectedCaste, setSelectedCaste] = useState<string>("");

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [currentOptions, setCurrentOptions] = useState<
    string[] | Array<{ name: string; flag: string; value: string }>
  >([]);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [currentSetter, setCurrentSetter] = useState<
    ((value: string) => void) | null
  >(null);
  const [currentValue, setCurrentValue] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Multi-select modal state
  const [multiSelectModalVisible, setMultiSelectModalVisible] = useState(false);
  const [multiSelectOptions, setMultiSelectOptions] = useState<string[]>([]);
  const [multiSelectTitle, setMultiSelectTitle] = useState<string>("");
  const [multiSelectCurrentValues, setMultiSelectCurrentValues] = useState<
    string[]
  >([]);
  const [multiSelectSetter, setMultiSelectSetter] = useState<
    ((values: string[]) => void) | null
  >(null);
  const [multiSelectSearchQuery, setMultiSelectSearchQuery] =
    useState<string>("");

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(verticalScale(50))).current;

  // Multi-select animation values
  const multiFadeAnim = useRef(new Animated.Value(0)).current;
  const multiScaleAnim = useRef(new Animated.Value(0.8)).current;
  const multiSlideAnim = useRef(new Animated.Value(verticalScale(50))).current;

  // Error states
  const [errors, setErrors] = useState<{
    title?: string;
    height?: string;
    religion?: string;
    location?: string;
    languages?: string;
    bio?: string;
    interests?: string;
    profilePhoto?: string;
  }>({});

  // Loading state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Profile Images State
  const [profileImages, setProfileImages] = useState<ProfileImage[]>([]);
  const [imagesLoading, setImagesLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Image Viewer State
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const imageViewerFadeAnim = useRef(new Animated.Value(0)).current;
  const imageViewerScaleAnim = useRef(new Animated.Value(0.8)).current;

  // Drag/Swap State - for reordering images
  const [selectedForSwap, setSelectedForSwap] = useState<ProfileImage | null>(
    null
  );
  const swapPulseAnim = useRef(new Animated.Value(1)).current;

  const clearError = (field: keyof typeof errors) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  // Populate form fields from profile when profile is available
  useEffect(() => {
    if (profile) {
      // Set bio
      if (profile.bio) {
        setBio(profile.bio);
      }

      // Set title
      if (profile.title) {
        setSelectedTitle(profile.title);
      }

      // Set height
      if (profile.height) {
        setSelectedHeight(profile.height);
      }

      // Set country
      if (profile.country) {
        setSelectedCountry(profile.country);
      }

      // Set religion
      if (profile.religion) {
        setSelectedReligion(profile.religion);
      }

      // Set sect
      if (profile.sect) {
        setSelectedSect(profile.sect);
      }

      // Handle languages - could be array or string
      if (Array.isArray(profile.languages)) {
        setSelectedLanguages(profile.languages);
      } else if (profile.languages) {
        setSelectedLanguages([profile.languages]);
      } else {
        setSelectedLanguages([]);
      }

      // Handle interests - could be array or string
      if (Array.isArray(profile.interests)) {
        setSelectedInterests(profile.interests);
      } else if (profile.interests) {
        setSelectedInterests([profile.interests]);
      } else {
        setSelectedInterests([]);
      }
      // Handle personalities - could be array or string
      if (Array.isArray((profile as any).personalities)) {
        setSelectedPersonality((profile as any).personalities);
      } else if ((profile as any).personalities) {
        setSelectedPersonality([(profile as any).personalities]);
      } else if (Array.isArray((profile as any).personality)) {
        // Backward compatibility for older payload key
        setSelectedPersonality((profile as any).personality);
      } else if ((profile as any).personality) {
        // Backward compatibility for older payload key
        setSelectedPersonality([(profile as any).personality]);
      } else {
        setSelectedPersonality([]);
      }
      // Caste (if stored)
      if ((profile as any).caste) {
        setSelectedCaste((profile as any).caste);
      }
      // Relationship preference (fallback to legacy polygomy key if present)
      if (profile.relationship_preference) {
        setSelectedRelationshipPreference(profile.relationship_preference);
      } else if ((profile as any).polygomy) {
        setSelectedRelationshipPreference((profile as any).polygomy);
      }
    }
  }, [profile]);

  const openModal = (
    title: string,
    options: string[] | Array<{ name: string; flag: string; value: string }>,
    setter: (value: string) => void,
    selectedValue: string,
    errorField?: keyof typeof errors
  ) => {
    setModalTitle(title);
    setCurrentOptions(options);
    setCurrentSetter(() => {
      return (value: string) => {
        setter(value);
        if (errorField) {
          clearError(errorField);
        }
      };
    });
    setCurrentValue(selectedValue);
    setSearchQuery(""); // Reset search when opening modal
    setModalVisible(true);
  };

  const closeModal = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 50,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setModalVisible(false);
      setCurrentSetter(null);
      setSearchQuery(""); // Reset search when closing modal
    });
  };

  const openMultiSelectModal = (
    title: string,
    options: string[],
    setter: (values: string[]) => void,
    currentValues: string[]
  ) => {
    setMultiSelectTitle(title);
    setMultiSelectOptions(options);
    setMultiSelectSetter(() => setter);
    setMultiSelectCurrentValues([...currentValues]);
    setMultiSelectSearchQuery(""); // Reset search when opening modal
    setMultiSelectModalVisible(true);
  };

  const closeMultiSelectModal = () => {
    Animated.parallel([
      Animated.timing(multiFadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(multiScaleAnim, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(multiSlideAnim, {
        toValue: 50,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setMultiSelectModalVisible(false);
      setMultiSelectSetter(null);
      setMultiSelectSearchQuery(""); // Reset search when closing modal
    });
  };

  // Get sect options based on selected religion
  const getSectOptions = (religion: string): string[] => {
    switch (religion) {
      case "Islam":
        return IslamSectionOptions;
      case "Hinduism":
        return HinduismSectionOptions;
      case "Christianity":
        return ChristianitySectionOptions;
      case "Sikhism":
        return SikhismSectionOptions;
      case "Buddhism":
        return BuddhismSectionOptions;
      case "Jainism":
        return JainismSectionOptions;
      case "Judaism":
        return JudaismSectionOptions;
      case "Atheist":
      case "Agnostic":
      case "Prefer not to say":
        return [];
      default:
        return [];
    }
  };

  const getCasteOptions = (country: string): string[] => {
    if (country === "Pakistan") return castePakistan;
    if (country === "India") return casteIndia;
    if (country === "Afghanistan") return casteAfghanistan;
    return [];
  };

  const getSortedCasteOptions = (country: string): string[] => {
    return [...getCasteOptions(country)].sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: "base" })
    );
  };

  // Handle religion selection - clear sect if Atheist/Agnostic
  const handleReligionSelection = (religion: string) => {
    setSelectedReligion(religion);
    // Clear sect when switching religions or selecting Atheist/Agnostic
    if (
      religion === "Atheist" ||
      religion === "Agnostic" ||
      religion === "Prefer not to say" ||
      !getSectOptions(religion).length
    ) {
      setSelectedSect("");
    }
  };

  // Clear caste when country not supported
  useEffect(() => {
    if (!["Pakistan", "India", "Afghanistan"].includes(selectedCountry)) {
      setSelectedCaste("");
    }
  }, [selectedCountry]);

  const toggleMultiSelectOption = (option: string) => {
    setMultiSelectCurrentValues((prev) => {
      if (prev.includes(option)) {
        return prev.filter((item) => item !== option);
      } else {
        if (
          multiSelectTitle === "Select Your Interests" &&
          prev.length >= MAX_INTERESTS
        ) {
          showAlert({
            variant: "warning",
            title: "Maximum Reached",
            message: `You can select up to ${MAX_INTERESTS} interests.`,
          });
          return prev;
        }
        if (
          multiSelectTitle === "Select Your Personality" &&
          prev.length >= MAX_PERSONALITY_OPTIONS
        ) {
          showAlert({
            variant: "warning",
            title: "Maximum Reached",
            message: `You can select up to ${MAX_PERSONALITY_OPTIONS} personality traits.`,
          });
          return prev;
        }
        return [...prev, option];
      }
    });
  };

  const confirmMultiSelect = () => {
    const valuesToSave =
      multiSelectTitle === "Select Your Interests"
        ? multiSelectCurrentValues.slice(0, MAX_INTERESTS)
        : multiSelectTitle === "Select Your Personality"
        ? multiSelectCurrentValues.slice(0, MAX_PERSONALITY_OPTIONS)
        : multiSelectCurrentValues;

    if (multiSelectSetter) {
      multiSelectSetter(valuesToSave);
    }
    // Clear languages error if it exists
    if (
      multiSelectTitle === "Select Languages" &&
      multiSelectCurrentValues.length > 0
    ) {
      clearError("languages");
    }
    // Clear interests error if at least 2 interests are selected
    if (
      multiSelectTitle === "Select Your Interests" &&
      valuesToSave.length >= 2
    ) {
      clearError("interests");
    }
    closeMultiSelectModal();
  };

  useEffect(() => {
    if (modalVisible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 65,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          tension: 65,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [modalVisible]);

  useEffect(() => {
    if (multiSelectModalVisible) {
      Animated.parallel([
        Animated.timing(multiFadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(multiScaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 65,
          useNativeDriver: true,
        }),
        Animated.spring(multiSlideAnim, {
          toValue: 0,
          friction: 8,
          tension: 65,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [multiSelectModalVisible]);

  // Clear sect when religion changes to Atheist/Agnostic/Prefer not to say
  useEffect(() => {
    if (
      selectedReligion === "Atheist" ||
      selectedReligion === "Agnostic" ||
      selectedReligion === "Prefer not to say"
    ) {
      setSelectedSect("");
    }
  }, [selectedReligion]);

  const handleComplete = async () => {
    // Validate required fields and set errors
    const newErrors: typeof errors = {};

    if (!selectedTitle) {
      newErrors.title = "Please select a title";
    }
    if (!selectedHeight) {
      newErrors.height = "Please select your height";
    }
    if (!selectedReligion) {
      newErrors.religion = "Please select your religion";
    }
    if (!selectedCountry) {
      newErrors.location = "Please select your location";
    }
    if (selectedLanguages.length === 0) {
      newErrors.languages = "Please select at least one language";
    }
    if (!bio || bio.trim().length === 0) {
      newErrors.bio = "Please write something about yourself";
    }
    if (selectedInterests.length < 2) {
      newErrors.interests = "Please select at least 2 interests";
    }
    if (profileImages.length < 1) {
      newErrors.profilePhoto =
        "Upload at least one real photo where your face is clearly visible.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to first error
      return;
    }

    // Clear all errors if validation passes
    setErrors({});

    // Check if user ID exists
    if (!user?.id) {
      showAlert({
        variant: "error",
        title: "Error",
        message: "User not found. Please log in again.",
      });
      return;
    }

    // Map data to database column names
    const profileData = {
      title: selectedTitle,
      bio: bio || null,
      height: selectedHeight,
      religion: selectedReligion,
      sect:
        selectedReligion === "Atheist" ||
        selectedReligion === "Agnostic" ||
        selectedReligion === "Prefer not to say"
          ? null
          : selectedSect || null,
      country: selectedCountry,
      caste: selectedCaste || null,
      languages: selectedLanguages,
      interests: selectedInterests,
      personalities:
        selectedPersonality.length > 0 ? selectedPersonality : null,
      relationship_preference: selectedRelationshipPreference || null,
      updated_at: new Date().toISOString(),
    };

    setIsSubmitting(true);

    try {
      console.log("InitialProfileSetup complete payload:", {
        userId: user.id,
        profileData,
      });
      navigation.navigate("FaceVerificationScreen");
    } catch (error) {
      console.error("Error saving profile data:", error);
      showAlert({
        variant: "error",
        title: "Error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to save profile. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatMultiSelectValue = (values: string[]) => {
    if (values.length === 0) return "";
    if (values.length === 1) return values[0];
    if (values.length <= 3) return values.join(", ");
    return `${values.slice(0, 3).join(", ")} +${values.length - 3} more`;
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // PROFILE IMAGES FUNCTIONS
  // ─────────────────────────────────────────────────────────────────────────────

  // Local-only image list: no API fetch required
  const fetchProfileImages = async () => {
    setImagesLoading(false);
  };

  // Handle image picker and upload
  const handleAddPhoto = () => {
    if (!user?.id) {
      showAlert({
        variant: "error",
        title: "Error",
        message: "User not found",
      });
      return;
    }

    // Check if user already has 4 images (max positions 0-3)
    if (profileImages.length >= 4) {
      showAlert({
        variant: "warning",
        title: "Limit reached",
        message: "You can only upload up to 4 photos.",
      });
      return;
    }

    const options = {
      mediaType: "photo" as const,
      quality: 0.8 as const,
      selectionLimit: 1,
      includeBase64: false,
    };

    launchImageLibrary(options, async (response: ImagePickerResponse) => {
      if (response.didCancel || response.errorCode) {
        return;
      }

      const asset = response.assets?.[0];
      if (!asset?.uri) {
        return;
      }

      try {
        setUploadingImage(true);

        // Find the next available position
        const existingPositions = profileImages.map((img) => img.position);
        let nextPosition = 0;
        for (let i = 0; i < 4; i++) {
          if (!existingPositions.includes(i)) {
            nextPosition = i;
            break;
          }
        }

        const localImage: ProfileImage = {
          id: `local-image-${Date.now()}`,
          image_url: asset.uri,
          position: nextPosition,
        };
        setProfileImages((prev) =>
          [...prev, localImage].sort((a, b) => a.position - b.position)
        );
        clearError("profilePhoto");
        showAlert({
          variant: "success",
          title: "Uploaded",
          message: "Photo uploaded successfully.",
          autoHideMs: 1800,
        });
      } catch (error: any) {
        console.error("Error uploading image:", error);
        showAlert({
          variant: "error",
          title: "Upload failed",
          message: error.message || "Failed to upload photo.",
        });
      } finally {
        setUploadingImage(false);
      }
    });
  };

  // Handle delete photo
  const handleDeletePhoto = (image: ProfileImage) => {
    showAlert({
      variant: "warning",
      title: "Delete photo?",
      message: "Are you sure you want to delete this photo?",
      dismissOnBackdropPress: false,
      actions: [
        { label: "Cancel", style: "cancel" },
        {
          label: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setUploadingImage(true);
              setProfileImages((prev) =>
                prev.filter((item) => item.id !== image.id)
              );
              showAlert({
                variant: "success",
                title: "Deleted",
                message: "Photo deleted successfully.",
                autoHideMs: 1600,
              });
            } catch (error: any) {
              console.error("Error deleting image:", error);
              showAlert({
                variant: "error",
                title: "Delete failed",
                message: error.message || "Failed to delete photo.",
              });
            } finally {
              setUploadingImage(false);
            }
          },
        },
      ],
    });
  };

  // Get image by position
  const getImageByPosition = (position: number): ProfileImage | undefined => {
    return profileImages.find((img) => img.position === position);
  };

  // Get all available images sorted by position
  const getAvailableImages = (): ProfileImage[] => {
    return profileImages
      .filter((img) => img !== undefined)
      .sort((a, b) => a.position - b.position);
  };

  // Open image viewer
  const openImageViewer = (position: number) => {
    const availableImages = getAvailableImages();
    const imageIndex = availableImages.findIndex(
      (img) => img.position === position
    );
    if (imageIndex !== -1) {
      setSelectedImageIndex(imageIndex);
      setImageViewerVisible(true);
      // Animate in
      Animated.parallel([
        Animated.timing(imageViewerFadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(imageViewerScaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 65,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  // Close image viewer
  const closeImageViewer = () => {
    Animated.parallel([
      Animated.timing(imageViewerFadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(imageViewerScaleAnim, {
        toValue: 0.8,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setImageViewerVisible(false);
    });
  };

  // Start pulse animation when image is selected for swap
  const startSwapPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(swapPulseAnim, {
          toValue: 1.05,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(swapPulseAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  // Stop pulse animation
  const stopSwapPulseAnimation = () => {
    swapPulseAnim.stopAnimation();
    swapPulseAnim.setValue(1);
  };

  // Handle long press to select image for swapping
  const handleLongPressImage = (image: ProfileImage) => {
    if (uploadingImage) return;

    if (selectedForSwap?.id === image.id) {
      // Deselect if same image
      setSelectedForSwap(null);
      stopSwapPulseAnimation();
    } else {
      setSelectedForSwap(image);
      startSwapPulseAnimation();
    }
  };

  // Handle tap on image when in swap mode
  const handleImageTapForSwap = async (
    targetPosition: number,
    targetImage: ProfileImage | undefined
  ) => {
    if (!selectedForSwap) return;

    // If tapping the same image, deselect
    if (targetImage?.id === selectedForSwap.id) {
      setSelectedForSwap(null);
      stopSwapPulseAnimation();
      return;
    }

    // If tapping an empty slot, don't swap
    if (!targetImage) {
      showAlert({
        variant: "info",
        title: "Cannot swap",
        message: "Please select another photo to swap positions.",
        autoHideMs: 1800,
      });
      return;
    }

    try {
      setUploadingImage(true);
      stopSwapPulseAnimation();

      setProfileImages((prev) =>
        prev
          .map((item) => {
            if (item.id === selectedForSwap.id) {
              return { ...item, position: targetImage.position };
            }
            if (item.id === targetImage.id) {
              return { ...item, position: selectedForSwap.position };
            }
            return item;
          })
          .sort((a, b) => a.position - b.position)
      );
      setSelectedForSwap(null);

      // Show success feedback
      showAlert({
        variant: "success",
        title: "All set",
        message: "Photos reordered successfully!",
        autoHideMs: 1600,
      });
    } catch (error: any) {
      console.error("Error swapping images:", error);
      showAlert({
        variant: "error",
        title: "Reorder failed",
        message: error.message || "Failed to reorder photos. Please try again.",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  // Cancel swap selection
  const cancelSwapSelection = () => {
    setSelectedForSwap(null);
    stopSwapPulseAnimation();
  };

  const handleVerifyFace = () => {
    navigation.navigate("FaceVerificationScreen");
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[
          themeSecond.bgDark,
          themeSecond.bgDark,
          themeSecond.surfaceDark,
          themeSecond.bgDark,
        ]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Complete Your Profile</Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Your Photos Section */}
          <View
            style={[
              styles.photosSection,
              errors.profilePhoto && styles.photosSectionError,
            ]}
          >
            <View style={styles.photosSectionHeader}>
              <Text style={styles.tileTitle}>Your Photos</Text>
              {selectedForSwap && (
                <TouchableOpacity
                  style={styles.cancelSwapButton}
                  onPress={cancelSwapSelection}
                  activeOpacity={0.7}
                >
                  <Text style={styles.cancelSwapText}>Cancel</Text>
                </TouchableOpacity>
              )}
            </View>
            {errors.profilePhoto && (
              <Text style={styles.photosSectionErrorText}>
                {errors.profilePhoto}
              </Text>
            )}

            {/* Swap Mode Hint */}
            {selectedForSwap && (
              <View style={styles.swapHintContainer}>
                <Ionicons
                  name="swap-horizontal"
                  size={moderateScale(16)}
                  color={themeSecond.accentPurple}
                />
                <Text style={styles.swapHintText}>
                  Tap another photo to swap positions
                </Text>
              </View>
            )}

            <View style={styles.photosGallery}>
              {/* Large Photo - Left (Position 0 - Main Photo) */}
              {(() => {
                const mainPhoto = getImageByPosition(0);
                const isSelected = selectedForSwap?.id === mainPhoto?.id;
                const isSwapTarget =
                  selectedForSwap && !isSelected && mainPhoto;

                return (
                  <Animated.View
                    style={[
                      styles.photoLarge,
                      isSelected && {
                        transform: [{ scale: swapPulseAnim }],
                        // borderWidth: 3,
                        // borderColor: themeSecond.accentPurple,
                      },
                      isSwapTarget && styles.swapTargetHighlight,
                    ]}
                  >
                    <TouchableOpacity
                      style={{ flex: 1, backgroundColor: "transparent" }}
                      activeOpacity={0.9}
                      onPress={() => {
                        if (selectedForSwap) {
                          handleImageTapForSwap(0, mainPhoto);
                        } else if (mainPhoto) {
                          openImageViewer(0);
                        } else {
                          handleAddPhoto();
                        }
                      }}
                      onLongPress={() => {
                        if (mainPhoto) {
                          handleLongPressImage(mainPhoto);
                        }
                      }}
                      delayLongPress={400}
                      disabled={uploadingImage}
                    >
                      {mainPhoto ? (
                        <>
                          <Image
                            source={{ uri: mainPhoto.image_url }}
                            style={{
                              width: "100%",
                              height: "100%",
                              backgroundColor: "transparent",
                            }}
                            resizeMode="cover"
                          />
                          {/* Delete Button */}
                          {!selectedForSwap && (
                            <TouchableOpacity
                              style={styles.photoDeleteButton}
                              onPress={(e) => {
                                e.stopPropagation();
                                handleDeletePhoto(mainPhoto);
                              }}
                              activeOpacity={0.8}
                              disabled={uploadingImage}
                            >
                              <View style={styles.deleteButtonBackdrop}>
                                {uploadingImage ? (
                                  <ActivityIndicator
                                    size="small"
                                    color="#FF0000"
                                  />
                                ) : (
                                  <Ionicons
                                    name="trash"
                                    size={moderateScale(16)}
                                    color="#FF0000"
                                  />
                                )}
                              </View>
                            </TouchableOpacity>
                          )}
                          {/* Selected indicator */}
                          {isSelected && (
                            <View style={styles.selectedOverlay}>
                              <View style={styles.selectedBadge}>
                                <Ionicons
                                  name="move"
                                  size={moderateScale(20)}
                                  color="#FFFFFF"
                                />
                                <Text style={styles.selectedBadgeText}>
                                  Selected
                                </Text>
                              </View>
                            </View>
                          )}
                          {/* Swap target indicator */}
                          {isSwapTarget && (
                            <View style={styles.swapTargetOverlay}>
                              <View style={styles.swapTargetBadge}>
                                <Ionicons
                                  name="swap-horizontal"
                                  size={moderateScale(18)}
                                  color="#FFFFFF"
                                />
                                <Text style={styles.swapTargetBadgeText}>
                                  Tap to swap
                                </Text>
                              </View>
                            </View>
                          )}
                        </>
                      ) : (
                        <View style={styles.photoPlaceholderLarge}>
                          <Ionicons
                            name="images"
                            size={moderateScale(36)}
                            color={themeSecond.textSoft}
                          />
                        </View>
                      )}
                      {mainPhoto && !isSelected && !selectedForSwap && (
                        <View style={styles.mainPhotoTag}>
                          <Ionicons
                            name="star"
                            size={moderateScale(14)}
                            color={themeSecond.accentPurple}
                            style={styles.mainPhotoTagIcon}
                          />
                          <Text style={styles.mainPhotoTagText}>
                            Main Photo
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  </Animated.View>
                );
              })()}

              {/* Small Photos - Right Column (Positions 1, 2, 3) */}
              <View style={styles.photosRightColumn}>
                {[1, 2, 3].map((position) => {
                  const image = getImageByPosition(position);
                  const isSelected = selectedForSwap?.id === image?.id;
                  const isSwapTarget = selectedForSwap && !isSelected && image;

                  return (
                    <Animated.View
                      key={position}
                      style={[
                        styles.photoSmall,
                        isSelected && {
                          transform: [{ scale: swapPulseAnim }],
                          // borderWidth: 2,
                          // borderColor: themeSecond.accentPurple,
                        },
                        isSwapTarget && styles.swapTargetHighlightSmall,
                      ]}
                    >
                      <TouchableOpacity
                        style={{ flex: 1, backgroundColor: "transparent" }}
                        activeOpacity={0.9}
                        onPress={() => {
                          if (selectedForSwap) {
                            handleImageTapForSwap(position, image);
                          } else if (image) {
                            openImageViewer(position);
                          } else {
                            handleAddPhoto();
                          }
                        }}
                        onLongPress={() => {
                          if (image) {
                            handleLongPressImage(image);
                          }
                        }}
                        delayLongPress={400}
                        disabled={uploadingImage}
                      >
                        {image ? (
                          <>
                            <Image
                              source={{ uri: image.image_url }}
                              style={{
                                width: "100%",
                                height: "100%",
                                backgroundColor: "transparent",
                              }}
                              resizeMode="cover"
                            />
                            {/* Delete Button */}
                            {!selectedForSwap && (
                              <TouchableOpacity
                                style={styles.photoDeleteButtonSmall}
                                onPress={(e) => {
                                  e.stopPropagation();
                                  handleDeletePhoto(image);
                                }}
                                activeOpacity={0.8}
                                disabled={uploadingImage}
                              >
                                <View style={styles.deleteButtonBackdropSmall}>
                                  {uploadingImage ? (
                                    <ActivityIndicator
                                      size="small"
                                      color="#FF0000"
                                    />
                                  ) : (
                                    <Ionicons
                                      name="trash"
                                      size={moderateScale(14)}
                                      color="#FF0000"
                                    />
                                  )}
                                </View>
                              </TouchableOpacity>
                            )}
                            {/* Selected indicator */}
                            {isSelected && (
                              <View style={styles.selectedOverlaySmall}>
                                <Ionicons
                                  name="move"
                                  size={moderateScale(16)}
                                  color="#FFFFFF"
                                />
                              </View>
                            )}
                            {/* Swap target indicator */}
                            {isSwapTarget && (
                              <View style={styles.swapTargetOverlaySmall}>
                                <Ionicons
                                  name="swap-horizontal"
                                  size={moderateScale(14)}
                                  color="#FFFFFF"
                                />
                              </View>
                            )}
                          </>
                        ) : (
                          <View style={styles.photoPlaceholderSmall}>
                            <Ionicons
                              name="image"
                              size={moderateScale(22)}
                              color={themeSecond.textSoft}
                            />
                          </View>
                        )}
                      </TouchableOpacity>
                    </Animated.View>
                  );
                })}
              </View>
            </View>

            {/* Long press hint */}
            {!selectedForSwap && profileImages.length > 1 && (
              <Text style={styles.longPressHint}>
                Long press any photo to reorder
              </Text>
            )}
            <TouchableOpacity
              style={[
                styles.addPhotosButton,
                (uploadingImage || profileImages.length >= 4) &&
                  styles.addPhotosButtonDisabled,
              ]}
              activeOpacity={0.8}
              onPress={handleAddPhoto}
              disabled={uploadingImage || profileImages.length >= 4}
            >
              {uploadingImage ? (
                <ActivityIndicator
                  size="small"
                  color={themeSecond.accentPurple}
                />
              ) : (
                <>
                  <Ionicons
                    name="images-outline"
                    size={moderateScale(20)}
                    color={
                      uploadingImage || profileImages.length >= 4
                        ? themeSecond.textSoft
                        : themeSecond.accentPurple
                    }
                  />
                  <Text
                    style={[
                      styles.addPhotosText,
                      (uploadingImage || profileImages.length >= 4) &&
                        styles.addPhotosTextDisabled,
                    ]}
                  >
                    Add Photos
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
          {!profile?.isVerified && (
            <GetVerifiedTile onPress={handleVerifyFace} />
          )}
          {/* About Me Section */}
          <View style={styles.AboutMeSection}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionHeaderLeft}>
                <View style={styles.sectionIconContainer}>
                  <Ionicons
                    name="person"
                    size={moderateScale(20)}
                    color="#D97757"
                  />
                </View>
                <Text style={styles.tileTitle}>About Me</Text>
              </View>
            </View>

            {/* Bio Section - Prominent */}
            <View style={styles.bioCard}>
              <View style={styles.bioHeader}>
                <Ionicons
                  name="document-text"
                  size={moderateScale(18)}
                  color="#8B6F9D"
                />
                <Text style={styles.bioLabel}>Bio</Text>
              </View>
              <TextInput
                style={[styles.textArea, errors.bio && styles.textAreaError]}
                placeholder="Tell us about yourself..."
                placeholderTextColor={themeSecond.textSoft}
                multiline
                numberOfLines={4}
                value={bio}
                onChangeText={(text) => {
                  setBio(text);
                  if (text.trim().length > 0) {
                    clearError("bio");
                  }
                }}
              />
              {errors.bio && <Text style={styles.errorText}>{errors.bio}</Text>}
            </View>

            {/* Quick Info Grid */}
            <View style={styles.quickInfoGrid}>
              <TouchableOpacity
                style={[
                  styles.quickInfoCard,
                  errors.title && styles.quickInfoCardError,
                ]}
                onPress={() =>
                  openModal(
                    "Select Title",
                    titleOptions,
                    setSelectedTitle,
                    selectedTitle,
                    "title"
                  )
                }
                activeOpacity={0.7}
              >
                <View style={styles.quickInfoIcon}>
                  <Ionicons
                    name="person"
                    size={moderateScale(20)}
                    color="#E67E22"
                  />
                </View>
                <Text style={styles.quickInfoLabel}>Title *</Text>
                <Text
                  style={styles.quickInfoValue}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {selectedTitle || "Select"}
                </Text>
                {errors.title && (
                  <Text style={styles.quickInfoError}>{errors.title}</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.quickInfoCard,
                  errors.height && styles.quickInfoCardError,
                ]}
                onPress={() =>
                  openModal(
                    "Select Your Height",
                    heightOptions,
                    setSelectedHeight,
                    selectedHeight,
                    "height"
                  )
                }
                activeOpacity={0.7}
              >
                <View style={styles.quickInfoIcon}>
                  <Ionicons
                    name="resize"
                    size={moderateScale(20)}
                    color="#27AE60"
                  />
                </View>
                <Text style={styles.quickInfoLabel}>Height *</Text>
                <Text
                  style={styles.quickInfoValue}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {selectedHeight || "Select"}
                </Text>
                {errors.height && (
                  <Text style={styles.quickInfoError}>{errors.height}</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.quickInfoCard,
                  errors.religion && styles.quickInfoCardError,
                ]}
                onPress={() =>
                  openModal(
                    "Select Your Religion",
                    religionOptions,
                    handleReligionSelection,
                    selectedReligion,
                    "religion"
                  )
                }
                activeOpacity={0.7}
              >
                <View style={styles.quickInfoIcon}>
                  <Ionicons
                    name="book"
                    size={moderateScale(20)}
                    color="#F39C12"
                  />
                </View>
                <Text style={styles.quickInfoLabel}>Religion *</Text>
                <Text
                  style={styles.quickInfoValue}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {selectedReligion || "Select"}
                </Text>
                {errors.religion && (
                  <Text style={styles.quickInfoError}>{errors.religion}</Text>
                )}
              </TouchableOpacity>

              {selectedReligion &&
                selectedReligion !== "Atheist" &&
                selectedReligion !== "Agnostic" &&
                selectedReligion !== "Prefer not to say" &&
                getSectOptions(selectedReligion).length > 0 && (
                  <TouchableOpacity
                    style={styles.quickInfoCard}
                    onPress={() =>
                      openModal(
                        "Select Your Sect",
                        getSectOptions(selectedReligion),
                        setSelectedSect,
                        selectedSect
                      )
                    }
                    activeOpacity={0.7}
                  >
                    <View style={styles.quickInfoIcon}>
                      <Ionicons
                        name="library"
                        size={moderateScale(20)}
                        color="#9B59B6"
                      />
                    </View>
                    <Text style={styles.quickInfoLabel}>Sect</Text>
                    <Text
                      style={styles.quickInfoValue}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {selectedSect || "Select (Optional)"}
                    </Text>
                  </TouchableOpacity>
                )}
            </View>

            {/* Detailed Info Cards */}
            <View style={styles.detailedInfoRow}>
              <TouchableOpacity
                style={[
                  styles.detailedInfoCard,
                  errors.location && styles.detailedInfoCardError,
                ]}
                onPress={() =>
                  openModal(
                    "Select Your Location",
                    locationOptions,
                    setSelectedCountry,
                    selectedCountry,
                    "location"
                  )
                }
                activeOpacity={0.7}
              >
                <View style={styles.detailedInfoIcon}>
                  <Ionicons
                    name="location"
                    size={moderateScale(22)}
                    color="#E85A4F"
                  />
                </View>
                <View style={styles.detailedInfoContent}>
                  <Text style={styles.detailedInfoLabel}>Location *</Text>
                  <Text
                    style={styles.detailedInfoValue}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {selectedCountry
                      ? formatCountryWithFlag(selectedCountry)
                      : "Select Your Location"}
                  </Text>
                  {errors.location && (
                    <Text style={styles.detailedInfoError}>
                      {errors.location}
                    </Text>
                  )}
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={moderateScale(20)}
                  color={themeSecond.textSoft}
                />
              </TouchableOpacity>
            </View>

            {["Pakistan", "India", "Afghanistan"].includes(
              selectedCountry || ""
            ) && (
              <View style={styles.detailedInfoRow}>
                <TouchableOpacity
                  style={styles.detailedInfoCard}
                  onPress={() =>
                    openModal(
                      "Select Your Caste",
                      getSortedCasteOptions(selectedCountry),
                      setSelectedCaste,
                      selectedCaste
                    )
                  }
                  activeOpacity={0.7}
                >
                  <View style={styles.detailedInfoIcon}>
                    <Ionicons
                      name="people-circle-outline"
                      size={moderateScale(22)}
                      color={themeSecond.textPrimary}
                    />
                  </View>
                  <View style={styles.detailedInfoContent}>
                    <Text style={styles.detailedInfoLabel}>Caste</Text>
                    <Text
                      style={styles.detailedInfoValue}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {selectedCaste || "Select Your Caste"}
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={moderateScale(20)}
                    color={themeSecond.textSoft}
                  />
                </TouchableOpacity>
              </View>
            )}

            {/* Multi-select Cards */}
            <TouchableOpacity
              style={[
                styles.multiSelectCard,
                errors.languages && styles.multiSelectCardError,
              ]}
              onPress={() =>
                openMultiSelectModal(
                  "Select Your Languages",
                  languagesOptions,
                  setSelectedLanguages,
                  selectedLanguages
                )
              }
              activeOpacity={0.7}
            >
              <View style={styles.multiSelectIcon}>
                <Ionicons
                  name="language"
                  size={moderateScale(22)}
                  color="#16A085"
                />
              </View>
              <View style={styles.multiSelectContent}>
                <Text style={styles.multiSelectLabel}>Languages *</Text>
                <Text
                  style={styles.multiSelectValue}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {formatMultiSelectValue(selectedLanguages) ||
                    "Select Your Languages"}
                </Text>
                {errors.languages && (
                  <Text style={styles.multiSelectError}>
                    {errors.languages}
                  </Text>
                )}
              </View>
              <Ionicons
                name="chevron-forward"
                size={moderateScale(20)}
                color={themeSecond.textSoft}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.multiSelectCard}
              onPress={() =>
                openMultiSelectModal(
                  "Select Your Interests",
                  interestsOptions,
                  (values: string[]) => {
                    setSelectedInterests(values);
                    if (values.length >= 2) {
                      clearError("interests");
                    }
                  },
                  selectedInterests
                )
              }
              activeOpacity={0.7}
            >
              <View style={styles.multiSelectIcon}>
                <Ionicons
                  name="star"
                  size={moderateScale(22)}
                  color="#E91E63"
                />
              </View>
              <View style={styles.multiSelectContent}>
                <Text style={styles.multiSelectLabel}>Interests *</Text>
                <Text
                  style={styles.multiSelectValue}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {formatMultiSelectValue(selectedInterests) ||
                    "Select Your Interests"}
                </Text>
                {errors.interests && (
                  <Text style={styles.multiSelectError}>
                    {errors.interests}
                  </Text>
                )}
              </View>
              <Ionicons
                name="chevron-forward"
                size={moderateScale(20)}
                color={themeSecond.textSoft}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.multiSelectCard}
              onPress={() =>
                openMultiSelectModal(
                  "Select Your Personality",
                  personalityOptions,
                  setSelectedPersonality,
                  selectedPersonality
                )
              }
              activeOpacity={0.7}
            >
              <View style={styles.multiSelectIcon}>
                <Ionicons
                  name="sparkles"
                  size={moderateScale(22)}
                  color="#8E44AD"
                />
              </View>
              <View style={styles.multiSelectContent}>
                <Text style={styles.multiSelectLabel}>Personality</Text>
                <Text
                  style={styles.multiSelectValue}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {formatMultiSelectValue(selectedPersonality) ||
                    "Select Personality Traits"}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={moderateScale(20)}
                color={themeSecond.textSoft}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.multiSelectCard}
              onPress={() =>
                openModal(
                  "Select Relationship Preference",
                  relationshipPreferenceOptions,
                  setSelectedRelationshipPreference,
                  selectedRelationshipPreference
                )
              }
              activeOpacity={0.7}
            >
              <View style={styles.multiSelectIcon}>
                <Ionicons
                  name="heart-circle-outline"
                  size={moderateScale(22)}
                  color={themeSecond.accentPurple}
                />
              </View>
              <View style={styles.multiSelectContent}>
                <Text style={styles.multiSelectLabel}>
                  Relationship Preference
                </Text>
                <Text
                  style={styles.multiSelectValue}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {selectedRelationshipPreference ||
                    "Select Relationship Preference"}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={moderateScale(20)}
                color={themeSecond.textSoft}
              />
            </TouchableOpacity>
          </View>

          {/* Complete Button */}
          <View style={styles.buttonContainer}>
            <Button
              title={isSubmitting ? "Saving..." : "Complete Setup"}
              onPress={isSubmitting ? undefined : handleComplete}
              disabled={isSubmitting}
              style={{
                ...styles.completeSetupButton,
                opacity: isSubmitting ? 0.6 : 1,
              }}
              textStyle={styles.completeSetupButtonText}
            />
          </View>
        </ScrollView>

        {/* Single Select Modal */}
        <Modal
          animationType="none"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
          statusBarTranslucent
        >
          <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
            <Pressable style={styles.modalBackdrop} onPress={closeModal} />
            <Animated.View
              style={[
                styles.modalContent,
                {
                  transform: [{ scale: scaleAnim }, { translateY: slideAnim }],
                },
              ]}
            >
              <View style={styles.modalHeader}>
                <View style={styles.modalHandle} />
                <Text style={styles.modalTitle}>{modalTitle}</Text>
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={closeModal}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="close"
                    size={moderateScale(22)}
                    color={themeSecond.textSoft}
                  />
                </TouchableOpacity>
              </View>

              {/* Search Input */}
              <View style={styles.searchContainer}>
                <Ionicons
                  name="search"
                  size={moderateScale(20)}
                  color={themeSecond.textSoft}
                  style={styles.searchIcon}
                />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search..."
                  placeholderTextColor={themeSecond.textSoft}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity
                    onPress={() => setSearchQuery("")}
                    style={styles.clearSearchButton}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name="close-circle"
                      size={moderateScale(20)}
                      color={themeSecond.textSoft}
                    />
                  </TouchableOpacity>
                )}
              </View>

              <ScrollView
                style={styles.optionsList}
                contentContainerStyle={styles.optionsContent}
                showsVerticalScrollIndicator={false}
              >
                {(currentOptions || [])
                  .filter((option) => {
                    if (!searchQuery.trim()) return true;
                    const searchLower = searchQuery.toLowerCase().trim();
                    if (typeof option === "string") {
                      return option.toLowerCase().includes(searchLower);
                    } else {
                      return (
                        option.name.toLowerCase().includes(searchLower) ||
                        option.value.toLowerCase().includes(searchLower)
                      );
                    }
                  })
                  .map((option, index, filteredArray) => {
                    // Handle both string and object formats
                    const optionValue =
                      typeof option === "string" ? option : option.value;
                    const optionDisplay =
                      typeof option === "string"
                        ? option
                        : `${option.flag} ${option.name}`;
                    const isSelected = currentValue === optionValue;
                    return (
                      <TouchableOpacity
                        key={optionValue}
                        style={[
                          styles.optionItem,
                          isSelected && styles.optionItemSelected,
                          index === filteredArray.length - 1 &&
                            styles.optionItemLast,
                        ]}
                        onPress={() => {
                          setCurrentValue(optionValue);
                          if (currentSetter) {
                            currentSetter(optionValue);
                          }
                          closeModal();
                        }}
                        activeOpacity={0.7}
                      >
                        <View style={styles.optionContent}>
                          <View
                            style={[
                              styles.radioOuter,
                              isSelected && styles.radioOuterSelected,
                            ]}
                          >
                            {isSelected && <View style={styles.radioInner} />}
                          </View>
                          <Text
                            style={[
                              styles.optionText,
                              isSelected && styles.optionTextSelected,
                            ]}
                          >
                            {optionDisplay}
                          </Text>
                        </View>
                        {isSelected && (
                          <Ionicons
                            name="checkmark-circle"
                            size={moderateScale(24)}
                            color={themeSecond.accentPurple}
                          />
                        )}
                      </TouchableOpacity>
                    );
                  })}
              </ScrollView>
            </Animated.View>
          </Animated.View>
        </Modal>

        {/* Multi-Select Modal */}
        <Modal
          animationType="none"
          transparent={true}
          visible={multiSelectModalVisible}
          onRequestClose={closeMultiSelectModal}
          statusBarTranslucent
        >
          <Animated.View
            style={[styles.modalOverlay, { opacity: multiFadeAnim }]}
          >
            <Pressable
              style={styles.modalBackdrop}
              onPress={closeMultiSelectModal}
            />
            <Animated.View
              style={[
                styles.modalContent,
                {
                  transform: [
                    { scale: multiScaleAnim },
                    { translateY: multiSlideAnim },
                  ],
                },
              ]}
            >
              <View style={styles.modalHeader}>
                <View style={styles.modalHandle} />
                <Text style={styles.modalTitle}>{multiSelectTitle}</Text>
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={closeMultiSelectModal}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="close"
                    size={moderateScale(22)}
                    color={themeSecond.textSoft}
                  />
                </TouchableOpacity>
              </View>

              {/* Search Input */}
              <View style={styles.searchContainer}>
                <Ionicons
                  name="search"
                  size={moderateScale(20)}
                  color={themeSecond.textSoft}
                  style={styles.searchIcon}
                />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search..."
                  placeholderTextColor={themeSecond.textSoft}
                  value={multiSelectSearchQuery}
                  onChangeText={setMultiSelectSearchQuery}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {multiSelectSearchQuery.length > 0 && (
                  <TouchableOpacity
                    onPress={() => setMultiSelectSearchQuery("")}
                    style={styles.clearSearchButton}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name="close-circle"
                      size={moderateScale(20)}
                      color={themeSecond.textSoft}
                    />
                  </TouchableOpacity>
                )}
              </View>

              <ScrollView
                style={styles.optionsList}
                contentContainerStyle={styles.optionsContent}
                showsVerticalScrollIndicator={false}
              >
                {(multiSelectOptions || [])
                  .filter((option) => {
                    if (!multiSelectSearchQuery.trim()) return true;
                    const searchLower = multiSelectSearchQuery
                      .toLowerCase()
                      .trim();
                    return option.toLowerCase().includes(searchLower);
                  })
                  .map((option, index, filteredArray) => {
                    const isSelected =
                      multiSelectCurrentValues.includes(option);
                    return (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.optionItem,
                          isSelected && styles.optionItemSelected,
                          index === filteredArray.length - 1 &&
                            styles.optionItemLast,
                        ]}
                        onPress={() => toggleMultiSelectOption(option)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.optionContent}>
                          <View
                            style={[
                              styles.checkboxOuter,
                              isSelected && styles.checkboxOuterSelected,
                            ]}
                          >
                            {isSelected && (
                              <Ionicons
                                name="checkmark"
                                size={moderateScale(16)}
                                color="#FFFFFF"
                              />
                            )}
                          </View>
                          {(multiSelectTitle === "Select Your Interests" ||
                            multiSelectTitle === "Select Your Personality") && (
                            <Ionicons
                              name={
                                multiSelectTitle === "Select Your Personality"
                                  ? getPersonalityIcon(option)
                                  : getInterestIcon(option)
                              }
                              size={moderateScale(20)}
                              color={
                                multiSelectTitle === "Select Your Personality"
                                  ? getPersonalityIconColor(option)
                                  : getInterestIconColor(option)
                              }
                              style={{ marginRight: moderateScale(8) }}
                            />
                          )}
                          <Text
                            style={[
                              styles.optionText,
                              isSelected && styles.optionTextSelected,
                            ]}
                          >
                            {option}
                          </Text>
                        </View>
                        {isSelected && (
                          <Ionicons
                            name="checkmark-circle"
                            size={moderateScale(24)}
                            color={themeSecond.accentPurple}
                          />
                        )}
                      </TouchableOpacity>
                    );
                  })}
              </ScrollView>

              <View style={styles.multiSelectFooter}>
                <Text style={styles.selectedCountText}>
                  {multiSelectTitle === "Select Your Interests"
                    ? `${multiSelectCurrentValues.length}/${MAX_INTERESTS} selected`
                    : multiSelectTitle === "Select Your Personality"
                    ? `${multiSelectCurrentValues.length}/${MAX_PERSONALITY_OPTIONS} selected`
                    : `${multiSelectCurrentValues.length} selected`}
                </Text>
                <TouchableOpacity
                  style={[
                    styles.confirmButton,
                    styles.multiSelectConfirmButton,
                  ]}
                  onPress={confirmMultiSelect}
                  activeOpacity={0.8}
                >
                  <Text style={styles.confirmButtonText}>Confirm</Text>
                  <View style={{ marginLeft: moderateScale(8) }}>
                    <Ionicons
                      name="checkmark-circle"
                      size={moderateScale(22)}
                      color="#fff"
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </Animated.View>
        </Modal>

        {/* Full Screen Image Viewer Modal */}
        <Modal
          animationType="none"
          transparent={true}
          visible={imageViewerVisible}
          onRequestClose={closeImageViewer}
          statusBarTranslucent
        >
          <Animated.View
            style={[
              styles.imageViewerOverlay,
              { opacity: imageViewerFadeAnim },
            ]}
          >
            <Pressable
              style={styles.imageViewerBackdrop}
              onPress={closeImageViewer}
            >
              <View style={styles.imageViewerCloseArea} />
            </Pressable>

            {/* Close Button */}
            <TouchableOpacity
              style={styles.imageViewerCloseButton}
              onPress={closeImageViewer}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={moderateScale(28)} color="#FFFFFF" />
            </TouchableOpacity>

            {/* Image Gallery */}
            <Animated.View
              style={[
                styles.imageViewerContainer,
                {
                  transform: [{ scale: imageViewerScaleAnim }],
                },
              ]}
            >
              <FlatList<ProfileImage>
                data={getAvailableImages()}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item: ProfileImage) => item.id}
                initialScrollIndex={selectedImageIndex}
                getItemLayout={(
                  _data: ArrayLike<ProfileImage> | null | undefined,
                  index: number
                ) => {
                  const itemWidth = moderateScale(300);
                  return {
                    length: itemWidth,
                    offset: itemWidth * index,
                    index,
                  };
                }}
                onMomentumScrollEnd={(event: any) => {
                  const itemWidth = moderateScale(300);
                  const newIndex = Math.round(
                    event.nativeEvent.contentOffset.x / itemWidth
                  );
                  setSelectedImageIndex(newIndex);
                }}
                renderItem={({ item }: { item: ProfileImage }) => (
                  <View style={styles.imageViewerItem}>
                    <Image
                      source={{ uri: item.image_url }}
                      style={styles.imageViewerImage}
                      resizeMode="contain"
                    />
                  </View>
                )}
              />

              {/* Image Index Indicator */}
              {getAvailableImages().length > 1 && (
                <View style={styles.imageViewerIndicator}>
                  <Text style={styles.imageViewerIndicatorText}>
                    {selectedImageIndex + 1} / {getAvailableImages().length}
                  </Text>
                </View>
              )}
            </Animated.View>
          </Animated.View>
        </Modal>
      </SafeAreaView>
    </View>
  );
};

export default InitialProfileSetupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeSecond.bgDark,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: moderateScale(16),
    paddingVertical: verticalScale(12),
    borderBottomWidth: 1,
    borderBottomColor: themeSecond.borderLight,
  },
  headerTitle: {
    ...typography.h3,
    color: themeSecond.textPrimary,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: moderateScale(16),
    paddingBottom: verticalScale(40),
  },
  photosSection: {
    borderRadius: moderateScale(20),
    padding: moderateScale(16),
    marginBottom: verticalScale(16),
    overflow: "hidden",
    width: "100%",
    borderWidth: moderateScale(1),
    ...Platform.select({
      ios: {
        backgroundColor: themeSecond.glassBg,
        borderColor: themeSecond.glassBorder,
        shadowColor: themeSecond.shadowBlack,
        shadowOffset: { width: 0, height: verticalScale(8) },
        shadowOpacity: 0.2,
        shadowRadius: moderateScale(20),
        elevation: 0,
      },
      android: {
        backgroundColor: "rgba(24, 20, 38, 0.98)",
        borderColor: themeSecond.borderMedium,
        shadowColor: "transparent",
        shadowOpacity: 0,
        shadowRadius: 0,
        shadowOffset: { width: 0, height: 0 },
        elevation: moderateScale(4),
      },
      default: {
        backgroundColor: themeSecond.glassBg,
        borderColor: themeSecond.glassBorder,
        shadowColor: themeSecond.shadowBlack,
        shadowOffset: { width: 0, height: verticalScale(8) },
        shadowOpacity: 0.2,
        shadowRadius: moderateScale(20),
        elevation: 0,
      },
    }),
  },
  photosSectionError: {
    borderColor: themeSecond.statusError,
    borderWidth: moderateScale(2),
  },
  photosSectionErrorText: {
    ...typography.caption,
    color: themeSecond.statusError,
    marginBottom: verticalScale(10),
    fontSize: moderateScale(12),
  },
  photosSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(4),
  },
  tileTitle: {
    ...typography.h3,
    color: themeSecond.textPrimary,
    marginBottom: verticalScale(12),
    fontWeight: "600",
  },
  photosGallery: {
    flexDirection: "row",
    gap: moderateScale(12),
    height: verticalScale(320),
    width: "100%",
    alignSelf: "stretch",
    overflow: "hidden",
  },
  photoLarge: {
    flex: 1.65,
    borderRadius: moderateScale(20),
    overflow: "hidden",
    backgroundColor: themeSecond.surfaceCardDark,
    flexShrink: 1,
    position: "relative",
    ...Platform.select({
      ios: {
        shadowColor: themeSecond.shadowBlack,
        shadowOffset: { width: 0, height: verticalScale(8) },
        shadowOpacity: 0.25,
        shadowRadius: moderateScale(20),
        elevation: 0,
        borderWidth: moderateScale(2),
        borderColor: themeSecond.accentPurpleMedium,
      },
      android: {
        shadowColor: "transparent",
        shadowOpacity: 0,
        shadowRadius: 0,
        shadowOffset: { width: 0, height: 0 },
        elevation: moderateScale(10),
        borderWidth: moderateScale(1),
        borderColor: themeSecond.borderStrong,
      },
      default: {
        shadowColor: themeSecond.shadowBlack,
        shadowOffset: { width: 0, height: verticalScale(8) },
        shadowOpacity: 0.25,
        shadowRadius: moderateScale(20),
        elevation: 0,
        borderWidth: moderateScale(2),
        borderColor: themeSecond.accentPurpleMedium,
      },
    }),
  },
  mainPhotoTag: {
    position: "absolute",
    top: moderateScale(12),
    left: moderateScale(12),
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: themeSecond.surfaceWhiteLight,
    paddingHorizontal: moderateScale(10),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(20),
    zIndex: 10,
    borderWidth: moderateScale(1),
    ...Platform.select({
      ios: {
        borderColor: themeSecond.glassBorder,
        shadowColor: themeSecond.shadowBlack,
        shadowOffset: { width: 0, height: verticalScale(2) },
        shadowOpacity: 0.15,
        shadowRadius: moderateScale(4),
        elevation: 0,
      },
      android: {
        borderColor: themeSecond.borderStrong,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        shadowColor: "transparent",
        shadowOpacity: 0,
        shadowRadius: 0,
        shadowOffset: { width: 0, height: 0 },
        elevation: moderateScale(3),
      },
      default: {
        borderColor: themeSecond.glassBorder,
        shadowColor: themeSecond.shadowBlack,
        shadowOffset: { width: 0, height: verticalScale(2) },
        shadowOpacity: 0.15,
        shadowRadius: moderateScale(4),
        elevation: 0,
      },
    }),
  },
  mainPhotoTagIcon: {
    marginRight: moderateScale(4),
  },
  mainPhotoTagText: {
    ...typography.caption,
    color: themeSecond.textPrimary,
    fontWeight: "700",
    fontSize: moderateScale(11),
    letterSpacing: moderateScale(0.5),
  },
  photoPlaceholderLarge: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: moderateScale(20),
    borderStyle: "dashed",
    ...Platform.select({
      ios: {
        backgroundColor: themeSecond.accentPurpleSubtle,
        borderWidth: moderateScale(2),
        borderColor: themeSecond.accentPurple,
      },
      android: {
        backgroundColor: "rgba(168, 85, 247, 0.12)",
        borderWidth: moderateScale(1),
        borderColor: themeSecond.borderMedium,
      },
      default: {
        backgroundColor: themeSecond.accentPurpleSubtle,
        borderWidth: moderateScale(2),
        borderColor: themeSecond.accentPurple,
      },
    }),
  },
  photosRightColumn: {
    flex: 1,
    gap: moderateScale(12),
    minWidth: 0,
    flexShrink: 1,
  },
  photoSmall: {
    flex: 1,
    borderRadius: moderateScale(18),
    overflow: "hidden",
    backgroundColor: themeSecond.surfaceCardDark,
    ...Platform.select({
      ios: {
        shadowColor: themeSecond.shadowBlack,
        shadowOffset: { width: 0, height: verticalScale(6) },
        shadowOpacity: 0.2,
        shadowRadius: moderateScale(16),
        elevation: 0,
        borderWidth: moderateScale(2),
        borderColor: themeSecond.accentPurpleMedium,
      },
      android: {
        shadowColor: "transparent",
        shadowOpacity: 0,
        shadowRadius: 0,
        shadowOffset: { width: 0, height: 0 },
        elevation: moderateScale(8),
        borderWidth: moderateScale(1),
        borderColor: themeSecond.borderStrong,
      },
      default: {
        shadowColor: themeSecond.shadowBlack,
        shadowOffset: { width: 0, height: verticalScale(6) },
        shadowOpacity: 0.2,
        shadowRadius: moderateScale(16),
        elevation: 0,
        borderWidth: moderateScale(2),
        borderColor: themeSecond.accentPurpleMedium,
      },
    }),
  },
  photoPlaceholderSmall: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: moderateScale(18),
    borderStyle: "dashed",
    ...Platform.select({
      ios: {
        backgroundColor: themeSecond.accentPurpleSubtle,
        borderWidth: moderateScale(1.5),
        borderColor: themeSecond.accentPurple,
      },
      android: {
        backgroundColor: "rgba(168, 85, 247, 0.1)",
        borderWidth: moderateScale(1),
        borderColor: themeSecond.borderMedium,
      },
      default: {
        backgroundColor: themeSecond.accentPurpleSubtle,
        borderWidth: moderateScale(1.5),
        borderColor: themeSecond.accentPurple,
      },
    }),
  },
  photoDeleteButton: {
    position: "absolute",
    top: moderateScale(10),
    right: moderateScale(10),
    width: moderateScale(26),
    height: moderateScale(26),
    borderRadius: moderateScale(13),
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  deleteButtonBackdrop: {
    width: "100%",
    height: "100%",
    borderRadius: moderateScale(13),
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: moderateScale(1),
    borderColor: "rgba(255, 0, 0, 0.25)",
    ...Platform.select({
      ios: {
        shadowColor: "#FF0000",
        shadowOffset: { width: 0, height: verticalScale(2) },
        shadowOpacity: 0.6,
        shadowRadius: moderateScale(6),
        elevation: 0,
      },
      android: {
        shadowColor: "transparent",
        shadowOpacity: 0,
        shadowRadius: 0,
        shadowOffset: { width: 0, height: 0 },
        elevation: moderateScale(4),
      },
      default: {
        shadowColor: "#FF0000",
        shadowOffset: { width: 0, height: verticalScale(2) },
        shadowOpacity: 0.6,
        shadowRadius: moderateScale(6),
        elevation: 0,
      },
    }),
  },
  photoDeleteButtonSmall: {
    position: "absolute",
    top: moderateScale(8),
    right: moderateScale(8),
    width: moderateScale(24),
    height: moderateScale(24),
    borderRadius: moderateScale(12),
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  deleteButtonBackdropSmall: {
    width: "100%",
    height: "100%",
    borderRadius: moderateScale(12),
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: moderateScale(1),
    borderColor: "rgba(255, 0, 0, 0.25)",
    ...Platform.select({
      ios: {
        shadowColor: "#FF0000",
        shadowOffset: { width: 0, height: verticalScale(2) },
        shadowOpacity: 0.5,
        shadowRadius: moderateScale(4),
        elevation: 0,
      },
      android: {
        shadowColor: "transparent",
        shadowOpacity: 0,
        shadowRadius: 0,
        shadowOffset: { width: 0, height: 0 },
        elevation: moderateScale(4),
      },
      default: {
        shadowColor: "#FF0000",
        shadowOffset: { width: 0, height: verticalScale(2) },
        shadowOpacity: 0.5,
        shadowRadius: moderateScale(4),
        elevation: 0,
      },
    }),
  },
  addPhotosButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: verticalScale(12),
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(10),
    borderStyle: "dashed",
    gap: moderateScale(8),
    ...Platform.select({
      ios: {
        borderWidth: moderateScale(1.5),
        borderColor: themeSecond.accentPurple,
      },
      android: {
        borderWidth: moderateScale(1),
        borderColor: themeSecond.borderMedium,
        backgroundColor: "rgba(168, 85, 247, 0.08)",
      },
      default: {
        borderWidth: moderateScale(1.5),
        borderColor: themeSecond.accentPurple,
      },
    }),
  },
  addPhotosButtonDisabled: {
    opacity: 0.4,
    ...Platform.select({
      ios: {
        borderColor: themeSecond.textSoft,
      },
      android: {
        borderColor: themeSecond.borderMedium,
        backgroundColor: "transparent",
      },
      default: {
        borderColor: themeSecond.textSoft,
      },
    }),
  },
  addPhotosText: {
    ...typography.bodyMedium,
    color: themeSecond.accentPurple,
    fontWeight: "600",
  },
  addPhotosTextDisabled: {
    color: themeSecond.textSoft,
  },
  AboutMeSection: {
    borderRadius: moderateScale(16),
    padding: moderateScale(16),
    marginBottom: verticalScale(16),
    borderWidth: moderateScale(1),
    ...Platform.select({
      ios: {
        backgroundColor: themeSecond.glassBg,
        borderColor: themeSecond.borderLight,
        shadowColor: themeSecond.textPrimary,
        shadowOffset: { width: 0, height: verticalScale(2) },
        shadowOpacity: 0.08,
        shadowRadius: moderateScale(8),
        elevation: 0,
      },
      android: {
        backgroundColor: "rgba(24, 20, 38, 0.98)",
        borderColor: themeSecond.borderMedium,
        shadowColor: "transparent",
        shadowOpacity: 0,
        shadowRadius: 0,
        shadowOffset: { width: 0, height: 0 },
        elevation: moderateScale(3),
      },
      default: {
        backgroundColor: themeSecond.glassBg,
        borderColor: themeSecond.borderLight,
        shadowColor: themeSecond.textPrimary,
        shadowOffset: { width: 0, height: verticalScale(2) },
        shadowOpacity: 0.08,
        shadowRadius: moderateScale(8),
        elevation: 0,
      },
    }),
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: verticalScale(16),
  },
  sectionHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(10),
  },
  sectionIconContainer: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(10),
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        backgroundColor: `${themeSecond.accentPurple}20`,
      },
      android: {
        backgroundColor: "rgba(168, 85, 247, 0.22)",
        borderWidth: moderateScale(1),
        borderColor: themeSecond.borderMedium,
      },
      default: { backgroundColor: `${themeSecond.accentPurple}20` },
    }),
  },
  bioCard: {
    borderRadius: moderateScale(14),
    padding: moderateScale(14),
    marginBottom: verticalScale(16),
    ...Platform.select({
      ios: {
        backgroundColor: themeSecond.glassBg,
        borderWidth: moderateScale(1.5),
        borderColor: `${themeSecond.accentPurple}30`,
      },
      android: {
        backgroundColor: "rgba(28, 22, 42, 0.95)",
        borderWidth: moderateScale(1),
        borderColor: themeSecond.borderMedium,
      },
      default: {
        backgroundColor: themeSecond.glassBg,
        borderWidth: moderateScale(1.5),
        borderColor: `${themeSecond.accentPurple}30`,
      },
    }),
  },
  bioHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(8),
    marginBottom: verticalScale(10),
  },
  bioLabel: {
    ...typography.bodyMedium,
    color: themeSecond.textPrimary,
    fontWeight: "600",
  },
  quickInfoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: moderateScale(10),
    marginBottom: verticalScale(16),
  },
  quickInfoCard: {
    flex: 1,
    minWidth: "47%",
    borderRadius: moderateScale(12),
    padding: moderateScale(12),
    alignItems: "center",
    ...Platform.select({
      ios: {
        backgroundColor: themeSecond.glassBg,
        borderWidth: moderateScale(1.5),
        borderColor: themeSecond.borderLight,
      },
      android: {
        backgroundColor: "rgba(28, 22, 42, 0.92)",
        borderWidth: moderateScale(1),
        borderColor: themeSecond.borderMedium,
      },
      default: {
        backgroundColor: themeSecond.glassBg,
        borderWidth: moderateScale(1.5),
        borderColor: themeSecond.borderLight,
      },
    }),
  },
  quickInfoCardError: {
    borderColor: themeSecond.statusError,
    borderWidth: 2,
  },
  quickInfoIcon: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(10),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: verticalScale(8),
    ...Platform.select({
      ios: {
        backgroundColor: `${themeSecond.accentPurple}20`,
      },
      android: {
        backgroundColor: "rgba(168, 85, 247, 0.18)",
        borderWidth: moderateScale(1),
        borderColor: themeSecond.borderMedium,
      },
      default: { backgroundColor: `${themeSecond.accentPurple}20` },
    }),
  },
  quickInfoLabel: {
    ...typography.caption,
    marginBottom: verticalScale(4),
    textAlign: "center",
    ...Platform.select({
      ios: { color: themeSecond.textSoft },
      android: { color: themeSecond.textMuted },
      default: { color: themeSecond.textSoft },
    }),
  },
  quickInfoValue: {
    ...typography.bodySmall,
    color: themeSecond.textPrimary,
    fontWeight: "600",
    textAlign: "center",
  },
  quickInfoError: {
    ...typography.caption,
    color: themeSecond.statusError,
    marginTop: verticalScale(4),
    textAlign: "center",
    fontSize: moderateScale(10),
  },
  detailedInfoRow: {
    gap: verticalScale(10),
    marginBottom: verticalScale(16),
  },
  detailedInfoCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: moderateScale(12),
    padding: moderateScale(14),
    gap: moderateScale(12),
    ...Platform.select({
      ios: {
        backgroundColor: themeSecond.glassBg,
        borderWidth: moderateScale(1.5),
        borderColor: themeSecond.borderLight,
      },
      android: {
        backgroundColor: "rgba(28, 22, 42, 0.92)",
        borderWidth: moderateScale(1),
        borderColor: themeSecond.borderMedium,
      },
      default: {
        backgroundColor: themeSecond.glassBg,
        borderWidth: moderateScale(1.5),
        borderColor: themeSecond.borderLight,
      },
    }),
  },
  detailedInfoCardError: {
    borderColor: themeSecond.statusError,
    borderWidth: 2,
  },
  detailedInfoIcon: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(12),
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        backgroundColor: `${themeSecond.accentPurple}20`,
      },
      android: {
        backgroundColor: "rgba(168, 85, 247, 0.18)",
        borderWidth: moderateScale(1),
        borderColor: themeSecond.borderMedium,
      },
      default: { backgroundColor: `${themeSecond.accentPurple}20` },
    }),
  },
  detailedInfoContent: {
    flex: 1,
  },
  detailedInfoLabel: {
    ...typography.caption,
    marginBottom: verticalScale(2),
    ...Platform.select({
      ios: { color: themeSecond.textSoft },
      android: { color: themeSecond.textMuted },
      default: { color: themeSecond.textSoft },
    }),
  },
  detailedInfoValue: {
    ...typography.bodyMedium,
    color: themeSecond.textPrimary,
    fontWeight: "500",
  },
  detailedInfoError: {
    ...typography.caption,
    color: themeSecond.statusError,
    marginTop: verticalScale(4),
    fontSize: moderateScale(10),
  },
  multiSelectCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: moderateScale(12),
    padding: moderateScale(14),
    marginBottom: verticalScale(10),
    gap: moderateScale(12),
    ...Platform.select({
      ios: {
        backgroundColor: themeSecond.glassBg,
        borderWidth: moderateScale(1.5),
        borderColor: themeSecond.borderLight,
      },
      android: {
        backgroundColor: "rgba(28, 22, 42, 0.92)",
        borderWidth: moderateScale(1),
        borderColor: themeSecond.borderMedium,
      },
      default: {
        backgroundColor: themeSecond.glassBg,
        borderWidth: moderateScale(1.5),
        borderColor: themeSecond.borderLight,
      },
    }),
  },
  multiSelectCardError: {
    borderColor: themeSecond.statusError,
    borderWidth: 2,
  },
  multiSelectIcon: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(12),
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        backgroundColor: `${themeSecond.accentPurple}20`,
      },
      android: {
        backgroundColor: "rgba(168, 85, 247, 0.18)",
        borderWidth: moderateScale(1),
        borderColor: themeSecond.borderMedium,
      },
      default: { backgroundColor: `${themeSecond.accentPurple}20` },
    }),
  },
  multiSelectContent: {
    flex: 1,
  },
  multiSelectLabel: {
    ...typography.caption,
    marginBottom: verticalScale(2),
    ...Platform.select({
      ios: { color: themeSecond.textSoft },
      android: { color: themeSecond.textMuted },
      default: { color: themeSecond.textSoft },
    }),
  },
  multiSelectValue: {
    ...typography.bodyMedium,
    color: themeSecond.textPrimary,
    fontWeight: "500",
  },
  multiSelectError: {
    ...typography.caption,
    color: themeSecond.statusError,
    marginTop: verticalScale(4),
    fontSize: moderateScale(10),
  },
  textArea: {
    backgroundColor: themeSecond.surfaceDark,
    borderRadius: moderateScale(12),
    padding: moderateScale(12),
    textAlignVertical: "top",
    height: verticalScale(100),
    ...typography.bodySmall,
    color: themeSecond.textPrimary,
    ...Platform.select({
      ios: {
        borderColor: `${themeSecond.accentPurple}40`,
        borderWidth: moderateScale(1.5),
      },
      android: {
        borderColor: themeSecond.borderMedium,
        borderWidth: moderateScale(1),
      },
      default: {
        borderColor: `${themeSecond.accentPurple}40`,
        borderWidth: moderateScale(1.5),
      },
    }),
  },
  textAreaError: {
    borderColor: themeSecond.statusError,
    borderWidth: 2,
  },
  errorText: {
    ...typography.caption,
    color: themeSecond.statusError,
    marginTop: verticalScale(4),
    fontSize: moderateScale(12),
  },
  buttonContainer: {
    marginTop: verticalScale(24),
    marginBottom: verticalScale(20),
  },
  button: {
    width: "100%",
  },
  completeSetupButton: {
    width: "100%",
    alignSelf: "stretch",
    backgroundColor: themeSecond.accentPurple,
    borderRadius: moderateScale(14),
    shadowColor: themeSecond.shadowPurple,
    shadowOpacity: 0.4,
    shadowRadius: moderateScale(12),
    shadowOffset: { width: 0, height: verticalScale(4) },
    elevation: moderateScale(8),
  },
  completeSetupButtonText: {
    color: themeSecond.textPrimary,
    fontWeight: "700",
    letterSpacing: moderateScale(1),
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: themeSecond.overlayBlack,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
    backgroundColor: themeSecond.surfaceDark,
    borderTopLeftRadius: moderateScale(28),
    borderTopRightRadius: moderateScale(28),
    paddingBottom: verticalScale(34),
    maxHeight: "70%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -verticalScale(8) },
    shadowOpacity: 0.15,
    shadowRadius: moderateScale(24),
    elevation: moderateScale(20),
  },
  modalHeader: {
    alignItems: "center",
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(16),
    borderBottomWidth: 1,
    borderBottomColor: themeSecond.borderLight,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: themeSecond.surfaceWhiteSubtle,
    marginHorizontal: moderateScale(16),
    marginTop: verticalScale(12),
    marginBottom: verticalScale(8),
    borderRadius: moderateScale(12),
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(10),
    borderWidth: 1,
    borderColor: themeSecond.borderLight,
  },
  searchIcon: {
    marginRight: moderateScale(8),
  },
  searchInput: {
    flex: 1,
    fontSize: moderateScale(16),
    color: themeSecond.textPrimary,
    padding: 0,
  },
  clearSearchButton: {
    marginLeft: moderateScale(8),
    padding: moderateScale(4),
  },
  modalHandle: {
    width: moderateScale(40),
    height: verticalScale(4),
    backgroundColor: themeSecond.borderMedium,
    borderRadius: moderateScale(2),
    marginBottom: verticalScale(16),
  },
  modalTitle: {
    ...typography.h3,
    color: themeSecond.textPrimary,
    fontWeight: "700",
  },
  modalCloseButton: {
    position: "absolute",
    right: moderateScale(16),
    top: verticalScale(20),
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    backgroundColor: themeSecond.surfaceWhiteSubtle,
    alignItems: "center",
    justifyContent: "center",
  },
  optionsList: {
    paddingHorizontal: moderateScale(20),
    paddingTop: verticalScale(8),
    maxHeight: verticalScale(360),
  },
  optionsContent: {
    paddingBottom: verticalScale(12),
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: verticalScale(16),
    paddingHorizontal: moderateScale(16),
    borderRadius: moderateScale(14),
    marginVertical: verticalScale(4),
    backgroundColor: themeSecond.surfaceWhiteSubtle,
  },
  optionItemSelected: {
    backgroundColor: `${themeSecond.accentPurple}12`,
    borderWidth: 1.5,
    borderColor: themeSecond.accentPurple,
  },
  optionItemLast: {
    marginBottom: 0,
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  radioOuter: {
    width: moderateScale(22),
    height: moderateScale(22),
    borderRadius: moderateScale(11),
    borderWidth: 2,
    borderColor: themeSecond.borderMedium,
    alignItems: "center",
    justifyContent: "center",
    marginRight: moderateScale(14),
  },
  radioOuterSelected: {
    borderColor: themeSecond.accentPurple,
  },
  radioInner: {
    width: moderateScale(12),
    height: moderateScale(12),
    borderRadius: moderateScale(6),
    backgroundColor: themeSecond.accentPurple,
  },
  checkboxOuter: {
    width: moderateScale(22),
    height: moderateScale(22),
    borderRadius: moderateScale(6),
    borderWidth: 2,
    borderColor: themeSecond.glassBorder,
    alignItems: "center",
    justifyContent: "center",
    marginRight: moderateScale(12),
    backgroundColor: themeSecond.surfaceDark,
  },
  checkboxOuterSelected: {
    borderColor: themeSecond.accentPurple,
    backgroundColor: themeSecond.accentPurple,
  },
  optionText: {
    ...typography.bodyMedium,
    color: themeSecond.textPrimary,
    fontWeight: "500",
  },
  optionTextSelected: {
    color: themeSecond.accentPurple,
    fontWeight: "600",
  },
  multiSelectFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: moderateScale(16),
    paddingVertical: verticalScale(16),
    borderTopWidth: 1,
    borderTopColor: themeSecond.borderLight,
  },
  selectedCountText: {
    ...typography.bodyMedium,
    color: themeSecond.textSoft,
    flex: 1,
  },
  confirmButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: themeSecond.accentPurple,
    marginHorizontal: moderateScale(20),
    paddingVertical: verticalScale(16),
    borderRadius: moderateScale(14),
    gap: moderateScale(10),
    shadowColor: themeSecond.accentPurple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmButtonText: {
    ...typography.button,
    color: themeSecond.textPrimary,
    fontWeight: "700",
  },
  dobModalContent: {
    backgroundColor: themeSecond.surfaceDark,
    borderTopLeftRadius: moderateScale(28),
    borderTopRightRadius: moderateScale(28),
    paddingBottom: verticalScale(34),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -verticalScale(8) },
    shadowOpacity: 0.15,
    shadowRadius: moderateScale(24),
    elevation: moderateScale(20),
  },
  ageDisplayContainer: {
    alignItems: "center",
    paddingVertical: verticalScale(20),
  },
  ageCircle: {
    width: moderateScale(100),
    height: moderateScale(100),
    borderRadius: moderateScale(50),
    backgroundColor: `${themeSecond.accentPurple}12`,
    borderWidth: 3,
    borderColor: themeSecond.accentPurple,
    justifyContent: "center",
    alignItems: "center",
  },
  ageNumber: {
    ...typography.h1,
    color: themeSecond.accentPurple,
    fontWeight: "700",
    marginBottom: -verticalScale(4),
  },
  ageLabel: {
    ...typography.caption,
    color: themeSecond.accentPurple,
    fontWeight: "500",
  },
  datePickerContainer: {
    flexDirection: "row",
    paddingHorizontal: moderateScale(20),
    gap: moderateScale(12),
    marginBottom: verticalScale(20),
  },
  pickerColumn: {
    flex: 1,
    alignItems: "center",
  },
  pickerLabel: {
    ...typography.bodySmall,
    color: themeSecond.textSoft,
    fontWeight: "600",
    marginBottom: verticalScale(10),
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  pickerScroll: {
    height: verticalScale(180),
    width: "100%",
    backgroundColor: themeSecond.surfaceWhiteSubtle,
    borderRadius: moderateScale(16),
  },
  pickerScrollContent: {
    paddingVertical: verticalScale(8),
  },
  pickerItem: {
    paddingVertical: verticalScale(12),
    paddingHorizontal: moderateScale(8),
    marginHorizontal: moderateScale(6),
    marginVertical: verticalScale(2),
    borderRadius: moderateScale(10),
    alignItems: "center",
  },
  pickerItemSelected: {
    backgroundColor: themeSecond.accentPurple,
  },
  pickerItemText: {
    ...typography.bodyMedium,
    color: themeSecond.textPrimary,
    fontWeight: "500",
  },
  pickerItemTextSelected: {
    color: themeSecond.textPrimary,
    fontWeight: "700",
  },
  selectedDatePreview: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: `${themeSecond.accentPurple}08`,
    marginHorizontal: moderateScale(20),
    paddingVertical: verticalScale(14),
    paddingHorizontal: moderateScale(20),
    borderRadius: moderateScale(14),
    gap: moderateScale(10),
    marginBottom: verticalScale(16),
    borderWidth: 1,
    borderColor: `${themeSecond.accentPurple}20`,
  },
  selectedDateText: {
    ...typography.bodyMedium,
    color: themeSecond.accentPurple,
    fontWeight: "600",
  },
  multiSelectConfirmButton: {
    marginHorizontal: 0,
    paddingHorizontal: moderateScale(20),
    minWidth: moderateScale(120),
  },
  // Swap/Reorder Styles
  cancelSwapButton: {
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(16),
    borderWidth: moderateScale(1),
    ...Platform.select({
      ios: {
        backgroundColor: `${themeSecond.accentPurple}15`,
        borderColor: "transparent",
      },
      android: {
        backgroundColor: "rgba(168, 85, 247, 0.15)",
        borderColor: themeSecond.borderMedium,
      },
      default: {
        backgroundColor: `${themeSecond.accentPurple}15`,
        borderColor: "transparent",
      },
    }),
  },
  cancelSwapText: {
    ...typography.bodySmall,
    color: themeSecond.accentPurple,
    fontWeight: "600",
  },
  swapHintContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(8),
    marginBottom: verticalScale(12),
    gap: moderateScale(8),
    borderWidth: moderateScale(1),
    ...Platform.select({
      ios: {
        backgroundColor: `${themeSecond.accentPurple}10`,
        borderColor: "transparent",
      },
      android: {
        backgroundColor: "rgba(168, 85, 247, 0.14)",
        borderColor: themeSecond.borderMedium,
      },
      default: {
        backgroundColor: `${themeSecond.accentPurple}10`,
        borderColor: "transparent",
      },
    }),
  },
  swapHintText: {
    ...typography.bodySmall,
    fontWeight: "500",
    ...Platform.select({
      ios: {
        color: themeSecond.accentPurple,
      },
      android: {
        color: themeSecond.textPrimary,
      },
      default: {
        color: themeSecond.accentPurple,
      },
    }),
  },
  swapTargetHighlight: {
    borderStyle: "dashed",
    borderColor: themeSecond.statusSuccess,
    ...Platform.select({
      ios: { borderWidth: moderateScale(2) },
      android: { borderWidth: moderateScale(1) },
      default: { borderWidth: moderateScale(2) },
    }),
  },
  swapTargetHighlightSmall: {
    borderStyle: "dashed",
    borderColor: themeSecond.statusSuccess,
    ...Platform.select({
      ios: { borderWidth: moderateScale(2) },
      android: { borderWidth: moderateScale(1) },
      default: { borderWidth: moderateScale(2) },
    }),
  },
  selectedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: themeSecond.overlayBlack,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: themeSecond.accentPurple,
    paddingHorizontal: moderateScale(14),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(20),
    gap: moderateScale(6),
  },
  selectedBadgeText: {
    ...typography.bodySmall,
    color: themeSecond.textPrimary,
    fontWeight: "600",
  },
  selectedOverlaySmall: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: themeSecond.overlayBlack,
    justifyContent: "center",
    alignItems: "center",
  },
  swapTargetOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: themeSecond.overlayBlack,
    justifyContent: "center",
    alignItems: "center",
  },
  swapTargetBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: themeSecond.statusSuccess,
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(16),
    gap: moderateScale(4),
  },
  swapTargetBadgeText: {
    ...typography.caption,
    color: themeSecond.textPrimary,
    fontWeight: "600",
  },
  swapTargetOverlaySmall: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: themeSecond.overlayBlack,
    justifyContent: "center",
    alignItems: "center",
  },
  longPressHint: {
    ...typography.caption,
    textAlign: "center",
    marginTop: verticalScale(8),
    fontStyle: "italic",
    ...Platform.select({
      ios: { color: themeSecond.textSoft },
      android: { color: themeSecond.textMuted },
      default: { color: themeSecond.textSoft },
    }),
  },
  // Image Viewer Styles
  imageViewerOverlay: {
    flex: 1,
    backgroundColor: themeSecond.overlayBlack,
    justifyContent: "center",
    alignItems: "center",
  },
  imageViewerBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  imageViewerCloseArea: {
    flex: 1,
  },
  imageViewerCloseButton: {
    position: "absolute",
    top: moderateScale(50),
    right: moderateScale(20),
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(22),
    backgroundColor: themeSecond.overlayBlack,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  imageViewerContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  imageViewerItem: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  imageViewerImage: {
    width: "100%",
    height: "100%",
  },
  imageViewerIndicator: {
    position: "absolute",
    bottom: moderateScale(40),
    alignSelf: "center",
    backgroundColor: themeSecond.overlayBlack,
    paddingHorizontal: moderateScale(16),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(20),
  },
  imageViewerIndicatorText: {
    ...typography.bodySmall,
    color: themeSecond.textPrimary,
    fontWeight: "600",
  },
});
