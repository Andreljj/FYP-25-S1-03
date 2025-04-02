import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions, 
  SafeAreaView,
  StatusBar,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";

const { width } = Dimensions.get("window");

// Define a type for the product data structure
type Product = {
  id: string;
  name: string;
  image: string;
  images: string[];
  price: string;
  originalPrice: string;
  description: string;
  sizes: string[];
  condition: string;
  brand: string;
  material: string;
  sellerName: string;
  sellerRating: number;
  totalSales: number;
};

// Define the type for the product data object with string index signature
type ProductDataType = {
  [key: string]: Product;
};

// Sample product data - in a real app, you would fetch this based on the product ID
const productData: ProductDataType = {
  "1": {
    id: "1",
    name: "Checkered H&M Shirt",
    image: "https://images.hardloop.fr/587266-large_default/wrangler-mixed-material-shirt-second-hand-shirt-mens-multicolored-l.jpg",
    images: [
      "https://images.hardloop.fr/587266-large_default/wrangler-mixed-material-shirt-second-hand-shirt-mens-multicolored-l.jpg",
      "https://i.pinimg.com/originals/b8/21/65/b82165d9fc56d21b858a47dd22bd9dbd.jpg",
      "https://sc04.alicdn.com/kf/Hdd40de37ff7c4bdab18fb9d58f4685a9B.jpg"
    ],
    price: "$28.50",
    originalPrice: "$45.00",
    description: "Classic checkered pattern shirt with button-down collar. Made from soft, breathable cotton blend fabric. Perfect for casual or semi-formal occasions. This shirt features a comfortable regular fit and versatile design that pairs easily with jeans or chinos.",
    sizes: ["S", "XL"],
    condition: "Like New",
    brand: "H&M",
    material: "60% Cotton, 40% Polyester",
    sellerName: "FashionReseller22",
    sellerRating: 4.8,
    totalSales: 4
  },
  "2": {
    id: "2",
    name: "Purple Baju Kurung",
    image: "https://daganghalal.blob.core.windows.net/42742/Product/baju-kurung-moden-songket-1704693764101.jpg",
    images: [
      "https://daganghalal.blob.core.windows.net/42742/Product/baju-kurung-moden-songket-1704693764101.jpg",
      "https://cf.shopee.com.my/file/df31e9a05fbedb32102fd76a50c9c667",
      "https://cf.shopee.com.my/file/58e2b27f8d90de8e98023ec2cfa2a74a"
    ],
    price: "$45.99",
    originalPrice: "$75.00",
    description: "Elegant traditional attire in vibrant purple. Features delicate embroidery and a modern cut. Comfortable for all-day wear during celebrations or formal events. Made with high-quality songket fabric that offers both beauty and durability.",
    sizes: ["S", "L"],
    condition: "Excellent",
    brand: "Traditional Crafts",
    material: "Songket Fabric",
    sellerName: "CulturalTreasures",
    sellerRating: 4.9,
    totalSales: 12
  },
  "3": {
    id: "3",
    name: "Khaki Jacket",
    image: "https://static2.goldengoose.com/public/Style/ECOMM/GMP00834.P001488-15527.jpg",
    images: [
      "https://static2.goldengoose.com/public/Style/ECOMM/GMP00834.P001488-15527.jpg",
      "https://www.prada.com/content/dam/pradanux_products/S/SGM/SGM191/1WMZF0031/SGM191_1WMZ_F0031_S_202_SLF.png",
      "https://media.endclothing.com/media/f_auto,q_auto:eco/prodmedia/media/catalog/product/3/0/30-01-2020_uniqlo_blocktechu-pocketblouson_32-khaki_185766-56_rc_1.jpg"
    ],
    price: "$39.75",
    originalPrice: "$89.00",
    description: "Versatile khaki jacket with quilted design. Features ribbed collar and cuffs, multiple pockets, and premium quality material. Ideal for cool weather. This lightweight jacket offers excellent warmth without bulk, making it perfect for layering.",
    sizes: ["M", "L"],
    condition: "Good",
    brand: "Golden Goose",
    material: "65% Cotton, 35% Polyamide",
    sellerName: "VintageTrends",
    sellerRating: 4.6,
    totalSales: 8
  }
};

export default function ProductDetails() {
  // Always call hooks at the top level, in the same order
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [product, setProduct] = useState<Product | null>(null);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [loading, setLoading] = useState(true);

  // Use useEffect to handle any logic that depends on params
  useEffect(() => {
    console.log("Product ID from params:", params.id);
    setLoading(true);
    
    try {
      // Get the ID from params and provide fallback
      const productId = typeof params.id === 'string' ? params.id : '1';
      
      // Get the product or default to the first one
      const selectedProduct = productData[productId];
      
      if (!selectedProduct) {
        console.warn(`Product with ID ${productId} not found, using default product`);
        setProduct(productData["1"]);
      } else {
        setProduct(selectedProduct);
      }
      
      // Only calculate discount if product exists
      if (selectedProduct) {
        const originalPrice = parseFloat(selectedProduct.originalPrice.replace('$', ''));
        const currentPrice = parseFloat(selectedProduct.price.replace('$', ''));
        const discount = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
        setDiscountPercentage(discount);
      }
    } catch (error) {
      console.error("Error loading product:", error);
      // Use the first product as fallback
      setProduct(productData["1"]);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  // Handle Add to Cart
  const handleAddToCart = () => {
    if (!selectedSize) {
      Alert.alert("Size Required", "Please select a size before adding to cart");
      return;
    }
    
    if (product) {
      Alert.alert("Added to Cart", `${product.name} (${selectedSize}) has been added to your cart!`);
    }
  };

  // If product is not loaded yet, show a simple loading state
  if (loading || !product) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#0077b3" />
        <View style={[styles.container, styles.loadingContainer]}>
          <Text style={styles.loadingText}>Loading product...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#0077b3" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
        <TouchableOpacity onPress={() => router.push("/register")} style={styles.favoriteButton}>
          <Ionicons 
            name="heart-outline" 
            size={28} 
            color="white" 
          />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Product Image Carousel */}
        <View style={styles.imageCarouselContainer}>
          <Image 
            source={{ uri: product.images[currentImageIndex] }} 
            style={styles.productImage}
            resizeMode="contain"
          />
          
          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{discountPercentage}% OFF</Text>
            </View>
          )}
          
          {/* Image Navigation Dots */}
          <View style={styles.imageDots}>
            {product.images.map((_, index) => (
              <TouchableOpacity 
                key={index}
                onPress={() => setCurrentImageIndex(index)}
              >
                <View 
                  style={[
                    styles.dot, 
                    index === currentImageIndex ? styles.activeDot : {}
                  ]} 
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {/* Image Thumbnails */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.thumbnailContainer}
        >
          {product.images.map((image, index) => (
            <TouchableOpacity 
              key={index}
              onPress={() => setCurrentImageIndex(index)}
            >
              <Image 
                source={{ uri: image }} 
                style={[
                  styles.thumbnail,
                  index === currentImageIndex ? styles.activeThumbnail : {}
                ]} 
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        {/* Product Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.productName}>{product.name}</Text>
          
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{product.price}</Text>
            <Text style={styles.originalPrice}>{product.originalPrice}</Text>
          </View>
          
          <View style={styles.conditionContainer}>
            <Text style={styles.conditionLabel}>Condition:</Text>
            <Text style={styles.conditionValue}>{product.condition}</Text>
          </View>
          
          <View style={styles.divider} />
          
          {/* Seller Info */}
          <View style={styles.sellerContainer}>
            <Text style={styles.sellerTitle}>Seller</Text>
            <View style={styles.sellerInfoRow}>
              <View>
                <Text style={styles.sellerName}>{product.sellerName}</Text>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text style={styles.ratingText}>
                    {product.sellerRating} · {product.totalSales} sales
                  </Text>
                </View>
              </View>
              <TouchableOpacity style={styles.contactButton}>
                <Text style={styles.contactButtonText}>Contact</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          {/* Product Details */}
          <Text style={styles.sectionTitle}>Product Details</Text>
          <Text style={styles.description}>{product.description}</Text>
          
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Brand</Text>
              <Text style={styles.detailValue}>{product.brand}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Material</Text>
              <Text style={styles.detailValue}>{product.material}</Text>
            </View>
          </View>
          
          {/* Size Selection */}
          <Text style={styles.sectionTitle}>Select Size</Text>
          <View style={styles.sizeContainer}>
            {product.sizes.map((size: string) => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.sizeButton,
                  selectedSize === size ? styles.selectedSizeButton : {}
                ]}
                onPress={() => setSelectedSize(size)}
              >
                <Text 
                  style={[
                    styles.sizeText,
                    selectedSize === size ? styles.selectedSizeText : {}
                  ]}
                >
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
      
      {/* Fixed Add to Cart Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={[
            styles.addToCartButton,
            !selectedSize ? styles.disabledButton : {}
          ]}
          disabled={!selectedSize}
          onPress={handleAddToCart}
        >
          <Text style={styles.addToCartText}>
            {selectedSize ? "Add to Cart" : "Select Size to Continue"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#0077b3",
  },
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#333',
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#0077b3",
  },
  backButton: {
    padding: 5,
  },
  favoriteButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  imageCarouselContainer: {
    width: "100%",
    height: 300,
    backgroundColor: "white",
    position: "relative",
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  imageDots: {
    flexDirection: "row",
    justifyContent: "center",
    position: "absolute",
    bottom: 10,
    width: "100%",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    margin: 5,
  },
  activeDot: {
    backgroundColor: "#0077b3",
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  thumbnailContainer: {
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  thumbnail: {
    width: 60,
    height: 60,
    marginRight: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  activeThumbnail: {
    borderColor: "#0077b3",
    borderWidth: 2,
  },
  infoContainer: {
    padding: 15,
    backgroundColor: "white",
    marginTop: 10,
    borderRadius: 10,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 100, // Space for bottom bar
  },
  productName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  price: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0077b3",
    marginRight: 10,
  },
  originalPrice: {
    fontSize: 18,
    color: "#999",
    textDecorationLine: "line-through",
  },
  conditionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  conditionLabel: {
    fontSize: 16,
    color: "#666",
    marginRight: 5,
  },
  conditionValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#0077b3",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 15,
  },
  sellerContainer: {
    marginBottom: 15,
  },
  sellerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  sellerInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sellerName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 14,
    color: "#666",
  },
  contactButton: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  contactButtonText: {
    color: "#0077b3",
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
    marginTop: 5,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: "#666",
    marginBottom: 15,
  },
  detailsGrid: {
    flexDirection: "row",
    marginBottom: 20,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: "#999",
    marginBottom: 3,
  },
  detailValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  sizeContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  sizeButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 10,
    minWidth: 45,
    alignItems: "center",
  },
  selectedSizeButton: {
    borderColor: "#0077b3",
    backgroundColor: "rgba(0, 119, 179, 0.1)",
  },
  sizeText: {
    fontSize: 14,
    color: "#333",
  },
  selectedSizeText: {
    color: "#0077b3",
    fontWeight: "bold",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  addToCartButton: {
    backgroundColor: "#0077b3",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  addToCartText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  discountBadge: {
    position: "absolute",
    top: 15,
    left: 15,
    backgroundColor: "#ff3b30",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
  },
  discountText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
});