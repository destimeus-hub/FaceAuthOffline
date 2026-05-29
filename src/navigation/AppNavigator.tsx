import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import DashboardScreen from '../screens/DashboardScreen';
import EnrollmentScreen from '../screens/EnrollmentScreen';
import VerificationScreen from '../screens/VerificationScreen';
import AuthLogScreen from '../screens/AuthLogScreen';
import SettingsScreen from '../screens/SettingsScreen';
import BenchmarkScreen from '../screens/BenchmarkScreen';
import ArchitectureScreen from '../screens/ArchitectureScreen';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Main: undefined;
  Enrollment: undefined;
  Verification: undefined;
  AuthLog: undefined;
  Settings: undefined;
  Benchmark: undefined;
  Architecture: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          cardStyle: {backgroundColor: '#0A0A0F'},
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}>
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{
            cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
          }}
        />
        <Stack.Screen
          name="Onboarding"
          component={OnboardingScreen}
          options={{
            cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
          }}
        />
        <Stack.Screen
          name="Main"
          component={DashboardScreen}
          options={{
            cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
          }}
        />
        <Stack.Screen name="Enrollment" component={EnrollmentScreen} />
        <Stack.Screen name="Verification" component={VerificationScreen} />
        <Stack.Screen name="AuthLog" component={AuthLogScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Benchmark" component={BenchmarkScreen} />
        <Stack.Screen name="Architecture" component={ArchitectureScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
