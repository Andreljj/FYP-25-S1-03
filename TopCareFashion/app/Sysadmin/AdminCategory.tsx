
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FILTER_OPTIONS } from '../NavigationBar';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AdminNavigationBar from '../Sysadmin/AdminNavigationBar';

const CATEGORIES_STORAGE_KEY = '@categories';

const AdminCategory = () => {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const storedCategories = await AsyncStorage.getItem(CATEGORIES_STORAGE_KEY);
      if (storedCategories) {
        setCategories(JSON.parse(storedCategories));
      } else {
        const isFirstLoad = await AsyncStorage.getItem('@firstLoad');
        if (!isFirstLoad) {
          const defaultCategories = FILTER_OPTIONS.CATEGORIES.map((name, index) => ({
            id: index + 1,
            name: name
          }));
          setCategories(defaultCategories);
          await AsyncStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(defaultCategories));
          await AsyncStorage.setItem('@firstLoad', 'true');
        } else {
          setCategories([]);
        }
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const saveCategories = async (newCategories) => {
    try {
      await AsyncStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(newCategories));
    } catch (error) {
      console.error('Error saving categories:', error);
    }
  };

  const generateUniqueId = (existingCategories) => {
    if (existingCategories.length === 0) return 1;
    const maxId = Math.max(...existingCategories.map(cat => cat.id));
    return maxId + 1;
  };

  const handleAddCategory = async () => {
    if (newCategory.trim()) {
      const newId = generateUniqueId(categories);
      const newCategoryList = [...categories, {
        id: newId,
        name: newCategory.trim()
      }];
      setCategories(newCategoryList);
      await saveCategories(newCategoryList);
      setNewCategory('');
    }
  };

  const handleDeleteCategory = async (id) => {
    const newCategoryList = categories.filter(category => category.id !== id);
    setCategories(newCategoryList);
    await saveCategories(newCategoryList);
  };

  const handleEditSubmit = async () => {
    if (editingName.trim()) {
      const newCategoryList = categories.map(category => 
        category.id === editingId 
          ? { ...category, name: editingName.trim() }
          : category
      );
      setCategories(newCategoryList);
      await saveCategories(newCategoryList);
      setEditingId(null);
      setEditingName('');
    }
  };

  const [newCategory, setNewCategory] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

  const handleEditStart = (category) => {
    setEditingId(category.id);
    setEditingName(category.name);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditingName('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <AdminNavigationBar showBackButton={true} />
      <View style={styles.content}>
        <Text style={styles.title}>Product Categories</Text>

        <View style={styles.addSection}>
          <TextInput
            style={styles.input}
            placeholder="Enter new category name"
            value={newCategory}
            onChangeText={setNewCategory}
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddCategory}>
            <Text style={styles.buttonText}>Add Category</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.headerCell, { flex: 0.5 }]}>ID</Text>
            <Text style={[styles.headerCell, { flex: 2 }]}>Category Name</Text>
            <Text style={[styles.headerCell, { flex: 1 }]}>Actions</Text>
          </View>

          {categories.map((category) => (
            <View key={category.id} style={styles.tableRow}>
              <Text style={[styles.cell, { flex: 0.5 }]}>{category.id}</Text>
              <View style={[styles.cell, { flex: 2 }]}>
                {editingId === category.id ? (
                  <View style={styles.editContainer}>
                    <TextInput
                      style={styles.editInput}
                      value={editingName}
                      onChangeText={setEditingName}
                      autoFocus
                    />
                    <TouchableOpacity onPress={handleEditSubmit} style={styles.editButton}>
                      <Ionicons name="checkmark" size={20} color="#4CAF50" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleEditCancel} style={styles.editButton}>
                      <Ionicons name="close" size={20} color="#f44336" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <Text>{category.name}</Text>
                )}
              </View>
              <View style={[styles.cell, styles.actionCell, { flex: 1 }]}>
                {editingId === category.id ? (
                  <View style={{ width: 48 }} />
                ) : (
                  <TouchableOpacity onPress={() => handleEditStart(category)}>
                    <Ionicons name="create-outline" size={24} color="#0077b3" />
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => handleDeleteCategory(category.id)}>
                  <Ionicons name="trash-outline" size={24} color="#ff4444" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>

        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.push('/Sysadmin/adminHome')}
        >
          <Text style={styles.backButtonText}>Back to Dashboard</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  addSection: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    backgroundColor: 'white',
  },
  addButton: {
    backgroundColor: '#0077b3',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  tableContainer: {
    flex: 1,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  headerCell: {
    fontWeight: 'bold',
    color: '#333',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: 'white',
    padding: 10,
  },
  cell: {
    justifyContent: 'center',
  },
  actionCell: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editInput: {
    flex: 1,
    height: 30,
    borderWidth: 1,
    borderColor: '#0077b3',
    borderRadius: 4,
    paddingHorizontal: 8,
    marginRight: 8,
    backgroundColor: 'white',
  },
  editButton: {
    padding: 4,
    marginLeft: 4,
  },
  backButton: {
    backgroundColor: '#0077b3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default AdminCategory;
