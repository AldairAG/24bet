import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, Text, StyleSheet, useColorScheme, Image } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import EventosEnVivoScreen from '../screens/EventosEnVivoScreen';
import MisApuestasScreen from '../screens/MisApuestasScreen';
import DeportesScreen from '../screens/DeportesScreen';
import SportEventsScreen from '../screens/SportEventsScreen';
import EventDetailScreen from '../screens/EventDetailScreen';
import SportManager, { ComponenteDeporte } from '../screens/SportManager';
import BoletoApuestas from '../components/items/BoletoApuestas';

// Componente del icono del header
const HeaderIcon = React.memo(() => (
    <View style={styles.headerIconContainer}>
        <Image
            source={require('../../assets/Mesa-de-trabajo.png')}
            style={styles.headerIcon}
            resizeMode="contain"
        />
    </View>
));

// Tipos de navegación para el stack principal
export type MainCasinoStackParamList = {
    CasinoTabs: undefined;
    DeportesScreen: { selectedSportId?: string } | undefined;
    SportEvents: {
        sport: {
            id: string;
            name: string;
            icon: string;
            eventCount: number;
        };
    };
    EventDetail: {
        event: {
            id: string;
            title: string;
            league: string;
            date: string;
            time: string;
            status: 'upcoming' | 'live' | 'finished';
            isLive?: boolean;
            score?: string;
            homeTeam: string;
            awayTeam: string;
            venue?: string;
        };
    };
    SportManager: {
        deporte: string;
        region: string;
        liga: string;
        evento?: string;
    };
    ligasByDeporte:{
        deporteId:string
    }

};

// Tipos para los tabs superiores del casino
export type CasinoTabParamList = {
    Inicio: undefined;
    EnVivo: undefined;
    MisApuestas: undefined;
    Deportes: { selectedSportId?: string } | undefined;
};

// Tipos adicionales para pantallas específicas
export type DeportesScreenParams = {
    selectedSportId?: string;
};

const MainCasinoStack = createNativeStackNavigator<MainCasinoStackParamList>();
const CasinoTab = createMaterialTopTabNavigator<CasinoTabParamList>();

// Navegador de tabs para las secciones principales del casino
function CasinoTabNavigator() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    return (
        <View style={{ flex: 1 }}>
            <CasinoTab.Navigator
                screenOptions={{
                    tabBarActiveTintColor: '#d32f2f',
                    tabBarInactiveTintColor: isDark ? '#888' : '#666',
                    tabBarStyle: {
                        backgroundColor: isDark ? '#1e1e1e' : 'white',
                        borderBottomWidth: 1,
                        borderBottomColor: isDark ? '#333' : '#e0e0e0',
                        elevation: 4,
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                    },
                    tabBarLabelStyle: {
                        fontSize: 14,
                        fontWeight: '600',
                        textTransform: 'none',
                    },
                    tabBarIndicatorStyle: {
                        backgroundColor: '#d32f2f',
                        height: 3,
                        borderRadius: 1.5,
                    },
                    tabBarPressColor: isDark ? '#333' : '#f0f0f0',
                    tabBarScrollEnabled: false,
                }}
            >
                <CasinoTab.Screen
                    name="Inicio"
                    component={HomeScreen}
                    options={{
                        tabBarLabel: 'Inicio',
                    }}
                />
                <CasinoTab.Screen
                    name="EnVivo"
                    component={EventosEnVivoScreen}
                    options={{
                        tabBarLabel: 'En Vivo',
                    }}
                />
                <CasinoTab.Screen
                    name="MisApuestas"
                    component={MisApuestasScreen}
                    options={{
                        tabBarLabel: 'Mis Apuestas',
                    }}
                />
                <CasinoTab.Screen
                    name="Deportes"
                    component={DeportesScreen}
                    options={{
                        tabBarLabel: 'Deportes',
                    }}
                />
            </CasinoTab.Navigator>

            {/* BoletoApuestas global para todas las pestañas del casino */}
            <BoletoApuestas />
        </View>
    );
}

// Exportar el navegador principal para ser usado en AppNavigator
export default function CasinoNavigation() {
    return (
        <MainCasinoStack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <MainCasinoStack.Screen
                name="CasinoTabs"
                component={CasinoTabNavigator}
                options={{
                    headerShown: true,
                    title: '',
                    headerTitle: () => <HeaderIcon />,
                    headerTitleAlign: 'center'
                }}
            />
            <MainCasinoStack.Screen
                name="SportEvents"
                component={SportEventsScreen}
                options={{
                    headerShown: false,
                }}
            />
            <MainCasinoStack.Screen
                name="EventDetail"
                component={EventDetailScreen}
                options={{
                    headerShown: false,
                }}
            />
            <MainCasinoStack.Screen
                name="SportManager"
                component={SportManager}
                options={{
                    headerShown: true,
                    title: 'Gestión Deportiva',
                    headerTintColor: '#d32f2f',
                }}
            />

            <MainCasinoStack.Screen
                name='ligasByDeporte'
                component={ComponenteDeporte}
                options={{
                    headerShown: true,
                    title: 'Gestión Deportiva',
                    headerTintColor: '#d32f2f',
                }}
            />

        </MainCasinoStack.Navigator>
    );
}

// Estilos para el contenedor del casino
const styles = StyleSheet.create({
    headerIconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerIcon: {
        width: 100,
        height: 100,
    },
});