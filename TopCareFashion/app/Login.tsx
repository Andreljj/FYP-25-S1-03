import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import NavigationBar from "./NavigationBar";
import { useAuth } from "./context/AuthContext";

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  // Error states
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

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
    
    // Validate password
    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else {
      setPasswordError("");
    }
    
    return isValid;
  };

  // Handle login
  const handleLogin = async () => {
    if (validateForm()) {
      setIsLoading(true);
      
      try {
        const success = await login(username, password);
        
        if (success) {
          // Navigate to home page after successful login
          router.replace("/Homepage");
        } else {
          Alert.alert("Login Failed", "Invalid username or password. Please try again.");
        }
      } catch (error) {
        Alert.alert("Error", "An unexpected error occurred. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <NavigationBar showBackButton={true} />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          <View style={styles.loginContainer}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue to TOP CARE FASHION</Text>
            
            {/* Username Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Username</Text>
              <TextInput 
                style={[styles.input, usernameError ? styles.inputError : null]} 
                placeholder="Enter your username"
                autoCapitalize="none"
                value={username}
                onChangeText={setUsername}
              />
              {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}
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
            
            {/* Forgot Password */}
            <TouchableOpacity 
              style={styles.forgotPasswordContainer}
              onPress={() => router.push("/Login")}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
            
            {/* Login Button */}
            <TouchableOpacity 
              style={styles.loginButton}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.buttonText}>Sign In</Text>
              )}
            </TouchableOpacity>
            
            {/* Register Link */}
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/register")}>
                <Text style={styles.registerLink}>Sign up</Text>
              </TouchableOpacity>
            </View>
            
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#0077b3",
  },
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    padding: 20,
    justifyContent: "center",
  },
  loginContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
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
  forgotPasswordContainer: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: "#0077b3",
    fontSize: 14,
    fontWeight: "500",
  },
  loginButton: {
    backgroundColor: "#0077b3",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    height: 55,
    justifyContent: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  registerText: {
    fontSize: 16,
    color: "#333",
  },
  registerLink: {
    fontSize: 16,
    color: "#0077b3",
    fontWeight: "bold",
  },
  demoCredentials: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#0077b3",
  },
  demoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  demoText: {
    fontSize: 14,
    color: "#666",
  }
});