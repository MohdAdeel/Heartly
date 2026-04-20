import React, {
  useRef,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  PanResponder,
  TouchableOpacity,
} from "react-native";
import { FilterParams } from "../types/filter";
import { themeSecond } from "../theme/colorSecond";
import { useFilters } from "../context/FilterContext";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native";
import { Modal, Pressable, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { MainStackParamList } from "../types/navigation.types";
import { moderateScale, verticalScale } from "react-native-size-matters";
import { locationOptions, religionOptions } from "../constants/MultiSelects";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

const SLIDER_WIDTH = moderateScale(260);

const mockUser = { isPremium: false };

// Filter row matching app list style (glass, icon, label, value, chevron)
const FilterRow = ({
  icon,
  label,
  value,
  placeholder,
  onPress,
  locked,
  onLockPress,
}: {
  icon: string;
  label: string;
  value: string;
  placeholder: string;
  onPress: () => void;
  locked?: boolean;
  onLockPress?: () => void;
}) => {
  const content = (
    <View style={styles.filterRow}>
      <View style={styles.filterRowIconWrap}>
        <Ionicons
          name={icon as any}
          size={moderateScale(20)}
          color={locked ? themeSecond.textSoft : themeSecond.accentPurple}
        />
      </View>
      <View style={styles.filterRowContent}>
        <Text style={styles.filterRowLabel}>{label}</Text>
        <Text
          style={[
            styles.filterRowValue,
            !value && styles.filterRowValuePlaceholder,
          ]}
          numberOfLines={1}
        >
          {value || placeholder}
        </Text>
      </View>
      {locked ? (
        <View style={styles.lockBadge}>
          <Ionicons
            name="lock-closed"
            size={moderateScale(16)}
            color={themeSecond.textSoft}
          />
        </View>
      ) : (
        <Ionicons
          name="chevron-forward"
          size={moderateScale(18)}
          color={themeSecond.textSoft}
        />
      )}
    </View>
  );

  if (locked) {
    return (
      <TouchableOpacity
        style={[styles.filterRowTouch, styles.filterRowLocked]}
        onPress={onLockPress}
        activeOpacity={0.7}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={styles.filterRowTouch}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {content}
    </TouchableOpacity>
  );
};

const FilterScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const { filters, setFilters, resetFilters } = useFilters();

  const [minAge, setMinAge] = useState(22);
  const [maxAge, setMaxAge] = useState(34);
  const [selectedReligion, setSelectedReligion] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedHeight, setSelectedHeight] = useState("");
  const [selectedMaritalStatus, setSelectedMaritalStatus] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedEthnicity, setSelectedEthnicity] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentOptions, setCurrentOptions] = useState<
    string[] | Array<{ name: string; flag: string; value: string }>
  >([]);
  const [currentValue, setCurrentValue] = useState("");
  const [currentSetter, setCurrentSetter] = useState<
    ((value: string) => void) | null
  >(null);

  const applyIncomingFilters = useCallback(() => {
    const incoming = filters;
    if (!incoming) return;

    setMinAge(incoming.min_age ?? 22);
    setMaxAge(incoming.max_age ?? 34);
    setSelectedReligion(incoming.religion ?? "");
    // Prefer explicit location, fall back to country if provided
    setSelectedLocation(incoming.country ?? "");
    setSelectedCountry(incoming.country ?? "");
    setSelectedHeight(incoming.height ?? "");
    setSelectedMaritalStatus(incoming.marital_status ?? "");
    setSelectedEthnicity(incoming.caste ?? "");
  }, [filters]);

  useFocusEffect(
    useCallback(() => {
      applyIncomingFilters();
      // Close any open modal when returning
      setModalVisible(false);
    }, [applyIncomingFilters])
  );

  useEffect(() => {
    if (maxAge < minAge) setMaxAge(minAge);
  }, [minAge, maxAge]);

  const openModal = (
    title: string,
    options: string[] | Array<{ name: string; flag: string; value: string }>,
    setter: (value: string) => void,
    selectedValue: string
  ) => {
    setModalTitle(title);
    setCurrentOptions(options || []);
    setCurrentSetter(() => setter);
    setCurrentValue(selectedValue || "");
    setSearchQuery("");
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setCurrentSetter(null);
    setSearchQuery("");
  };

  const handleReset = () => {
    setMinAge(22);
    setMaxAge(34);
    setSelectedReligion("");
    setSelectedLocation("");
    setSelectedHeight("");
    setSelectedMaritalStatus("");
    setSelectedCountry("");
    setSelectedEthnicity("");
    resetFilters();
    navigation.goBack();
  };

  const buildFilters = useCallback((): FilterParams => {
    const filters: FilterParams = {
      min_age: minAge,
      max_age: maxAge,
    };

    if (selectedReligion) filters.religion = selectedReligion;
    if (selectedLocation) filters.country = selectedLocation;
    if (selectedCountry) filters.country = selectedCountry;
    if (selectedHeight) filters.height = selectedHeight;
    if (selectedMaritalStatus) filters.marital_status = selectedMaritalStatus;
    if (selectedEthnicity) filters.caste = selectedEthnicity;

    return filters;
  }, [
    maxAge,
    minAge,
    selectedCountry,
    selectedEthnicity,
    selectedHeight,
    selectedLocation,
    selectedMaritalStatus,
    selectedReligion,
  ]);

  const handleApplyFilters = () => {
    const filtersPayload = buildFilters();
    const hasFilters = Object.values(filtersPayload).some(
      (value) => value !== undefined && value !== null && value !== ""
    );

    if (hasFilters) {
      setFilters(filtersPayload);
    } else {
      resetFilters();
    }

    navigation.goBack();
  };

  const minAgePosition = ((minAge - 18) / (60 - 18)) * SLIDER_WIDTH;
  const maxAgePosition = ((maxAge - 18) / (60 - 18)) * SLIDER_WIDTH;

  const minAgePanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const newPosition = minAgePosition + gestureState.dx;
        const clamped = Math.max(
          0,
          Math.min(newPosition, maxAgePosition - moderateScale(20))
        );
        const newAge = Math.round(18 + (clamped / SLIDER_WIDTH) * 42);
        if (newAge >= 18 && newAge <= maxAge) {
          setMinAge(newAge);
          if (newAge === maxAge && maxAge < 60) setMaxAge(maxAge + 1);
        }
      },
    })
  ).current;

  const maxAgePanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const newPosition = maxAgePosition + gestureState.dx;
        const clamped = Math.max(
          minAgePosition + moderateScale(20),
          Math.min(newPosition, SLIDER_WIDTH)
        );
        const newAge = Math.round(18 + (clamped / SLIDER_WIDTH) * 42);
        if (newAge >= minAge && newAge <= 60) {
          setMaxAge(newAge);
          if (newAge === minAge && minAge > 18) setMinAge(minAge - 1);
        }
      },
    })
  ).current;

  const handleUnlockPremium = () => navigation.navigate("PremiumScreen");

  const filteredOptions = useMemo(() => {
    const opts = currentOptions || [];
    const q = searchQuery.toLowerCase().trim();
    if (!q) return opts;
    return opts.filter((opt) => {
      if (typeof opt === "string") return opt.toLowerCase().includes(q);
      return (
        opt.name.toLowerCase().includes(q) ||
        opt.value.toLowerCase().includes(q)
      );
    });
  }, [currentOptions, searchQuery]);

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerIconCircle}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons
            name="chevron-back"
            size={moderateScale(24)}
            color={themeSecond.textPrimary}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Filter Matches</Text>
        <TouchableOpacity
          style={styles.resetButton}
          onPress={handleReset}
          activeOpacity={0.7}
        >
          <Text style={styles.resetText}>Reset</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Basic Filters */}
        <Text style={styles.sectionTitle}>Basic Filters</Text>
        <View style={styles.ageCard}>
          <View style={styles.ageRow}>
            <Text style={styles.ageLabel}>Min Age</Text>
            <Text style={styles.ageLabel}>Max Age</Text>
          </View>
          <View style={styles.ageRow}>
            <Text style={styles.ageValue}>{minAge}</Text>
            <Text style={styles.ageValue}>{maxAge}</Text>
          </View>
          <View style={styles.sliderContainer}>
            <View style={styles.sliderTrack} />
            <View
              style={[
                styles.sliderActiveTrack,
                {
                  left: minAgePosition,
                  width: maxAgePosition - minAgePosition,
                },
              ]}
            />
            <View
              {...minAgePanResponder.panHandlers}
              style={[
                styles.sliderThumb,
                { left: minAgePosition - moderateScale(20) },
              ]}
            >
              <View style={styles.sliderThumbCircle} />
            </View>
            <View
              {...maxAgePanResponder.panHandlers}
              style={[
                styles.sliderThumb,
                { left: maxAgePosition - moderateScale(20) },
              ]}
            >
              <View style={styles.sliderThumbCircle} />
            </View>
          </View>
        </View>

        <View style={styles.filterCard}>
          <FilterRow
            icon="book-outline"
            label="Religion"
            value={selectedReligion}
            placeholder="Select Religion"
            onPress={() =>
              openModal(
                "Select Religion",
                religionOptions,
                setSelectedReligion,
                selectedReligion
              )
            }
          />
          <View style={styles.filterSeparator} />
          <FilterRow
            icon="location-outline"
            label="Location"
            value={selectedLocation}
            placeholder="Select Location"
            onPress={() =>
              openModal(
                "Select Location",
                locationOptions,
                setSelectedLocation,
                selectedLocation
              )
            }
          />
        </View>

        {/* Advanced Filters */}
        <Text style={[styles.sectionTitle, styles.sectionTitleAdvanced]}>
          Advanced Filters
        </Text>
        {!mockUser.isPremium && (
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumBadgeText}>Unlock Premium</Text>
          </View>
        )}
        <View style={styles.advancedCard}>
          <FilterRow
            icon="resize-outline"
            label="Height"
            value={selectedHeight}
            placeholder="Select Height"
            onPress={() => {}}
            locked={!mockUser.isPremium}
            onLockPress={handleUnlockPremium}
          />
          <View style={styles.filterSeparator} />
          <FilterRow
            icon="heart-outline"
            label="Marital Status"
            value={selectedMaritalStatus}
            placeholder="Select Marital Status"
            onPress={() => {}}
            locked={!mockUser.isPremium}
            onLockPress={handleUnlockPremium}
          />
          <View style={styles.filterSeparator} />
          <FilterRow
            icon="globe-outline"
            label="Country"
            value={selectedCountry}
            placeholder="Select Country"
            onPress={() => {}}
            locked={!mockUser.isPremium}
            onLockPress={handleUnlockPremium}
          />
          <View style={styles.filterSeparator} />
          <FilterRow
            icon="people-outline"
            label="Ethnicity"
            value={selectedEthnicity}
            placeholder="Select Ethnicity"
            onPress={() => {}}
            locked={!mockUser.isPremium}
            onLockPress={handleUnlockPremium}
          />
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.applyButton}
          onPress={handleApplyFilters}
          activeOpacity={0.85}
        >
          <Text style={styles.applyButtonText}>Show Results</Text>
          <Text style={styles.applyButtonSubtext}>
            We'll filter matches based on your choices
          </Text>
        </TouchableOpacity>
      </View>

      {/* Single-select Modal (same behavior as ProfileSetting) */}
      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={closeModal}
        statusBarTranslucent
      >
        <View style={styles.modalOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={closeModal} />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
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
              {filteredOptions.map((option) => {
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
                      numberOfLines={1}
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
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default FilterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeSecond.bgDark,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: moderateScale(16),
    paddingVertical: verticalScale(12),
    backgroundColor: themeSecond.bgDark,
  },
  headerIconCircle: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: themeSecond.glassBg,
    borderWidth: moderateScale(1),
    borderColor: themeSecond.glassBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: moderateScale(18),
    fontWeight: "700",
    color: themeSecond.textPrimary,
  },
  resetButton: {
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(8),
  },
  resetText: {
    fontSize: moderateScale(15),
    fontWeight: "600",
    color: themeSecond.accentPurple,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: moderateScale(16),
    paddingTop: verticalScale(8),
  },
  sectionTitle: {
    fontSize: moderateScale(22),
    fontWeight: "700",
    color: themeSecond.textPrimary,
    marginBottom: verticalScale(14),
  },
  sectionTitleAdvanced: {
    marginTop: verticalScale(24),
  },
  ageCard: {
    backgroundColor: themeSecond.glassBg,
    borderRadius: moderateScale(16),
    padding: moderateScale(20),
    marginBottom: verticalScale(16),
    borderWidth: moderateScale(1),
    borderColor: themeSecond.glassBorder,
  },
  ageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: verticalScale(8),
  },
  ageLabel: {
    fontSize: moderateScale(13),
    color: themeSecond.textSoft,
  },
  ageValue: {
    fontSize: moderateScale(18),
    fontWeight: "600",
    color: themeSecond.textPrimary,
  },
  sliderContainer: {
    height: verticalScale(40),
    justifyContent: "center",
    position: "relative",
    marginTop: verticalScale(8),
  },
  sliderTrack: {
    position: "absolute",
    left: 0,
    right: 0,
    height: verticalScale(4),
    backgroundColor: themeSecond.surfaceMuted,
    borderRadius: moderateScale(2),
  },
  sliderActiveTrack: {
    position: "absolute",
    height: verticalScale(4),
    backgroundColor: themeSecond.accentPurple,
    borderRadius: moderateScale(2),
    top: verticalScale(18),
  },
  sliderThumb: {
    position: "absolute",
    width: moderateScale(40),
    height: verticalScale(40),
    top: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  sliderThumbCircle: {
    width: moderateScale(20),
    height: moderateScale(20),
    borderRadius: moderateScale(10),
    backgroundColor: themeSecond.accentPurple,
    borderWidth: moderateScale(3),
    borderColor: themeSecond.bgDark,
  },
  filterCard: {
    backgroundColor: themeSecond.glassBg,
    borderRadius: moderateScale(16),
    paddingHorizontal: moderateScale(16),
    paddingVertical: verticalScale(8),
    marginBottom: verticalScale(8),
    borderWidth: moderateScale(1),
    borderColor: themeSecond.glassBorder,
  },
  filterRowTouch: {
    paddingVertical: verticalScale(12),
  },
  filterRowLocked: {
    opacity: 0.7,
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(14),
  },
  filterRowIconWrap: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(12),
    backgroundColor: themeSecond.accentPurpleLight,
    borderWidth: moderateScale(1),
    borderColor: themeSecond.accentPurpleMedium,
    alignItems: "center",
    justifyContent: "center",
  },
  filterRowContent: {
    flex: 1,
    minWidth: 0,
  },
  filterRowLabel: {
    fontSize: moderateScale(12),
    color: themeSecond.textSoft,
    marginBottom: verticalScale(2),
  },
  filterRowValue: {
    fontSize: moderateScale(15),
    fontWeight: "500",
    color: themeSecond.textPrimary,
  },
  filterRowValuePlaceholder: {
    color: themeSecond.textSoft,
    fontWeight: "400",
  },
  lockBadge: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    backgroundColor: themeSecond.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  advancedCard: {
    backgroundColor: themeSecond.glassBg,
    borderRadius: moderateScale(16),
    paddingHorizontal: moderateScale(16),
    paddingVertical: verticalScale(8),
    borderWidth: moderateScale(1),
    borderColor: themeSecond.glassBorder,
    borderLeftWidth: moderateScale(3),
    borderLeftColor: themeSecond.accentPurple,
  },
  premiumBadge: {
    alignSelf: "flex-start",
    backgroundColor: themeSecond.accentPurple,
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(16),
    marginBottom: verticalScale(12),
  },
  premiumBadgeText: {
    fontSize: moderateScale(12),
    fontWeight: "600",
    color: themeSecond.textPrimary,
  },
  filterSeparator: {
    height: verticalScale(1),
    backgroundColor: themeSecond.borderLight,
    marginLeft: moderateScale(60),
  },
  bottomSpacing: {
    height: verticalScale(20),
  },
  footer: {
    paddingHorizontal: moderateScale(16),
    paddingBottom: verticalScale(20),
    paddingTop: verticalScale(6),
    backgroundColor: themeSecond.bgDark,
  },
  applyButton: {
    backgroundColor: themeSecond.accentPurple,
    borderRadius: moderateScale(14),
    paddingVertical: verticalScale(14),
    paddingHorizontal: moderateScale(16),
    alignItems: "center",
    borderWidth: moderateScale(1),
    borderColor: themeSecond.accentPurpleMedium,
  },
  applyButtonText: {
    color: themeSecond.textPrimary,
    fontSize: moderateScale(16),
    fontWeight: "700",
  },
  applyButtonSubtext: {
    color: themeSecond.textPrimary,
    opacity: 0.85,
    marginTop: verticalScale(4),
    fontSize: moderateScale(12),
  },

  // Modal styles (copied/adapted from ProfileSetting to match look)
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: themeSecond.overlayBlack,
  },
  modalContent: {
    backgroundColor: themeSecond.surfaceDark,
    borderTopLeftRadius: moderateScale(28),
    borderTopRightRadius: moderateScale(28),
    paddingBottom: verticalScale(24),
    maxHeight: "75%",
    borderWidth: moderateScale(1),
    borderColor: themeSecond.glassBorder,
  },
  modalHeader: {
    alignItems: "center",
    paddingTop: verticalScale(14),
    paddingBottom: verticalScale(14),
    borderBottomWidth: moderateScale(1),
    borderBottomColor: themeSecond.glassBorder,
  },
  modalTitle: {
    color: themeSecond.textPrimary,
    fontSize: moderateScale(18),
    fontWeight: "700",
    textAlign: "center",
    paddingHorizontal: moderateScale(40),
  },
  modalCloseBtn: {
    position: "absolute",
    right: moderateScale(16),
    top: verticalScale(10),
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
    marginRight: moderateScale(10),
  },
  optionTextSelected: {
    fontWeight: "600",
  },
});
