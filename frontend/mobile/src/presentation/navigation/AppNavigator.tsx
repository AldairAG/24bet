import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { useColorScheme } from 'react-native'; // Importante
import HomeScreen from '../screens/HomeScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import RecoveryPasswordScreen from '../screens/RecoveryPasswordScreen';
import SupportScreen from '../screens/SupportScreen';
import MainTabNavigator from './MainTabNavigator';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    const scheme = useColorScheme();

    return (
        <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>

            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{
                        title: 'Bienvenido',
                        headerTitleAlign: 'center',
                        headerTitleStyle: { color: '#d32f2f', fontSize: 28, fontWeight: 'bold' }
                    }}
                />
                <Stack.Screen
                    name="Register"
                    component={RegisterScreen}
                    options={{ title: '' }}
                />
                <Stack.Screen
                    name="RecoveryPassword"
                    component={RecoveryPasswordScreen}
                    options={{ 
                        headerShown: false,
                        presentation: 'modal'
                    }}
                />
                <Stack.Screen
                    name="ProfileScreen"
                    component={ProfileScreen}
                    options={{ 
                        title: '',
                        headerTitleAlign: 'center',
                        headerTitleStyle: { color: '#d32f2f', fontSize: 20, fontWeight: 'bold' }
                    }}
                />
                <Stack.Screen
                    name="EditProfile"
                    component={EditProfileScreen}
                    options={{ 
                        title: '',
                        headerTitleAlign: 'center',
                        headerTitleStyle: { color: '#d32f2f', fontSize: 20, fontWeight: 'bold' }
                    }}
                />
                <Stack.Screen
                    name="Support"
                    component={SupportScreen}
                    options={{ 
                        headerShown: false
                    }}
                />
                <Stack.Screen
                    name="MainTab"
                    component={MainTabNavigator}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
        
    );
}