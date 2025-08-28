import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme, Platform, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import Toast from 'react-native-toast-message';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ProfileScreen from './ProfileScreen';
import SupportScreen from './SupportScreen';

export type TabParamList = {
	Deposito: undefined;
	Apuestas: undefined;
	Menu: undefined;
	ProfileStack: { screen: string } | undefined;
};

export type RootStackParamList = {
    AuthFlow: undefined;
    MainApp: undefined;
};

type TabNavigationProp = BottomTabNavigationProp<TabParamList>;
type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;

type NavigationProp = CompositeNavigationProp<
    TabNavigationProp,
    RootNavigationProp
>;

export default function MenuScreen() {
	const colorScheme = useColorScheme();
	const navigation = useNavigation<NavigationProp>();
	const { logout } = useAuth();
	const styles = getStyles((colorScheme === 'light' || colorScheme === 'dark') ? colorScheme : null);

	const handleLogout = () => {
		Alert.alert(
			'Cerrar sesión',
			'¿Estás seguro de que quieres cerrar sesión?',
			[
				{
					text: 'Cancelar',
					style: 'cancel',
				},
				{
					text: 'Cerrar sesión',
					style: 'destructive',
					onPress: () => {
						logout();
						Toast.show({
							type: 'success',
							text1: 'Sesión cerrada',
							text2: 'Has cerrado sesión correctamente'
						});
						// Navegar al flujo de autenticación
						const rootNavigation = navigation.getParent()?.getParent();
						if (rootNavigation) {
							rootNavigation.reset({
								index: 0,
								routes: [{ name: 'AuthFlow' }],
							});
						}
					},
				},
			]
		);
	};

	return (
		<View style={styles.container}>
			<View style={styles.topButtonsContainer}>
				<TouchableOpacity style={[styles.topButton, styles.retiroButton, { marginRight: 8 }]} onPress={() => {}}>
					<MaterialIcons name="attach-money" size={20} color="#fff" />
					<Text style={styles.topButtonText}>Retiro</Text>
				</TouchableOpacity>
				<TouchableOpacity 
					style={[styles.topButton, styles.depositoButton]} 
					onPress={() => navigation.navigate('Deposito')}
				>
					<MaterialIcons name="account-balance-wallet" size={20} color="#fff" />
					<Text style={styles.topButtonText}>Depósito</Text>
				</TouchableOpacity>
			</View>

			<View style={styles.menuButtonsContainer}>
				<TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('ProfileStack', { screen: 'Profile' })}>
					<Ionicons name="person-circle-outline" size={24} color={colorScheme === 'dark' ? '#fff' : '#181818'} />
					<Text style={styles.menuButtonText}>Perfil</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.menuButton} onPress={() => {}}>
					<FontAwesome5 name="receipt" size={20} color={colorScheme === 'dark' ? '#fff' : '#181818'} />
					<Text style={styles.menuButtonText}>Transacciones</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('ProfileStack', { screen: 'Support' })}>
					<Ionicons name="headset-outline" size={24} color={colorScheme === 'dark' ? '#fff' : '#181818'} />
					<Text style={styles.menuButtonText}>Soporte</Text>
				</TouchableOpacity>
				<TouchableOpacity style={[styles.menuButton, styles.logoutButton]} onPress={handleLogout}>
					<Ionicons name="log-out-outline" size={24} color="#d32f2f" />
					<Text style={[styles.menuButtonText, styles.logoutButtonText]}>Cerrar sesión</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const getStyles = (colorScheme: 'light' | 'dark' | null) =>
	StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: colorScheme === 'dark' ? '#181818' : '#fff',
			padding: 24,
			justifyContent: 'flex-start',
		},
		topButtonsContainer: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			marginBottom: 32,
			marginTop: Platform.OS === 'ios' ? 60 : 30,
		},
		topButton: {
			flex: 1,
			paddingVertical: 14,
			borderRadius: 10,
			alignItems: 'center',
			elevation: 2,
			flexDirection: 'row',
			justifyContent: 'center',
			gap: 8,
		},
		retiroButton: {
			backgroundColor: '#d32f2f',
		},
		depositoButton: {
			backgroundColor: '#757575',
		},
		topButtonText: {
			color: '#fff',
			fontWeight: 'bold',
			fontSize: 16,
			letterSpacing: 1,
		},
		menuButtonsContainer: {
			marginTop: 16,
		},
		menuButton: {
			backgroundColor: colorScheme === 'dark' ? '#222' : '#f5f5f5',
			paddingVertical: 18,
			borderRadius: 10,
			alignItems: 'center',
			marginBottom: 18,
			borderWidth: 1,
			borderColor: colorScheme === 'dark' ? '#555' : '#ccc',
			elevation: 1,
			flexDirection: 'row',
			justifyContent: 'center',
			gap: 12,
		},
		logoutButton: {
			borderColor: '#d32f2f',
			backgroundColor: colorScheme === 'dark' ? '#1a0000' : '#fff5f5',
		},
		menuButtonText: {
			color: colorScheme === 'dark' ? '#fff' : '#181818',
			fontWeight: '600',
			fontSize: 18,
			letterSpacing: 1,
		},
		logoutButtonText: {
			color: '#d32f2f',
		},
	});
