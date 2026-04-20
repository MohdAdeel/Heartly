import {
  Text,
  View,
  Modal,
  Image,
  Platform,
  Animated,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  SkeletonBox,
  SkeletonShimmer,
  useShimmerAnimation,
} from "../components/SkeletonLoader";
import {
  months,
  ageRanges,
  casteIndia,
  heightOptions,
  castePakistan,
  religionOptions,
  locationOptions,
  interestsOptions,
  languagesOptions,
  educationOptions,
  casteAfghanistan,
  professionOptions,
  personalityOptions,
  IslamSectionOptions,
  formatCountryWithFlag,
  SikhismSectionOptions,
  JudaismSectionOptions,
  JainismSectionOptions,
  HinduismSectionOptions,
  BuddhismSectionOptions,
  religiusBackgroundOptions,
  ChristianitySectionOptions,
  partnerSameEthnicityOptions,
  relationshipPreferenceOptions,
  partnerReligionImportanceOptions,
} from "../constants/MultiSelects";
import {
  getInterestIcon,
  getPersonalityIcon,
  getInterestIconColor,
  getPersonalityIconColor,
} from "../utils/optionIcons";
import FastImage from "react-native-fast-image";
import { useAlerts } from "../components/Alert";
import { useAuth } from "../context/AuthContext";
import React, { useRef, useEffect } from "react";
import { themeSecond } from "../theme/colorSecond";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";
import GetVerifiedTile from "../components/GetVerifiedTile";
import { SafeAreaView } from "react-native-safe-area-context";
import type { MainStackScreenProps } from "../types/navigation.types";
import { moderateScale, verticalScale, scale } from "react-native-size-matters";

type NavigationProp = MainStackScreenProps<"ProfileScreen">["navigation"];
type ProfileImage = {
  id: string;
  image_url: string;
  position: number;
};

const MAX_INTERESTS = 10;
const MAX_PERSONALITY_OPTIONS = 5;

const ProfileSettingScreenSecond = () => {
  const navigation = useNavigation<NavigationProp>();
  const { profile, user } = useAuth();
  const { showAlert } = useAlerts();

  const [selectedBio, setSelectedBio] = React.useState<string>("");
  const [selectedProfession, setSelectedProfession] =
    React.useState<string>("");
  const [selectedEducation, setSelectedEducation] = React.useState<string>("");
  const [selectedHeight, setSelectedHeight] = React.useState<string>("");
  const [selectedReligiousBackground, setSelectedReligiousBackground] =
    React.useState<string>("");
  const [selectedReligion, setSelectedReligion] = React.useState<string>("");
  const [selectedSect, setSelectedSect] = React.useState<string>("");
  const [selectedLocation, setSelectedLocation] = React.useState<string>("");
  const [selectedLanguages, setSelectedLanguages] = React.useState<string[]>(
    []
  );
  const [selectedInterests, setSelectedInterests] = React.useState<string[]>(
    []
  );
  const [selectedPersonality, setSelectedPersonality] = React.useState<
    string[]
  >([]);
  const [selectedAgePartner, setSelectedAgePartner] =
    React.useState<string>("");
  const [selectedPartnerEthnicPreference, setSelectedPartnerEthnicPreference] =
    React.useState<string>("");
  const [selectedReligionPartner, setSelectedReligionPartner] =
    React.useState<string>("");
  const [selectedRelationshipPreference, setSelectedRelationshipPreference] =
    React.useState<string>("");
  const [selectedCaste, setSelectedCaste] = React.useState<string>("");
  const [currentOptions, setCurrentOptions] = React.useState<
    string[] | Array<{ name: string; flag: string; value: string }>
  >([]);
  const [modalTitle, setModalTitle] = React.useState<string>("");
  const [currentSetter, setCurrentSetter] = React.useState<
    ((value: string) => void) | null
  >(null);
  const [currentValue, setCurrentValue] = React.useState<string>("");
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  const [multiSelectModalVisible, setMultiSelectModalVisible] =
    React.useState(false);
  const [multiSelectOptions, setMultiSelectOptions] = React.useState<string[]>(
    []
  );
  const [multiSelectTitle, setMultiSelectTitle] = React.useState<string>("");
  const [multiSelectCurrentValues, setMultiSelectCurrentValues] =
    React.useState<string[]>([]);
  const [multiSelectSetter, setMultiSelectSetter] = React.useState<
    ((values: string[]) => void) | null
  >(null);
  const [multiSelectSearchQuery, setMultiSelectSearchQuery] =
    React.useState<string>("");

  const [profileImages, setProfileImages] = React.useState<ProfileImage[]>([]);
  const [imagesLoading, setImagesLoading] = React.useState(false);
  const [isProfileSeeded, setIsProfileSeeded] = React.useState(false);
  const [uploadingImage, setUploadingImage] = React.useState(false);
  const [selectedForSwap, setSelectedForSwap] =
    React.useState<ProfileImage | null>(null);

  const [dobModalVisible, setDobModalVisible] = React.useState(false);
  const [selectedDay, setSelectedDay] = React.useState<number>(15);
  const [selectedMonth, setSelectedMonth] = React.useState<number>(6);
  const [selectedYear, setSelectedYear] = React.useState<number>(1995);
  const [dateOfBirth, setDateOfBirth] = React.useState<string>("");

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(moderateScale(50))).current;
  const multiFadeAnim = useRef(new Animated.Value(0)).current;
  const multiScaleAnim = useRef(new Animated.Value(0.8)).current;
  const multiSlideAnim = useRef(new Animated.Value(moderateScale(50))).current;
  const dobFadeAnim = useRef(new Animated.Value(0)).current;
  const dobScaleAnim = useRef(new Animated.Value(0.8)).current;
  const dobSlideAnim = useRef(new Animated.Value(moderateScale(50))).current;

  const isInitialLoad = useRef(true);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousValuesRef = useRef<Record<string, any>>({});
  const [barContainerWidth, setBarContainerWidth] = React.useState(0);
  const strengthBarWidth = useRef(new Animated.Value(0)).current;
  const strengthPercentage = useRef(new Animated.Value(0)).current;
  const swapPulseAnim = useRef(new Animated.Value(1)).current;
  const [animatedPercentage, setAnimatedPercentage] = React.useState(0);

  const profileStrength = React.useMemo(() => {
    if (!profile) return 0;
    let strength = 100;
    const photoDeduction = 25;
    const maxPhotosForFullCredit = 3;
    const photoCreditPerImage = photoDeduction / maxPhotosForFullCredit;
    const imagesCount = Math.min(profileImages.length, maxPhotosForFullCredit);
    strength -= photoDeduction - imagesCount * photoCreditPerImage;
    if (!profile.isVerified) strength -= 25;
    const criticalFields = [
      profile.bio,
      profile.occupation,
      profile.education_level,
      profile.height,
      profile.religiosity_level,
      profile.country,
      profile.date_of_birth,
    ];
    strength -= criticalFields.filter((f) => !f || f === "").length * 2;
    if ((profile.languages || []).length === 0) strength -= 3;
    if ((profile.interests || []).length === 0) strength -= 3;
    const partnerPrefs = [
      profile.partner_age_range_preference,
      profile.partner_religion_importance,
      profile.partner_ethnic_preference,
    ];
    strength -= partnerPrefs.filter((p) => !p || p === "").length * 2;
    return Math.max(0, Math.min(100, strength));
  }, [profile, profileImages]);

  useEffect(() => {
    const id = strengthPercentage.addListener(({ value }) => {
      setAnimatedPercentage(Math.round(value));
    });
    return () => strengthPercentage.removeListener(id);
  }, []);

  useEffect(() => {
    if (barContainerWidth > 0) {
      const targetWidth = (barContainerWidth * profileStrength) / 100;
      Animated.parallel([
        Animated.timing(strengthBarWidth, {
          toValue: targetWidth,
          duration: 1500,
          useNativeDriver: false,
        }),
        Animated.timing(strengthPercentage, {
          toValue: profileStrength,
          duration: 1500,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [profileStrength, barContainerWidth]);

  const fetchProfileImages = async () => {
    setImagesLoading(false);
  };

  useEffect(() => {
    fetchProfileImages();
  }, [user?.id]);

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
      default:
        return [];
    }
  };

  const getCasteOptions = (location: string): string[] => {
    if (location === "Pakistan") return castePakistan;
    if (location === "India") return casteIndia;
    if (location === "Afghanistan") return casteAfghanistan;
    return [];
  };

  const getSortedCasteOptions = (location: string): string[] =>
    [...getCasteOptions(location)].sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: "base" })
    );

  const handleReligionSelection = (religion: string) => {
    setSelectedReligion(religion);
    if (
      !["Atheist", "Agnostic", "Prefer not to say"].includes(religion) &&
      getSectOptions(religion).length === 0
    ) {
      setSelectedSect("");
    }
    if (
      religion === "Atheist" ||
      religion === "Agnostic" ||
      religion === "Prefer not to say"
    ) {
      setSelectedSect("");
    }
  };

  useEffect(() => {
    if (
      !["Pakistan", "India", "Afghanistan"].includes(selectedLocation || "")
    ) {
      setSelectedCaste("");
    }
  }, [selectedLocation]);

  useEffect(() => {
    if (!profile) {
      setIsProfileSeeded(false);
      return;
    }

    if (profile) {
      setSelectedBio(profile.bio || "");
      setSelectedProfession(profile.occupation || "");
      setSelectedEducation(profile.education_level || "");
      setSelectedHeight(profile.height || "");
      setSelectedReligiousBackground(profile.religiosity_level || "");
      setSelectedReligion(profile.religion || "");
      setSelectedSect(profile.sect || "");
      setSelectedLocation(profile.country || "");
      setSelectedCaste(profile.caste || "");
      setDateOfBirth(profile.date_of_birth || "");
      setSelectedLanguages(
        Array.isArray(profile.languages)
          ? profile.languages
          : profile.languages
          ? [profile.languages]
          : []
      );
      setSelectedInterests(
        Array.isArray(profile.interests)
          ? profile.interests
          : profile.interests
          ? [profile.interests]
          : []
      );
      setSelectedPersonality(
        Array.isArray((profile as any).personalities)
          ? (profile as any).personalities
          : (profile as any).personalities
          ? [(profile as any).personalities]
          : Array.isArray((profile as any).personality)
          ? (profile as any).personality
          : (profile as any).personality
          ? [(profile as any).personality]
          : []
      );
      setSelectedAgePartner(profile.partner_age_range_preference || "");
      setSelectedReligionPartner(profile.partner_religion_importance || "");
      setSelectedPartnerEthnicPreference(
        profile.partner_ethnic_preference || ""
      );
      setSelectedRelationshipPreference(
        profile.relationship_preference || (profile as any).polygomy || ""
      );
      previousValuesRef.current = {
        bio: profile.bio || null,
        occupation: profile.occupation || null,
        education_level: profile.education_level || null,
        height: profile.height || null,
        religiosity_level: profile.religiosity_level || null,
        religion: profile.religion || null,
        sect: profile.sect || null,
        country: profile.country || null,
        caste: profile.caste || null,
        date_of_birth: profile.date_of_birth || null,
        languages: Array.isArray(profile.languages)
          ? profile.languages
          : profile.languages
          ? [profile.languages]
          : [],
        interests: Array.isArray(profile.interests)
          ? profile.interests
          : profile.interests
          ? [profile.interests]
          : [],
        personalities: Array.isArray((profile as any).personalities)
          ? (profile as any).personalities
          : (profile as any).personalities
          ? [(profile as any).personalities]
          : Array.isArray((profile as any).personality)
          ? (profile as any).personality
          : (profile as any).personality
          ? [(profile as any).personality]
          : [],
        partner_age_range_preference:
          profile.partner_age_range_preference || null,
        partner_religion_importance:
          profile.partner_religion_importance || null,
        partner_ethnic_preference: profile.partner_ethnic_preference || null,
        relationship_preference:
          profile.relationship_preference || (profile as any).polygomy || null,
      };
      setTimeout(() => {
        isInitialLoad.current = false;
        setIsProfileSeeded(true);
      }, 800);
    }
  }, [profile]);

  const arraysEqual = (a: any[], b: any[]): boolean => {
    if (a.length !== b.length) return false;
    return a.every((val, i) => val === b[i]);
  };

  const hasValuesChanged = (): boolean => {
    const current = {
      bio: selectedBio || null,
      occupation: selectedProfession || null,
      education_level: selectedEducation || null,
      height: selectedHeight || null,
      religiosity_level: selectedReligiousBackground || null,
      religion: selectedReligion || null,
      sect: selectedSect || null,
      country: selectedLocation || null,
      caste: selectedCaste || null,
      date_of_birth: dateOfBirth || null,
      languages: selectedLanguages.length > 0 ? selectedLanguages : null,
      interests: selectedInterests.length > 0 ? selectedInterests : null,
      personalities:
        selectedPersonality.length > 0 ? selectedPersonality : null,
      partner_age_range_preference: selectedAgePartner || null,
      partner_religion_importance: selectedReligionPartner || null,
      partner_ethnic_preference: selectedPartnerEthnicPreference || null,
      relationship_preference: selectedRelationshipPreference || null,
    };
    const prev = previousValuesRef.current;
    if (
      current.bio !== prev.bio ||
      current.occupation !== prev.occupation ||
      current.education_level !== prev.education_level ||
      current.height !== prev.height ||
      current.religiosity_level !== prev.religiosity_level ||
      current.religion !== prev.religion ||
      current.sect !== prev.sect ||
      current.country !== prev.country ||
      current.caste !== prev.caste ||
      current.date_of_birth !== prev.date_of_birth ||
      current.partner_age_range_preference !==
        prev.partner_age_range_preference ||
      current.partner_religion_importance !==
        prev.partner_religion_importance ||
      current.partner_ethnic_preference !== prev.partner_ethnic_preference ||
      current.relationship_preference !== prev.relationship_preference
    ) {
      return true;
    }
    if (!arraysEqual(prev.languages || [], current.languages || []))
      return true;
    if (!arraysEqual(prev.interests || [], current.interests || []))
      return true;
    if (!arraysEqual(prev.personalities || [], current.personalities || []))
      return true;
    return false;
  };

  useEffect(() => {
    if (isInitialLoad.current || !user?.id) return;
    if (!hasValuesChanged()) return;
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        const profileData: Record<string, any> = {
          bio: selectedBio || null,
          occupation: selectedProfession || null,
          education_level: selectedEducation || null,
          height: selectedHeight || null,
          religiosity_level: selectedReligiousBackground || null,
          religion: selectedReligion || null,
          sect: ["Atheist", "Agnostic", "Prefer not to say"].includes(
            selectedReligion || ""
          )
            ? null
            : selectedSect || null,
          country: selectedLocation || null,
          caste: selectedCaste || null,
          date_of_birth: dateOfBirth || null,
          languages: selectedLanguages.length > 0 ? selectedLanguages : null,
          interests: selectedInterests.length > 0 ? selectedInterests : null,
          personalities:
            selectedPersonality.length > 0 ? selectedPersonality : null,
          partner_age_range_preference: selectedAgePartner || null,
          partner_religion_importance: selectedReligionPartner || null,
          partner_ethnic_preference: selectedPartnerEthnicPreference || null,
          relationship_preference: selectedRelationshipPreference || null,
        };
        console.log("ProfileSetting auto-save payload:", {
          userId: user.id,
          profileData,
        });
        previousValuesRef.current = {
          bio: selectedBio || null,
          occupation: selectedProfession || null,
          education_level: selectedEducation || null,
          height: selectedHeight || null,
          religiosity_level: selectedReligiousBackground || null,
          religion: selectedReligion || null,
          sect: selectedSect || null,
          country: selectedLocation || null,
          caste: selectedCaste || null,
          date_of_birth: dateOfBirth || null,
          languages: selectedLanguages,
          interests: selectedInterests,
          personalities: selectedPersonality,
          partner_age_range_preference: selectedAgePartner || null,
          partner_religion_importance: selectedReligionPartner || null,
          partner_ethnic_preference: selectedPartnerEthnicPreference || null,
          relationship_preference: selectedRelationshipPreference || null,
        };
      } catch (err) {
        console.error("Error saving profile:", err);
      }
    }, 1500);
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [
    user?.id,
    selectedBio,
    selectedProfession,
    selectedEducation,
    selectedHeight,
    selectedReligiousBackground,
    selectedReligion,
    selectedSect,
    selectedLocation,
    selectedCaste,
    dateOfBirth,
    selectedLanguages,
    selectedInterests,
    selectedPersonality,
    selectedAgePartner,
    selectedReligionPartner,
    selectedPartnerEthnicPreference,
    selectedRelationshipPreference,
  ]);

  const openModal = (
    title: string,
    options: string[] | Array<{ name: string; flag: string; value: string }>,
    setter: (value: string) => void,
    selectedValue: string
  ) => {
    setModalTitle(title);
    setCurrentOptions(options || []);
    setCurrentSetter(() => setter);
    setCurrentValue(selectedValue);
    setSearchQuery("");
    setModalVisible(true);
  };

  const [modalVisible, setModalVisible] = React.useState(false);

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
        toValue: moderateScale(50),
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setModalVisible(false);
      setCurrentSetter(null);
      setSearchQuery("");
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
    setMultiSelectSearchQuery("");
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
        toValue: moderateScale(50),
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setMultiSelectModalVisible(false);
      setMultiSelectSetter(null);
      setMultiSelectSearchQuery("");
    });
  };

  const toggleMultiSelectOption = (option: string) => {
    setMultiSelectCurrentValues((prev) => {
      if (prev.includes(option)) {
        return prev.filter((item) => item !== option);
      }

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
    });
  };

  const confirmMultiSelect = () => {
    const valuesToSave =
      multiSelectTitle === "Select Your Interests"
        ? multiSelectCurrentValues.slice(0, MAX_INTERESTS)
        : multiSelectTitle === "Select Your Personality"
        ? multiSelectCurrentValues.slice(0, MAX_PERSONALITY_OPTIONS)
        : multiSelectCurrentValues;

    if (multiSelectSetter) multiSelectSetter(valuesToSave);
    closeMultiSelectModal();
  };

  const formatMultiSelectValue = (values: string[]) => {
    if (!values?.length) return "";
    if (values.length === 1) return values[0];
    if (values.length <= 3) return values.join(", ");
    return `${values.slice(0, 3).join(", ")} +${values.length - 3}`;
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

  useEffect(() => {
    if (dobModalVisible) {
      Animated.parallel([
        Animated.timing(dobFadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(dobScaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 65,
          useNativeDriver: true,
        }),
        Animated.spring(dobSlideAnim, {
          toValue: 0,
          friction: 8,
          tension: 65,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [dobModalVisible]);

  const getDaysInMonth = (month: number, year: number) =>
    new Date(year, month, 0).getDate();
  const days = Array.from(
    { length: getDaysInMonth(selectedMonth, selectedYear) },
    (_, i) => i + 1
  );
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 80 }, (_, i) => currentYear - 18 - i);

  const openDobModal = () => setDobModalVisible(true);

  const closeDobModal = () => {
    Animated.parallel([
      Animated.timing(dobFadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(dobScaleAnim, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(dobSlideAnim, {
        toValue: moderateScale(50),
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => setDobModalVisible(false));
  };

  const confirmDob = () => {
    setDateOfBirth(
      `${months[selectedMonth - 1]} ${selectedDay}, ${selectedYear}`
    );
    closeDobModal();
  };

  const calculateAge = () => {
    const today = new Date();
    const birth = new Date(selectedYear, selectedMonth - 1, selectedDay);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const handlePreview = () => {
    navigation.navigate("ProfileScreen", {});
  };

  const handleAddPhoto = async () => {
    if (!user?.id || uploadingImage || profileImages.length >= 4) return;
    setUploadingImage(true);
    try {
      const { launchImageLibrary } = await import("react-native-image-picker");
      const result = await launchImageLibrary({
        mediaType: "photo",
        selectionLimit: 1,
        includeBase64: false,
      });

      const asset = result.assets?.[0];

      if (result.didCancel || !asset?.uri) {
        setUploadingImage(false);
        return;
      }

      const localImage: ProfileImage = {
        id: `local-image-${Date.now()}`,
        image_url: asset.uri,
        position: profileImages.length,
      };
      setProfileImages((prev) =>
        [...prev, localImage].sort((a, b) => a.position - b.position)
      );
    } catch (err) {
      console.error("Error adding photo:", err);
    } finally {
      setUploadingImage(false);
    }
  };

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

  const stopSwapPulseAnimation = () => {
    swapPulseAnim.stopAnimation();
    swapPulseAnim.setValue(1);
  };

  const handleVerifyFace = () => {
    navigation.navigate("FaceVerificationScreen");
  };

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
              if (selectedForSwap?.id === image.id) {
                setSelectedForSwap(null);
                stopSwapPulseAnimation();
              }
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

  const handleLongPressImage = (image: ProfileImage) => {
    if (uploadingImage) return;
    if (selectedForSwap?.id === image.id) {
      setSelectedForSwap(null);
      stopSwapPulseAnimation();
    } else {
      setSelectedForSwap(image);
      startSwapPulseAnimation();
    }
  };

  const handleImageTapForSwap = async (
    targetPosition: number,
    targetImage: ProfileImage | undefined
  ) => {
    if (!selectedForSwap) return;
    if (targetImage?.id === selectedForSwap.id) {
      setSelectedForSwap(null);
      stopSwapPulseAnimation();
      return;
    }
    if (!targetImage && targetPosition !== 0) {
      showAlert({
        variant: "info",
        title: "Cannot swap",
        message: "Tap Cover or another photo to move the selected image.",
        autoHideMs: 1800,
      });
      return;
    }
    try {
      setUploadingImage(true);
      stopSwapPulseAnimation();
      const coverImage = getImageByPosition(0);
      if (targetPosition === 0) {
        if (coverImage) {
          setProfileImages((prev) =>
            prev
              .map((item) => {
                if (item.id === selectedForSwap.id) {
                  return { ...item, position: coverImage.position };
                }
                if (item.id === coverImage.id) {
                  return { ...item, position: selectedForSwap.position };
                }
                return item;
              })
              .sort((a, b) => a.position - b.position)
          );
        } else {
          setProfileImages((prev) =>
            prev
              .map((item) => {
                if (item.id === selectedForSwap.id) {
                  return { ...item, position: 0 };
                }
                if (item.position < selectedForSwap.position) {
                  return { ...item, position: item.position + 1 };
                }
                return item;
              })
              .sort((a, b) => a.position - b.position)
          );
        }
      } else {
        setProfileImages((prev) =>
          prev
            .map((item) => {
              if (item.id === selectedForSwap.id) {
                return { ...item, position: targetImage!.position };
              }
              if (item.id === targetImage!.id) {
                return { ...item, position: selectedForSwap.position };
              }
              return item;
            })
            .sort((a, b) => a.position - b.position)
        );
      }
      setSelectedForSwap(null);
      showAlert({
        variant: "success",
        title: "Moved",
        message: "Photo position updated.",
        autoHideMs: 1600,
      });
    } catch (error: any) {
      console.error("Error swapping images:", error);
      showAlert({
        variant: "error",
        title: "Move failed",
        message: error.message || "Failed to move photo. Please try again.",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const isSectAvailable =
    selectedReligion &&
    !["Atheist", "Agnostic", "Prefer not to say"].includes(selectedReligion) &&
    getSectOptions(selectedReligion).length > 0;
  const isCasteAvailable = ["Pakistan", "India", "Afghanistan"].includes(
    selectedLocation || ""
  );

  const displayName =
    profile?.full_name ||
    profile?.first_name ||
    user?.email?.split("@")[0] ||
    "You";

  const firstImageUri = profileImages[0]?.image_url;

  const getImageByPosition = (pos: number) =>
    profileImages.find((img) => img.position === pos);

  const isPageLoading = !profile || imagesLoading || !isProfileSeeded;
  const shimmerAnim = useShimmerAnimation(isPageLoading);

  if (isPageLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <SkeletonShimmer shimmerAnim={shimmerAnim} style={styles.avatar} />
            <View>
              <SkeletonBox
                shimmerAnim={shimmerAnim}
                width={moderateScale(90)}
                height={moderateScale(14)}
                borderRadius={moderateScale(6)}
                style={{ marginBottom: verticalScale(8) }}
              />
              <SkeletonBox
                shimmerAnim={shimmerAnim}
                width={moderateScale(140)}
                height={moderateScale(18)}
                borderRadius={moderateScale(6)}
              />
            </View>
          </View>
          <SkeletonBox
            shimmerAnim={shimmerAnim}
            width={moderateScale(98)}
            height={verticalScale(36)}
            borderRadius={moderateScale(12)}
          />
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.glassCard}>
            <View style={styles.strengthRow}>
              <SkeletonShimmer
                shimmerAnim={shimmerAnim}
                style={styles.strengthCircleWrap}
              />
              <View style={styles.strengthRight}>
                <SkeletonBox
                  shimmerAnim={shimmerAnim}
                  width={moderateScale(130)}
                  height={moderateScale(18)}
                  borderRadius={moderateScale(6)}
                  style={{ marginBottom: verticalScale(8) }}
                />
                <SkeletonBox
                  shimmerAnim={shimmerAnim}
                  width="92%"
                  height={moderateScale(14)}
                  borderRadius={moderateScale(6)}
                  style={{ marginBottom: verticalScale(8) }}
                />
                <SkeletonShimmer
                  shimmerAnim={shimmerAnim}
                  style={styles.strengthBarContainer}
                />
              </View>
            </View>
          </View>

          <View style={[styles.glassCard, styles.photosCardGlow]}>
            <View style={styles.photosCardHeader}>
              <View style={styles.sectionTitleLeft}>
                <SkeletonShimmer
                  shimmerAnim={shimmerAnim}
                  style={styles.sectionIconCircle}
                />
                <View>
                  <SkeletonBox
                    shimmerAnim={shimmerAnim}
                    width={moderateScale(110)}
                    height={moderateScale(18)}
                    borderRadius={moderateScale(6)}
                    style={{ marginBottom: verticalScale(6) }}
                  />
                  <SkeletonBox
                    shimmerAnim={shimmerAnim}
                    width={moderateScale(42)}
                    height={moderateScale(22)}
                    borderRadius={moderateScale(11)}
                  />
                </View>
              </View>
              <SkeletonBox
                shimmerAnim={shimmerAnim}
                width={moderateScale(72)}
                height={verticalScale(34)}
                borderRadius={moderateScale(12)}
              />
            </View>

            <View style={styles.bentoWrap}>
              <SkeletonShimmer
                shimmerAnim={shimmerAnim}
                style={styles.bentoHero}
              />
              <View style={styles.bentoStrip}>
                {[1, 2, 3].map((item) => (
                  <SkeletonShimmer
                    key={`photo-skeleton-${item}`}
                    shimmerAnim={shimmerAnim}
                    style={styles.bentoThumb}
                  />
                ))}
              </View>
            </View>
          </View>

          {[1, 2, 3, 4].map((section) => (
            <View key={`detail-skeleton-${section}`} style={styles.glassCard}>
              <SkeletonBox
                shimmerAnim={shimmerAnim}
                width={moderateScale(150)}
                height={moderateScale(18)}
                borderRadius={moderateScale(6)}
                style={{ marginBottom: verticalScale(12) }}
              />
              <SkeletonBox
                shimmerAnim={shimmerAnim}
                width="100%"
                height={verticalScale(52)}
                borderRadius={moderateScale(14)}
                style={{ marginBottom: verticalScale(10) }}
              />
              <SkeletonBox
                shimmerAnim={shimmerAnim}
                width="100%"
                height={verticalScale(52)}
                borderRadius={moderateScale(14)}
              />
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header - HomeSecond style */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarRing}>
            {firstImageUri ? (
              <Image source={{ uri: firstImageUri }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons
                  name="person"
                  size={moderateScale(22)}
                  color={themeSecond.textMuted}
                />
              </View>
            )}
          </View>
          <View>
            <Text style={styles.greeting}>Edit profile</Text>
            <Text style={styles.name}>{displayName}</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={handlePreview}
          activeOpacity={0.85}
          style={styles.previewButton}
        >
          <Ionicons
            name="eye-outline"
            size={moderateScale(20)}
            color={themeSecond.textPrimary}
          />
          <Text style={styles.previewText}>Preview</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Strength - glass card */}
        <View style={styles.glassCard}>
          <View style={styles.strengthRow}>
            <View style={styles.strengthCircleWrap}>
              <Text style={styles.strengthPercentText}>
                {animatedPercentage}%
              </Text>
            </View>
            <View style={styles.strengthRight}>
              <Text style={styles.strengthTitle}>Profile strength</Text>
              <Text style={styles.strengthHint}>
                {profileStrength < 50
                  ? "Add more details to attract matches"
                  : profileStrength < 80
                  ? "Almost there! Complete your profile"
                  : "Your profile looks great!"}
              </Text>
              <View
                style={styles.strengthBarContainer}
                onLayout={(e) => {
                  const w = e.nativeEvent.layout.width;
                  if (w > 0 && w !== barContainerWidth) setBarContainerWidth(w);
                }}
              >
                <Animated.View
                  style={[
                    styles.strengthBarFill,
                    {
                      width: strengthBarWidth,
                      backgroundColor:
                        profileStrength < 50
                          ? themeSecond.statusError
                          : profileStrength < 80
                          ? themeSecond.statusWarning
                          : themeSecond.statusSuccess,
                    },
                  ]}
                />
              </View>
            </View>
          </View>
        </View>
        {!profile?.isVerified && <GetVerifiedTile onPress={handleVerifyFace} />}

        {/* Your Photos - Bento Gallery */}
        <View style={[styles.glassCard, styles.photosCardGlow]}>
          <View style={styles.photosCardHeader}>
            <View style={styles.sectionTitleLeft}>
              <View style={[styles.sectionIconCircle, styles.photosIconCircle]}>
                <Ionicons
                  name="images"
                  size={moderateScale(20)}
                  color={themeSecond.accentPurple}
                />
              </View>
              <View>
                <Text style={styles.sectionTitle}>Your photos</Text>
                <View style={styles.photosCountPill}>
                  <Text style={styles.photosCountText}>
                    {profileImages.length}/4
                  </Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={[
                styles.addPhotoBtn,
                (uploadingImage || profileImages.length >= 4) &&
                  styles.addPhotoBtnDisabled,
              ]}
              onPress={handleAddPhoto}
              disabled={uploadingImage || profileImages.length >= 4}
              activeOpacity={0.8}
            >
              {uploadingImage ? (
                <ActivityIndicator
                  size="small"
                  color={themeSecond.textPrimary}
                />
              ) : (
                <>
                  <Ionicons
                    name="add"
                    size={moderateScale(22)}
                    color={
                      profileImages.length >= 4
                        ? themeSecond.textSoft
                        : themeSecond.textPrimary
                    }
                  />
                  <Text style={styles.addPhotoBtnLabel}>Add</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Bento: Hero + 3-strip */}
          <View style={styles.bentoWrap}>
            {/* Hero slot - main photo */}
            {(() => {
              const coverImage = getImageByPosition(0);
              const isCoverSelected = selectedForSwap?.id === coverImage?.id;
              const isCoverSwapTarget =
                selectedForSwap &&
                coverImage &&
                selectedForSwap.id !== coverImage.id;
              return (
                <Animated.View
                  style={[
                    isCoverSelected && {
                      transform: [{ scale: swapPulseAnim }],
                    },
                  ]}
                >
                  <TouchableOpacity
                    style={[
                      styles.bentoHero,
                      !coverImage && styles.bentoHeroEmpty,
                      isCoverSwapTarget && styles.bentoSwapTarget,
                    ]}
                    onPress={() => {
                      if (selectedForSwap) {
                        handleImageTapForSwap(0, coverImage ?? undefined);
                      } else if (!coverImage) {
                        handleAddPhoto();
                      }
                    }}
                    activeOpacity={!coverImage ? 0.85 : 1}
                    disabled={
                      !coverImage &&
                      !selectedForSwap &&
                      (uploadingImage || profileImages.length >= 4)
                    }
                    onLongPress={() =>
                      coverImage && handleLongPressImage(coverImage)
                    }
                    delayLongPress={400}
                  >
                    {coverImage ? (
                      <>
                        <FastImage
                          source={{
                            uri: coverImage.image_url,
                            priority: FastImage.priority.high,
                            cache: FastImage.cacheControl.immutable,
                          }}
                          style={styles.bentoHeroImage}
                          resizeMode={FastImage.resizeMode.cover}
                        />
                        <LinearGradient
                          colors={["transparent", themeSecond.overlayDarkHeavy]}
                          style={styles.bentoHeroOverlay}
                          start={{ x: 0.5, y: 0 }}
                          end={{ x: 0.5, y: 1 }}
                        />
                        <View style={styles.bentoHeroBadge}>
                          <Ionicons
                            name="star"
                            size={12}
                            color={themeSecond.textPrimary}
                          />
                          <Text style={styles.bentoHeroBadgeText}>Cover</Text>
                        </View>
                        {!selectedForSwap && (
                          <TouchableOpacity
                            style={styles.bentoDeleteBtn}
                            onPress={(e) => {
                              e.stopPropagation();
                              handleDeletePhoto(coverImage);
                            }}
                            activeOpacity={0.8}
                            disabled={uploadingImage}
                          >
                            {uploadingImage ? (
                              <ActivityIndicator
                                size="small"
                                color={themeSecond.textPrimary}
                              />
                            ) : (
                              <Ionicons
                                name="close"
                                size={moderateScale(16)}
                                color={themeSecond.textPrimary}
                              />
                            )}
                          </TouchableOpacity>
                        )}
                        {isCoverSelected && (
                          <View style={styles.bentoSelectedOverlay}>
                            <Ionicons
                              name="move"
                              size={moderateScale(20)}
                              color={themeSecond.textPrimary}
                            />
                            <Text style={styles.bentoSelectedOverlayText}>
                              Tap a slot to move
                            </Text>
                          </View>
                        )}
                        {isCoverSwapTarget && (
                          <View style={styles.bentoSwapOverlay}>
                            <Ionicons
                              name="swap-horizontal"
                              size={moderateScale(20)}
                              color={themeSecond.textPrimary}
                            />
                          </View>
                        )}
                      </>
                    ) : (
                      <View style={styles.bentoHeroPlaceholder}>
                        <View style={styles.bentoHeroPlaceholderRing}>
                          <Ionicons
                            name="camera"
                            size={moderateScale(36)}
                            color={themeSecond.accentPurple}
                          />
                        </View>
                        <Text style={styles.bentoHeroPlaceholderTitle}>
                          Add cover photo
                        </Text>
                        <Text style={styles.bentoHeroPlaceholderSub}>
                          Your best shot, front and center
                        </Text>
                        {selectedForSwap && (
                          <Text style={styles.bentoHeroPlaceholderHint}>
                            Tap here to set as cover
                          </Text>
                        )}
                      </View>
                    )}
                  </TouchableOpacity>
                </Animated.View>
              );
            })()}

            {/* Strip: 3 small slots */}
            <View style={styles.bentoStrip}>
              {[1, 2, 3].map((position) => {
                const image = getImageByPosition(position);
                const isEmpty = !image;
                const isSelected = selectedForSwap?.id === image?.id;
                const isSwapTarget = selectedForSwap && !isSelected && image;
                return (
                  <Animated.View
                    key={position}
                    style={[
                      styles.bentoThumbWrap,
                      isSelected && {
                        transform: [{ scale: swapPulseAnim }],
                      },
                    ]}
                  >
                    <TouchableOpacity
                      style={[
                        styles.bentoThumb,
                        isEmpty && styles.bentoThumbEmpty,
                        isSwapTarget && styles.bentoThumbSwapTarget,
                      ]}
                      onPress={() => {
                        if (selectedForSwap) {
                          handleImageTapForSwap(position, image ?? undefined);
                        } else if (isEmpty) {
                          handleAddPhoto();
                        }
                      }}
                      activeOpacity={isEmpty ? 0.85 : 1}
                      disabled={
                        isEmpty && (uploadingImage || profileImages.length >= 4)
                      }
                      onLongPress={() => image && handleLongPressImage(image)}
                      delayLongPress={400}
                    >
                      {image ? (
                        <>
                          <FastImage
                            source={{
                              uri: image.image_url,
                              priority: FastImage.priority.high,
                              cache: FastImage.cacheControl.immutable,
                            }}
                            style={styles.bentoThumbImage}
                            resizeMode={FastImage.resizeMode.cover}
                          />
                          {!selectedForSwap && (
                            <TouchableOpacity
                              style={styles.bentoThumbDeleteBtn}
                              onPress={(e) => {
                                e.stopPropagation();
                                handleDeletePhoto(image);
                              }}
                              activeOpacity={0.8}
                              disabled={uploadingImage}
                            >
                              <Ionicons
                                name="close"
                                size={moderateScale(14)}
                                color={themeSecond.textPrimary}
                              />
                            </TouchableOpacity>
                          )}
                          {isSelected && (
                            <View style={styles.bentoThumbSelectedOverlay}>
                              <Ionicons
                                name="move"
                                size={moderateScale(16)}
                                color={themeSecond.textPrimary}
                              />
                            </View>
                          )}
                          {isSwapTarget && (
                            <View style={styles.bentoThumbSwapOverlay}>
                              <Ionicons
                                name="swap-horizontal"
                                size={moderateScale(16)}
                                color={themeSecond.textPrimary}
                              />
                            </View>
                          )}
                        </>
                      ) : (
                        <View style={styles.bentoThumbPlaceholder}>
                          <Ionicons
                            name="add"
                            size={moderateScale(28)}
                            color={themeSecond.accentPurple}
                          />
                        </View>
                      )}
                    </TouchableOpacity>
                  </Animated.View>
                );
              })}
            </View>
          </View>

          {/* Reorder hint */}
          {profileImages.length > 1 && (
            <View style={styles.bentoHintRow}>
              {selectedForSwap ? (
                <>
                  <Text style={styles.bentoHintText}>
                    Tap Cover or another slot to move
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedForSwap(null);
                      stopSwapPulseAnimation();
                    }}
                    style={styles.bentoCancelSwapBtn}
                  >
                    <Text style={styles.bentoCancelSwapText}>Cancel</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Ionicons
                    name="hand-left-outline"
                    size={moderateScale(14)}
                    color={themeSecond.textSoft}
                  />
                  <Text style={styles.bentoHintText}>
                    Long-press an image, then tap Cover or another slot to
                    reorder
                  </Text>
                </>
              )}
            </View>
          )}
        </View>

        {/* About Me */}
        <View style={styles.glassCard}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.sectionTitleLeft}>
              <View style={[styles.sectionIconCircle, styles.iconPerson]}>
                <Ionicons
                  name="person"
                  size={moderateScale(18)}
                  color={themeSecond.optionTerracotta}
                />
              </View>
              <Text style={styles.sectionTitle}>About me</Text>
            </View>
          </View>
          <View style={styles.bioWrap}>
            <Text style={styles.bioLabel}>Your bio</Text>
            <Text style={styles.bioCount}>{selectedBio?.length || 0}/1200</Text>
          </View>
          <TextInput
            style={styles.bioInput}
            placeholder="Share what makes you unique..."
            placeholderTextColor={themeSecond.textSoft}
            multiline
            numberOfLines={10}
            maxLength={1200}
            value={selectedBio}
            onChangeText={setSelectedBio}
          />
          <View style={styles.infoGrid}>
            {[
              {
                label: "Work",
                value: selectedProfession || "Add",
                icon: "briefcase" as const,
                color: themeSecond.optionOrange,
                onPress: () =>
                  openModal(
                    "Select Your Profession",
                    professionOptions,
                    setSelectedProfession,
                    selectedProfession
                  ),
              },
              {
                label: "Education",
                value: selectedEducation || "Add",
                icon: "school" as const,
                color: themeSecond.optionBlue,
                onPress: () =>
                  openModal(
                    "Select Your Education",
                    educationOptions,
                    setSelectedEducation,
                    selectedEducation
                  ),
              },
              {
                label: "Height",
                value: selectedHeight || "Add",
                icon: "resize-outline" as const,
                color: themeSecond.optionGreen,
                onPress: () =>
                  openModal(
                    "Select Your Height",
                    heightOptions,
                    setSelectedHeight,
                    selectedHeight
                  ),
              },
              {
                label: "Birthday",
                value: dateOfBirth ? dateOfBirth.split(",")[0] : "Add",
                icon: "calendar" as const,
                color: themeSecond.optionPink,
                onPress: openDobModal,
              },
              {
                label: "Location",
                value: selectedLocation
                  ? formatCountryWithFlag(selectedLocation)
                  : "Add",
                icon: "location" as const,
                color: themeSecond.optionRed,
                onPress: () =>
                  openModal(
                    "Select Your Location",
                    locationOptions,
                    setSelectedLocation,
                    selectedLocation
                  ),
              },
              {
                label: "Religiosity",
                value: selectedReligiousBackground || "Add",
                icon: "sparkles" as const,
                color: themeSecond.optionYellow,
                onPress: () =>
                  openModal(
                    "Select Your Religious Background",
                    religiusBackgroundOptions,
                    setSelectedReligiousBackground,
                    selectedReligiousBackground
                  ),
              },
            ].map((item, index) => (
              <TouchableOpacity
                key={item.label}
                style={styles.infoGridItem}
                onPress={item.onPress}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.infoIconCircle,
                    { backgroundColor: `${item.color}20` },
                  ]}
                >
                  <Ionicons
                    name={item.icon}
                    size={moderateScale(18)}
                    color={item.color}
                  />
                </View>
                <Text style={styles.infoLabel}>{item.label}</Text>
                <Text style={styles.infoValue} numberOfLines={1}>
                  {item.value}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Religion & Culture */}
          <View style={styles.cultureSection}>
            <Text style={styles.cultureSectionTitle}>Religion & culture</Text>
            <View style={styles.culturePillRow}>
              <TouchableOpacity
                style={[styles.culturePill, styles.culturePillReligion]}
                onPress={() =>
                  openModal(
                    "Select Your Religion",
                    religionOptions,
                    handleReligionSelection,
                    selectedReligion
                  )
                }
                activeOpacity={0.7}
              >
                <Ionicons
                  name="book"
                  size={moderateScale(14)}
                  color={themeSecond.pillReligion}
                />
                <Text style={styles.culturePillValue} numberOfLines={1}>
                  {selectedReligion || "Religion"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.culturePill,
                  styles.culturePillSect,
                  !isSectAvailable && styles.culturePillDisabled,
                ]}
                onPress={() =>
                  isSectAvailable &&
                  openModal(
                    "Select Your Sect",
                    getSectOptions(selectedReligion),
                    setSelectedSect,
                    selectedSect
                  )
                }
                activeOpacity={0.7}
                disabled={!isSectAvailable}
              >
                <Ionicons
                  name="library"
                  size={moderateScale(14)}
                  color={themeSecond.optionViolet}
                />
                <Text style={styles.culturePillValue} numberOfLines={1}>
                  {isSectAvailable ? selectedSect || "Sect" : "—"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.culturePill,
                  styles.culturePillCaste,
                  !isCasteAvailable && styles.culturePillDisabled,
                ]}
                onPress={() =>
                  isCasteAvailable &&
                  openModal(
                    "Select Your Caste",
                    getSortedCasteOptions(selectedLocation),
                    setSelectedCaste,
                    selectedCaste
                  )
                }
                activeOpacity={0.7}
                disabled={!isCasteAvailable}
              >
                <Ionicons
                  name="people-circle-outline"
                  size={moderateScale(14)}
                  color={themeSecond.optionSlate}
                />
                <Text style={styles.culturePillValue} numberOfLines={1}>
                  {isCasteAvailable ? selectedCaste || "Caste" : "—"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Languages */}
          <TouchableOpacity
            style={styles.pillCard}
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
            <View style={styles.pillCardHeader}>
              <Ionicons
                name="language"
                size={moderateScale(18)}
                color={themeSecond.optionTeal}
              />
              <Text style={styles.pillCardTitle}>Languages</Text>
              <Ionicons
                name="add-circle"
                size={moderateScale(20)}
                color={themeSecond.accentPurple}
              />
            </View>
            {selectedLanguages.length > 0 ? (
              <View style={styles.pillRow}>
                {selectedLanguages.slice(0, 4).map((lang, i) => (
                  <View key={i} style={styles.tagPill}>
                    <Text style={styles.tagPillText}>{lang}</Text>
                  </View>
                ))}
                {selectedLanguages.length > 4 && (
                  <View style={styles.tagPillMore}>
                    <Text style={styles.tagPillMoreText}>
                      +{selectedLanguages.length - 4}
                    </Text>
                  </View>
                )}
              </View>
            ) : (
              <Text style={styles.pillPlaceholder}>Tap to add languages</Text>
            )}
          </TouchableOpacity>

          {/* Interests */}
          <TouchableOpacity
            style={styles.pillCard}
            onPress={() =>
              openMultiSelectModal(
                "Select Your Interests",
                interestsOptions,
                setSelectedInterests,
                selectedInterests
              )
            }
            activeOpacity={0.7}
          >
            <View style={styles.pillCardHeader}>
              <Ionicons
                name="heart"
                size={moderateScale(18)}
                color={themeSecond.optionHeart}
              />
              <Text style={styles.pillCardTitle}>Interests</Text>
              <Ionicons
                name="add-circle"
                size={moderateScale(20)}
                color={themeSecond.accentPurple}
              />
            </View>
            {selectedInterests.length > 0 ? (
              <View style={styles.pillRow}>
                {selectedInterests.slice(0, 5).map((interest, i) => (
                  <View key={i} style={styles.tagPill}>
                    <Text style={styles.tagPillText}>{interest}</Text>
                  </View>
                ))}
                {selectedInterests.length > 5 && (
                  <View style={styles.tagPillMore}>
                    <Text style={styles.tagPillMoreText}>
                      +{selectedInterests.length - 5}
                    </Text>
                  </View>
                )}
              </View>
            ) : (
              <Text style={styles.pillPlaceholder}>Tap to add interests</Text>
            )}
          </TouchableOpacity>

          {/* Personality */}
          <TouchableOpacity
            style={styles.pillCard}
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
            <View style={styles.pillCardHeader}>
              <Ionicons
                name="sparkles"
                size={moderateScale(18)}
                color={themeSecond.optionPurple}
              />
              <Text style={styles.pillCardTitle}>Personality</Text>
              <Ionicons
                name="add-circle"
                size={moderateScale(20)}
                color={themeSecond.accentPurple}
              />
            </View>
            {selectedPersonality.length > 0 ? (
              <View style={styles.pillRow}>
                {selectedPersonality.slice(0, 5).map((trait, i) => (
                  <View key={i} style={styles.tagPill}>
                    <Text style={styles.tagPillText}>{trait}</Text>
                  </View>
                ))}
                {selectedPersonality.length > 5 && (
                  <View style={styles.tagPillMore}>
                    <Text style={styles.tagPillMoreText}>
                      +{selectedPersonality.length - 5}
                    </Text>
                  </View>
                )}
              </View>
            ) : (
              <Text style={styles.pillPlaceholder}>
                Tap to add personality traits
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Partner Preferences */}
        <View style={styles.glassCard}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.sectionTitleLeft}>
              <View style={[styles.sectionIconCircle, styles.iconHeart]}>
                <Ionicons
                  name="heart"
                  size={moderateScale(18)}
                  color={themeSecond.optionCoral}
                />
              </View>
              <Text style={styles.sectionTitle}>Partner preferences</Text>
            </View>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.preferencePillsRow}
          >
            <TouchableOpacity
              style={[
                styles.preferencePill,
                selectedAgePartner && styles.preferencePillFilled,
              ]}
              onPress={() =>
                openModal(
                  "Select Age Range",
                  ageRanges,
                  setSelectedAgePartner,
                  selectedAgePartner
                )
              }
              activeOpacity={0.7}
            >
              <Ionicons
                name="calendar"
                size={moderateScale(16)}
                color={themeSecond.optionPink}
              />
              <View>
                <Text style={styles.preferencePillLabel}>Age</Text>
                <Text style={styles.preferencePillValue} numberOfLines={1}>
                  {selectedAgePartner || "Any"}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.preferencePill,
                selectedPartnerEthnicPreference && styles.preferencePillFilled,
              ]}
              onPress={() =>
                openModal(
                  "Select Partner Ethnic Preference",
                  partnerSameEthnicityOptions,
                  setSelectedPartnerEthnicPreference,
                  selectedPartnerEthnicPreference
                )
              }
              activeOpacity={0.7}
            >
              <Ionicons
                name="globe"
                size={moderateScale(16)}
                color={themeSecond.optionBlue}
              />
              <View>
                <Text style={styles.preferencePillLabel}>Ethnicity</Text>
                <Text style={styles.preferencePillValue} numberOfLines={1}>
                  {selectedPartnerEthnicPreference || "Open"}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.preferencePill,
                selectedReligionPartner && styles.preferencePillFilled,
              ]}
              onPress={() =>
                openModal(
                  "Select Religious Preferences",
                  partnerReligionImportanceOptions,
                  setSelectedReligionPartner,
                  selectedReligionPartner
                )
              }
              activeOpacity={0.7}
            >
              <Ionicons
                name="book"
                size={moderateScale(16)}
                color={themeSecond.optionYellow}
              />
              <View>
                <Text style={styles.preferencePillLabel}>Religion</Text>
                <Text style={styles.preferencePillValue} numberOfLines={1}>
                  {selectedReligionPartner || "Open"}
                </Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
          <TouchableOpacity
            style={styles.inlineRow}
            onPress={() =>
              openModal(
                "Looking for",
                relationshipPreferenceOptions,
                setSelectedRelationshipPreference,
                selectedRelationshipPreference
              )
            }
            activeOpacity={0.7}
          >
            <View style={styles.inlineRowLeft}>
              <Ionicons
                name="heart-circle"
                size={moderateScale(18)}
                color={themeSecond.accentPurple}
              />
              <View>
                <Text style={styles.inlineLabel}>Looking for</Text>
                <Text style={styles.inlineValue}>
                  {selectedRelationshipPreference || "Select preference"}
                </Text>
              </View>
            </View>
            <Ionicons
              name="chevron-forward"
              size={moderateScale(20)}
              color={themeSecond.textSoft}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Single-select Modal */}
      <Modal
        animationType="none"
        transparent
        visible={modalVisible}
        onRequestClose={closeModal}
        statusBarTranslucent
      >
        <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={closeModal} />
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
                style={styles.modalCloseBtn}
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
            <View style={styles.searchWrap}>
              <Ionicons
                name="search"
                size={moderateScale(20)}
                color={themeSecond.textSoft}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search..."
                placeholderTextColor={themeSecond.textSoft}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCapitalize="none"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
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
                .filter((opt) => {
                  if (!searchQuery.trim()) return true;
                  const q = searchQuery.toLowerCase().trim();
                  if (typeof opt === "string")
                    return opt.toLowerCase().includes(q);
                  return (
                    opt.name.toLowerCase().includes(q) ||
                    opt.value.toLowerCase().includes(q)
                  );
                })
                .map((option, index, arr) => {
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
                      ]}
                      onPress={() => {
                        setCurrentValue(optionValue);
                        currentSetter?.(optionValue);
                        closeModal();
                      }}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          isSelected && styles.optionTextSelected,
                        ]}
                      >
                        {optionDisplay}
                      </Text>
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

      {/* Multi-select Modal */}
      <Modal
        animationType="none"
        transparent
        visible={multiSelectModalVisible}
        onRequestClose={closeMultiSelectModal}
        statusBarTranslucent
      >
        <Animated.View
          style={[styles.modalOverlay, { opacity: multiFadeAnim }]}
        >
          <Pressable
            style={StyleSheet.absoluteFill}
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
                style={styles.modalCloseBtn}
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
            <View style={styles.searchWrap}>
              <Ionicons
                name="search"
                size={moderateScale(20)}
                color={themeSecond.textSoft}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search..."
                placeholderTextColor={themeSecond.textSoft}
                value={multiSelectSearchQuery}
                onChangeText={setMultiSelectSearchQuery}
                autoCapitalize="none"
              />
              {multiSelectSearchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setMultiSelectSearchQuery("")}>
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
                .filter((opt) =>
                  !multiSelectSearchQuery.trim()
                    ? true
                    : opt
                        .toLowerCase()
                        .includes(multiSelectSearchQuery.toLowerCase().trim())
                )
                .map((option) => {
                  const isSelected = multiSelectCurrentValues.includes(option);
                  return (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.optionItem,
                        isSelected && styles.optionItemSelected,
                      ]}
                      onPress={() => toggleMultiSelectOption(option)}
                      activeOpacity={0.7}
                    >
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
                style={styles.confirmBtn}
                onPress={confirmMultiSelect}
                activeOpacity={0.8}
              >
                <Text style={styles.confirmBtnText}>Confirm</Text>
                <Ionicons
                  name="checkmark-circle"
                  size={moderateScale(22)}
                  color={themeSecond.textPrimary}
                />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>

      {/* DOB Modal */}
      <Modal
        animationType="none"
        transparent
        visible={dobModalVisible}
        onRequestClose={closeDobModal}
        statusBarTranslucent
      >
        <Animated.View style={[styles.modalOverlay, { opacity: dobFadeAnim }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={closeDobModal} />
          <Animated.View
            style={[
              styles.modalContent,
              {
                transform: [
                  { scale: dobScaleAnim },
                  { translateY: dobSlideAnim },
                ],
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <View style={styles.modalHandle} />
              <Text style={styles.modalTitle}>Select Date of Birth</Text>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={closeDobModal}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="close"
                  size={moderateScale(22)}
                  color={themeSecond.textSoft}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.ageDisplayWrap}>
              <View style={styles.ageCircle}>
                <Text style={styles.ageNumber}>{calculateAge()}</Text>
                <Text style={styles.ageLabel}>years old</Text>
              </View>
            </View>
            <View style={styles.datePickerRow}>
              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabel}>Month</Text>
                <ScrollView
                  style={styles.pickerScroll}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.pickerScrollContent}
                >
                  {months.map((month, i) => (
                    <TouchableOpacity
                      key={month}
                      style={[
                        styles.pickerItem,
                        selectedMonth === i + 1 && styles.pickerItemSelected,
                      ]}
                      onPress={() => setSelectedMonth(i + 1)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.pickerItemText,
                          selectedMonth === i + 1 &&
                            styles.pickerItemTextSelected,
                        ]}
                      >
                        {month.substring(0, 3)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabel}>Day</Text>
                <ScrollView
                  style={styles.pickerScroll}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.pickerScrollContent}
                >
                  {days.map((day) => (
                    <TouchableOpacity
                      key={day}
                      style={[
                        styles.pickerItem,
                        selectedDay === day && styles.pickerItemSelected,
                      ]}
                      onPress={() => setSelectedDay(day)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.pickerItemText,
                          selectedDay === day && styles.pickerItemTextSelected,
                        ]}
                      >
                        {day}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabel}>Year</Text>
                <ScrollView
                  style={styles.pickerScroll}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.pickerScrollContent}
                >
                  {years.map((year) => (
                    <TouchableOpacity
                      key={year}
                      style={[
                        styles.pickerItem,
                        selectedYear === year && styles.pickerItemSelected,
                      ]}
                      onPress={() => setSelectedYear(year)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.pickerItemText,
                          selectedYear === year &&
                            styles.pickerItemTextSelected,
                        ]}
                      >
                        {year}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
            <View style={styles.selectedDateWrap}>
              <Ionicons
                name="calendar"
                size={moderateScale(20)}
                color={themeSecond.accentPurple}
              />
              <Text style={styles.selectedDateText}>
                {months[selectedMonth - 1]} {selectedDay}, {selectedYear}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.confirmBtn}
              onPress={confirmDob}
              activeOpacity={0.8}
            >
              <Text style={styles.confirmBtnText}>Confirm Date</Text>
              <Ionicons
                name="checkmark-circle"
                size={moderateScale(22)}
                color={themeSecond.textPrimary}
              />
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </Modal>
    </SafeAreaView>
  );
};

export default ProfileSettingScreenSecond;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeSecond.bgDark,
    paddingHorizontal: moderateScale(20),
    paddingTop: verticalScale(6),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: verticalScale(20),
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(12),
  },
  avatarRing: {
    width: moderateScale(46),
    height: moderateScale(46),
    borderRadius: moderateScale(23),
    padding: moderateScale(2),
    backgroundColor: themeSecond.avatarRingBg,
    borderWidth: moderateScale(1.5),
    borderColor: themeSecond.avatarRingBorder,
    overflow: "hidden",
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 22,
  },
  avatarPlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  greeting: {
    color: themeSecond.textMuted,
    fontSize: moderateScale(12),
  },
  name: {
    color: themeSecond.textPrimary,
    fontSize: moderateScale(18),
    fontWeight: "600",
  },
  previewButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: moderateScale(10),
    paddingHorizontal: moderateScale(20),
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(24),
    backgroundColor: themeSecond.buttonPrimaryBg,
    borderWidth: moderateScale(1),
    borderColor: themeSecond.buttonPrimaryBorder,
    shadowColor: themeSecond.buttonPrimaryBg,
    shadowOffset: { width: 0, height: verticalScale(4) },
    shadowOpacity: 0.45,
    shadowRadius: moderateScale(10),
    elevation: moderateScale(6),
  },
  previewText: {
    color: themeSecond.textPrimary,
    fontSize: moderateScale(15),
    fontWeight: "700",
  },
  scrollView: { flex: 1 },
  scrollContent: {
    paddingBottom: verticalScale(100),
  },
  glassCard: {
    borderRadius: moderateScale(24),
    padding: moderateScale(18),
    marginBottom: verticalScale(14),
    backgroundColor: themeSecond.glassBg,
    borderWidth: moderateScale(1),
    borderColor: themeSecond.glassBorder,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: verticalScale(12),
  },
  sectionTitleLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(10),
  },
  sectionIconCircle: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    backgroundColor: themeSecond.accentPurpleMedium,
    alignItems: "center",
    justifyContent: "center",
  },
  iconPerson: { backgroundColor: themeSecond.iconPersonBg },
  iconHeart: { backgroundColor: themeSecond.iconHeartBg },
  sectionTitle: {
    color: themeSecond.textPrimary,
    fontSize: moderateScale(16),
    fontWeight: "700",
  },
  sectionSubtitle: {
    color: themeSecond.textSoft,
    fontSize: moderateScale(12),
    marginTop: -verticalScale(6),
  },
  strengthRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(14),
  },
  strengthCircleWrap: {
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(28),
    backgroundColor: themeSecond.pillBg,
    borderWidth: moderateScale(1),
    borderColor: themeSecond.pillBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  strengthPercentText: {
    color: themeSecond.textPrimary,
    fontSize: moderateScale(16),
    fontWeight: "700",
  },
  strengthRight: { flex: 1 },
  strengthTitle: {
    color: themeSecond.textPrimary,
    fontSize: moderateScale(14),
    fontWeight: "700",
    marginBottom: verticalScale(4),
  },
  strengthHint: {
    color: themeSecond.textSoft,
    fontSize: moderateScale(12),
    marginBottom: verticalScale(8),
  },
  strengthBarContainer: {
    height: verticalScale(6),
    backgroundColor: themeSecond.surfaceWhiteLight,
    borderRadius: moderateScale(3),
    overflow: "hidden",
  },
  strengthBarFill: {
    height: "100%",
    borderRadius: moderateScale(3),
  },
  photosCardGlow: {
    ...Platform.select({
      ios: {
        borderColor: themeSecond.accentPurpleMedium,
        shadowColor: themeSecond.shadowPurple,
        shadowOffset: { width: 0, height: verticalScale(2) },
        shadowOpacity: 0.25,
        shadowRadius: moderateScale(12),
        elevation: 0,
      },
      android: {
        borderColor: themeSecond.borderMedium,
        backgroundColor: "rgba(24, 20, 38, 0.98)",
        shadowColor: "transparent",
        shadowOpacity: 0,
        shadowRadius: 0,
        shadowOffset: { width: 0, height: 0 },
        elevation: moderateScale(4),
      },
      default: {},
    }),
  },
  photosCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: verticalScale(14),
  },
  photosIconCircle: {
    ...Platform.select({
      ios: {
        backgroundColor: themeSecond.accentPurpleMedium,
      },
      android: {
        backgroundColor: "rgba(168, 85, 247, 0.22)",
        borderWidth: moderateScale(1),
        borderColor: themeSecond.borderMedium,
      },
      default: { backgroundColor: themeSecond.accentPurpleMedium },
    }),
  },
  photosCountPill: {
    alignSelf: "flex-start",
    marginTop: verticalScale(4),
    paddingHorizontal: moderateScale(10),
    paddingVertical: verticalScale(3),
    borderRadius: moderateScale(12),
    borderWidth: moderateScale(1),
    ...Platform.select({
      ios: {
        backgroundColor: themeSecond.accentPurpleMedium,
        borderColor: themeSecond.accentPurpleMedium,
      },
      android: {
        backgroundColor: "rgba(168, 85, 247, 0.25)",
        borderColor: themeSecond.borderStrong,
      },
      default: {
        backgroundColor: themeSecond.accentPurpleMedium,
        borderColor: themeSecond.accentPurpleMedium,
      },
    }),
  },
  photosCountText: {
    color: themeSecond.accentPurple,
    fontSize: moderateScale(12),
    fontWeight: "700",
  },
  addPhotoBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: moderateScale(6),
    paddingHorizontal: moderateScale(14),
    paddingVertical: verticalScale(10),
    borderRadius: moderateScale(20),
    backgroundColor: themeSecond.accentPurple,
    borderWidth: moderateScale(1),
    ...Platform.select({
      ios: {
        borderColor: themeSecond.accentPurpleMedium,
        shadowColor: themeSecond.shadowPurple,
        shadowOffset: { width: 0, height: verticalScale(2) },
        shadowOpacity: 0.35,
        shadowRadius: moderateScale(6),
        elevation: 0,
      },
      android: {
        borderColor: themeSecond.borderMedium,
        shadowColor: "transparent",
        shadowOpacity: 0,
        shadowRadius: 0,
        shadowOffset: { width: 0, height: 0 },
        elevation: moderateScale(5),
      },
      default: {
        borderColor: themeSecond.accentPurpleMedium,
        shadowColor: themeSecond.shadowPurple,
        shadowOffset: { width: 0, height: verticalScale(2) },
        shadowOpacity: 0.35,
        shadowRadius: moderateScale(6),
        elevation: 0,
      },
    }),
  },
  addPhotoBtnDisabled: {
    backgroundColor: themeSecond.accentPurpleMedium,
    opacity: 0.8,
  },
  addPhotoBtnLabel: {
    color: themeSecond.textPrimary,
    fontSize: moderateScale(13),
    fontWeight: "700",
  },
  bentoWrap: {
    gap: verticalScale(12),
  },
  bentoHero: {
    width: "100%",
    height: verticalScale(200),
    borderRadius: moderateScale(20),
    overflow: "hidden",
    backgroundColor: themeSecond.surfaceCardDark,
    ...Platform.select({
      ios: {
        borderWidth: moderateScale(2),
        borderColor: themeSecond.accentPurpleMedium,
        shadowColor: themeSecond.shadowPurple,
        shadowOffset: { width: 0, height: verticalScale(6) },
        shadowOpacity: 0.3,
        shadowRadius: moderateScale(14),
        elevation: 0,
      },
      android: {
        borderWidth: moderateScale(1),
        borderColor: themeSecond.borderStrong,
        shadowColor: "transparent",
        shadowOpacity: 0,
        shadowRadius: 0,
        shadowOffset: { width: 0, height: 0 },
        elevation: moderateScale(8),
      },
      default: {
        borderWidth: moderateScale(2),
        borderColor: themeSecond.accentPurpleMedium,
        shadowColor: themeSecond.shadowPurple,
        shadowOffset: { width: 0, height: verticalScale(6) },
        shadowOpacity: 0.3,
        shadowRadius: moderateScale(14),
        elevation: 0,
      },
    }),
  },
  bentoHeroEmpty: {
    borderStyle: "dashed",
    ...Platform.select({
      ios: {
        borderColor: themeSecond.accentPurpleStrong,
        backgroundColor: themeSecond.accentPurpleSubtle,
      },
      android: {
        borderColor: themeSecond.borderMedium,
        backgroundColor: "rgba(168, 85, 247, 0.12)",
      },
      default: {
        borderColor: themeSecond.accentPurpleStrong,
        backgroundColor: themeSecond.accentPurpleSubtle,
      },
    }),
  },
  bentoHeroImage: {
    width: "100%",
    height: "100%",
  },
  bentoHeroOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "50%",
  },
  bentoHeroBadge: {
    position: "absolute",
    bottom: verticalScale(12),
    left: moderateScale(12),
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(4),
    paddingHorizontal: moderateScale(10),
    paddingVertical: verticalScale(5),
    borderRadius: moderateScale(12),
    backgroundColor: themeSecond.overlayBlack,
    borderWidth: moderateScale(1),
    borderColor: themeSecond.borderLight,
  },
  bentoHeroBadgeText: {
    color: themeSecond.textPrimary,
    fontSize: 11,
    fontWeight: "700",
  },
  bentoHeroPlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: moderateScale(24),
  },
  bentoHeroPlaceholderRing: {
    width: moderateScale(72),
    height: moderateScale(72),
    borderRadius: moderateScale(36),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: themeSecond.accentPurpleLight,
    marginBottom: verticalScale(12),
    ...Platform.select({
      ios: {
        borderWidth: moderateScale(2),
        borderColor: themeSecond.accentPurpleMedium,
      },
      android: {
        borderWidth: moderateScale(1),
        borderColor: themeSecond.borderMedium,
      },
      default: {
        borderWidth: moderateScale(2),
        borderColor: themeSecond.accentPurpleMedium,
      },
    }),
  },
  bentoHeroPlaceholderTitle: {
    color: themeSecond.textPrimary,
    fontSize: moderateScale(16),
    fontWeight: "700",
    marginBottom: 4,
  },
  bentoHeroPlaceholderSub: {
    color: themeSecond.textMuted,
    fontSize: moderateScale(12),
  },
  bentoHeroPlaceholderHint: {
    marginTop: verticalScale(8),
    color: themeSecond.accentPurple,
    fontSize: moderateScale(12),
    fontWeight: "600",
  },
  bentoSwapTarget: {
    borderColor: themeSecond.accentPurple,
    borderWidth: moderateScale(3),
  },
  bentoDeleteBtn: {
    position: "absolute",
    top: verticalScale(10),
    right: moderateScale(10),
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    backgroundColor: themeSecond.overlayBlack,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: moderateScale(1),
    borderColor: themeSecond.borderLight,
  },
  bentoSelectedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: themeSecond.overlayBlack,
    alignItems: "center",
    justifyContent: "center",
  },
  bentoSelectedOverlayText: {
    color: themeSecond.textPrimary,
    fontSize: moderateScale(11),
    fontWeight: "600",
    marginTop: 6,
  },
  bentoSwapOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(168, 85, 247, 0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  bentoStrip: {
    flexDirection: "row",
    width: "100%",
    gap: moderateScale(10),
    alignItems: "stretch",
  },
  bentoThumbWrap: {
    flex: 1,
    minWidth: 0,
  },
  bentoThumb: {
    flex: 1,
    width: "100%",
    aspectRatio: 1,
    borderRadius: moderateScale(16),
    overflow: "hidden",
    backgroundColor: themeSecond.surfaceWhiteSubtle,
    ...Platform.select({
      ios: {
        borderWidth: moderateScale(2),
        borderColor: themeSecond.accentPurpleMedium,
        shadowColor: themeSecond.shadowBlack,
        shadowOffset: { width: 0, height: verticalScale(2) },
        shadowOpacity: 0.2,
        shadowRadius: moderateScale(6),
        elevation: 0,
      },
      android: {
        borderWidth: moderateScale(1),
        borderColor: themeSecond.borderStrong,
        shadowColor: "transparent",
        shadowOpacity: 0,
        shadowRadius: 0,
        shadowOffset: { width: 0, height: 0 },
        elevation: moderateScale(4),
      },
      default: {
        borderWidth: moderateScale(2),
        borderColor: themeSecond.accentPurpleMedium,
        shadowColor: themeSecond.shadowBlack,
        shadowOffset: { width: 0, height: verticalScale(2) },
        shadowOpacity: 0.2,
        shadowRadius: moderateScale(6),
        elevation: 0,
      },
    }),
  },
  bentoThumbEmpty: {
    borderStyle: "dashed",
    ...Platform.select({
      ios: {
        borderColor: themeSecond.accentPurpleMedium,
        backgroundColor: themeSecond.accentPurpleSubtle,
      },
      android: {
        borderColor: themeSecond.borderMedium,
        backgroundColor: "rgba(168, 85, 247, 0.1)",
      },
      default: {
        borderColor: themeSecond.accentPurpleMedium,
        backgroundColor: themeSecond.accentPurpleSubtle,
      },
    }),
  },
  bentoThumbImage: {
    width: "100%",
    height: "100%",
  },
  bentoThumbPlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  bentoThumbDeleteBtn: {
    position: "absolute",
    top: verticalScale(6),
    right: moderateScale(6),
    width: moderateScale(26),
    height: moderateScale(26),
    borderRadius: moderateScale(13),
    backgroundColor: themeSecond.overlayBlack,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: moderateScale(1),
    borderColor: themeSecond.borderLight,
  },
  bentoThumbSelectedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: themeSecond.overlayBlack,
    alignItems: "center",
    justifyContent: "center",
  },
  bentoThumbSwapOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(168, 85, 247, 0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  bentoThumbSwapTarget: {
    borderColor: themeSecond.accentPurple,
    borderWidth: 3,
  },
  bentoHintRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(8),
    marginTop: verticalScale(10),
    paddingHorizontal: moderateScale(4),
  },
  bentoHintText: {
    flex: 1,
    fontSize: moderateScale(12),
    ...Platform.select({
      ios: { color: themeSecond.textSoft },
      android: { color: themeSecond.textMuted },
      default: { color: themeSecond.textSoft },
    }),
  },
  bentoCancelSwapBtn: {
    paddingVertical: verticalScale(6),
    paddingHorizontal: moderateScale(12),
    borderRadius: moderateScale(10),
    borderWidth: moderateScale(1),
    ...Platform.select({
      ios: {
        backgroundColor: themeSecond.surfaceWhiteSubtle,
        borderColor: themeSecond.borderMedium,
      },
      android: {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderColor: themeSecond.borderStrong,
      },
      default: {
        backgroundColor: themeSecond.surfaceWhiteSubtle,
        borderColor: themeSecond.borderMedium,
      },
    }),
  },
  bentoCancelSwapText: {
    color: themeSecond.textPrimary,
    fontSize: moderateScale(12),
    fontWeight: "600",
  },
  bioWrap: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: verticalScale(6),
  },
  bioLabel: { color: themeSecond.textMuted, fontSize: moderateScale(12) },
  bioCount: { color: themeSecond.textSoft, fontSize: moderateScale(11) },
  bioInput: {
    backgroundColor: themeSecond.surfaceWhiteSubtle,
    borderRadius: moderateScale(12),
    padding: moderateScale(10),
    color: themeSecond.textPrimary,
    fontSize: moderateScale(14),
    minHeight: verticalScale(80),
    textAlignVertical: "top",
    borderWidth: moderateScale(1),
    borderColor: themeSecond.glassBorder,
    marginBottom: verticalScale(14),
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: moderateScale(10),
  },
  infoGridItem: {
    width: "31%",
    alignItems: "center",
    paddingVertical: verticalScale(10),
    paddingHorizontal: moderateScale(6),
    borderRadius: moderateScale(12),
    backgroundColor: themeSecond.surfaceWhiteSubtle,
    borderWidth: moderateScale(1),
    borderColor: themeSecond.glassBorder,
  },
  infoIconCircle: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: verticalScale(4),
  },
  infoLabel: {
    color: themeSecond.textMuted,
    fontSize: moderateScale(10),
    marginBottom: verticalScale(2),
  },
  infoValue: {
    color: themeSecond.textPrimary,
    fontSize: moderateScale(11),
    fontWeight: "600",
  },
  cultureSection: { marginTop: verticalScale(14) },
  cultureSectionTitle: {
    color: themeSecond.textMuted,
    fontSize: moderateScale(11),
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: moderateScale(0.8),
    marginBottom: verticalScale(8),
  },
  culturePillRow: {
    flexDirection: "row",
    gap: moderateScale(8),
  },
  culturePill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(6),
    paddingVertical: verticalScale(10),
    paddingHorizontal: moderateScale(10),
    borderRadius: moderateScale(12),
    borderWidth: moderateScale(1),
  },
  culturePillReligion: {
    backgroundColor: themeSecond.tagReligionBg,
    borderColor: themeSecond.tagReligionBorder,
  },
  culturePillSect: {
    backgroundColor: themeSecond.tagBlueBg,
    borderColor: themeSecond.tagBlueBorder,
  },
  culturePillCaste: {
    backgroundColor: themeSecond.tagGreenBg,
    borderColor: themeSecond.tagGreenBorder,
  },
  culturePillDisabled: { opacity: 0.5 },
  culturePillValue: {
    color: themeSecond.textPrimary,
    fontSize: moderateScale(11),
    fontWeight: "600",
    flex: 1,
  },
  pillCard: {
    backgroundColor: themeSecond.surfaceWhiteSubtle,
    borderRadius: moderateScale(12),
    padding: moderateScale(12),
    marginTop: verticalScale(10),
    borderWidth: moderateScale(1),
    borderColor: themeSecond.glassBorder,
  },
  pillCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(8),
    marginBottom: verticalScale(8),
  },
  pillCardTitle: {
    color: themeSecond.textPrimary,
    fontSize: moderateScale(14),
    fontWeight: "600",
    flex: 1,
  },
  pillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: moderateScale(8),
  },
  tagPill: {
    backgroundColor: themeSecond.pillBg,
    borderWidth: moderateScale(1),
    borderColor: themeSecond.pillBorder,
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(14),
  },
  tagPillText: {
    color: themeSecond.textPrimary,
    fontSize: 12,
    fontWeight: "500",
  },
  tagPillMore: {
    backgroundColor: themeSecond.accentPurple,
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(14),
  },
  tagPillMoreText: {
    color: themeSecond.textPrimary,
    fontSize: 12,
    fontWeight: "600",
  },
  pillPlaceholder: {
    color: themeSecond.textSoft,
    fontSize: moderateScale(12),
    fontStyle: "italic",
  },
  preferencePillsRow: {
    flexDirection: "row",
    gap: moderateScale(10),
    paddingVertical: verticalScale(4),
  },
  preferencePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(10),
    paddingHorizontal: moderateScale(14),
    paddingVertical: verticalScale(10),
    borderRadius: moderateScale(24),
    backgroundColor: themeSecond.surfaceWhiteSubtle,
    borderWidth: moderateScale(1),
    borderColor: themeSecond.glassBorder,
    minWidth: moderateScale(100),
  },
  preferencePillFilled: {
    backgroundColor: themeSecond.accentPurpleMedium,
    borderColor: themeSecond.accentPurpleMedium,
  },
  preferencePillLabel: {
    color: themeSecond.textMuted,
    fontSize: moderateScale(10),
  },
  preferencePillValue: {
    color: themeSecond.textPrimary,
    fontSize: moderateScale(12),
    fontWeight: "600",
  },
  inlineRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: themeSecond.surfaceWhiteSubtle,
    padding: moderateScale(12),
    borderRadius: moderateScale(12),
    marginTop: verticalScale(12),
    borderWidth: moderateScale(1),
    borderColor: themeSecond.glassBorder,
  },
  inlineRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(10),
  },
  inlineLabel: {
    color: themeSecond.textMuted,
    fontSize: moderateScale(10),
  },
  inlineValue: {
    color: themeSecond.textPrimary,
    fontSize: moderateScale(14),
    fontWeight: "600",
  },
  bottomSpacer: { height: verticalScale(40) },

  // Modals - dark glass to match
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: themeSecond.overlayBlack,
  },
  modalContent: {
    backgroundColor: themeSecond.surfaceDark,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingBottom: 34,
    maxHeight: "75%",
    borderWidth: 1,
    borderColor: themeSecond.glassBorder,
  },
  modalHeader: {
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: themeSecond.glassBorder,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: themeSecond.textSoft,
    borderRadius: 2,
    marginBottom: 16,
  },
  modalTitle: {
    color: themeSecond.textPrimary,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    paddingHorizontal: 40,
  },
  modalCloseBtn: {
    position: "absolute",
    right: moderateScale(16),
    top: verticalScale(20),
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    backgroundColor: themeSecond.surfaceWhiteLight,
    alignItems: "center",
    justifyContent: "center",
  },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: themeSecond.surfaceWhiteSubtle,
    marginHorizontal: moderateScale(16),
    marginTop: verticalScale(12),
    marginBottom: verticalScale(8),
    borderRadius: moderateScale(12),
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(10),
    borderWidth: moderateScale(1),
    borderColor: themeSecond.glassBorder,
  },
  searchInput: {
    flex: 1,
    fontSize: moderateScale(16),
    color: themeSecond.textPrimary,
    padding: 0,
    marginLeft: moderateScale(8),
  },
  optionsList: {
    paddingHorizontal: moderateScale(20),
    paddingTop: verticalScale(8),
    maxHeight: verticalScale(320),
  },
  optionsContent: { paddingBottom: verticalScale(12) },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: verticalScale(16),
    paddingHorizontal: moderateScale(16),
    borderRadius: moderateScale(14),
    marginVertical: verticalScale(4),
    backgroundColor: themeSecond.surfaceWhiteSubtle,
    borderWidth: moderateScale(1),
    borderColor: "transparent",
  },
  optionItemSelected: {
    backgroundColor: themeSecond.accentPurpleMedium,
    borderColor: themeSecond.accentPurple,
  },
  optionText: {
    color: themeSecond.textPrimary,
    fontSize: moderateScale(15),
    flex: 1,
  },
  optionTextSelected: { fontWeight: "600" },
  multiSelectFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: moderateScale(20),
    paddingVertical: verticalScale(16),
    borderTopWidth: moderateScale(1),
    borderTopColor: themeSecond.glassBorder,
  },
  selectedCountText: {
    color: themeSecond.textSoft,
    fontSize: moderateScale(13),
  },
  confirmBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(8),
    backgroundColor: themeSecond.accentPurple,
    paddingHorizontal: moderateScale(20),
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(20),
  },
  confirmBtnText: {
    color: themeSecond.textPrimary,
    fontSize: moderateScale(15),
    fontWeight: "600",
  },
  ageDisplayWrap: {
    alignItems: "center",
    paddingVertical: verticalScale(16),
  },
  ageCircle: {
    width: moderateScale(80),
    height: moderateScale(80),
    borderRadius: moderateScale(40),
    backgroundColor: themeSecond.pillBg,
    borderWidth: moderateScale(1),
    borderColor: themeSecond.pillBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  ageNumber: {
    color: themeSecond.textPrimary,
    fontSize: moderateScale(28),
    fontWeight: "700",
  },
  ageLabel: { color: themeSecond.textSoft, fontSize: moderateScale(11) },
  datePickerRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: moderateScale(16),
  },
  pickerColumn: { flex: 1, alignItems: "center" },
  pickerLabel: {
    color: themeSecond.textMuted,
    fontSize: moderateScale(11),
    marginBottom: verticalScale(8),
  },
  pickerScroll: { maxHeight: verticalScale(120) },
  pickerScrollContent: { paddingVertical: verticalScale(4) },
  pickerItem: {
    paddingVertical: verticalScale(10),
    paddingHorizontal: moderateScale(12),
    borderRadius: moderateScale(10),
    marginVertical: verticalScale(2),
    backgroundColor: themeSecond.surfaceWhiteSubtle,
  },
  pickerItemSelected: {
    backgroundColor: themeSecond.accentPurpleMedium,
    borderWidth: moderateScale(1),
    borderColor: themeSecond.accentPurple,
  },
  pickerItemText: {
    color: themeSecond.textPrimary,
    fontSize: moderateScale(14),
  },
  pickerItemTextSelected: { fontWeight: "600" },
  selectedDateWrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: moderateScale(8),
    marginTop: verticalScale(16),
    marginBottom: verticalScale(16),
  },
  selectedDateText: {
    color: themeSecond.textPrimary,
    fontSize: moderateScale(16),
    fontWeight: "600",
  },
});
