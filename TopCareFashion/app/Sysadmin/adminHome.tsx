import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AdminNavigationBar from './AdminNavigationBar';
import { useAuth } from '../context/AuthContext';

export default function AdminHomepage() {
  const router = useRouter();
  const { logout } = useAuth();

  const dashboardItems = [
    { title: 'Product Category', icon: 'grid', route: '/Sysadmin/AdminCategory' },
    { title: 'FAQ', icon: 'help-circle', route: '/Sysadmin/EditFAQ' },
    { title: 'About Us', icon: 'information-circle', route: '/Sysadmin/EditAboutUs' },
    { title: 'Feedback', icon: 'chatbox', route: '/Sysadmin/Adminfeedback' },
    { title: 'User Accounts', icon: 'people', route: '/Sysadmin/ViewUserAccount' }
  ];

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <AdminNavigationBar />
      <ScrollView>
        <View style={styles.content}>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.subtitle}>Control Panel</Text>
          
          <View style={styles.grid}>
            {dashboardItems.map((item, index) => (
              <TouchableOpacity 
                key={index}
                style={styles.card}
                onPress={() => router.push(item.route)}
              >
                <View style={styles.cardContent}>
                  <View style={styles.cardHeader}>
                    <Ionicons name={item.icon} size={24} color="#0077b3" />
                  </View>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.moreInfo}>More Info →</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={24} color="white" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Add styles for the navigation bar
const navStyles = StyleSheet.create({
  header: {
    backgroundColor: '#0077b3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
  },
  headerTitle: {
    fontSize: 24, // Increased font size
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  backButton: {
    padding: 5,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: Dimensions.get('window').width / 2 - 30,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  cardContent: {
    minHeight: 100,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  cardTitle: {
    fontSize: 16,
    color: '#444',
    marginBottom: 10,
  },
  moreInfo: {
    fontSize: 14,
    color: '#666',
  },
  logoutButton: {
    backgroundColor: '#ff3b30',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
