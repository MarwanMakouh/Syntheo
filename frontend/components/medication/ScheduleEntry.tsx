import { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  ActionSheetIOS,
  ScrollView,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors, FontSize, Spacing, BorderRadius, FontWeight, Shadows } from '@/constants';
import { DAGDEEL_OPTIONS, DAY_OF_WEEK_OPTIONS } from '@/constants/medicationConstants';

interface ScheduleData {
  time_of_day: 'Ochtend' | 'Middag' | 'Avond' | 'Nacht';
  dosage: string;
  instructions: string;
  day_of_week: string;
}

interface Props {
  index: number;
  schedule: ScheduleData;
  onChange: (index: number, field: keyof ScheduleData, value: string) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}

export function ScheduleEntry({ index, schedule, onChange, onRemove, canRemove }: Props) {
  const [dagdeelDropdownOpen, setDagdeelDropdownOpen] = useState(false);
  const [dayOfWeekDropdownOpen, setDayOfWeekDropdownOpen] = useState(false);

  const handleDagdeelPress = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Annuleren', ...DAGDEEL_OPTIONS.map(d => d.label)],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex > 0) {
            onChange(index, 'time_of_day', DAGDEEL_OPTIONS[buttonIndex - 1].value);
          }
        }
      );
    } else {
      setDayOfWeekDropdownOpen(false);
      setDagdeelDropdownOpen(!dagdeelDropdownOpen);
    }
  };

  const handleDayOfWeekPress = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Annuleren', ...DAY_OF_WEEK_OPTIONS.map(d => d.label)],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex > 0) {
            onChange(index, 'day_of_week', DAY_OF_WEEK_OPTIONS[buttonIndex - 1].value);
          }
        }
      );
    } else {
      setDagdeelDropdownOpen(false);
      setDayOfWeekDropdownOpen(!dayOfWeekDropdownOpen);
    }
  };

  const getDagdeelLabel = () => {
    const dagdeel = DAGDEEL_OPTIONS.find(d => d.value === schedule.time_of_day);
    return dagdeel ? dagdeel.label : 'Selecteer dagdeel';
  };

  const getDayOfWeekLabel = () => {
    const day = DAY_OF_WEEK_OPTIONS.find(d => d.value === schedule.day_of_week);
    return day ? day.label : 'Selecteer dag';
  };

  return (
    <View style={[
      styles.container,
      (dagdeelDropdownOpen || dayOfWeekDropdownOpen) && styles.containerElevated
    ]}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Schema {index + 1}</Text>
        {canRemove && (
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => onRemove(index)}
            activeOpacity={0.7}
          >
            <MaterialIcons name="delete" size={20} color={Colors.error} />
            <Text style={styles.removeButtonText}>Verwijder</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Dagdeel Dropdown */}
      <View style={[styles.fieldContainer, dagdeelDropdownOpen && styles.fieldContainerOpen]}>
        <Text style={styles.label}>
          Dagdeel <Text style={styles.required}>*</Text>
        </Text>
        <View style={styles.dropdownWrapper}>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={handleDagdeelPress}
            activeOpacity={0.7}
          >
            <Text style={styles.dropdownButtonText}>{getDagdeelLabel()}</Text>
            <MaterialIcons
              name={dagdeelDropdownOpen ? "arrow-drop-up" : "arrow-drop-down"}
              size={24}
              color={Colors.iconDefault}
            />
          </TouchableOpacity>

          {dagdeelDropdownOpen && Platform.OS !== 'ios' && (
            <View style={[styles.dropdownList, Platform.OS === 'web' && styles.dropdownListWeb]}>
              <ScrollView style={styles.scrollView} nestedScrollEnabled>
                {DAGDEEL_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.dropdownItem,
                      schedule.time_of_day === option.value && styles.dropdownItemSelected,
                    ]}
                    onPress={() => {
                      onChange(index, 'time_of_day', option.value);
                      setDagdeelDropdownOpen(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        schedule.time_of_day === option.value && styles.dropdownItemTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                    {schedule.time_of_day === option.value && (
                      <MaterialIcons name="check" size={20} color={Colors.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </View>

      {/* Dosage Input */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>
          Dosering <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          value={schedule.dosage}
          onChangeText={(text) => onChange(index, 'dosage', text)}
          placeholder="Bijv. 500mg, 1 tablet, 2 ml"
          placeholderTextColor={Colors.textMuted}
        />
      </View>

      {/* Instructions Input */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Instructies (optioneel)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={schedule.instructions}
          onChangeText={(text) => onChange(index, 'instructions', text)}
          placeholder="Bijv. Met eten innemen, voor het slapen"
          placeholderTextColor={Colors.textMuted}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
      </View>

      {/* Day of Week Dropdown */}
      <View style={[styles.fieldContainer, dayOfWeekDropdownOpen && styles.fieldContainerOpen]}>
        <Text style={styles.label}>
          Dag van de week <Text style={styles.required}>*</Text>
        </Text>
        <View style={styles.dropdownWrapper}>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={handleDayOfWeekPress}
            activeOpacity={0.7}
          >
            <Text style={styles.dropdownButtonText}>{getDayOfWeekLabel()}</Text>
            <MaterialIcons
              name={dayOfWeekDropdownOpen ? "arrow-drop-up" : "arrow-drop-down"}
              size={24}
              color={Colors.iconDefault}
            />
          </TouchableOpacity>

          {dayOfWeekDropdownOpen && Platform.OS !== 'ios' && (
            <View style={[styles.dropdownList, Platform.OS === 'web' && styles.dropdownListWeb]}>
              <ScrollView style={styles.scrollView} nestedScrollEnabled>
                {DAY_OF_WEEK_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.dropdownItem,
                      schedule.day_of_week === option.value && styles.dropdownItemSelected,
                    ]}
                    onPress={() => {
                      onChange(index, 'day_of_week', option.value);
                      setDayOfWeekDropdownOpen(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        schedule.day_of_week === option.value && styles.dropdownItemTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                    {schedule.day_of_week === option.value && (
                      <MaterialIcons name="check" size={20} color={Colors.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  containerElevated: {
    ...(Platform.OS === 'web' ? { zIndex: 10001 } : { zIndex: 2001 }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  headerText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  removeButtonText: {
    fontSize: FontSize.md,
    color: Colors.error,
    fontWeight: FontWeight.medium,
  },
  fieldContainer: {
    marginBottom: Spacing.lg,
    position: 'relative',
  },
  fieldContainerOpen: {
    ...(Platform.OS === 'web' ? { zIndex: 10000 } : { zIndex: 2000 }),
  },
  label: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  required: {
    color: Colors.error,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    fontSize: FontSize.lg,
    backgroundColor: Colors.background,
    color: Colors.textPrimary,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  dropdownWrapper: {
    flex: 1,
    position: 'relative',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background,
  },
  dropdownButtonText: {
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
  },
  dropdownList: {
    position: 'absolute',
    top: 52,
    left: 0,
    right: 0,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    ...Shadows.dropdown,
    maxHeight: 200,
    zIndex: 1,
  },
  dropdownListWeb: {
    position: 'absolute' as any,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
  },
  scrollView: {
    maxHeight: 200,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  dropdownItemSelected: {
    backgroundColor: Colors.selectedBackground,
  },
  dropdownItemText: {
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
  },
  dropdownItemTextSelected: {
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
  },
});
