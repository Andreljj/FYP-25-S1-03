import React, { useState } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  Alert,
  ActivityIndicator 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "./context/AuthContext";

export default function AccountSettings() {
  const router = useRouter();
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const { logout } = useAuth();

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to permanently delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setIsDeletingAccount(true);
            setTimeout(() => {
              setIsDeletingAccount(false);
              Alert.alert(
                "Account Deleted",
                "Your account has been successfully deleted.",
                [{ text: "OK", onPress: () => router.replace("/Login") }]
              );
            }, 1500);
          }
        }
      ]
    );
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/'); //navigate to guest page
    } catch (error) {
      console.error('Logout failed:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Account Settings</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.content}>
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={() => router.push('/EditProfile')}
        >
          <Ionicons name="person-outline" size={24} color="#333" />
          <Text style={styles.settingText}>Edit Profile</Text>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.settingItem}
          onPress={() => router.push('/Wishlist')}
        >
          <Ionicons name="heart-outline" size={24} color="#333" />
          <Text style={styles.settingText}>My Wishlist</Text>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.settingItem}
          onPress={() => router.push('/PurchaseHistory')}
        >
          <Ionicons name="wallet-outline" size={24} color="#333" />
          <Text style={styles.settingText}>Orders and Payments</Text>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={24} color="#0077b3" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0077b3",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  backButton: {
    padding: 5,
  },
  content: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    padding: 20,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 15,
    color: "#333",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 119, 179, 0.1)",
    padding: 15,
    borderRadius: 8,
    marginTop: 15,
    borderWidth: 2,
    borderColor: "#0077b3",
    justifyContent: "center",
  },
  logoutText: {
    color: "#0077b3",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 10,
  }
});