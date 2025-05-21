// Enhanced EditAboutUs.tsx with detailed Contact section rendering

import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditAboutUs = () => {
  const [sections, setSections] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(true);

  const loadContent = async () => {
    try {
      const response = await fetch('https://topcare-fashion-backend.onrender.com/api/about');
      const data = await response.json();
      const map = {};
      data.forEach(section => {
        map[section.section] = section;
        if (section.section === 'contact') {
          if (typeof section.content === 'string') {
            try {
              map[section.section].content = JSON.parse(section.content);
            } catch {
              map[section.section].content = { email: '', phone: '', address: '' };
            }
          } else {
            map[section.section].content = section.content;
          }
        }        
      });
      setSections(map);
    } catch (err) {
      console.error('Error fetching content:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleChange = (sectionKey, field, value) => {
    setSections(prev => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      setIsLoading(true);
      const updates = Object.keys(sections).map(async key => {
        const section = sections[key];
        const payload = {
          title: section.title,
          content: key === 'contact' ? JSON.stringify(section.content) : section.content
        };
        return fetch(`https://topcare-fashion-backend.onrender.com/api/about/${section.section}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      });
      await Promise.all(updates);
      Alert.alert('Success', 'All sections updated.');
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  if (isLoading) {
    return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Edit About Us</Text>
      {Object.keys(sections).map((key) => (
        <View key={key} style={styles.card}>
          <Text style={styles.sectionName}>{key}</Text>

          <TextInput
            style={styles.input}
            value={sections[key].title}
            onChangeText={(text) => handleChange(key, 'title', text)}
            placeholder="Section Title"
          />

          {key === 'contact' ? (
            ['email', 'phone', 'address'].map((field) => (
              <TextInput
                key={field}
                style={styles.input}
                value={sections[key].content?.[field] || ''}
                onChangeText={(text) => {
                  setSections(prev => ({
                    ...prev,
                    [key]: {
                      ...prev[key],
                      content: {
                        ...prev[key].content,
                        [field]: text
                      }
                    }
                  }));
                }}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              />
            ))
          ) : typeof sections[key].content === 'string' ? (
            <TextInput
              style={styles.textarea}
              multiline
              value={sections[key].content}
              onChangeText={(text) => handleChange(key, 'content', text)}
              placeholder="Content"
            />
          ) : Array.isArray(sections[key].content) ? (
            sections[key].content.map((item, idx) =>
              typeof item === 'string' ? (
                <TextInput
                  key={idx}
                  style={styles.textarea}
                  multiline
                  value={item}
                  onChangeText={(text) => {
                    const updated = [...sections[key].content];
                    updated[idx] = text;
                    handleChange(key, 'content', updated);
                  }}
                  placeholder={`Paragraph ${idx + 1}`}
                />
              ) : (
                <View key={idx} style={{ marginBottom: 12 }}>
                  {Object.keys(item).map((subKey) => (
                    <TextInput
                      key={subKey}
                      style={styles.input}
                      value={item[subKey]}
                      onChangeText={(text) => {
                        const updated = [...sections[key].content];
                        updated[idx][subKey] = text;
                        handleChange(key, 'content', updated);
                      }}
                      placeholder={`${subKey} ${idx + 1}`}
                    />
                  ))}
                </View>
              )
            )
          ) : null}
        </View>
      ))}

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9f9f9'
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0077b3',
    marginBottom: 24,
    textAlign: 'center'
  },
  card: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2
  },
  sectionName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textTransform: 'capitalize'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    fontSize: 14
  },
  textarea: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 10
  },
  button: {
    backgroundColor: '#0077b3',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  }
});

export default EditAboutUs;