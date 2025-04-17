import React, { useState } from "react";
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

export default function EditProfile() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  
  // Form state
  const [username, setUsername] = useState("Jason Gretel");
  const [email, setEmail] = useState("jason@example.com");
  const [bio, setBio] = useState("Fashion enthusiast");
  const [day, setDay] = useState("15");
  const [month, setMonth] = useState("06");
  const [year, setYear] = useState("1990");
  const [gender, setGender] = useState("male");
  const [showDateModal, setShowDateModal] = useState(false);
  
  // Error states
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [dobError, setDobError] = useState("");
  const [genderError, setGenderError] = useState("");

  // Get dob as Date object
  const getDobDate = () => {
    if (!day || !month || !year) return null;
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  };

  // Format the date for display
  const getFormattedDate = () => {
    if (!day || !month || !year) return "Select Date";
    return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
  };

  // Validate form
  const validateForm = () => {
    let isValid = true;
    
    if (!username.trim()) {
      setUsernameError("Username is required");
      isValid = false;
    } else {
      setUsernameError("");
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    } else {
      setEmailError("");
    }
    
    const dobDate = getDobDate();
    if (!dobDate) {
      setDobError("Date of birth is required");
      isValid = false;
    } else {
      const today = new Date();
      const age = today.getFullYear() - dobDate.getFullYear();
      const monthDiff = today.getMonth() - dobDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
        if (age - 1 < 13) {
          setDobError("You must be at least 13 years old");
          isValid = false;
        } else {
          setDobError("");
        }
      } else {
        if (age < 13) {
          setDobError("You must be at least 13 years old");
          isValid = false;
        } else {
          setDobError("");
        }
      }
    }
    
    if (!gender) {
      setGenderError("Please select your gender");
      isValid = false;
    } else {
      setGenderError("");
    }
    
    return isValid;
  };

  // Handle profile update
  const handleUpdate = () => {
    if (validateForm()) {
      setIsUpdating(true);
      
      // Simulate API call
      setTimeout(() => {
        setIsUpdating(false);
        Alert.alert(
          "Success",
          "Profile updated successfully",
          [{ text: "OK", onPress: () => router.back() }]
        );
      }, 1500);
    }
  };

  // Generate arrays for dropdown options
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1));
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1));
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => String(currentYear - i));

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#0077b3" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
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

            {/* Username Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Username</Text>
              <TextInput 
                style={[
                  styles.input, 
                  usernameError ? styles.inputError : null,
                  { backgroundColor: '#f0f0f0' }
                ]} 
                placeholder="Enter a username"
                value={username}
                onChangeText={setUsername}
                editable={false}
              />
              {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}
            </View>
            
            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput 
                style={[styles.input, emailError ? styles.inputError : null]} 
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
              {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
            </View>

            {/* Bio Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Bio</Text>
              <TextInput 
                style={[styles.input, styles.bioInput]} 
                placeholder="Tell us about yourself"
                value={bio}
                onChangeText={setBio}
                multiline
                numberOfLines={3}
              />
            </View>
            
            {/* Date of Birth Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Date of Birth</Text>
              <TouchableOpacity 
                style={[styles.input, dobError ? styles.inputError : null, styles.dobInput]} 
                onPress={() => setShowDateModal(true)}
              >
                <Text style={styles.dobText}>{getFormattedDate()}</Text>
                <Ionicons name="calendar-outline" size={24} color="#666" />
              </TouchableOpacity>
              {dobError ? <Text style={styles.errorText}>{dobError}</Text> : null}
              
              {/* Date Picker Modal */}
              <Modal
                visible={showDateModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowDateModal(false)}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Select Date of Birth</Text>
                    
                    <View style={styles.datePickerContainer}>
                      {/* Day Picker */}
                      <View style={styles.datePickerColumn}>
                        <Text style={styles.datePickerLabel}>Day</Text>
                        <ScrollView style={styles.datePickerScroll}>
                          {days.map((d) => (
                            <TouchableOpacity
                              key={`day-${d}`}
                              style={[
                                styles.datePickerItem,
                                day === d ? styles.datePickerItemSelected : {}
                              ]}
                              onPress={() => setDay(d)}
                            >
                              <Text 
                                style={[
                                  styles.datePickerItemText,
                                  day === d ? styles.datePickerItemTextSelected : {}
                                ]}
                              >
                                {d.padStart(2, '0')}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </View>
                      
                      {/* Month Picker */}
                      <View style={styles.datePickerColumn}>
                        <Text style={styles.datePickerLabel}>Month</Text>
                        <ScrollView style={styles.datePickerScroll}>
                          {months.map((m) => (
                            <TouchableOpacity
                              key={`month-${m}`}
                              style={[
                                styles.datePickerItem,
                                month === m ? styles.datePickerItemSelected : {}
                              ]}
                              onPress={() => setMonth(m)}
                            >
                              <Text 
                                style={[
                                  styles.datePickerItemText,
                                  month === m ? styles.datePickerItemTextSelected : {}
                                ]}
                              >
                                {m.padStart(2, '0')}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </View>
                      
                      {/* Year Picker */}
                      <View style={styles.datePickerColumn}>
                        <Text style={styles.datePickerLabel}>Year</Text>
                        <ScrollView style={styles.datePickerScroll}>
                          {years.map((y) => (
                            <TouchableOpacity
                              key={`year-${y}`}
                              style={[
                                styles.datePickerItem,
                                year === y ? styles.datePickerItemSelected : {}
                              ]}
                              onPress={() => setYear(y)}
                            >
                              <Text 
                                style={[
                                  styles.datePickerItemText,
                                  year === y ? styles.datePickerItemTextSelected : {}
                                ]}
                              >
                                {y}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </View>
                    </View>
                    
                    <View style={styles.modalButtons}>
                      <TouchableOpacity 
                        style={[styles.modalButton, styles.modalCancelButton]} 
                        onPress={() => setShowDateModal(false)}
                      >
                        <Text style={styles.modalCancelButtonText}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={[styles.modalButton, styles.modalConfirmButton]}
                        onPress={() => setShowDateModal(false)}
                      >
                        <Text style={styles.modalConfirmButtonText}>Confirm</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
            </View>
            
            {/* Gender Selection */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Gender</Text>
              <View style={styles.genderContainer}>
                <TouchableOpacity 
                  style={[
                    styles.genderOption, 
                    gender === "male" ? styles.genderSelected : null
                  ]}
                  onPress={() => setGender("male")}
                >
                  <Ionicons 
                    name={gender === "male" ? "radio-button-on" : "radio-button-off"} 
                    size={24} 
                    color={gender === "male" ? "#0077b3" : "#666"} 
                  />
                  <Text style={[
                    styles.genderText,
                    gender === "male" ? styles.genderTextSelected : null
                  ]}>Male</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.genderOption, 
                    gender === "female" ? styles.genderSelected : null
                  ]}
                  onPress={() => setGender("female")}
                >
                  <Ionicons 
                    name={gender === "female" ? "radio-button-on" : "radio-button-off"} 
                    size={24} 
                    color={gender === "female" ? "#0077b3" : "#666"} 
                  />
                  <Text style={[
                    styles.genderText,
                    gender === "female" ? styles.genderTextSelected : null
                  ]}>Female</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.genderOption, 
                    gender === "other" ? styles.genderSelected : null
                  ]}
                  onPress={() => setGender("other")}
                >
                  <Ionicons 
                    name={gender === "other" ? "radio-button-on" : "radio-button-off"} 
                    size={24} 
                    color={gender === "other" ? "#0077b3" : "#666"} 
                  />
                  <Text style={[
                    styles.genderText,
                    gender === "other" ? styles.genderTextSelected : null
                  ]}>Other</Text>
                </TouchableOpacity>
              </View>
              {genderError ? <Text style={styles.errorText}>{genderError}</Text> : null}
            </View>
            
            {/* Update Button */}
            <TouchableOpacity 
              style={styles.updateButton}
              onPress={handleUpdate}
              disabled={isUpdating || isDeletingAccount}
            >
              {isUpdating ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.buttonText}>Update Profile</Text>
              )}
            </TouchableOpacity>

            {/* Logout Button */}
            <TouchableOpacity 
              style={styles.logoutButton}
              onPress={() => {
                // Add logout logic here
                router.replace("/Login");
              }}
            >
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>

            {/* Delete Account Button */}
            <TouchableOpacity 
              style={styles.deleteAccountButton}
              disabled={isUpdating || isDeletingAccount}
              onPress={() => {
                Alert.alert(
                  "Delete Account",
                  "Are you sure you want to permanently delete your account? This action cannot be undone.",
                  [
                    {
                      text: "Cancel",
                      style: "cancel"
                    },
                    {
                      text: "Delete",
                      style: "destructive",
                      onPress: () => {
                        setIsDeletingAccount(true);
                        // Simulate account deletion process
                        setTimeout(() => {
                          setIsDeletingAccount(false);
                          Alert.alert(
                            "Account Deleted",
                            "Your account has been successfully deleted.",
                            [
                              {
                                text: "OK",
                                onPress: () => router.replace("/Login")
                              }
                            ]
                          );
                        }, 1500);
                      }
                    }
                  ]
                );
              }}
            >
              {isDeletingAccount ? (
                <ActivityIndicator color="#ff3b30" size="small" />
              ) : (
                <Text style={styles.deleteAccountButtonText}>Delete Account</Text>
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
  inputError: {
    borderColor: "#ff3b30",
  },
  errorText: {
    color: "#ff3b30",
    fontSize: 14,
    marginTop: 5,
  },
  dobInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 15,
  },
  dobText: {
    fontSize: 16,
    color: "#333",
    padding: 12,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 200,
  },
  datePickerColumn: {
    flex: 1,
    marginHorizontal: 5,
  },
  datePickerLabel: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
  },
  datePickerScroll: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
  },
  datePickerItem: {
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  datePickerItemSelected: {
    backgroundColor: 'rgba(0, 119, 179, 0.1)',
  },
  datePickerItemText: {
    fontSize: 16,
    color: '#333',
  },
  datePickerItemTextSelected: {
    color: '#0077b3',
    fontWeight: '600',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  modalCancelButton: {
    backgroundColor: '#f0f0f0',
  },
  modalConfirmButton: {
    backgroundColor: '#0077b3',
  },
  modalCancelButtonText: {
    color: '#333',
    fontWeight: '500',
  },
  modalConfirmButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: "#f8f8f8",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
    height: 55,
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#ff3b30",
  },
  logoutButtonText: {
    color: "#ff3b30",
    fontWeight: "bold",
    fontSize: 16,
  },
  deleteAccountButton: {
    backgroundColor: "rgba(255, 59, 48, 0.1)",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
    height: 55,
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#ff3b30",
  },
  deleteAccountButtonText: {
    color: "#ff3b30",
    fontWeight: "bold",
    fontSize: 16,
  },
});