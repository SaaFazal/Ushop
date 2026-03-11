import { StyleSheet, ScrollView, RefreshControl, Image, View as RNView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Text, View } from '@/components/Themed';
import { fetchDashboard } from '@/lib/api';
import Colors from '@/constants/Colors';
import { SymbolView } from 'expo-symbols';

export default function DashboardScreen() {
  const [data, setData] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const result = await fetchDashboard();
      setData(result);
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

  if (!data) {
    return (
      <View style={styles.container}>
        <Text>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.dark.tint} />
      }
    >
      <View style={styles.header}>
        <Image 
          source={require('../../assets/logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.grid}>
        <Card 
          title="Total Products" 
          value={data.totalProducts} 
          icon="package.fill"
          color="#222"
        />
        <Card 
          title="Expiring Soon" 
          value={data.expiringSevenDays} 
          icon="exclamationmark.circle.fill"
          color="#E76F21"
          subtitle="Next 7 Days"
        />
        <Card 
          title="Cost at Risk" 
          value={`£${data.totalRiskValue?.toFixed(2)}`} 
          icon="chart.line.uptrend.xyaxis"
          color="#005C39"
        />
        <Card 
          title="Low Stock" 
          value={data.lowStockItems} 
          icon="shippingbox.fill"
          color="#FACC15"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>System Status</Text>
        <View style={styles.statusItem}>
          <SymbolView name="checkmark.circle.fill" tintColor="#005C39" size={20} />
          <Text style={styles.statusText}>Database Connected</Text>
        </View>
        <View style={styles.statusItem}>
          <SymbolView name="antenna.radiowaves.left.and.right" tintColor="#005C39" size={20} />
          <Text style={styles.statusText}>Real-time Sync Active</Text>
        </View>
      </View>
    </ScrollView>
  );
}

function Card({ title, value, icon, color, subtitle }: any) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{title}</Text>
        <SymbolView name={icon} tintColor={color} size={20} />
      </View>
      <Text style={styles.cardValue}>{value}</Text>
      {subtitle && <Text style={styles.cardSubtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#050505',
  },
  header: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: 'transparent',
  },
  logo: {
    width: 200,
    height: 50,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
    backgroundColor: 'transparent',
  },
  card: {
    width: '47%',
    backgroundColor: '#111',
    padding: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#222',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
    backgroundColor: 'transparent',
  },
  cardTitle: {
    fontSize: 12,
    color: '#888',
    fontWeight: '600',
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  cardSubtitle: {
    fontSize: 10,
    color: '#E76F21',
    marginTop: 4,
  },
  section: {
    marginTop: 30,
    backgroundColor: 'transparent',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#111',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#222',
  },
  statusText: {
    fontSize: 14,
    color: '#ccc',
  },
});
