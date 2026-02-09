import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList } from 'react-native';

export default function CartScreen() {
  const [cartItems, setCartItems] = useState([
    { id: '1', name: 'Inkey list vitamin C serum', price: 29000, quantity: 2 },
    { id: '2', name: 'Inkey list vitamin C serum', price: 29000, quantity: 1 },
  ]);

  const increaseQty = (id) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const estimatedTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.itemCount}>{cartItems.length} item(s)</Text>
        <TouchableOpacity>
          <Text style={styles.addMore}>Add more</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Image
              source={{ uri: 'data:image/jpeg;base64,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' }}
              style={styles.cartImage}
            />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>₦ {item.price.toLocaleString()}</Text>
              <View style={styles.quantityContainer}>
                <TouchableOpacity onPress={() => decreaseQty(item.id)} style={styles.qtyButton}>
                  <Text style={styles.qtyText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.qtyValue}>{item.quantity}</Text>
                <TouchableOpacity onPress={() => increaseQty(item.id)} style={styles.qtyButton}>
                  <Text style={styles.qtyText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />

      <View style={styles.footer}>
        <Text style={styles.totalLabel}>Estimated total</Text>
        <Text style={styles.totalAmount}>₦ {estimatedTotal.toLocaleString()}</Text>
        <Text style={styles.terms}>
          By continuing, you agree to share your cart, profile name and phone number with the business so it can confirm your order and total price, including any tax, fees and discounts.
        </Text>
        <TouchableOpacity style={styles.placeOrderButton}>
          <Text style={styles.placeOrderText}>Place order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  itemCount: { fontWeight: 'bold' },
  addMore: { color: '#007bff' },
  cartItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  cartImage: { width: 60, height: 60, marginRight: 12 },
  itemInfo: { flex: 1 },
  itemName: { fontWeight: 'bold' },
  itemPrice: { color: '#555' },
  quantityContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  qtyButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  qtyText: { fontSize: 16 },
  qtyValue: { marginHorizontal: 12 },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalLabel: { fontWeight: 'bold', marginBottom: 4 },
  totalAmount: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  terms: { color: '#555', fontSize: 12, marginBottom: 16 },
  placeOrderButton: {
    backgroundColor: '#007bff',
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
  },
  placeOrderText: { color: '#fff', fontWeight: 'bold' },
});
