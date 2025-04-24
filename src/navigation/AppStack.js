import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import OwnerDashboard from '../screens/OwnerDashboard';

const Stack = createStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
  <Stack.Screen name="Map" component={SpotParkMapScreen} />
  <Stack.Screen name="Dashboard" component={OwnerDashboard} />
</Stack.Navigator>

  );
}
