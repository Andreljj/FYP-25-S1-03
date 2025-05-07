
import React from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';

const ProductCategory = ({ onBack }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Product Categories</Text>

      {/* Input for new category */}
      <TextInput
        style={styles.input}
        placeholder="Enter new category name"
      />

      {/* Buttons for adding and updating categories */}
      <Button title="Add Category" onPress={() => {/* Add category logic */}} />
      <Button title="Update Category" onPress={() => {/* Update category logic */}} />

      {/* Back Button */}
      <Button title="Back" onPress={onBack} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 8,
  },
});

export default ProductCategory;
