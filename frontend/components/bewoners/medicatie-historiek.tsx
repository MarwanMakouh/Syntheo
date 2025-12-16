import { StyleSheet, View, Text, ScrollView } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

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
                  <MaterialIcons name="check" size={20} color="#10B981" />
                ) : (
                  <Text style={styles.emptyText}>—</Text>
                )}
              </View>
              <View style={styles.cell}>
                {item.middag ? (
                  <MaterialIcons name="check" size={20} color="#10B981" />
                ) : (
                  <Text style={styles.emptyText}>—</Text>
                )}
              </View>
              <View style={styles.cell}>
                {item.avond ? (
                  <MaterialIcons name="check" size={20} color="#10B981" />
                ) : (
                  <Text style={styles.emptyText}>—</Text>
                )}
              </View>
              <View style={styles.cell}>
                {item.nacht ? (
                  <MaterialIcons name="check" size={20} color="#10B981" />
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
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 16,
  },
  table: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#F9F9F9',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  dataRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  cell: {
    width: 100,
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCell: {
    paddingVertical: 12,
  },
  dateColumn: {
    width: 80,
  },
  headerText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000000',
  },
  cellText: {
    fontSize: 14,
    color: '#333333',
  },
  emptyText: {
    fontSize: 16,
    color: '#CCCCCC',
  },
});
