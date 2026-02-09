// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform,
//   Alert,
// } from "react-native";
// import LinearGradient from "react-native-linear-gradient";
// import Icon from "react-native-vector-icons/MaterialIcons";


// // Main authentication component with navigation
// export default function AuthScreen({ navigation }) {
//   const [currentScreen, setCurrentScreen] = useState("signin");

//   const renderScreen = () => {
//     switch (currentScreen) {
//       case "signup":
//         return <SignUpScreen goToSignIn={() => setCurrentScreen("signin")} />;
//       case "reset":
//         return (
//           <ResetPasswordScreen goToSignIn={() => setCurrentScreen("signin")} />
//         );
//       case "verify":
//         return <VerifyEmailScreen goToSignIn={() => setCurrentScreen("signin")} />;
//       default:
//         return (
//           <SignInScreen
//             goToSignUp={() => setCurrentScreen("signup")}
//             goToReset={() => setCurrentScreen("reset")}
//           />
//         );
//     }
//   };

//   return (
//     <LinearGradient
//       colors={["#FF3366", "#FF6F00", "#FF3366"]}
//       style={styles.container}
//       start={{ x: 0, y: 0 }}
//       end={{ x: 1, y: 1 }}
//     >
//       <View style={styles.logoContainer}>
//         <View style={styles.logo}>
//           <Text style={styles.logoText}>❤️</Text>
//         </View>
//         <Text style={styles.appName}>eDate</Text>
//       </View>

//       <View style={styles.card}>
//         <ScrollView showsVerticalScrollIndicator={false}>
//           {renderScreen()}
//         </ScrollView>
//       </View>
//     </LinearGradient>
//   );
// }

// // Sign In Screen
// function SignInScreen({ goToSignUp, goToReset }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleSignIn = () => {
//     if (!email || !password) {
//       Alert.alert("Error", "Please fill in all fields");
//       return;
//     }
//     // Handle sign in logic
//     Alert.alert("Success", "Signed in successfully!");
//   };

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//       style={styles.formContainer}
//     >
//       <Text style={styles.title}>Welcome Back</Text>
//       <Text style={styles.subtitle}>Sign in to continue your journey</Text>

//       <View style={styles.inputContainer}>
//         <Icon name="email" size={20} color="#FF3366" style={styles.inputIcon} />
//         <TextInput
//           style={styles.input}
//           placeholder="Email"
//           placeholderTextColor="#999"
//           value={email}
//           onChangeText={setEmail}
//           keyboardType="email-address"
//           autoCapitalize="none"
//         />
//       </View>

//       <View style={styles.inputContainer}>
//         <Icon name="lock" size={20} color="#FF3366" style={styles.inputIcon} />
//         <TextInput
//           style={styles.input}
//           placeholder="Password"
//           placeholderTextColor="#999"
//           value={password}
//           onChangeText={setPassword}
//           secureTextEntry
//         />
//       </View>

//       <TouchableOpacity onPress={goToReset}>
//         <Text style={styles.linkText}>Forgot Password?</Text>
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.button} onPress={handleSignIn}>
//         <LinearGradient
//           colors={["#FF3366", "#FF6F00"]}
//           style={styles.buttonGradient}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 0 }}
//         >
//           <Text style={styles.buttonText}>Sign In</Text>
//         </LinearGradient>
//       </TouchableOpacity>

//       <View style={styles.footer}>
//         <Text style={styles.footerText}>Don't have an account? </Text>
//         <TouchableOpacity onPress={goToSignUp}>
//           <Text style={styles.footerLink}>Sign Up</Text>
//         </TouchableOpacity>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }

// // Sign Up Screen
// function SignUpScreen({ goToSignIn }) {
//   const [email, setEmail] = useState("");
//   const [username, setUsername] = useState("");
//   const [phone, setPhone] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   const handleSignUp = () => {
//     if (!email || !username || !phone || !password || !confirmPassword) {
//       Alert.alert("Error", "Please fill in all fields");
//       return;
//     }
    
//     if (password !== confirmPassword) {
//       Alert.alert("Error", "Passwords do not match");
//       return;
//     }
    
//     // Handle sign up logic
//     Alert.alert("Success", "Account created successfully!");
//   };

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//       style={styles.formContainer}
//     >
//       <Text style={styles.title}>Create Account</Text>
//       <Text style={styles.subtitle}>Join eDate to find your perfect match</Text>

//       <View style={styles.inputContainer}>
//         <Icon name="email" size={20} color="#FF3366" style={styles.inputIcon} />
//         <TextInput
//           style={styles.input}
//           placeholder="Email"
//           placeholderTextColor="#999"
//           value={email}
//           onChangeText={setEmail}
//           keyboardType="email-address"
//           autoCapitalize="none"
//         />
//       </View>

//       <View style={styles.inputContainer}>
//         <Icon name="person" size={20} color="#FF3366" style={styles.inputIcon} />
//         <TextInput
//           style={styles.input}
//           placeholder="Username"
//           placeholderTextColor="#999"
//           value={username}
//           onChangeText={setUsername}
//           autoCapitalize="none"
//         />
//       </View>

//       <View style={styles.inputContainer}>
//         <Icon name="phone" size={20} color="#FF3366" style={styles.inputIcon} />
//         <TextInput
//           style={styles.input}
//           placeholder="Phone Number"
//           placeholderTextColor="#999"
//           value={phone}
//           onChangeText={setPhone}
//           keyboardType="phone-pad"
//         />
//       </View>

//       <View style={styles.inputContainer}>
//         <Icon name="lock" size={20} color="#FF3366" style={styles.inputIcon} />
//         <TextInput
//           style={styles.input}
//           placeholder="Password"
//           placeholderTextColor="#999"
//           value={password}
//           onChangeText={setPassword}
//           secureTextEntry
//         />
//       </View>

//       <View style={styles.inputContainer}>
//         <Icon name="lock" size={20} color="#FF3366" style={styles.inputIcon} />
//         <TextInput
//           style={styles.input}
//           placeholder="Confirm Password"
//           placeholderTextColor="#999"
//           value={confirmPassword}
//           onChangeText={setConfirmPassword}
//           secureTextEntry
//         />
//       </View>

//       <TouchableOpacity style={styles.button} onPress={handleSignUp}>
//         <LinearGradient
//           colors={["#FF3366", "#FF6F00"]}
//           style={styles.buttonGradient}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 0 }}
//         >
//           <Text style={styles.buttonText}>Sign Up</Text>
//         </LinearGradient>
//       </TouchableOpacity>

//       <View style={styles.footer}>
//         <Text style={styles.footerText}>Already have an account? </Text>
//         <TouchableOpacity onPress={goToSignIn}>
//           <Text style={styles.footerLink}>Sign In</Text>
//         </TouchableOpacity>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }

// // Reset Password Screen
// function ResetPasswordScreen({ goToSignIn }) {
//   const [email, setEmail] = useState("");

//   const handleReset = () => {
//     if (!email) {
//       Alert.alert("Error", "Please enter your email");
//       return;
//     }
    
//     // Handle reset password logic
//     Alert.alert("Success", "Password reset link sent to your email!");
//   };

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//       style={styles.formContainer}
//     >
//       <Text style={styles.title}>Reset Password</Text>
//       <Text style={styles.subtitle}>
//         Enter your email to receive a reset link
//       </Text>

//       <View style={styles.inputContainer}>
//         <Icon name="email" size={20} color="#FF3366" style={styles.inputIcon} />
//         <TextInput
//           style={styles.input}
//           placeholder="Email"
//           placeholderTextColor="#999"
//           value={email}
//           onChangeText={setEmail}
//           keyboardType="email-address"
//           autoCapitalize="none"
//         />
//       </View>

//       <TouchableOpacity style={styles.button} onPress={handleReset}>
//         <LinearGradient
//           colors={["#FF3366", "#FF6F00"]}
//           style={styles.buttonGradient}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 0 }}
//         >
//           <Text style={styles.buttonText}>Send Reset Link</Text>
//         </LinearGradient>
//       </TouchableOpacity>

//       <View style={styles.footer}>
//         <Text style={styles.footerText}>Remember your password? </Text>
//         <TouchableOpacity onPress={goToSignIn}>
//           <Text style={styles.footerLink}>Sign In</Text>
//         </TouchableOpacity>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }

// // Verify Email Screen
// function VerifyEmailScreen({ goToSignIn }) {
//   const [code, setCode] = useState(["", "", "", "", "", ""]);

//   const handleVerify = () => {
//     if (code.some(digit => digit === "")) {
//       Alert.alert("Error", "Please enter the complete verification code");
//       return;
//     }
    
//     // Handle verification logic
//     Alert.alert("Success", "Email verified successfully!");
//   };

//   const handleChangeCode = (text, index) => {
//     const newCode = [...code];
//     newCode[index] = text;
//     setCode(newCode);
    
//     // Auto focus to next input
//     if (text && index < 5) {
//       // You would need to use refs for this in a real implementation
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//       style={styles.formContainer}
//     >
//       <Text style={styles.title}>Verify Email</Text>
//       <Text style={styles.subtitle}>
//         Enter the 6-digit code sent to your email
//       </Text>

//       <View style={styles.codeContainer}>
//         {code.map((digit, index) => (
//           <View key={index} style={styles.codeInputWrapper}>
//             <TextInput
//               style={styles.codeInput}
//               value={digit}
//               onChangeText={(text) => handleChangeCode(text, index)}
//               keyboardType="number-pad"
//               maxLength={1}
//             />
//           </View>
//         ))}
//       </View>

//       <TouchableOpacity style={styles.button} onPress={handleVerify}>
//         <LinearGradient
//           colors={["#FF3366", "#FF6F00"]}
//           style={styles.buttonGradient}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 0 }}
//         >
//           <Text style={styles.buttonText}>Verify Email</Text>
//         </LinearGradient>
//       </TouchableOpacity>

//       <View style={styles.footer}>
//         <Text style={styles.footerText}>Didn't receive the code? </Text>
//         <TouchableOpacity>
//           <Text style={styles.footerLink}>Resend</Text>
//         </TouchableOpacity>
//       </View>

//       <View style={styles.footer}>
//         <TouchableOpacity onPress={goToSignIn}>
//           <Text style={styles.footerLink}>Back to Sign In</Text>
//         </TouchableOpacity>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   logoContainer: {
//     alignItems: "center",
//     marginTop: 40,
//     marginBottom: 20,
//   },
//   logo: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: "rgba(255, 255, 255, 0.2)",
//     justifyContent: "center",
//     alignItems: "center",
//     borderWidth: 2,
//     borderColor: "rgba(255, 255, 255, 0.3)",
//     marginBottom: 10,
//   },
//   logoText: {
//     fontSize: 40,
//   },
//   appName: {
//     fontSize: 28,
//     fontWeight: "800",
//     color: "#FFFFFF",
//     letterSpacing: 2,
//     textShadowColor: "rgba(0, 0, 0, 0.2)",
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 5,
//   },
//   card: {
//     flex: 1,
//     backgroundColor: "#FFF",
//     borderRadius: 20,
//     padding: 20,
//     marginBottom: 20,
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 10,
//     },
//     shadowOpacity: 0.2,
//     shadowRadius: 20,
//     elevation: 10,
//   },
//   formContainer: {
//     flex: 1,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "700",
//     color: "#FF3366",
//     marginBottom: 10,
//     textAlign: "center",
//   },
//   subtitle: {
//     fontSize: 16,
//     color: "#666",
//     marginBottom: 30,
//     textAlign: "center",
//   },
//   inputContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#F8F8F8",
//     borderRadius: 15,
//     marginBottom: 15,
//     paddingHorizontal: 15,
//     borderWidth: 1,
//     borderColor: "#EEE",
//   },
//   inputIcon: {
//     marginRight: 10,
//   },
//   input: {
//     flex: 1,
//     height: 50,
//     color: "#333",
//   },
//   linkText: {
//     color: "#FF3366",
//     textAlign: "right",
//     marginBottom: 20,
//     fontWeight: "500",
//   },
//   button: {
//     borderRadius: 15,
//     overflow: "hidden",
//     marginBottom: 20,
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 3,
//     },
//     shadowOpacity: 0.3,
//     shadowRadius: 5,
//     elevation: 5,
//   },
//   buttonGradient: {
//     paddingVertical: 16,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   buttonText: {
//     color: "#FFFFFF",
//     fontSize: 18,
//     fontWeight: "700",
//   },
//   footer: {
//     flexDirection: "row",
//     justifyContent: "center",
//     marginTop: 10,
//   },
//   footerText: {
//     color: "#666",
//   },
//   footerLink: {
//     color: "#FF3366",
//     fontWeight: "600",
//   },
//   codeContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 30,
//   },
//   codeInputWrapper: {
//     width: 45,
//     height: 50,
//     borderRadius: 10,
//     backgroundColor: "#F8F8F8",
//     justifyContent: "center",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "#EEE",
//   },
//   codeInput: {
//     width: "100%",
//     height: "100%",
//     textAlign: "center",
//     fontSize: 18,
//     fontWeight: "700",
//     color: "#333",
//   },
// });

// AuthScreen.js

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import { authAPI } from './api';
import { storage } from './storage';

// Main authentication component with navigation
export default function AuthScreen({ navigation }) {
  const [currentScreen, setCurrentScreen] = useState("signin");
  const [isLoading, setIsLoading] = useState(false);

  const renderScreen = () => {
    switch (currentScreen) {
      case "signup":
        return <SignUpScreen 
          goToSignIn={() => setCurrentScreen("signin")} 
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />;
      case "reset":
        return (
          <ResetPasswordScreen goToSignIn={() => setCurrentScreen("signin")} />
        );
      case "verify":
        return <VerifyEmailScreen goToSignIn={() => setCurrentScreen("signin")} />;
      default:
        return (
          <SignInScreen
            goToSignUp={() => setCurrentScreen("signup")}
            goToReset={() => setCurrentScreen("reset")}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            navigation={navigation}
          />
        );
    }
  };

  return (
    <LinearGradient
      colors={["#FF3366", "#FF6F00", "#FF3366"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.logoContainer}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>❤️</Text>
        </View>
        <Text style={styles.appName}>eDate</Text>
      </View>

      <View style={styles.card}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {renderScreen()}
        </ScrollView>
      </View>
    </LinearGradient>
  );
}

// Sign In Screen
function SignInScreen({ goToSignUp, goToReset, isLoading, setIsLoading, navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (!email.includes('@')) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      const response = await authAPI.login(email, password);
      
      // Store tokens and user data using async storage
      await storage.setTokens(response.access, response.refresh);
      await storage.setUser(response.user);
      
      Alert.alert("Success", "Logged in successfully!");
      
      // Navigate to main app screen
      // navigation.navigate('Main');
      
    } catch (error) {
      Alert.alert("Login Failed", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.formContainer}
    >
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Sign in to continue your journey</Text>

      <View style={styles.inputContainer}>
        <Icon name="email" size={20} color="#FF3366" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isLoading}
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="#FF3366" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!isLoading}
        />
      </View>

      <TouchableOpacity onPress={goToReset} disabled={isLoading}>
        <Text style={[styles.linkText, isLoading && styles.disabledText]}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]} 
        onPress={handleSignIn}
        disabled={isLoading}
      >
        <LinearGradient
          colors={["#FF3366", "#FF6F00"]}
          style={styles.buttonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account? </Text>
        <TouchableOpacity onPress={goToSignUp} disabled={isLoading}>
          <Text style={[styles.footerLink, isLoading && styles.disabledText]}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

// Sign Up Screen
function SignUpScreen({ goToSignIn, isLoading, setIsLoading }) {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    phone_number: "",
    password: "",
    confirmPassword: "",
    bio: "",
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSignUp = async () => {
    const { email, username, phone_number, password, confirmPassword } = formData;

    // Frontend validation
    if (!email || !username || !phone_number || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    if (!email.includes('@')) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password should be at least 6 characters long");
      return;
    }

    if (username.length < 3) {
      Alert.alert("Error", "Username should be at least 3 characters long");
      return;
    }

    setIsLoading(true);
    try {
      // Prepare data for backend (exclude confirmPassword and handle empty bio)
      const submitData = {
        email: formData.email,
        username: formData.username,
        phone_number: formData.phone_number,
        password: formData.password,
        bio: formData.bio || '', // Send empty string if bio is not provided
      };

      console.log('Submitting registration data:', submitData);
      
      const response = await authAPI.register(submitData);
      
      Alert.alert(
        "Success", 
        "Account created successfully! Please sign in.",
        [
          {
            text: "OK",
            onPress: goToSignIn
          }
        ]
      );
      
    } catch (error) {
      Alert.alert("Registration Failed", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.formContainer}
    >
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Join eDate to find your perfect match</Text>

      <View style={styles.inputContainer}>
        <Icon name="email" size={20} color="#FF3366" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Email *"
          placeholderTextColor="#999"
          value={formData.email}
          onChangeText={(value) => handleInputChange('email', value)}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isLoading}
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="person" size={20} color="#FF3366" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Username *"
          placeholderTextColor="#999"
          value={formData.username}
          onChangeText={(value) => handleInputChange('username', value)}
          autoCapitalize="none"
          editable={!isLoading}
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="phone" size={20} color="#FF3366" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Phone Number *"
          placeholderTextColor="#999"
          value={formData.phone_number}
          onChangeText={(value) => handleInputChange('phone_number', value)}
          keyboardType="phone-pad"
          editable={!isLoading}
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="info" size={20} color="#FF3366" style={styles.inputIcon} />
        <TextInput
          style={[styles.input, styles.bioInput]}
          placeholder="Bio (Optional)"
          placeholderTextColor="#999"
          value={formData.bio}
          onChangeText={(value) => handleInputChange('bio', value)}
          multiline
          numberOfLines={3}
          editable={!isLoading}
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="#FF3366" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Password *"
          placeholderTextColor="#999"
          value={formData.password}
          onChangeText={(value) => handleInputChange('password', value)}
          secureTextEntry
          editable={!isLoading}
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="#FF3366" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password *"
          placeholderTextColor="#999"
          value={formData.confirmPassword}
          onChangeText={(value) => handleInputChange('confirmPassword', value)}
          secureTextEntry
          editable={!isLoading}
        />
      </View>

      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]} 
        onPress={handleSignUp}
        disabled={isLoading}
      >
        <LinearGradient
          colors={["#FF3366", "#FF6F00"]}
          style={styles.buttonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Sign Up</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <TouchableOpacity onPress={goToSignIn} disabled={isLoading}>
          <Text style={[styles.footerLink, isLoading && styles.disabledText]}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

// ... (ResetPasswordScreen and VerifyEmailScreen remain the same as previous example)

const styles = StyleSheet.create({
  // ... (styles remain the same as previous example)
});