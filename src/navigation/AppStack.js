import { createStackNavigator } from "@react-navigation/stack"
import SpotParkMapScreen from "../screens/SpotParkMapScreen"
import OwnerDashboard from "../screens/OwnerDashboard"
import ProfileScreen from "../screens/ProfileScreen"
import AddParkingSpotScreen from "../screens/AddParkingSpotScreen"

const Stack = createStackNavigator()

export default function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Map" component={SpotParkMapScreen} />
      <Stack.Screen name="Dashboard" component={OwnerDashboard} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="AddParkingSpot" component={AddParkingSpotScreen} />
    </Stack.Navigator>
  )
}
