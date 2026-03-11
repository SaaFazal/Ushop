import { StyleSheet, FlatList, TextInput, RefreshControl, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Text, View } from '@/components/Themed';
import { fetchProducts } from '@/lib/api';
import Colors from '@/constants/Colors';
import { SymbolView } from 'expo-symbols';

export default function InventoryScreen() {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const result = await fetchProducts();
      setProducts(result);
      applySearch(search, result);
    } catch (error) {
      console.error(error);
    }
  };

  const applySearch = (query: string, data: any[]) => {
    const filtered = data.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) || 
      p.barcode?.includes(query)
    );
    setFilteredProducts(filtered);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applySearch(search, products);
  }, [search, products]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <SymbolView name="magnifyingglass" tintColor="#888" size={18} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products or barcode..."
          placeholderTextColor="#666"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.dark.tint} />
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.productCard}>
            <Image 
              source={{ uri: item.image || 'https://via.placeholder.com/150' }} 
              style={styles.productImage} 
            />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productCategory}>{item.category} • {item.supplier?.name}</Text>
              <View style={styles.stockBadge}>
                <Text style={[
                  styles.stockText,
                  item.currentStock <= item.minStockLevel ? { color: '#E76F21' } : { color: '#005C39' }
                ]}>
                  {item.currentStock} in stock
                </Text>
              </View>
            </View>
            <SymbolView name="chevron.right" tintColor="#333" size={16} />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No products found</Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
    padding: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#222',
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    borderRadius: 15,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#222',
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#222',
  },
  productInfo: {
    flex: 1,
    marginLeft: 15,
    backgroundColor: 'transparent',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  productCategory: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  stockBadge: {
    marginTop: 6,
    backgroundColor: 'transparent',
  },
  stockText: {
    fontSize: 12,
    fontWeight: '700',
  },
  empty: {
    marginTop: 50,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  emptyText: {
    color: '#444',
    fontSize: 16,
  },
});
