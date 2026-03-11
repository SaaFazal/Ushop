export const API_BASE_URL = 'http://192.168.1.109:3000/api';

export async function fetchDashboard() {
  const response = await fetch(`${API_BASE_URL}/dashboard`);
  if (!response.ok) throw new Error('Failed to fetch dashboard');
  return response.json();
}

export async function fetchProducts() {
  const response = await fetch(`${API_BASE_URL}/products`);
  if (!response.ok) throw new Error('Failed to fetch products');
  return response.json();
}

export async function lookupProduct(barcode: string) {
  const response = await fetch(`${API_BASE_URL}/products/lookup?barcode=${barcode}`);
  if (!response.ok) throw new Error('Product not found');
  return response.json();
}

export async function postStockIn(data: { 
  barcode: string, 
  quantity: number, 
  expiryDate?: string, 
  batchNumber?: string 
}) {
  const response = await fetch(`${API_BASE_URL}/inventory/stock-in`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to post stock-in');
  return response.json();
}

export async function fetchAlerts() {
  const response = await fetch(`${API_BASE_URL}/alerts`);
  if (!response.ok) throw new Error('Failed to fetch alerts');
  return response.json();
}
