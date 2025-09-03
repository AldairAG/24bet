import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function MenuScreen() {
	const colorScheme = useColorScheme();
	const navigation = useNavigation();
	const styles = getStyles((colorScheme === 'light' || colorScheme === 'dark') ? colorScheme : null);

	return (
		<View style={styles.container}>
			<View style={styles.topButtonsContainer}>
				<TouchableOpacity style={[styles.topButton, { marginRight: 8 }]} onPress={() => {}}>
					<Text style={styles.topButtonText}>Retiro</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.topButton} onPress={() => {}}>
					<Text style={styles.topButtonText}>Depósito</Text>
				</TouchableOpacity>
			</View>

			<View style={styles.menuButtonsContainer}>
				<TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('ProfileScreen' as never)}>
					<Text style={styles.menuButtonText}>Perfil</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.menuButton} onPress={() => {}}>
					<Text style={styles.menuButtonText}>Soporte</Text>
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
			backgroundColor: '#d32f2f',
			paddingVertical: 14,
			borderRadius: 10,
			alignItems: 'center',
			elevation: 2,
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
		},
		menuButtonText: {
			color: colorScheme === 'dark' ? '#fff' : '#181818',
			fontWeight: '600',
			fontSize: 18,
			letterSpacing: 1,
		},
	});
