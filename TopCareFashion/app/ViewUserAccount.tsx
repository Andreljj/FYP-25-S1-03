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
import NavigationBar from './NavigationBar';
import { useRoute, useNavigation } from '@react-navigation/native';

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
    const route = useRoute();
    const [users, setUsers] = useState<User[]>([
        {
          _id: '1',
          username: 'johnsmith12',
          name: 'John Smith',
          email: 'john.smith@gmail.com',
          dateOfBirth: '1990-06-15',
          gender: 'male',
          status: 'Suspended',
          lastLoginDate: '2024-01-15'
        },
        {
          _id: '2',
          username: 'sarahj',
          name: 'Sarah Johnson',
          email: 'sarah.j@gmail.com',
          dateOfBirth: '1992-03-22',
          gender: 'female',
          status: 'Active',
          lastLoginDate: '2024-01-20'
        },
        {
          _id: '3',
          username: 'michaelb',
          name: 'Michael Brown',
          email: 'michael.b@gmail.com',
          dateOfBirth: '1995-09-05',
          gender: 'Male',
          status: 'Suspended',
          lastLoginDate: '2024-01-10'
        },
        {
          _id: '4',
          username: 'emilyd',
          name: 'Emily Davis',
          email: 'emily.d@gmail.com',
          dateOfBirth: '1987-05-18',
          gender: 'female',
          status: 'Active',
          lastLoginDate: '2024-01-18'
        },
        {
          _id: '5',
          username: 'jamesw',
          name: 'James Wilson',
          email: 'james.w@gmail.com',
          dateOfBirth: '1999-01-20',
          gender: 'Male',
          status: 'Suspended',
          lastLoginDate: '2024-01-05'
        }
      ]);
      const [isLoading, setIsLoading] = useState(false);
      const [activeFilter, setActiveFilter] = useState('All');

      useEffect(() => {
        if (route.params?.deletedUserId) {
            const deletedId = route.params.deletedUserId;
            setUsers(prevUsers => prevUsers.filter(user => user._id !== deletedId));
            // Clear params after state update
            requestAnimationFrame(() => {
                navigation.setParams({
                    deletedUserId: undefined,
                    timestamp: undefined
                });
            });
        }
    }, [route.params?.deletedUserId, route.params?.timestamp]);

      const filteredUsers = users.filter(user => {
        if (activeFilter === 'All') return true;
        return user.status === activeFilter;
      });

      const getStatusCount = (status: string) => {
        if (status === 'All') return users.length;
        return users.filter(user => user.status === status).length;
      };

  const fetchUsers = async () => {
    try {
      const apiUrl = await AsyncStorage.getItem('apiUrl') || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/users`);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  const activateUser = async (userId: string) => {
    try {
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user._id === userId 
              ? { ...user, status: 'Active' }
              : user
          )
        );
        Alert.alert('Success', 'User account activated successfully');
      } catch (error) {
        Alert.alert('Error', 'Failed to activate user account');
      }
  };

  const suspendUser = async (userId: string) => {
    try {
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user._id === userId 
            ? { ...user, status: 'Suspended' }
            : user
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
      <NavigationBar showBackButton={true} />
      <View style={styles.content}>
        <Text style={styles.title}>User Accounts</Text>
        <View style={styles.filterContainer}>
          <TouchableOpacity 
            style={[styles.filterButton, activeFilter === 'All' && styles.activeFilter]}
            onPress={() => setActiveFilter('All')}
          >
            <Text style={[styles.filterText, activeFilter === 'All' && styles.activeFilterText]}>
              All {getStatusCount('All')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.filterButton, activeFilter === 'Active' && styles.activeFilter]}
            onPress={() => setActiveFilter('Active')}
          >
            <Text style={[styles.filterText, activeFilter === 'Active' && styles.activeFilterText]}>
              Active {getStatusCount('Active')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.filterButton, activeFilter === 'Suspended' && styles.activeFilter]}
            onPress={() => setActiveFilter('Suspended')}
          >
            <Text style={[styles.filterText, activeFilter === 'Suspended' && styles.activeFilterText]}>
              Suspended {getStatusCount('Suspended')}
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={filteredUsers}
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