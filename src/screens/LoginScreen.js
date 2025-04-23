"use client"

import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from "react-native"
import * as yup from "yup"
import { Formik } from "formik"
import api from "../services/api"
import { useAuth } from "../auth/AuthContext"
import { Ionicons } from "@expo/vector-icons"

const loginSchema = yup.object().shape({
  usernameOrEmail: yup.string().required("Email or username is required"),
  password: yup.string().required("Password is required"),
})

export default function LoginScreen({ navigation }) {
  const [loading, setLoading] = useState(false)
  const { setAuthenticated } = useAuth()
  const [secureTextEntry, setSecureTextEntry] = useState(true)

  const handleLogin = async (values) => {
    try {
      setLoading(true)
      console.log("Sending login request with:", values);

      console.log("Trimit cerere login...");

      const response = await api.post("/auth/login", {
        usernameOrEmail: values.usernameOrEmail,
        password: values.password,
      })

      console.log("Răspuns de la server:", response.data);

      await login(response.data);
      
      navigation.navigate("Dashboard")
    } catch (error) {
      let errorMessage = "Authentication failed"
      if (error.response?.data) {
        errorMessage = error.response.data
      }
      Alert.alert("Error", errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = (provider) => {
    Alert.alert("Social Login", `${provider} login will be implemented soon`)
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoidingView}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>SpotPark</Text>
            <Text style={styles.tagline}>Find your perfect parking spot</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.title}>Welcome back</Text>

            <Formik
              initialValues={{ usernameOrEmail: "", password: "" }}
              validationSchema={loginSchema}
              onSubmit={handleLogin}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <>
                  <View style={styles.inputContainer}>
                    <Ionicons name="person-outline" size={20} color="#A0A0A0" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Email or username"
                      placeholderTextColor="#808080"
                      value={values.usernameOrEmail}
                      onChangeText={handleChange("usernameOrEmail")}
                      onBlur={handleBlur("usernameOrEmail")}
                      autoCapitalize="none"
                      keyboardType="email-address"
                    />
                  </View>
                  {touched.usernameOrEmail && errors.usernameOrEmail && (
                    <Text style={styles.errorText}>{errors.usernameOrEmail}</Text>
                  )}

                  <View style={styles.inputContainer}>
                    <Ionicons name="lock-closed-outline" size={20} color="#A0A0A0" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Password"
                      placeholderTextColor="#808080"
                      secureTextEntry={secureTextEntry}
                      value={values.password}
                      onChangeText={handleChange("password")}
                      onBlur={handleBlur("password")}
                    />
                    <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)} style={styles.eyeIcon}>
                      <Ionicons name={secureTextEntry ? "eye-outline" : "eye-off-outline"} size={20} color="#A0A0A0" />
                    </TouchableOpacity>
                  </View>
                  {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

                  <TouchableOpacity style={styles.forgotPassword}>
                    <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.loginButton} onPress={handleSubmit} disabled={loading}>
                    {loading ? <ActivityIndicator color="black" /> : <Text style={styles.loginButtonText}>Log In</Text>}
                  </TouchableOpacity>
                </>
              )}
            </Formik>

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.divider} />
            </View>

            <View style={styles.socialButtonsContainer}>
              <TouchableOpacity style={styles.socialButton} onPress={() => handleSocialLogin("Google")}>
                <Ionicons name="logo-google" size={20} color="#E0E0E0" />
                <Text style={styles.socialButtonText}>Google</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialButton} onPress={() => handleSocialLogin("Apple")}>
                <Ionicons name="logo-apple" size={20} color="#E0E0E0" />
                <Text style={styles.socialButtonText}>Apple</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                <Text style={styles.signupLink}>Sign up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212", // Dark background
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 60,
    marginBottom: 40,
  },
  logoText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF", // White text for logo
    fontFamily: "EuclidCircularB-Bold",
  },
  tagline: {
    fontSize: 16,
    color: "#B0B0B0", // Light gray for secondary text
    marginTop: 8,
    fontFamily: "EuclidCircularB-Regular",
  },
  formContainer: {
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#FFFFFF", // White text for headings
    fontFamily: "EuclidCircularB-Bold",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333333", // Darker border for inputs
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: "#1E1E1E", // Slightly lighter than background
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: "#FFFFFF", // White text for input
    fontFamily: "EuclidCircularB-Regular",
  },
  eyeIcon: {
    padding: 8,
  },
  errorText: {
    color: "#FF6B6B", // Brighter red for errors on dark background
    fontSize: 14,
    marginTop: -8,
    marginBottom: 16,
    marginLeft: 4,
    fontFamily: "EuclidCircularB-Regular",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: "#4DA6FF", // Brighter blue for links
    fontSize: 14,
    fontFamily: "EuclidCircularB-Medium",
  },
  loginButton: {
    backgroundColor: "#FFFC00", // Snapchat yellow
    borderRadius: 12,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  loginButtonText: {
    color: "#000000", // Black text on yellow button
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "EuclidCircularB-Bold",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#333333", // Darker divider
  },
  dividerText: {
    marginHorizontal: 16,
    color: "#B0B0B0", // Light gray text
    fontSize: 14,
    fontFamily: "EuclidCircularB-Regular",
  },
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#333333", // Darker border
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    width: "48%",
    backgroundColor: "#252525", // Slightly lighter than background
  },
  socialButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: "EuclidCircularB-Medium",
    color: "#E0E0E0", // Light gray text
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 32,
  },
  signupText: {
    color: "#B0B0B0", // Light gray text
    fontSize: 14,
    fontFamily: "EuclidCircularB-Regular",
  },
  signupLink: {
    color: "#FFFC00", // Snapchat yellow
    fontWeight: "bold",
    fontSize: 14,
    fontFamily: "EuclidCircularB-Bold",
  },
})
