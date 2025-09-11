import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    useColorScheme,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    runOnJS,
} from 'react-native-reanimated';
import Toast from 'react-native-toast-message';

interface EmailFormData {
    email: string;
}

interface CodeFormData {
    code: string;
}

interface PasswordFormData {
    password: string;
    confirmPassword: string;
}

export default function RecoveryPasswordScreen() {
    const navigation = useNavigation();
    const colorScheme = useColorScheme();
    const styles = getStyles((colorScheme === 'light' || colorScheme === 'dark') ? colorScheme : null);

    const [currentStep, setCurrentStep] = useState(1);
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const opacityAnimation = useSharedValue(1);

    const emailForm = useForm<EmailFormData>({ defaultValues: { email: '' }, mode: 'onChange' });
    const codeForm = useForm<CodeFormData>({ defaultValues: { code: '' }, mode: 'onChange' });
    const passwordForm = useForm<PasswordFormData>({ defaultValues: { password: '', confirmPassword: '' }, mode: 'onChange' });

    const emailValidation = {
        required: 'El correo es requerido',
        pattern: {
            value: /\S+@\S+\.\S+/,
            message: 'Formato de correo inválido'
        }
    };

    const codeValidation = {
        required: 'El código es requerido',
        pattern: {
            value: /^\d{6}$/,
            message: 'El código debe tener 6 dígitos'
        }
    };

    const passwordValidation = {
        required: 'La contraseña es requerida',
        minLength: {
            value: 8,
            message: 'Mínimo 8 caracteres'
        },
        pattern: {
            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            message: 'Debe contener mayúscula, minúscula y número'
        }
    };

    const confirmPasswordValidation = {
        required: 'Confirma tu contraseña',
        validate: (value: string) => {
            const password = passwordForm.watch('password');
            return value === password || 'Las contraseñas no coinciden';
        }
    };

    const animateStepChange = (nextStep: number) => {
        opacityAnimation.value = withTiming(0, { duration: 200 }, () => {
            runOnJS(setCurrentStep)(nextStep);
            opacityAnimation.value = withTiming(1, { duration: 300 });
        });
    };

    const sendRecoveryCode = async (emailData: EmailFormData) => {
        setIsLoading(true);
        setEmail(emailData.email);

        setTimeout(() => {
            setIsLoading(false);
            Toast.show({
                type: 'success',
                text1: 'Código enviado',
                text2: `Se ha enviado un código a ${emailData.email}`
            });
            animateStepChange(2);
        }, 2000);
    };

    const verifyCode = async (codeData: CodeFormData) => {
        setIsLoading(true);

        setTimeout(() => {
            setIsLoading(false);
            if (codeData.code === '123456') {
                Toast.show({
                    type: 'success',
                    text1: 'Código verificado',
                    text2: 'Ahora puedes crear tu nueva contraseña'
                });
                animateStepChange(3);
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Código incorrecto',
                    text2: 'Verifica el código enviado a tu email'
                });
            }
        }, 1500);
    };

    const resetPassword = async (passwordData: PasswordFormData) => {
        setIsLoading(true);

        setTimeout(() => {
            setIsLoading(false);
            Toast.show({
                type: 'success',
                text1: 'Contraseña actualizada',
                text2: 'Tu contraseña ha sido cambiada exitosamente'
            });

            setTimeout(() => {
                navigation.navigate('Login' as never);
            }, 1500);
        }, 2000);
    };

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacityAnimation.value,
    }));

    const renderProgressIndicator = () => (
        <View style={styles.progressContainer}>
            {[1, 2, 3].map((step) => (
                <View key={step} style={styles.progressStepContainer}>
                    <View style={[
                        styles.progressStep,
                        currentStep >= step && styles.progressStepActive
                    ]}>
                        {currentStep > step ? (
                            <Ionicons name="checkmark" size={16} color="#fff" />
                        ) : (
                            <Text style={[
                                styles.progressStepText,
                                currentStep >= step && styles.progressStepTextActive
                            ]}>
                                {step}
                            </Text>
                        )}
                    </View>
                    {step < 3 && (
                        <View style={[
                            styles.progressLine,
                            currentStep > step && styles.progressLineActive
                        ]} />
                    )}
                </View>
            ))}
        </View>
    );

    const renderStep1 = () => (
        <View style={styles.stepContainer}>
            <Ionicons name="mail-outline" size={60} color="#d32f2f" style={styles.stepIcon} />
            <Text style={styles.stepTitle}>Recuperar contraseña</Text>
            <Text style={styles.stepDescription}>
                Ingresa tu email para recibir un código de verificación
            </Text>

            <Controller
                control={emailForm.control}
                name="email"
                rules={emailValidation}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        style={[
                            styles.input,
                            emailForm.formState.errors.email && styles.inputError
                        ]}
                        placeholder="Ingresa tu email"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#888'}
                    />
                )}
            />
            {emailForm.formState.errors.email && (
                <Text style={styles.error}>{emailForm.formState.errors.email.message}</Text>
            )}

            <TouchableOpacity
                style={[
                    styles.button,
                    {
                        backgroundColor: emailForm.formState.isValid && !isLoading ? '#d32f2f' : '#bdbdbd'
                    }
                ]}
                onPress={emailForm.handleSubmit(sendRecoveryCode)}
                disabled={!emailForm.formState.isValid || isLoading}
            >
                <Text style={styles.buttonText}>
                    {isLoading ? 'Enviando...' : 'Enviar código'}
                </Text>
            </TouchableOpacity>
        </View>
    );

    const renderStep2 = () => (
        <View style={styles.stepContainer}>
            <Ionicons name="shield-checkmark-outline" size={60} color="#d32f2f" style={styles.stepIcon} />
            <Text style={styles.stepTitle}>Verificar código</Text>
            <Text style={styles.stepDescription}>
                Ingresa el código de 6 dígitos enviado a {email}
            </Text>

            <View style={styles.codeInputContainer}>
                <Controller
                    control={codeForm.control}
                    name="code"
                    rules={codeValidation}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={[
                                styles.input,
                                styles.codeInput,
                                codeForm.formState.errors.code && styles.inputError
                            ]}
                            placeholder="123456"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            keyboardType="numeric"
                            maxLength={6}
                            autoFocus={true}
                            selectTextOnFocus={true}
                            placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#888'}
                        />
                    )}
                />
            </View>

            {codeForm.formState.errors.code && (
                <Text style={styles.error}>{codeForm.formState.errors.code.message}</Text>
            )}

            <Text style={styles.helpText}>
                Para pruebas, usa el código: 123456
            </Text>

            <TouchableOpacity
                style={[
                    styles.button,
                    {
                        backgroundColor: codeForm.formState.isValid && !isLoading ? '#d32f2f' : '#bdbdbd'
                    }
                ]}
                onPress={codeForm.handleSubmit(verifyCode)}
                disabled={!codeForm.formState.isValid || isLoading}
            >
                <Text style={styles.buttonText}>
                    {isLoading ? 'Verificando...' : 'Verificar código'}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.resendButton}
                onPress={() => {
                    Toast.show({
                        type: 'info',
                        text1: 'Código reenviado',
                        text2: `Nuevo código enviado a ${email}`
                    });
                }}
            >
                <Text style={styles.resendText}>Reenviar código</Text>
            </TouchableOpacity>
        </View>
    );

    const renderStep3 = () => (
        <View style={styles.stepContainer}>
            <Ionicons name="lock-closed-outline" size={60} color="#d32f2f" style={styles.stepIcon} />
            <Text style={styles.stepTitle}>Nueva contraseña</Text>
            <Text style={styles.stepDescription}>
                Crea una contraseña segura para tu cuenta
            </Text>

            <Controller
                control={passwordForm.control}
                name="password"
                rules={passwordValidation}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        style={[
                            styles.input,
                            passwordForm.formState.errors.password && styles.inputError
                        ]}
                        placeholder="Nueva contraseña"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        secureTextEntry
                        placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#888'}
                    />
                )}
            />
            {passwordForm.formState.errors.password && (
                <Text style={styles.error}>{passwordForm.formState.errors.password.message}</Text>
            )}

            <Controller
                control={passwordForm.control}
                name="confirmPassword"
                rules={confirmPasswordValidation}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        style={[
                            styles.input,
                            passwordForm.formState.errors.confirmPassword && styles.inputError
                        ]}
                        placeholder="Confirmar contraseña"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        secureTextEntry
                        placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#888'}
                    />
                )}
            />
            {passwordForm.formState.errors.confirmPassword && (
                <Text style={styles.error}>{passwordForm.formState.errors.confirmPassword.message}</Text>
            )}

            <TouchableOpacity
                style={[
                    styles.button,
                    {
                        backgroundColor: passwordForm.formState.isValid && !isLoading ? '#d32f2f' : '#bdbdbd'
                    }
                ]}
                onPress={passwordForm.handleSubmit(resetPassword)}
                disabled={!passwordForm.formState.isValid || isLoading}
            >
                <Text style={styles.buttonText}>
                    {isLoading ? 'Actualizando...' : 'Actualizar contraseña'}
                </Text>
            </TouchableOpacity>
        </View>
    );

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 1: return renderStep1();
            case 2: return renderStep2();
            case 3: return renderStep3();
            default: return renderStep1();
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        >
            {renderProgressIndicator()}

            <Animated.View style={[styles.content, animatedStyle]}>
                {renderCurrentStep()}
            </Animated.View>
        </KeyboardAvoidingView>
    );
}

const getStyles = (colorScheme: 'light' | 'dark' | null) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colorScheme === 'dark' ? '#181818' : '#fff',
        },
        progressContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 40,
            paddingVertical: 20,
        },
        progressStepContainer: { flexDirection: 'row', alignItems: 'center' },
        progressStep: {
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: colorScheme === 'dark' ? '#444' : '#e0e0e0',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 2,
            borderColor: colorScheme === 'dark' ? '#555' : '#e0e0e0',
        },
        progressStepActive: { backgroundColor: '#d32f2f', borderColor: '#d32f2f' },
        progressStepText: {
            fontSize: 14,
            fontWeight: '600',
            color: colorScheme === 'dark' ? '#888' : '#888',
        },
        progressStepTextActive: { color: '#fff' },
        progressLine: {
            width: 40,
            height: 2,
            backgroundColor: colorScheme === 'dark' ? '#444' : '#e0e0e0',
            marginHorizontal: 5,
        },
        progressLineActive: { backgroundColor: '#d32f2f' },
        content: {
            flex: 1,
            paddingHorizontal: 20,
            justifyContent: 'center',
            alignItems: 'center',
        },
        stepContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: 50,
            paddingHorizontal: 20,
            width: '100%',
        },
        stepIcon: { marginBottom: 20 },
        stepTitle: {
            fontSize: 24,
            fontWeight: 'bold',
            color: colorScheme === 'dark' ? '#fff' : '#181818',
            marginBottom: 10,
            textAlign: 'center',
        },
        stepDescription: {
            fontSize: 16,
            color: colorScheme === 'dark' ? '#aaa' : '#666',
            textAlign: 'center',
            marginBottom: 30,
            lineHeight: 22,
            paddingHorizontal: 30,
            maxWidth: '90%',
        },
        input: {
            width: '90%',
            maxWidth: 320,
            borderWidth: 1,
            borderColor: colorScheme === 'dark' ? '#555' : '#ddd',
            backgroundColor: colorScheme === 'dark' ? '#333' : '#fff',
            color: colorScheme === 'dark' ? '#fff' : '#181818',
            padding: 15,
            borderRadius: 10,
            marginBottom: 12,
            fontSize: 16,
            alignSelf: 'center',
        },
        codeInputContainer: {
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 10,
        },
        codeInput: {
            width: '80%',
            maxWidth: 250,
            textAlign: 'center',
            fontSize: 24,
            letterSpacing: 8,
            fontWeight: '700',
            paddingVertical: 15,
            borderWidth: 1,
            borderColor: colorScheme === 'dark' ? '#555' : '#ddd',
            borderRadius: 10,
        },
        inputError: { borderColor: '#d32f2f' },
        error: {
            fontSize: 12,
            color: '#d32f2f',
            marginBottom: 15,
            textAlign: 'center',
        },
        helpText: {
            fontSize: 12,
            color: colorScheme === 'dark' ? '#4caf50' : '#2e7d32',
            marginBottom: 20,
            textAlign: 'center',
            fontStyle: 'italic',
        },
        button: {
            width: '90%',
            maxWidth: 320,
            padding: 15,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 15,
            alignSelf: 'center',
        },
        buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
        resendButton: { padding: 10 },
        resendText: { color: '#d32f2f', fontSize: 14, fontWeight: '500' },
    });
