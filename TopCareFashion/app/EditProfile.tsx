import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function EditProfile() {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [gender, setGender] = useState("");

  const [showDateModal, setShowDateModal] = useState(false);

  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [dobError, setDobError] = useState("");
  const [genderError, setGenderError] = useState("");

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      console.log("TOKEN:", token);

      const response = await fetch("https://topcare-fashion-backend.onrender.com/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log("RESPONSE STATUS:", response.status);
      const text = await response.text();
      console.log("RESPONSE BODY:", text);
      console.log("TOKEN:", token);
      console.log("RESPONSE STATUS:", response.status);
      console.log("RESPONSE BODY:", text);

      if (!response.ok) return;

      const user = JSON.parse(text);

      setUsername(user.username || "");
      setEmail(user.email || "");
      setBio(user.bio || "");
      setGender(user.gender || "");

      if (user.dob) {
        const dob = new Date(user.dob);
        setDay(String(dob.getDate()));
        setMonth(String(dob.getMonth() + 1));
        setYear(String(dob.getFullYear()));
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setIsUpdating(true);
      const token = await AsyncStorage.getItem("token");
  
      const response = await fetch("https://topcare-fashion-backend.onrender.com/api/auth/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email,
          bio,
          gender,
        }),
      });
  
      const text = await response.text();
      console.log("UPDATE RESPONSE STATUS:", response.status);
      console.log("UPDATE RESPONSE BODY:", text);
  
      if (!response.ok) {
        Alert.alert("Update Failed", "Unable to update profile.");
        return;
      }
  
      Alert.alert("Success", "Profile updated successfully.", [
        {
          text: "OK",
          onPress: () => {
            router.replace("/Profile");
          },
        },
      ]);
    } catch (error) {
      console.error("Update error:", error);
      Alert.alert("Error", "An error occurred while updating profile.");
    } finally {
      setIsUpdating(false);
    }
  };
  

  const handleDeleteAccount = () => {
    Alert.alert("Delete Account", "Are you sure you want to permanently delete your account?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setIsDeletingAccount(true);
          setTimeout(() => {
            setIsDeletingAccount(false);
            Alert.alert("Account Deleted", "Your account has been successfully deleted.", [
              { text: "OK", onPress: () => router.replace("/Login") }
            ]);
          }, 1500);
        }
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#0077b3" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 28 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.container}>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Username</Text>
              <TextInput
                style={[styles.input, { backgroundColor: '#f0f0f0' }]}
                placeholder="Enter a username"
                value={username}
                editable={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={email}
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Bio</Text>
              <TextInput
                style={[styles.input, styles.bioInput]}
                placeholder="Tell us about yourself"
                value={bio}
                multiline
                onChangeText={setBio}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Gender</Text>
              <View style={styles.genderContainer}>
                {['male', 'female', 'other'].map((g) => (
                  <TouchableOpacity
                    key={g}
                    style={[styles.genderOption, gender === g && styles.genderSelected]}
                    onPress={() => setGender(g)}
                  >
                    <Ionicons
                      name={gender === g ? "radio-button-on" : "radio-button-off"}
                      size={24}
                      color={gender === g ? "#0077b3" : "#666"}
                    />
                    <Text style={[styles.genderText, gender === g && styles.genderTextSelected]}>
                      {g.charAt(0).toUpperCase() + g.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={styles.updateButton}
              onPress={handleUpdateProfile}
              disabled={isUpdating || isDeletingAccount}
            >
              {isUpdating ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.buttonText}>Update Profile</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteAccountButton}
              disabled={isDeletingAccount}
              onPress={handleDeleteAccount}
            >
              {isDeletingAccount ? (
                <ActivityIndicator color="#ff3b30" size="small" />
              ) : (
                <>
                  <Ionicons name="trash-outline" size={24} color="#ff3b30" />
                  <Text style={styles.deleteAccountText}>Delete Account</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    padding: 20,
    paddingTop: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "white",
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  genderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  genderOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "white",
    minWidth: "30%",
  },
  genderSelected: {
    borderColor: "#0077b3",
    backgroundColor: "rgba(0, 119, 179, 0.05)",
  },
  genderText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#333",
  },
  genderTextSelected: {
    color: "#0077b3",
    fontWeight: "500",
  },
  updateButton: {
    backgroundColor: "#0077b3",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 20,
    height: 55,
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  deleteAccountButton: {
    backgroundColor: "rgba(255, 59, 48, 0.1)",
    padding: 15,
    borderRadius: 8,
    marginTop: 15,
    borderWidth: 2,
    borderColor: "#ff3b30",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  deleteAccountText: {
    color: "#ff3b30",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 10,
  },
});
