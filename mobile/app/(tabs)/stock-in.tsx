import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Text, View } from '@/components/Themed';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { postStockIn, lookupProduct } from '@/lib/api';
import { SymbolView } from 'expo-symbols';

export default function StockInScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [barcode, setBarcode] = useState('');
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState('1');
  const [expiry, setExpiry] = useState('');
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    setScanned(true);
    setBarcode(data);
    await findProduct(data);
  };

  const findProduct = async (code: string) => {
    setSearching(true);
    try {
      const result = await lookupProduct(code);
      setProduct(result);
    } catch (error) {
      Alert.alert('Not Found', 'This product barcode is not in the system yet.');
      setProduct(null);
    } finally {
      setSearching(false);
    }
  };

  const handleSubmit = async () => {
    if (!product || !quantity) return;
    setLoading(true);
    try {
      await postStockIn({
        barcode,
        quantity: parseInt(quantity),
        expiryDate: expiry || undefined,
      });
      Alert.alert('Success', `Added ${quantity} units to ${product.name}`);
      resetForm();
    } catch (error) {
      Alert.alert('Error', 'Failed to update stock.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setScanned(false);
    setBarcode('');
    setProduct(null);
    setQuantity('1');
    setExpiry('');
  };

  if (hasPermission === null) return <View style={styles.container}><Text>Requesting for camera permission</Text></View>;
  if (hasPermission === false) return <View style={styles.container}><Text>No access to camera</Text></View>;

  return (
    <ScrollView style={styles.container}>
      {!scanned ? (
        <View style={styles.scannerContainer}>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.overlay}>
             <SymbolView name="barcode.viewfinder" tintColor="#E76F21" size={150} />
             <Text style={styles.overlayText}>Scan Item Barcode</Text>
          </View>
        </View>
      ) : (
        <View style={styles.form}>
          <TouchableOpacity onPress={() => setScanned(false)} style={styles.rescan}>
             <SymbolView name="arrow.left" tintColor="#888" size={16} />
             <Text style={styles.rescanText}>Scan Different Item</Text>
          </TouchableOpacity>

          <View style={styles.productBrief}>
            {searching ? (
              <ActivityIndicator color="#005C39" />
            ) : product ? (
              <>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productStock}>Current stock: {product.currentStock}</Text>
              </>
            ) : (
              <Text style={styles.errorText}>No Product Found for {barcode}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Quantity Received</Text>
            <TextInput
              style={styles.input}
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor="#444"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Expiry Date (YYYY-MM-DD)</Text>
            <TextInput
              style={styles.input}
              value={expiry}
              onChangeText={setExpiry}
              placeholder="Optional"
              placeholderTextColor="#444"
            />
          </View>

          <TouchableOpacity 
            style={[styles.submitButton, (!product || loading) && styles.disabled]} 
            onPress={handleSubmit}
            disabled={!product || loading}
          >
            <Text style={styles.submitText}>{loading ? 'Updating...' : 'Confirm Stock In'}</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
  },
  scannerContainer: {
    height: 400,
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  overlayText: {
    color: '#E76F21',
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 20,
    textShadowColor: 'black',
    textShadowRadius: 10,
  },
  form: {
    padding: 20,
    backgroundColor: 'transparent',
  },
  rescan: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
    backgroundColor: 'transparent',
  },
  rescanText: {
    color: '#888',
    fontSize: 14,
  },
  productBrief: {
    backgroundColor: '#111',
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#222',
    marginBottom: 25,
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  productStock: {
    color: '#005C39',
    fontWeight: '600',
    marginTop: 4,
  },
  inputGroup: {
    marginBottom: 20,
    backgroundColor: 'transparent',
  },
  label: {
    color: '#888',
    fontSize: 12,
    marginBottom: 8,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#222',
    borderRadius: 12,
    padding: 15,
    color: '#fff',
    fontSize: 18,
  },
  submitButton: {
    backgroundColor: '#005C39',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  submitText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabled: {
    opacity: 0.5,
    backgroundColor: '#222',
  },
  errorText: {
    color: '#ef4444',
  }
});
