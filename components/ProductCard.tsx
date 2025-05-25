import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { memo } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { useCart } from '../contexts/CartContext';
import { useThemeColor } from '../hooks/useThemeColor';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 16px padding + 16px gap

function ProductCard({ product }: ProductCardProps) {
  const backgroundColor = useThemeColor({}, 'cardBackground') as string;
  const textColor = useThemeColor({}, 'text') as string;
  const secondaryColor = useThemeColor({}, 'secondary') as string;
  const priceColor = useThemeColor({}, 'price') as string;
  const primaryColor = useThemeColor({}, 'primary') as string;
  const shadowColor = useThemeColor({}, 'cardShadow') as string;
  const surfaceColor = useThemeColor({}, 'surface') as string;

  const { addToCart } = useCart();
  const handleProductPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/product/${product.id}` as any);
  };

  const handleAddToCart = (event: any) => {
    event.stopPropagation();
    addToCart(product);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  // Truncate title if too long
  const truncatedTitle = product.title.length > 40 
    ? product.title.substring(0, 40) + '...' 
    : product.title;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,        {
          backgroundColor,
          width: cardWidth,
          opacity: pressed ? 0.95 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
          shadowColor,
        },
      ]}
      onPress={handleProductPress}
    >
      {/* Product Image */}
      <View style={[styles.imageContainer, { backgroundColor: surfaceColor }]}>
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          contentFit="contain"
          transition={200}
          placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
        />
        
        {/* Add to Cart Button - Floating */}
        <Pressable
          style={({ pressed }) => [
            styles.floatingAddButton,            {
              backgroundColor: primaryColor,
              opacity: pressed ? 0.8 : 1,
              transform: [{ scale: pressed ? 0.9 : 1 }],
            },
          ]}
          onPress={handleAddToCart}
        >
          <Ionicons name="add" size={16} color="white" />
        </Pressable>
      </View>

      {/* Product Info */}
      <View style={styles.infoContainer}>        <Text style={[styles.category, { color: primaryColor }]} numberOfLines={1}>
          {product.category.toUpperCase()}
        </Text>
        
        <Text style={[styles.title, { color: textColor }]} numberOfLines={2}>
          {truncatedTitle}
        </Text>

        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={12} color="#fbbf24" />
          <Text style={[styles.rating, { color: secondaryColor }]}>
            {product.rating.rate.toFixed(1)}
          </Text>
          <Text style={[styles.reviewCount, { color: secondaryColor }]}>
            ({product.rating.count})
          </Text>
        </View>

        <Text style={[styles.price, { color: priceColor }]}>
          ${product.price.toFixed(2)}
        </Text>
      </View>
    </Pressable>
  );
}

export default memo(ProductCard);

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },
  imageContainer: {
    height: 160,
    position: 'relative',
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  floatingAddButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  infoContainer: {
    padding: 16,
    paddingTop: 12,
  },
  category: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: 8,
    minHeight: 40,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  rating: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 3,
  },
  reviewCount: {
    fontSize: 12,
    marginLeft: 3,
    opacity: 0.7,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
