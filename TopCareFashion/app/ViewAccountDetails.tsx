import React from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView, 
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Alert } from 'react-native';

export default function ViewUserDetails() {
  const route = useRoute();
  const navigation = useNavigation();
  const { userData } = route.params;

  const handleDelete = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete this user account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Success', 'User account deleted successfully');
            navigation.goBack();
            // Use a timeout to ensure navigation is complete before sending params
            setTimeout(() => {
              navigation.navigate('ViewUserAccount', {
                deletedUserId: userData._id,
                timestamp: Date.now()
              });
            }, 100);
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#0077b3" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>User Details</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.container}>
        {/* User Info Sections */}
        <View style={styles.section}>
          <Text style={styles.label}>Username</Text>
          <Text style={styles.value}>{userData.username}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{userData.name}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{userData.email}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Date of Birth</Text>
          <Text style={styles.value}>
            {userData.dateOfBirth ? new Date(userData.dateOfBirth).toLocaleDateString() : 'N/A'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Gender</Text>
          <Text style={styles.value}>
            {userData.gender ? userData.gender.charAt(0).toUpperCase() + userData.gender.slice(1) : 'N/A'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Status</Text>
          <Text style={[
            styles.value, 
            userData.status === 'Active' ? styles.activeStatus : styles.suspendedStatus
          ]}>
            {userData.status}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Last Login</Text>
          <Text style={styles.value}>
            {userData.lastLoginDate ? new Date(userData.lastLoginDate).toLocaleDateString() : 'N/A'}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
        >
          <Text style={styles.deleteButtonText}>Delete Account</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#0077b3",
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
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    padding: 20,
  },
  section: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  value: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  activeStatus: {
    color: "#34C759",
  },
  suspendedStatus: {
    color: "#FF3B30",
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 40,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});