import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AdminNavigationBar from '../Sysadmin/AdminNavigationBar'; 
import { useRoute, useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';  

interface User {
  _id: string;
  username: string;
  name: string;
  email: string;
  dateOfBirth?: string;
  gender?: string;
  status: 'Active' | 'Suspended';
  lastLoginDate?: string;
}

export default function ViewUserAccount() {
    const navigation = useNavigation();
    const router = useRouter();  // This will now work correctly
    const route = useRoute();
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeFilter, setActiveFilter] = useState('All');

    const fetchUsers = async (status = 'All') => {
  try {
    setIsLoading(true);
    const apiUrl = await AsyncStorage.getItem('apiUrl') || 'https://topcare-fashion-backend.onrender.com';
    const token = await AsyncStorage.getItem('token');

    const response = await fetch(`${apiUrl}/api/admin/users?status=${status}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    setUsers(data);
  } catch (error) {
    Alert.alert('Error', 'Failed to fetch users');
  } finally {
    setIsLoading(false);
  }
};

  useEffect(() => {
  fetchUsers(activeFilter);
}, [activeFilter]);




 const activateUser = async (userId: string) => {
  try {
    const apiUrl = await AsyncStorage.getItem('apiUrl') || 'https://topcare-fashion-backend.onrender.com';
    const token = await AsyncStorage.getItem('token');

    const response = await fetch(`${apiUrl}/api/admin/users/${userId}/status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: 'Active' }),
    });

    if (!response.ok) throw new Error();

    setUsers(prevUsers =>
      prevUsers.map(user =>
        user._id === userId ? { ...user, status: 'Active' } : user
      )
    );

    Alert.alert('Success', 'User account activated successfully');
  } catch (error) {
    Alert.alert('Error', 'Failed to activate user account');
  }
};


  const suspendUser = async (userId: string) => {
  try {
    const apiUrl = await AsyncStorage.getItem('apiUrl') || 'https://topcare-fashion-backend.onrender.com';
    const token = await AsyncStorage.getItem('token');

    const response = await fetch(`${apiUrl}/api/admin/users/${userId}/status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: 'Suspended' }),
    });

    if (!response.ok) throw new Error();

    setUsers(prevUsers =>
      prevUsers.map(user =>
        user._id === userId ? { ...user, status: 'Suspended' } : user
      )
    );

    Alert.alert('Success', 'User account suspended successfully');
  } catch (error) {
    Alert.alert('Error', 'Failed to suspend user account');
  }
};


  const renderUserItem = ({ item }: { item: User }) => (
    <View style={styles.userCard}>
      <TouchableOpacity 
        style={styles.cardContent}
        onPress={() => navigation.navigate('ViewAccountDetails', { userId: item._id, userData: item })}
      >
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.username}</Text>
          <Text style={styles.userEmail}>{item.email}</Text>
          <Text style={[
            styles.userStatus,
            item.status === 'Active' ? styles.statusActive : styles.statusSuspended
          ]}>
            {item.status}
          </Text>
        </View>
      </TouchableOpacity>
      
      <View style={styles.buttonContainer}>
        {item.status === 'Active' ? (
          <TouchableOpacity
            style={[styles.actionButton, styles.suspendButton]}
            onPress={() => {
              Alert.alert(
                'Suspend User',
                'Are you sure you want to suspend this user?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Suspend', onPress: () => suspendUser(item._id) }
                ]
              );
            }}
          >
            <Text style={styles.actionButtonText}>Suspend</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.actionButton, styles.activateButton]}
            onPress={() => {
              Alert.alert(
                'Activate User',
                'Are you sure you want to activate this user?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Activate', onPress: () => activateUser(item._id) }
                ]
              );
            }}
          >
            <Text style={styles.actionButtonText}>Activate</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <AdminNavigationBar showBackButton={true} />
      <View style={styles.content}>
        <Text style={styles.title}>User Accounts</Text>
        <View style={styles.filterContainer}>
          <View style={styles.filterContainer}>
  <TouchableOpacity 
    style={[styles.filterButton, activeFilter === 'All' && styles.activeFilter]}
    onPress={() => setActiveFilter('All')}
  >
    <Text style={[styles.filterText, activeFilter === 'All' && styles.activeFilterText]}>
      All
    </Text>
  </TouchableOpacity>

  <TouchableOpacity 
    style={[styles.filterButton, activeFilter === 'Active' && styles.activeFilter]}
    onPress={() => setActiveFilter('Active')}
  >
    <Text style={[styles.filterText, activeFilter === 'Active' && styles.activeFilterText]}>
      Active
    </Text>
  </TouchableOpacity>

  <TouchableOpacity 
    style={[styles.filterButton, activeFilter === 'Suspended' && styles.activeFilter]}
    onPress={() => setActiveFilter('Suspended')}
  >
    <Text style={[styles.filterText, activeFilter === 'Suspended' && styles.activeFilterText]}>
      Suspended
    </Text>
  </TouchableOpacity>
</View>
</View>

        <FlatList
          data={users}
          renderItem={renderUserItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            !isLoading && (
              <Text style={styles.emptyText}>No users found</Text>
            )
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  listContainer: {
    paddingBottom: 16,
  },
  userCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  userStatus: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
  statusActive: {
    color: '#34C759',
  },
  statusSuspended: {
    color: '#FF3B30',
  },
  activateButton: {
    backgroundColor: '#0077b3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft: 16,
  },
  activateButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginTop: 24,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 8,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    borderRadius: 20,
  },
  activeFilter: {
    backgroundColor: '#0077b3',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
  },
  activeFilterText: {
    color: 'white',
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  activateButton: {
    backgroundColor: '#0077b3',
  },
  suspendButton: {
    backgroundColor: '#FF3B30',
  },
  disabledButton: {
    opacity: 0.5,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
});