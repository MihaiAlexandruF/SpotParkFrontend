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

import { registerSchema } from "../utils/validationSchemas";
import { handleRegister, handleSocialSignup } from "../utils/authUtils";

export default function RegisterScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [secureConfirmTextEntry, setSecureConfirmTextEntry] = useState(true);

  const onRegister = async (values) => {
    await handleRegister(values, setLoading, navigation, Alert);
  };

  const onSocialSignup = (provider) => {
    handleSocialSignup(provider, Alert);
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
            <Text style={styles.tagline}>Creează-ți un cont</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.title}>Înregistrare</Text>

            <Formik
              initialValues={{
                username: "",
                email: "",
                password: "",
                confirmPassword: "",
              }}
              validationSchema={registerSchema}
              onSubmit={onRegister}
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
                      placeholder="Nume utilizator"
                      placeholderTextColor="#808080"
                      value={values.username}
                      onChangeText={handleChange("username")}
                      onBlur={handleBlur("username")}
                      autoCapitalize="none"
                    />
                  </View>
                  {touched.username && errors.username && (
                    <Text style={styles.errorText}>{errors.username}</Text>
                  )}

                  <View style={styles.inputContainer}>
                    <Ionicons
                      name="mail-outline"
                      size={20}
                      color="#A0A0A0"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Email"
                      placeholderTextColor="#808080"
                      value={values.email}
                      onChangeText={handleChange("email")}
                      onBlur={handleBlur("email")}
                      autoCapitalize="none"
                      keyboardType="email-address"
                    />
                  </View>
                  {touched.email && errors.email && (
                    <Text style={styles.errorText}>{errors.email}</Text>
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

                  <View style={styles.inputContainer}>
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color="#A0A0A0"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Confirmă parola"
                      placeholderTextColor="#808080"
                      secureTextEntry={secureConfirmTextEntry}
                      value={values.confirmPassword}
                      onChangeText={handleChange("confirmPassword")}
                      onBlur={handleBlur("confirmPassword")}
                    />
                    <TouchableOpacity
                      onPress={() =>
                        setSecureConfirmTextEntry(!secureConfirmTextEntry)
                      }
                      style={styles.eyeIcon}
                    >
                      <Ionicons
                        name={
                          secureConfirmTextEntry
                            ? "eye-outline"
                            : "eye-off-outline"
                        }
                        size={20}
                        color="#A0A0A0"
                      />
                    </TouchableOpacity>
                  </View>
                  {touched.confirmPassword && errors.confirmPassword && (
                    <Text style={styles.errorText}>
                      {errors.confirmPassword}
                    </Text>
                  )}

                  <TouchableOpacity
                    style={styles.registerButton}
                    onPress={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="black" />
                    ) : (
                      <Text style={styles.registerButtonText}>
                        Creează cont
                      </Text>
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
                onPress={() => onSocialSignup("Google")}
              >
                <Ionicons name="logo-google" size={20} color="#E0E0E0" />
                <Text style={styles.socialButtonText}>
                  Continuă cu Google
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Ai deja un cont? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.loginLink}>Autentificare</Text>
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
    backgroundColor: "#121212", // Dark background
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 30,
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
  registerButton: {
    backgroundColor: "#FFFC00", // Snapchat yellow
    borderRadius: 12,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  registerButtonText: {
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
    width: "100%",
    backgroundColor: "#252525", // Slightly lighter than background
  },
  socialButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: "EuclidCircularB-Medium",
    color: "#E0E0E0", // Light gray text
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 32,
  },
  loginText: {
    color: "#B0B0B0", // Light gray text
    fontSize: 14,
    fontFamily: "EuclidCircularB-Regular",
  },
  loginLink: {
    color: "#FFFC00", // Snapchat yellow
    fontWeight: "bold",
    fontSize: 14,
    fontFamily: "EuclidCircularB-Bold",
  },
})
