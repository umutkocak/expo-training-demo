import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useCart } from '../contexts/CartContext';
import { useThemeColor } from '../hooks/useThemeColor';
import { CartItem as CartItemType } from '../types';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const backgroundColor = useThemeColor({}, 'cardBackground');
  const textColor = useThemeColor({}, 'text');
  const secondaryColor = useThemeColor({}, 'secondary');
  const priceColor = useThemeColor({}, 'price');
  const primaryColor = useThemeColor({}, 'primary');
  const borderColor = useThemeColor({}, 'border');
  const errorColor = useThemeColor({}, 'error');

  const { updateQuantity, removeFromCart } = useCart();

  const handleIncrement = () => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    } else {
      handleRemove();
    }
  };

  const handleRemove = () => {
    Alert.alert(
      'Remove Item',
      `Are you sure you want to remove "${item.title}" from your cart?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => removeFromCart(item.id)
        },
      ]
    );
  };

  const itemTotal = item.price * item.quantity;

  return (
    <View style={[styles.container, { backgroundColor, borderColor }]}>
      {/* Product Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.image }}
          style={styles.image}
          contentFit="contain"
          transition={200}
        />
      </View>

      {/* Product Info */}
      <View style={styles.infoContainer}>
        <Text style={[styles.title, { color: textColor }]} numberOfLines={2}>
          {item.title}
        </Text>
        
        <Text style={[styles.category, { color: secondaryColor }]}>
          {item.category}
        </Text>

        <View style={styles.priceRow}>
          <Text style={[styles.unitPrice, { color: secondaryColor }]}>
            ${item.price.toFixed(2)} each
          </Text>
          <Text style={[styles.totalPrice, { color: priceColor }]}>
            ${itemTotal.toFixed(2)}
          </Text>
        </View>

        {/* Quantity Controls */}
        <View style={styles.quantityContainer}>
          <View style={styles.quantityControls}>
            <Pressable
              style={({ pressed }) => [
                styles.quantityButton,
                {
                  borderColor: item.quantity === 1 ? errorColor : primaryColor,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
              onPress={handleDecrement}
            >
              <Ionicons 
                name={item.quantity === 1 ? "trash-outline" : "remove"} 
                size={16} 
                color={item.quantity === 1 ? errorColor : primaryColor} 
              />
            </Pressable>

            <Text style={[styles.quantity, { color: textColor }]}>
              {item.quantity}
            </Text>

            <Pressable
              style={({ pressed }) => [
                styles.quantityButton,
                {
                  borderColor: primaryColor,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
              onPress={handleIncrement}
            >
              <Ionicons name="add" size={16} color={primaryColor} />
            </Pressable>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.removeButton,
              { opacity: pressed ? 0.7 : 1 },
            ]}
            onPress={handleRemove}
          >
            <Ionicons name="close-circle" size={24} color={errorColor} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: 4,
  },
  category: {
    fontSize: 12,
    textTransform: 'capitalize',
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  unitPrice: {
    fontSize: 14,
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 16,
    minWidth: 24,
    textAlign: 'center',
  },
  removeButton: {
    padding: 4,
  },
});
