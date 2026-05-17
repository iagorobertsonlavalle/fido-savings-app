import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import OnboardingScreen from '../screens/OnboardingScreen';
import HomeScreen from '../screens/HomeScreen';
import FirstDepositScreen from '../screens/FirstDepositScreen';
import MoMoOverflowScreen from '../screens/MoMoOverflowScreen';
import TermSavingsScreen from '../screens/TermSavingsScreen';
import GoalSavingsScreen from '../screens/GoalSavingsScreen';
import DashboardScreen from '../screens/DashboardScreen';
import TrustedProgressScreen from '../screens/TrustedProgressScreen';
import SharedSusuScreen from '../screens/SharedSusuScreen';
import LoanLinkedScreen from '../screens/LoanLinkedScreen';
import OfflineSavingsScreen from '../screens/OfflineSavingsScreen';
import FidoScoreScreen from '../screens/FidoScoreScreen';
import FamilyViewScreen from '../screens/FamilyViewScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="FirstDeposit" component={FirstDepositScreen} />
        <Stack.Screen name="MoMoOverflow" component={MoMoOverflowScreen} />
        <Stack.Screen name="TermSavings" component={TermSavingsScreen} />
        <Stack.Screen name="GoalSavings" component={GoalSavingsScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="TrustedProgress" component={TrustedProgressScreen} />
        <Stack.Screen name="SharedSusu" component={SharedSusuScreen} />
        <Stack.Screen name="LoanLinked" component={LoanLinkedScreen} />
        <Stack.Screen name="OfflineSavings" component={OfflineSavingsScreen} />
        <Stack.Screen name="FidoScore" component={FidoScoreScreen} />
        <Stack.Screen name="FamilyView" component={FamilyViewScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
