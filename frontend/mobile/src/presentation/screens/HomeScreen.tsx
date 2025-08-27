import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import { LoginRequest } from '../../types/authTypes';
import Toast from 'react-native-toast-message';

type Props = NativeStackScreenProps<any, 'Home'>;

interface FormData {
    email: string;
    password: string;
}

export default function HomeScreen({ navigation }: Props) {
    const colorScheme = useColorScheme();
    const styles = getStyles((colorScheme === 'light' || colorScheme === 'dark') ? colorScheme : null);

    // Hook de autenticación
    const { login, loading, error } = useAuth();

    // React Hook Form
    const {
        control,
        handleSubmit,
        formState: { errors, isValid, isDirty },
        watch
    } = useForm<FormData>({
        defaultValues: {
            email: '',
            password: ''
        },
        mode: 'onChange' // Validación en tiempo real
    });

    // Validaciones
    const emailValidation = {
        required: 'El correo es requerido',
        pattern: {
            value: /\S+@\S+\.\S+/,
            message: 'Formato de correo inválido'
        }
    };

    const passwordValidation = {
        required: 'La contraseña es requerida',
        minLength: {
            value: 6,
            message: 'Mínimo 6 caracteres'
        }
    };

    const onSubmit = async (data: FormData) => {
        // Crear el objeto con el campo que el backend espera
        const loginRequest = {
            password: data.password.trim(),
            username: data.email.trim() // Agregar el campo username que el backend está esperando
        } as LoginRequest & { username: string };

        try {
            const action = await login(loginRequest);
            // Si el login fue exitoso
            if (
                action &&
                action.meta &&
                action.meta.requestStatus === 'fulfilled' &&
                action.payload &&
                typeof action.payload === 'object' &&
                'success' in action.payload &&
                (action.payload as any).success
            ) {
                Toast.show({
                    type: 'success',
                    text1: 'Inicio de sesión exitoso',
                    text2: 'Bienvenido a 24bet'
                });
                navigation.navigate('MainApp');
            } else if (action && action.meta && action.meta.requestStatus !== 'fulfilled') {
                Toast.show({
                    type: 'error',
                    text1: 'Error de autenticación',
                    text2: 'No se pudo iniciar sesión'
                });
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Credenciales incorrectas',
                    text2:
                        (typeof action?.payload === 'object' && action?.payload?.message)
                            ? action.payload.message
                            : 'Verifica tu email y contraseña'
                });
            }
        } catch (e: any) {
            Toast.show({
                type: 'error',
                text1: 'Error de conexión',
                text2: 'No se pudo iniciar sesión'
            });
        }
    };

    // Observar los valores para determinar si el formulario tiene datos
    const watchedValues = watch();
    const hasValues = watchedValues.email.trim() !== '' && watchedValues.password.trim() !== '';

    return (
        <View style={styles.container}>
            <Text style={styles.header}>24bet</Text>

            <Controller
                control={control}
                name="email"
                rules={emailValidation}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        style={[
                            styles.input,
                            errors.email && styles.inputError
                        ]}
                        placeholder="Ingresa tu correo o usuario"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#888'}
                    />
                )}
            />
            {errors.email && (
                <Text style={styles.error}>{errors.email.message}</Text>
            )}

            <Controller
                control={control}
                name="password"
                rules={passwordValidation}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        style={[
                            styles.input,
                            errors.password && styles.inputError
                        ]}
                        placeholder="Ingresa tu contraseña"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        secureTextEntry
                        placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#888'}
                    />
                )}
            />
            {errors.password && (
                <Text style={styles.error}>{errors.password.message}</Text>
            )}

            <Text style={styles.warning}>
                🔞 El contenido de esta aplicación es exclusivo para mayores de 18 años.
            </Text>

            <TouchableOpacity
                style={[
                    styles.button,
                    {
                        backgroundColor: isValid && hasValues && !loading ? '#d32f2f' : '#bdbdbd'
                    }
                ]}
                onPress={handleSubmit(onSubmit)}
                disabled={!isValid || !hasValues || loading}
            >
                <Text style={styles.buttonText}>
                    {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                </Text>
            </TouchableOpacity>

            {error && (
                <Text style={styles.error}>{error}</Text>
            )}

            <TouchableOpacity onPress={() => navigation.navigate('RecoveryPassword')}>
                <Text style={styles.forgotPasswordLink}>
                    ¿Has olvidado tu contraseña?
                </Text>
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
        inputError: {
            borderColor: '#d32f2f',
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
        forgotPasswordLink: {
            color: colorScheme === 'dark' ? '#aaa' : '#666',
            textAlign: 'center',
            marginTop: 15,
            marginBottom: 5,
            fontSize: 14,
        },
    });