import { useState, useEffect, useCallback } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { View, Text, ActivityIndicator } from "react-native"
import * as Font from "expo-font"
import * as SplashScreen from "expo-splash-screen"
import LoginScreen from "./src/screens/LoginScreen"
import RegisterScreen from "./src/screens/RegisterScreen"
import OwnerDashboard from "./src/screens/OwnerDashboard"
import AuthGuard from "./src/components/AuthGuard"
import { AuthProvider } from "./src/auth/AuthContext"

SplashScreen.preventAutoHideAsync()

const Stack = createStackNavigator()

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false)

  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync({
          "EuclidCircularB-Regular": require("./assets/fonts/Euclid Circular B Regular.ttf"),
          "EuclidCircularB-Medium": require("./assets/fonts/Euclid Circular B Medium.ttf"),
          "EuclidCircularB-Bold": require("./assets/fonts/Euclid Circular B Bold.ttf"),
        })
      } catch (e) {
        console.warn(e)
      } finally {
        setAppIsReady(true)
      }
    }
    

    prepare()
  }, [])

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync()
    }
  }, [appIsReady])

  if (!appIsReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#121212" }}>
        <ActivityIndicator size="large" color="#FFFC00" />
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <AuthProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Dashboard" options={{ headerShown: false }}>
              {() => (
                <AuthGuard>
                  <OwnerDashboard />
                </AuthGuard>
              )}
            </Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
    </View>
  )
}
