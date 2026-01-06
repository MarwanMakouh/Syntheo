import { StyleSheet, View, TextInput, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Colors, FontSize, Spacing, BorderRadius } from '@/constants';

interface AuditLogsFiltersProps {
  actionFilter: string;
  userFilter: string;
  dateFilter: string;
  onActionFilterChange: (value: string) => void;
  onUserFilterChange: (value: string) => void;
  onDateFilterChange: (value: string) => void;
}

export function AuditLogsFilters({
  actionFilter,
  userFilter,
  dateFilter,
  onActionFilterChange,
  onUserFilterChange,
  onDateFilterChange,
}: AuditLogsFiltersProps) {
  return (
    <View style={styles.container}>
      {/* Action Filter */}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={actionFilter}
          onValueChange={onActionFilterChange}
          style={styles.picker}
        >
          <Picker.Item label="Alle acties" value="all" />
          <Picker.Item label="Toegevoegd" value="CREATE" />
          <Picker.Item label="Bewerkt" value="UPDATE" />
          <Picker.Item label="Verwijderd" value="DELETE" />
          <Picker.Item label="Goedgekeurd" value="APPROVE" />
          <Picker.Item label="Afgekeurd" value="REJECT" />
        </Picker>
      </View>

      {/* User Filter */}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={userFilter}
          onValueChange={onUserFilterChange}
          style={styles.picker}
        >
          <Picker.Item label="Alle gebruikers" value="all" />
        </Picker>
      </View>

      {/* Date Filter */}
      <View style={styles.dateContainer}>
        <TextInput
          style={styles.dateInput}
          placeholder="dd-mm-jjjj"
          placeholderTextColor={Colors.textSecondary}
          value={dateFilter}
          onChangeText={onDateFilterChange}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginBottom: Spacing.xl,
    flexWrap: 'wrap',
    alignItems: 'stretch',
  },
  pickerContainer: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    height: 50,
    justifyContent: 'center',
    ...Platform.select({
      web: {
        minWidth: 200,
        flex: 0,
      },
      default: {
        flex: 1,
        minWidth: 150,
      },
    }),
  },
  picker: {
    height: 50,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    ...Platform.select({
      web: {
        width: '100%',
      },
    }),
  },
  dateContainer: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
    ...Platform.select({
      web: {
        minWidth: 180,
        flex: 0,
      },
      default: {
        flex: 1,
        minWidth: 150,
      },
    }),
  },
  dateInput: {
    height: '100%',
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    outlineStyle: 'none',
  },
});
