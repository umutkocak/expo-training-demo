import CartItem from '@/components/CartItem';
import { useCart } from '@/contexts/CartContext';
import { useThemeColor } from '@/hooks/useThemeColor';
import { CartItem as CartItemType } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import {
    Alert,
    FlatList,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    View
} from 'react-native';

export default function CartScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const secondaryColor = useThemeColor({}, 'secondary');
  const primaryColor = useThemeColor({}, 'primary');
  const surfaceColor = useThemeColor({}, 'surface');
  const priceColor = useThemeColor({}, 'price');

  const { items, totalPrice, totalItems, clearCart } = useCart();

  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All', 
          style: 'destructive',
          onPress: () => {
            clearCart();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
        },
      ]
    );
  };

  const handleCheckout = () => {
    Alert.alert(
      'Checkout',
      `Total: $${totalPrice.toFixed(2)}\n\nThis is a demo app. Checkout functionality would be implemented here.`,
      [
        { text: 'OK', style: 'default' }
      ]
    );
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const renderCartItem = ({ item }: { item: CartItemType }) => (
    <CartItem item={item} />
  );

  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="bag-outline" size={80} color={secondaryColor} />
      <Text style={[styles.emptyTitle, { color: textColor }]}>
        Your cart is empty
      </Text>
      <Text style={[styles.emptySubtitle, { color: secondaryColor }]}>
        Add some products to get started
      </Text>
    </View>
  );

  const renderHeader = () => (
    <View style={[styles.header, { backgroundColor: surfaceColor }]}>
      <View style={styles.headerRow}>
        <Text style={[styles.headerTitle, { color: textColor }]}>
          Shopping Cart
        </Text>
        {items.length > 0 && (
          <Pressable
            style={({ pressed }) => [
              styles.clearButton,
              { opacity: pressed ? 0.7 : 1 }
            ]}
            onPress={handleClearCart}
          >
            <Ionicons name="trash-outline" size={20} color={secondaryColor} />
            <Text style={[styles.clearButtonText, { color: secondaryColor }]}>
              Clear
            </Text>
          </Pressable>
        )}
      </View>
      
      {items.length > 0 && (
        <Text style={[styles.itemCount, { color: secondaryColor }]}>
          {totalItems} {totalItems === 1 ? 'item' : 'items'}
        </Text>
      )}
    </View>
  );

  const renderFooter = () => {
    if (items.length === 0) return null;

    return (
      <View style={[styles.footer, { backgroundColor: surfaceColor }]}>
        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, { color: textColor }]}>
            Total
          </Text>
          <Text style={[styles.totalPrice, { color: priceColor }]}>
            ${totalPrice.toFixed(2)}
          </Text>
        </View>
        
        <Pressable
          style={({ pressed }) => [
            styles.checkoutButton,
            {
              backgroundColor: primaryColor,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
          onPress={handleCheckout}
        >
          <Ionicons name="card-outline" size={20} color="white" />
          <Text style={styles.checkoutButtonText}>
            Checkout
          </Text>
        </Pressable>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <FlatList
        data={items}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyCart}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
    padding: 16,
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 4,
    marginBottom: 16,
    borderRadius: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  clearButtonText: {
    fontSize: 14,
    marginLeft: 4,
  },
  itemCount: {
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  footer: {
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  checkoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
});
