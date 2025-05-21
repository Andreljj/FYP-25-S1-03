import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function ResetPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleResetRequest = async () => {
    try {
      const response = await fetch('https://topcare-fashion-backend.onrender.com/api/auth/request-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        if (response.status === 404) {
          Alert.alert('Invalid Email', 'No account found with this email address.');
        } else {
          Alert.alert('Error', data.message || 'Failed to send reset code.');
        }
      } else {
        Alert.alert('Check your email', 'A reset code has been sent to your email.');
        router.push({ pathname: '/ChangePassword', params: { email } });
      }
    } catch (err) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter your email to reset password</Text>
      <TextInput
        style={styles.input}
        placeholder="Email address"
        value={email}
        onChangeText={setEmail}
      />
      <TouchableOpacity style={styles.button} onPress={handleResetRequest}>
        <Text style={styles.buttonText}>Send Reset Code</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 20, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 6, marginBottom: 20 },
  button: { backgroundColor: '#0077b3', padding: 15, borderRadius: 6, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' }
});
