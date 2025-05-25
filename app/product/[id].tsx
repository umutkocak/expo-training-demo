import LoadingSpinner from '@/components/LoadingSpinner';
import { useCart } from '@/contexts/CartContext';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Product } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const secondaryColor = useThemeColor({}, 'secondary');
  const primaryColor = useThemeColor({}, 'primary');
  const surfaceColor = useThemeColor({}, 'surface');
  const priceColor = useThemeColor({}, 'price');

  const { addToCart, items } = useCart();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`https://fakestoreapi.com/products/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }

      const data: Product = await response.json();
      setProduct(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong';
      setError(errorMessage);
      
      Alert.alert(
        'Error',
        `Failed to load product: ${errorMessage}`,
        [
          { text: 'Retry', onPress: fetchProduct },
          { text: 'Go Back', onPress: () => router.back() }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleGoBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  if (loading) {
    return <LoadingSpinner message="Loading product details..." />;
  }
  if (error || !product) {
    return (
      <View style={[styles.container, { backgroundColor, paddingTop: insets.top }]}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={secondaryColor} />
          <Text style={[styles.errorText, { color: textColor }]}>
            Product not found
          </Text>
        </View>
      </View>
    );
  }
  const cartItem = items.find(item => item.id === product.id);
  const quantityInCart = cartItem?.quantity || 0;
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      {/* Modern Header with blur effect */}
      <View style={[styles.header, { backgroundColor: surfaceColor + 'F0', paddingTop: insets.top }]}>
        <Pressable
          style={({ pressed }) => [
            styles.backButton,
            { 
              backgroundColor: pressed ? primaryColor + '20' : 'transparent',
              transform: [{ scale: pressed ? 0.95 : 1 }]
            }
          ]}
          onPress={handleGoBack}
        >
          <Ionicons name="chevron-back" size={28} color={textColor} />
        </Pressable>
        
        <Text style={[styles.headerTitle, { color: textColor }]} numberOfLines={1}>
          Product Details
        </Text>
        
        <View style={styles.headerActions}>
          {quantityInCart > 0 && (
            <View style={[styles.cartBadge, { backgroundColor: primaryColor }]}>
              <Text style={styles.cartBadgeText}>{quantityInCart}</Text>
            </View>
          )}
        </View>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        bounces={true}
        contentInsetAdjustmentBehavior="automatic"
      >
        {/* Product Image */}
        <View style={[styles.imageContainer, { backgroundColor: surfaceColor }]}>
          <Image
            source={{ uri: product.image }}
            style={styles.productImage}
            contentFit="contain"
            transition={300}
          />
        </View>

        {/* Product Info */}
        <View style={styles.infoContainer}>
          <View style={styles.categoryRow}>
            <Text style={[styles.category, { color: primaryColor }]}>
              {product.category.toUpperCase()}
            </Text>
          </View>

          <Text style={[styles.title, { color: textColor }]}>
            {product.title}
          </Text>

          <View style={styles.ratingRow}>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#fbbf24" />
              <Text style={[styles.rating, { color: secondaryColor }]}>
                {product.rating.rate.toFixed(1)}
              </Text>
              <Text style={[styles.reviewCount, { color: secondaryColor }]}>
                ({product.rating.count} reviews)
              </Text>
            </View>
          </View>

          <Text style={[styles.price, { color: priceColor }]}>
            ${product.price.toFixed(2)}
          </Text>

          <View style={[styles.descriptionContainer, { backgroundColor: surfaceColor }]}>
            <Text style={[styles.descriptionTitle, { color: textColor }]}>
              Description
            </Text>
            <Text style={[styles.description, { color: secondaryColor }]}>
              {product.description}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View style={[styles.bottomContainer, { backgroundColor: surfaceColor }]}>
        {quantityInCart > 0 && (
          <View style={styles.cartInfo}>
            <Ionicons name="bag" size={16} color={primaryColor} />
            <Text style={[styles.cartInfoText, { color: primaryColor }]}>
              {quantityInCart} in cart
            </Text>
          </View>
        )}
        
        <Pressable
          style={({ pressed }) => [
            styles.addToCartButton,
            {
              backgroundColor: primaryColor,
              opacity: pressed ? 0.8 : 1,
              transform: [{ scale: pressed ? 0.98 : 1 }],
            },
          ]}
          onPress={handleAddToCart}
        >
          <LinearGradient
            colors={[primaryColor, primaryColor + 'DD']}
            style={styles.gradientButton}
          >
            <Ionicons name="bag-add" size={20} color="white" />
            <Text style={styles.addToCartText}>
              Add to Cart
            </Text>
          </LinearGradient>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#00000010',
  },
  backButton: {
    padding: 8,
  },  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  headerActions: {
    width: 40,
    alignItems: 'flex-end',
  },
  cartBadge: {
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    height: width * 0.8,
    margin: 16,
    borderRadius: 16,
    padding: 20,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    padding: 16,
  },
  categoryRow: {
    marginBottom: 8,
  },
  category: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 32,
    marginBottom: 12,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 14,
    marginLeft: 4,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  descriptionContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  bottomContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#00000010',
  },
  cartInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cartInfoText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  addToCartButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  addToCartText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
});
