import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  TextInput,
  Button,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons'; 
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'expo-router';
import PlatformStatistics from './PlatformStatistics';
import TopRatedSellers from './TopRatedSellers';

// Admin Panel
const AdminPanel = ({ onSave }: { onSave: (data: any) => void }) => {
  const [banner, setBanner] = useState('');
  const [promotions, setPromotions] = useState('');
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([
    { name: "", image: "" }, 
    { name: "", image: "" }
  ]);

  const handleSave = () => {
    const data = { banner, promotions, featuredProducts };
    onSave(data);
  };

  return (
    <View style={styles.adminPanel}>
      <Text>Edit Homepage Content</Text>
      <TextInput 
        placeholder="Enter Banner Text" 
        value={banner} 
        onChangeText={setBanner} 
        style={styles.input}
      />
      <TextInput 
        placeholder="Enter Promotions" 
        value={promotions} 
        onChangeText={setPromotions} 
        style={styles.input}
      />
      <Text>Featured Products:</Text>
      {featuredProducts.map((product, index) => (
        <View key={index} style={styles.productInputContainer}>
          <TextInput 
            placeholder={`Product ${index + 1} Name`} 
            value={product.name} 
            onChangeText={(text) => {
              const updatedProducts = [...featuredProducts];
              updatedProducts[index].name = text;
              setFeaturedProducts(updatedProducts);
            }} 
            style={styles.input}
          />
          <TextInput 
            placeholder={`Product ${index + 1} Image URL`} 
            value={product.image} 
            onChangeText={(text) => {
              const updatedProducts = [...featuredProducts];
              updatedProducts[index].image = text;
              setFeaturedProducts(updatedProducts);
            }} 
            style={styles.input}
          />
        </View>
      ))}
      <Button title="Save Changes" onPress={handleSave} />
    </View>
  );
};

// Homepage
const HomepageScreen = () => {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false); // Simulate admin user
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<any>({});

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Simulate fetching content from an API
    setContent({
      banner: "Welcome to the Fashion World!",
      promotions: "50% off on selected items!",
      featuredProducts: [
        { name: "Product 1", image: "https://example.com/image1.jpg" },
        { name: "Product 2", image: "https://example.com/image2.jpg" }
      ]
    });
  }, []);

  const handleSaveContent = (data: any) => {
    setLoading(true);
    setTimeout(() => {
      setContent(data);
      setIsEditing(false);
      setLoading(false);
    }, 1500);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeContainer}>
        <NavigationBar activeTab="TOP" showAddButton={true} />
        
        <View style={styles.mainContainer}>
          {isEditing ? (
            <AdminPanel onSave={handleSaveContent} />
          ) : (
            <ScrollView style={styles.container}>
              {/* Display banner and promotions */}
              <View style={styles.welcomeBanner}>
                <Text style={styles.welcomeTitle}>{content.banner}</Text>
                <Text style={styles.welcomeSubtitle}>{content.promotions}</Text>
              </View>

              {/* Featured Products */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Featured Products</Text>
              </View>
              <FlatList
                horizontal
                data={content.featuredProducts}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.productCard}>
                    <Image source={{ uri: item.image }} style={styles.productImage} />
                    <Text style={styles.productName}>{item.name}</Text>
                  </TouchableOpacity>
                )}
                showsHorizontalScrollIndicator={false}
              />

              {/* Toggle Edit Button (For Admin) */}
              {isAdmin && (
                <TouchableOpacity 
                  style={styles.editButton} 
                  onPress={() => setIsEditing(true)}
                >
                  <Text style={styles.editButtonText}>Edit Homepage</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          )}

          {/* Loading indicator */}
          {loading && (
            <View style={styles.loadingMoreContainer}>
              <ActivityIndicator size="small" color="#0077b3" />
              <Text style={styles.loadingMoreText}>Saving changes...</Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: "#0077b3" },
  mainContainer: { flex: 1, backgroundColor: "#f8f8f8" },
  container: { flex: 1 },
  welcomeBanner: { backgroundColor: "#0077b3", padding: 20, paddingBottom: 25 },
  welcomeTitle: { fontSize: 22, fontWeight: "bold", color: "white", marginBottom: 5 },
  welcomeSubtitle: { fontSize: 14, color: "rgba(255,255,255,0.8)" },
  sectionHeader: { paddingHorizontal: 15, marginTop: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  productCard: { width: 160, marginHorizontal: 7, backgroundColor: "white", borderRadius: 12 },
  productImage: { width: "100%", height: 160, resizeMode: "cover" },
  productName: { fontSize: 14, fontWeight: "500", color: "#333", marginBottom: 5 },
  editButton: { marginTop: 20, padding: 10, backgroundColor: "#0077b3", borderRadius: 5 },
  editButtonText: { color: "white", fontWeight: "bold" },
  adminPanel: { padding: 20, backgroundColor: "white" },
  input: { padding: 10, marginVertical: 5, borderWidth: 1, borderColor: "#ccc", borderRadius: 5 },
  productInputContainer: { marginBottom: 20 },
  loadingMoreContainer: { flexDirection: "row", justifyContent: "center", alignItems: "center", paddingVertical: 15 },
  loadingMoreText: { marginLeft: 8, color: "#666", fontSize: 14 },
});

export default HomepageScreen;
