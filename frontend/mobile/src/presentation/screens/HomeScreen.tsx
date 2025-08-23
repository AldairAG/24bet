import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<any, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    const colorScheme = useColorScheme();
    const styles = getStyles((colorScheme === 'light' || colorScheme === 'dark') ? colorScheme : null);

    const validate = () => {
        const newErrors: { email?: string; password?: string } = {};

        if (!email.trim()) {
            newErrors.email = 'El correo es requerido';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Formato de correo inválido';
        }

        if (!password.trim()) {
            newErrors.password = 'La contraseña es requerida';
        } else if (password.length < 6) {
            newErrors.password = 'Mínimo 6 caracteres';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = () => {
        if (validate()) {
            console.log('Credenciales:', { email, password });
            // Lógica de autenticación aquí
            navigation.replace('MainTab');
        }
    };

    const isFormValid = email.trim() !== '' && password.trim() !== '';

    return (
        <View style={styles.container}>
            <Text style={styles.header}>24bet</Text>
            <TextInput
                style={styles.input}
                placeholder="Ingresa tu correo"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#888'}
            />
            {errors.email && <Text style={styles.error}>{errors.email}</Text>}
            <TextInput
                style={styles.input}
                placeholder="Ingresa tu contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#888'}
            />
            {errors.password && <Text style={styles.error}>{errors.password}</Text>}
            <Text style={styles.warning}>
                🔞 El contenido de esta aplicación es exclusivo para mayores de 18 años.
            </Text>
            <TouchableOpacity
                style={[styles.button, { backgroundColor: isFormValid ? '#d32f2f' : '#bdbdbd' }]}
                onPress={handleLogin}
                disabled={!isFormValid}
            >
                <Text style={styles.buttonText}>Iniciar sesión</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerLink}>
                    ¿No tienes cuenta? Registrar ahora
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const getStyles = (colorScheme: 'light' | 'dark' | null) =>
    StyleSheet.create({
        container: {
            flex: 1,
            padding: 20,
            backgroundColor: colorScheme === 'dark' ? '#181818' : '#fff',
            justifyContent: 'center',
        },
        header: {
            fontSize: 28,
            fontWeight: 'bold',
            color: '#d32f2f',
            marginBottom: 30,
            textAlign: 'center',
        },
        input: {
            borderWidth: 1,
            borderColor: colorScheme === 'dark' ? '#555' : '#ccc',
            backgroundColor: colorScheme === 'dark' ? '#222' : '#fff',
            color: colorScheme === 'dark' ? '#fff' : '#181818',
            padding: 12,
            borderRadius: 8,
            marginBottom: 5,
        },
        error: {
            fontSize: 12,
            color: '#d32f2f',
            marginBottom: 10,
        },
        warning: {
            fontSize: 12,
            color: colorScheme === 'dark' ? '#aaa' : '#888',
            marginVertical: 10,
            textAlign: 'center',
        },
        button: {
            padding: 15,
            borderRadius: 8,
            alignItems: 'center',
            marginVertical: 10,
        },
        buttonText: {
            color: '#fff',
            fontWeight: 'bold',
        },
        registerLink: {
            color: colorScheme === 'dark' ? '#ef9a9a' : '#d32f2f',
            textAlign: 'center',
            marginTop: 10,
        },
    });