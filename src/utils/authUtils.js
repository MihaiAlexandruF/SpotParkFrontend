import api from '../services/api';

export const handleLogin = async (values, setLoading, login, Alert) => {
  try {
    setLoading(true);
    console.log("Sending login request with:", values);
    console.log("Trimit cerere login...");
    const response = await api.post("/auth/login", {
      usernameOrEmail: values.usernameOrEmail,
      password: values.password,
    });
    console.log("Răspuns de la server:", response.data);
    await login(response.data);
  } catch (error) {
    console.log("EROARE LA LOGIN:", error);
    let errorMessage = "Authentication failed";
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    Alert.alert("Eroare", errorMessage);
  } finally {
    setLoading(false);
  }
};



export const handleRegister = async (values, setLoading, navigation, Alert) => {
  try {
    setLoading(true);
    await api.post("/auth/register", {
      username: values.username,
      email: values.email,
      password: values.password,
    });
    Alert.alert("Success", "Account created successfully! You can now log in.");
    navigation.navigate("Login");
  } catch (error) {
    let errorMessage = "Registration failed";
    if (error.response) {
      errorMessage = error.response.data || errorMessage;
    }
    Alert.alert("Error", errorMessage);
  } finally {
    setLoading(false);
  }
};

export const handleSocialSignup = (provider, Alert) => {
  Alert.alert("Social Signup", `${provider} signup will be implemented soon`);
}; 