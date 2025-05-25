import LoadingSpinner from '@/components/LoadingSpinner';
import ProductCard from '@/components/ProductCard';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Product } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

export default function ProductsScreen() {
  // Theme colors must be called at the top level
  const backgroundColor = useThemeColor({}, 'background') as string;
  const textColor = useThemeColor({}, 'text') as string;
  const surfaceColor = useThemeColor({}, 'surface') as string;
  const primaryColor = useThemeColor({}, 'primary') as string;
  const secondaryColor = useThemeColor({}, 'secondary') as string;

  // State hooks after theme hooks
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchProducts = async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const response = await fetch('https://fakestoreapi.com/products');
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data: Product[] = await response.json();
      setProducts(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong';
      setError(errorMessage);
      
      Alert.alert(
        'Error',
        `Failed to load products: ${errorMessage}`,
        [
          { text: 'Retry', onPress: () => fetchProducts() },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const onRefresh = useCallback(() => {
    fetchProducts(true);
  }, []);

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) {
      return products;
    }
    
    const query = searchQuery.toLowerCase().trim();
    return products.filter(product => 
      product.title.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)
    );
  }, [products, searchQuery]);

  const renderProduct = ({ item }: { item: Product }) => (
    <ProductCard product={item} />
  );

  const renderHeader = () => (
    <View style={[styles.header, { backgroundColor: surfaceColor }]}>
      <Text style={[styles.headerTitle, { color: textColor }]}>
        Discover Products
      </Text>
      <Text style={[styles.headerSubtitle, { color: secondaryColor }]}>
        {filteredProducts.length} amazing {filteredProducts.length === 1 ? 'product' : 'products'} {searchQuery ? 'found' : 'waiting for you'}
      </Text>
      
      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor, borderColor: useThemeColor({}, 'border') as string }]}>
        <Ionicons name="search" size={20} color={secondaryColor} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: textColor }]}
          placeholder="Search products..."
          placeholderTextColor={secondaryColor}
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <Ionicons 
            name="close-circle" 
            size={20} 
            color={secondaryColor} 
            style={styles.clearIcon}
            onPress={() => setSearchQuery('')}
          />
        )}
      </View>
    </View>
  );

  if (loading && !refreshing) {
    return <LoadingSpinner message="Loading products..." />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={primaryColor}
          />
        }
        getItemLayout={(data, index) => ({
          length: 320, // Updated item height for new design
          offset: 320 * Math.floor(index / 2),
          index,
        })}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    opacity: 0.8,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 4,
  },
  clearIcon: {
    marginLeft: 8,
  },
});
