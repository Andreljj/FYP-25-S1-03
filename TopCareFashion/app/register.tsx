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
  Modal
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Register() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [gender, setGender] = useState("");
  const [showDateModal, setShowDateModal] = useState(false);
  
  // Error states
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
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
    
    // Validate username
    if (!username.trim()) {
      setUsernameError("Username is required");
      isValid = false;
    } else {
      setUsernameError("");
    }
    
    // Validate email
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
    
    // Validate password
    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      isValid = false;
    } else {
      setPasswordError("");
    }
    
    // Validate DOB
    const dobDate = getDobDate();
    if (!dobDate) {
      setDobError("Date of birth is required");
      isValid = false;
    } else {
      const today = new Date();
      const age = today.getFullYear() - dobDate.getFullYear();
      const monthDiff = today.getMonth() - dobDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
        // Hasn't had birthday this year yet
        if (age - 1 < 13) {
          setDobError("You must be at least 13 years old to register");
          isValid = false;
        } else {
          setDobError("");
        }
      } else {
        // Had birthday this year
        if (age < 13) {
          setDobError("You must be at least 13 years old to register");
          isValid = false;
        } else {
          setDobError("");
        }
      }
    }
    
    // Validate gender
    if (!gender) {
      setGenderError("Please select your gender");
      isValid = false;
    } else {
      setGenderError("");
    }
    
    return isValid;
  };

  // Handle registration
  const handleRegister = () => {
    if (validateForm()) {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        // Navigate to home after successful registration
        router.replace("/Homepage");
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
        <View style={{ width: 28 }} />
        <Text style={styles.headerTitle}>TOP CARE FASHION</Text>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <Ionicons name="close" size={28} color="white" />
        </TouchableOpacity>
      </View>
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.container}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join our community of fashion lovers</Text>
            
            {/* Username Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Username</Text>
              <TextInput 
                style={[styles.input, usernameError ? styles.inputError : null]} 
                placeholder="Enter a username"
                value={username}
                onChangeText={setUsername}
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
            
            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={[styles.passwordContainer, passwordError ? styles.inputError : null]}>
                <TextInput 
                  style={styles.passwordInput} 
                  placeholder="Enter your password"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity 
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons 
                    name={showPassword ? "eye-off-outline" : "eye-outline"} 
                    size={24} 
                    color="#666" 
                  />
                </TouchableOpacity>
              </View>
              {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
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
              
              {/* Custom Date Picker Modal */}
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
            
            {/* Register Button */}
            <TouchableOpacity 
              style={styles.registerButton}
              onPress={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.buttonText}>Create Account</Text>
              )}
            </TouchableOpacity>
            
            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/Login")}>
                <Text style={styles.loginLink}>Sign in</Text>
              </TouchableOpacity>
            </View>
            
            {/* Terms and Privacy */}
            <Text style={styles.termsText}>
              By creating an account, you agree to our{' '}
              <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
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
  closeButton: {
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
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
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
  inputError: {
    borderColor: "#ff3b30",
  },
  errorText: {
    color: "#ff3b30",
    fontSize: 14,
    marginTop: 5,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "white",
  },
  passwordInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 10,
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
  registerButton: {
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
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  loginText: {
    fontSize: 16,
    color: "#333",
  },
  loginLink: {
    fontSize: 16,
    color: "#0077b3",
    fontWeight: "bold",
  },
  termsText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  termsLink: {
    color: "#0077b3",
    fontWeight: "500",
  },
  // Modal Styles
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
});