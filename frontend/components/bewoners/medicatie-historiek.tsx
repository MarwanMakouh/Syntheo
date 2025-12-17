import { StyleSheet, View, Text, ScrollView } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '@/constants';

interface HistoriekItem {
  date: string;
  ochtend: boolean;
  middag: boolean;
  avond: boolean;
  nacht: boolean;
}

interface MedicatieHistoriekProps {
  historiek: HistoriekItem[];
}

export function MedicatieHistoriek({ historiek }: MedicatieHistoriekProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${day}-${month}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>7-Dagen Historiek</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.table}>
          {/* Header Row */}
          <View style={styles.headerRow}>
            <View style={[styles.cell, styles.headerCell, styles.dateColumn]}>
              <Text style={styles.headerText}>Datum</Text>
            </View>
            <View style={[styles.cell, styles.headerCell]}>
              <Text style={styles.headerText}>Ochtend</Text>
            </View>
            <View style={[styles.cell, styles.headerCell]}>
              <Text style={styles.headerText}>Middag</Text>
            </View>
            <View style={[styles.cell, styles.headerCell]}>
              <Text style={styles.headerText}>Avond</Text>
            </View>
            <View style={[styles.cell, styles.headerCell]}>
              <Text style={styles.headerText}>Nacht</Text>
            </View>
          </View>

          {/* Data Rows */}
          {historiek.map((item, index) => (
            <View key={index} style={styles.dataRow}>
              <View style={[styles.cell, styles.dateColumn]}>
                <Text style={styles.cellText}>{formatDate(item.date)}</Text>
              </View>
              <View style={styles.cell}>
                {item.ochtend ? (
                  <MaterialIcons name="check" size={20} color={Colors.success} />
                ) : (
                  <Text style={styles.emptyText}>—</Text>
                )}
              </View>
              <View style={styles.cell}>
                {item.middag ? (
                  <MaterialIcons name="check" size={20} color={Colors.success} />
                ) : (
                  <Text style={styles.emptyText}>—</Text>
                )}
              </View>
              <View style={styles.cell}>
                {item.avond ? (
                  <MaterialIcons name="check" size={20} color={Colors.success} />
                ) : (
                  <Text style={styles.emptyText}>—</Text>
                )}
              </View>
              <View style={styles.cell}>
                {item.nacht ? (
                  <MaterialIcons name="check" size={20} color={Colors.success} />
                ) : (
                  <Text style={styles.emptyText}>—</Text>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xl,
  },
  table: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundTertiary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  dataRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  cell: {
    width: 100,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCell: {
    paddingVertical: Spacing.lg,
  },
  dateColumn: {
    width: 80,
  },
  headerText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  cellText: {
    fontSize: FontSize.md,
    color: Colors.textBody,
  },
  emptyText: {
    fontSize: FontSize.lg,
    color: Colors.iconMuted,
  },
});
