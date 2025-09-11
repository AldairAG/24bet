import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { useColorScheme, View, Text, StyleSheet } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

// Importar todas las pantallas
import RegisterScreen from '../screens/auth/RegisterScreen';
import ProfileScreen from '../screens/usuario/ProfileScreen';
import EditProfileScreen from '../screens/usuario/EditProfileScreen';
import RecoveryPasswordScreen from '../screens/auth/RecoveryPasswordScreen';
import SupportScreen from '../screens/usuario/SupportScreen';
import DocumentsScreen from '../screens/usuario/DocumentsScreen';
import DepositoScreen from '../screens/transacciones/DepositoScreen';
import RetiroScreen from '../screens/transacciones/RetiroScreen';
import MenuScreen from '../screens/usuario/MenuScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import CasinoNavigation from './DeportesNavigation';

// Tipos de navegación
export type RootStackParamList = {
    AuthFlow: undefined;
    MainApp: undefined;
};

export type AuthStackParamList = {
    Login: undefined;
    Register: undefined;
    RecoveryPassword: undefined;
};

export type MainTabParamList = {
    Casino: undefined;
    Deposito: undefined;
    Retiro: undefined;
    Menu: undefined;
    ProfileStack: undefined;
};

export type ProfileStackParamList = {
    Profile: undefined;
    EditProfile: undefined;
    Support: undefined;
    Documents: undefined;
};

// Constantes
const COLORS = {
    primary: '#d32f2f',
    inactive: 'gray',
} as const;

const TAB_ICONS = {
    Casino: (props: { color: string; size: number }) => (
        <Ionicons name="home" {...props} />
    ),
    Deposito: (props: { color: string; size: number }) => (
        <MaterialIcons name="attach-money" {...props} />
    ),
    Retiro: (props: { color: string; size: number }) => (
        <MaterialIcons name="account-balance-wallet" {...props} />
    ),
    Menu: (props: { color: string; size: number }) => (
        <Ionicons name="menu" {...props} />
    ),
    ProfileStack: (props: { color: string; size: number }) => (
        <Ionicons name="person-circle-outline" {...props} />
    ),
} as const;

// Componente DummyScreen
const DummyScreen = React.memo<{ title: string }>(({ title }) => (
    <View style={styles.dummyContainer}>
        <Text style={styles.dummyText}>{title}</Text>
    </View>
));

// Navegadores
const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

// Stack de Autenticación (sin tabs)
function AuthStackNavigator() {
    return (
        <AuthStack.Navigator initialRouteName="Login">
            <AuthStack.Screen
                name="Login"
                component={LoginScreen}
                options={{
                    title: 'Bienvenido',
                    headerTitleAlign: 'center',
                    headerTitleStyle: { 
                        color: COLORS.primary, 
                        fontSize: 28, 
                        fontWeight: 'bold' 
                    }
                }}
            />
            <AuthStack.Screen
                name="Register"
                component={RegisterScreen}
                options={{ title: '' }}
            />
            <AuthStack.Screen
                name="RecoveryPassword"
                component={RecoveryPasswordScreen}
                options={{ 
                    headerShown: false,
                    presentation: 'modal'
                }}
            />
        </AuthStack.Navigator>
    );
}

// Stack del Perfil (anidado en el tab)
function ProfileStackNavigator() {
    return (
        <ProfileStack.Navigator>
            <ProfileStack.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ 
                    title: 'Perfil',
                    headerTitleAlign: 'center',
                    headerTitleStyle: { 
                        color: COLORS.primary, 
                        fontSize: 20, 
                        fontWeight: 'bold' 
                    }
                }}
            />
            <ProfileStack.Screen
                name="EditProfile"
                component={EditProfileScreen}
                options={{ 
                    title: 'Editar Perfil',
                    headerTitleAlign: 'center',
                    headerTitleStyle: { 
                        color: COLORS.primary, 
                        fontSize: 20, 
                        fontWeight: 'bold' 
                    }
                }}
            />
            <ProfileStack.Screen
                name="Support"
                component={SupportScreen}
                options={{ 
                    title: 'Soporte',
                    headerTitleAlign: 'center',
                    headerTitleStyle: { 
                        color: COLORS.primary, 
                        fontSize: 20, 
                        fontWeight: 'bold' 
                    }
                }}
            />
            <ProfileStack.Screen
                name="Documents"
                component={DocumentsScreen}
                options={{ 
                    title: 'Mis Documentos',
                    headerTitleAlign: 'center',
                    headerTitleStyle: { 
                        color: COLORS.primary, 
                        fontSize: 20, 
                        fontWeight: 'bold' 
                    }
                }}
            />
        </ProfileStack.Navigator>
    );
}

// Tab Navigator Principal (siempre visible)
function MainTabNavigator() {
    const colorScheme = useColorScheme();
    
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.inactive,
                headerShown: false,
                tabBarIcon: ({ color, size }) => {
                    const IconComponent = TAB_ICONS[route.name as keyof typeof TAB_ICONS];
                    return IconComponent ? <IconComponent color={color} size={size} /> : null;
                },
                tabBarLabelStyle: styles.tabBarLabel,
                tabBarStyle: [
                    styles.tabBar,
                    {
                        backgroundColor: colorScheme === 'dark' ? '#222' : '#ffffff',
                        borderTopColor: colorScheme === 'dark' ? '#333' : '#e0e0e0',
                    }
                ],
            })}
        >
            <Tab.Screen 
                name="Casino" 
                component={CasinoNavigation}
                options={{ 
                    tabBarLabel: 'Casino',
                    headerShown: false,
                }}
            />
            <Tab.Screen 
                name="Deposito" 
                component={DepositoScreen}
                options={{ 
                    tabBarLabel: 'Depósito',
                    headerShown: true,
                    headerTitle: 'Depósito',
                    headerTitleAlign: 'center',
                    headerTitleStyle: { 
                        color: COLORS.primary, 
                        fontSize: 20, 
                        fontWeight: 'bold' 
                    }
                }}
            />
            <Tab.Screen 
                name="Retiro" 
                component={RetiroScreen}
                options={{ 
                    tabBarLabel: 'Retiro',
                    headerShown: true,
                    headerTitle: 'Retiro',
                    headerTitleAlign: 'center',
                    headerTitleStyle: { 
                        color: COLORS.primary, 
                        fontSize: 20, 
                        fontWeight: 'bold' 
                    }
                }}
            />
            <Tab.Screen 
                name="Menu" 
                component={MenuScreen}
                options={{ tabBarLabel: 'Menú' }}
            />
            <Tab.Screen 
                name="ProfileStack" 
                component={ProfileStackNavigator}
                options={{ tabBarLabel: 'Perfil' }}
            />
        </Tab.Navigator>
    );
}

// Navegador Principal
export default function AppNavigator() {
    const scheme = useColorScheme();

    return (
        <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
            <RootStack.Navigator 
                initialRouteName="AuthFlow"
                screenOptions={{ headerShown: false }}
            >
                {/* Flujo de Autenticación - Sin Tabs */}
                <RootStack.Screen
                    name="AuthFlow"
                    component={AuthStackNavigator}
                />
                
                {/* Aplicación Principal - Con Tabs Siempre Visibles */}
                <RootStack.Screen
                    name="MainApp"
                    component={MainTabNavigator}
                />
            </RootStack.Navigator>
        </NavigationContainer>
    );
}

// Estilos
const styles = StyleSheet.create({
    dummyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
    },
    dummyText: {
        fontSize: 24,
        fontWeight: '600',
        color: '#333',
    },
    tabBarLabel: {
        fontSize: 12,
        fontWeight: '500',
    },
    tabBar: {
        borderTopWidth: 1,
        height: 60,
        paddingBottom: 8,
        paddingTop: 8,
    },
});