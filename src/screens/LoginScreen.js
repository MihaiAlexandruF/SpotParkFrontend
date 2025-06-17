"use client";

import { useState } from "react";
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
} from "react-native";
import { Formik } from "formik";
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "../auth/AuthContext";
import { loginSchema } from "../utils/validationSchemas";
import { handleLogin, handleSocialLogin } from "../utils/authUtils";

export default function LoginScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const { login } = useAuth();

  const onLogin = async (values) => {
    await handleLogin(values, setLoading, login, Alert);
  };

  const onSocialLogin = (provider) => {
    handleSocialLogin(provider, Alert);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>SpotPark</Text>
            <Text style={styles.tagline}>Găsește locul perfect de parcare</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.title}>Bine ai revenit</Text>

            <Formik
              initialValues={{ usernameOrEmail: "", password: "" }}
              validationSchema={loginSchema}
              onSubmit={onLogin}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
              }) => (
                <>
                  <View style={styles.inputContainer}>
                    <Ionicons
                      name="person-outline"
                      size={20}
                      color="#A0A0A0"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Email sau nume utilizator"
                      placeholderTextColor="#808080"
                      value={values.usernameOrEmail}
                      onChangeText={handleChange("usernameOrEmail")}
                      onBlur={handleBlur("usernameOrEmail")}
                      autoCapitalize="none"
                      keyboardType="email-address"
                    />
                  </View>
                  {touched.usernameOrEmail && errors.usernameOrEmail && (
                    <Text style={styles.errorText}>
                      {errors.usernameOrEmail}
                    </Text>
                  )}

                  <View style={styles.inputContainer}>
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color="#A0A0A0"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Parolă"
                      placeholderTextColor="#808080"
                      secureTextEntry={secureTextEntry}
                      value={values.password}
                      onChangeText={handleChange("password")}
                      onBlur={handleBlur("password")}
                    />
                    <TouchableOpacity
                      onPress={() => setSecureTextEntry(!secureTextEntry)}
                      style={styles.eyeIcon}
                    >
                      <Ionicons
                        name={
                          secureTextEntry ? "eye-outline" : "eye-off-outline"
                        }
                        size={20}
                        color="#A0A0A0"
                      />
                    </TouchableOpacity>
                  </View>
                  {touched.password && errors.password && (
                    <Text style={styles.errorText}>{errors.password}</Text>
                  )}

                  <TouchableOpacity style={styles.forgotPassword}>
                    <Text style={styles.forgotPasswordText}>
                      Ai uitat parola?
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.loginButton}
                    onPress={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="black" />
                    ) : (
                      <Text style={styles.loginButtonText}>Autentificare</Text>
                    )}
                  </TouchableOpacity>
                </>
              )}
            </Formik>

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>sau continuă cu</Text>
              <View style={styles.divider} />
            </View>

            <View style={styles.socialButtonsContainer}>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => onSocialLogin("Google")}
              >
                <Ionicons name="logo-google" size={20} color="#E0E0E0" />
                <Text style={styles.socialButtonText}>
                  Continuă cu Google
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Nu ai cont?</Text>
              <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                <Text style={styles.signupLink}> Creează cont</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
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
    color: "#FFFFFF",
    fontFamily: "EuclidCircularB-Bold",
  },
  tagline: {
    fontSize: 16,
    color: "#B0B0B0",
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
    color: "#FFFFFF",
    fontFamily: "EuclidCircularB-Bold",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333333",
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: "#1E1E1E",
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: "#FFFFFF",
    fontFamily: "EuclidCircularB-Regular",
  },
  eyeIcon: {
    padding: 8,
  },
  errorText: {
    color: "#FF6B6B",
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
    color: "#4DA6FF",
    fontSize: 14,
    fontFamily: "EuclidCircularB-Medium",
  },
  loginButton: {
    backgroundColor: "#FFFC00",
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
    color: "#000000",
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
    backgroundColor: "#333333",
  },
  dividerText: {
    marginHorizontal: 16,
    color: "#B0B0B0",
    fontSize: 14,
    fontFamily: "EuclidCircularB-Regular",
  },
  socialButtonsContainer: {
    marginBottom: 32,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#333333",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#252525",
    width: "100%",
  },
  socialButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: "EuclidCircularB-Medium",
    color: "#E0E0E0",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 32,
  },
  signupText: {
    color: "#B0B0B0",
    fontSize: 14,
    fontFamily: "EuclidCircularB-Regular",
  },
  signupLink: {
    color: "#FFFC00",
    fontWeight: "bold",
    fontSize: 14,
    fontFamily: "EuclidCircularB-Bold",
  },
});
