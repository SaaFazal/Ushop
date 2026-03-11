import { StyleSheet, FlatList, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Text, View } from '@/components/Themed';
import { fetchAlerts } from '@/lib/api';
import Colors from '@/constants/Colors';
import { SymbolView } from 'expo-symbols';

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const result = await fetchAlerts();
      setAlerts(result);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={alerts}
        keyExtractor={(item, index) => index.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.dark.tint} />
        }
        renderItem={({ item }) => (
          <View style={styles.alertCard}>
            <View style={[styles.iconContainer, { backgroundColor: item.type === 'CRITICAL' ? '#450a0a' : '#422006' }]}>
              <SymbolView 
                name={item.type === 'CRITICAL' ? "exclamationmark.octagon.fill" : "exclamationmark.triangle.fill"} 
                tintColor={item.type === 'CRITICAL' ? "#ef4444" : "#f59e0b"} 
                size={24} 
              />
            </View>
            <View style={styles.alertInfo}>
              <Text style={styles.alertTitle}>{item.productName}</Text>
              <Text style={styles.alertMessage}>{item.message}</Text>
              <Text style={styles.alertDate}>Batch: {item.batchId} • Expiry: {item.expiryDate}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
             <SymbolView name="checkmark.seal.fill" tintColor="#005C39" size={60} />
            <Text style={styles.emptyText}>No active alerts. Everything is fresh!</Text>
          </View>
        }
        contentContainerStyle={{ padding: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
  },
  alertCard: {
    flexDirection: 'row',
    backgroundColor: '#111',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#222',
    alignItems: 'center',
  },
  iconContainer: {
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertInfo: {
    flex: 1,
    marginLeft: 15,
    backgroundColor: 'transparent',
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  alertMessage: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 2,
  },
  alertDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  empty: {
    marginTop: 100,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
  },
});
