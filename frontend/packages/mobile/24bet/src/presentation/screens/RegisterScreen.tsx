import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    useColorScheme,
} from "react-native";
import { Checkbox } from "react-native-paper";

import type { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
    Home: undefined;
    // Agrega aquí otras pantallas si es necesario
};

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface RegisterScreenProps {
    navigation: RegisterScreenNavigationProp;
}

export default function RegisterScreen({ navigation }: RegisterScreenProps) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [privacyAccepted, setPrivacyAccepted] = useState(false);

    const colorSchemeRaw = useColorScheme();
    const colorScheme: 'light' | 'dark' | null = colorSchemeRaw === 'light' || colorSchemeRaw === 'dark' ? colorSchemeRaw : null;
    const styles = getStyles(colorScheme);

    const isFormValid =
        username.trim() !== "" &&
        email.includes("@") &&
        password.length >= 6 &&
        confirmPassword === password &&
        firstName.trim() !== "" &&
        lastName.trim() !== "" &&
        /^[0-9]{10}$/.test(phone) &&
        termsAccepted &&
        privacyAccepted;

    const handleRegister = () => {
        if (isFormValid) {
            navigation.navigate("Home");
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{ flex: 1, backgroundColor: styles.container.backgroundColor }}
        >
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                <Text style={styles.title}>Registro</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Nombre de usuario"
                    value={username}
                    onChangeText={setUsername}
                    placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#888'}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Correo electrónico"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                    placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#888'}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Contraseña"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#888'}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Confirmar contraseña"
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#888'}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Nombre"
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#888'}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Apellido"
                    value={lastName}
                    onChangeText={setLastName}
                    placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#888'}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Número de teléfono"
                    keyboardType="numeric"
                    value={phone}
                    onChangeText={(text) => {
                        if (/^\d*$/.test(text) && text.length <= 10) {
                            setPhone(text);
                        }
                    }}
                    placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#888'}
                />
                <View style={styles.checkboxContainer}>
                    <Checkbox
                        status={termsAccepted ? "checked" : "unchecked"}
                        onPress={() => setTermsAccepted(!termsAccepted)}
                        color="#d32f2f"
                        uncheckedColor={colorScheme === 'dark' ? '#aaa' : '#888'}
                    />
                    <Text style={styles.checkboxLabel}>
                        Soy mayor de 18 años y acepto los términos y condiciones
                    </Text>
                </View>
                <View style={styles.checkboxContainer}>
                    <Checkbox
                        status={privacyAccepted ? "checked" : "unchecked"}
                        onPress={() => setPrivacyAccepted(!privacyAccepted)}
                        color="#d32f2f"
                        uncheckedColor={colorScheme === 'dark' ? '#aaa' : '#888'}
                    />
                    <Text style={styles.checkboxLabel}>
                        Acepto la política de privacidad
                    </Text>
                </View>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: isFormValid ? "#d32f2f" : "#bdbdbd" }]}
                    onPress={handleRegister}
                    disabled={!isFormValid}
                >
                    <Text style={styles.buttonText}>Registrarse</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                    <Text style={styles.loginText}>Ya tienes cuenta? Inicia sesión</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const getStyles = (colorScheme: 'light' | 'dark' | null) =>
    StyleSheet.create({
        container: {
            padding: 20,
            paddingBottom: 40,
            backgroundColor: colorScheme === 'dark' ? '#181818' : '#fff',
            flexGrow: 1,
        },
        title: {
            fontSize: 24,
            fontWeight: "bold",
            color: "#d32f2f",
            marginBottom: 20,
            textAlign: "center",
        },
        input: {
            borderWidth: 1,
            borderColor: colorScheme === 'dark' ? '#555' : '#ccc',
            borderRadius: 8,
            padding: 10,
            marginBottom: 15,
            backgroundColor: colorScheme === 'dark' ? '#222' : '#fff',
            color: colorScheme === 'dark' ? '#fff' : '#181818',
        },
        checkboxContainer: {
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 10,
        },
        checkboxLabel: {
            flex: 1,
            fontSize: 14,
            color: colorScheme === 'dark' ? '#eee' : '#181818',
        },
        button: {
            padding: 15,
            borderRadius: 8,
            alignItems: "center",
            marginTop: 10,
        },
        buttonText: {
            color: "#fff",
            fontWeight: "bold",
        },
        loginText: {
            marginTop: 15,
            textAlign: "center",
            color: colorScheme === 'dark' ? '#ef9a9a' : '#d32f2f',
        },
    });
