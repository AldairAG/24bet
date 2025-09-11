import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MenuScreen from '../screens/usuario/MenuScreen';
import ProfileScreen from '../screens/usuario/ProfileScreen';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { View, Text } from 'react-native';

function DummyScreen({ title }: { title: string }) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 24 }}>{title}</Text>
        </View>
    );
}

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarActiveTintColor: '#d32f2f',
                tabBarInactiveTintColor: 'gray',
                headerShown: false,
                tabBarIcon: ({ color, size }) => {
                    if (route.name === 'Retiro') {
                        return <MaterialIcons name="attach-money" size={size} color={color} />;
                    } else if (route.name === 'Apuestas') {
                        return <FontAwesome5 name="dice" size={size} color={color} />;
                    } else if (route.name === 'Perfil') {
                        return <Ionicons name="person-circle-outline" size={size} color={color} />;
                    } else if (route.name === 'Menú') {
                        return <Ionicons name="menu" size={size} color={color} />;
                    }
                    return null;
                }
            })}
        >
            <Tab.Screen name="Retiro" children={() => <DummyScreen title="Retiro" />} />
            <Tab.Screen name="Apuestas" children={() => <DummyScreen title="Apuestas" />} />
            <Tab.Screen name="Perfil" component={ProfileScreen} />
            <Tab.Screen name="Menú" component={MenuScreen} />
        </Tab.Navigator>
    );
}