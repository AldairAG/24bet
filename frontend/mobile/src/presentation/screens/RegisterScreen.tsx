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
    Modal,
    FlatList,
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

import { useAuth } from '../../hooks/useAuth';
import { Alert } from 'react-native';
import { RegistroRequest } from '../../types/authTypes';
// Lista de códigos de área internacionales
const countryCodes = [
    { label: "México (+52)", value: "+52", maxLength: 10 },
    { label: "Estados Unidos o Canadá (+1)", value: "+1", maxLength: 10 },
    { label: "España (+34)", value: "+34", maxLength: 9 },
    { label: "Argentina (+54)", value: "+54", maxLength: 10 },
    { label: "Colombia (+57)", value: "+57", maxLength: 10 },
    { label: "Chile (+56)", value: "+56", maxLength: 9 },
    { label: "Perú (+51)", value: "+51", maxLength: 9 },
    { label: "Brasil (+55)", value: "+55", maxLength: 11 },
    { label: "Reino Unido (+44)", value: "+44", maxLength: 10 },
    { label: "Francia (+33)", value: "+33", maxLength: 10 },
    { label: "Alemania (+49)", value: "+49", maxLength: 11 },
    { label: "Italia (+39)", value: "+39", maxLength: 10 },
    { label: "China (+86)", value: "+86", maxLength: 11 },
    { label: "Japón (+81)", value: "+81", maxLength: 10 },
    { label: "Corea del Sur (+82)", value: "+82", maxLength: 10 },
    { label: "India (+91)", value: "+91", maxLength: 10 },
    { label: "Australia (+61)", value: "+61", maxLength: 9 },
];

// Generar arrays para los selectores de fecha
const generateDays = () => {
    return Array.from({ length: 31 }, (_, i) => {
        const day = i + 1;
        return { label: day.toString().padStart(2, '0'), value: day };
    });
};

const generateMonths = () => {
    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months.map((month, index) => ({
        label: month,
        value: index + 1
    }));
};

const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= currentYear - 100; year--) {
        years.push({ label: year.toString(), value: year });
    }
    return years;
};

const days = generateDays();
const months = generateMonths();
const years = generateYears();


export default function RegisterScreen({ navigation }: RegisterScreenProps) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [countryCode, setCountryCode] = useState("+52"); // México por defecto

    // Estados para fecha de nacimiento
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
    const [selectedYear, setSelectedYear] = useState<number | null>(null);
    const [birthDate, setBirthDate] = useState<Date | null>(null);

    const [termsAccepted, setTermsAccepted] = useState(false);
    const [privacyAccepted, setPrivacyAccepted] = useState(false);

    // Estados para modales
    const [showCountryPicker, setShowCountryPicker] = useState(false);
    const [showDayPicker, setShowDayPicker] = useState(false);
    const [showMonthPicker, setShowMonthPicker] = useState(false);
    const [showYearPicker, setShowYearPicker] = useState(false);

    const colorSchemeRaw = useColorScheme();
    const colorScheme: 'light' | 'dark' | null = colorSchemeRaw === 'light' || colorSchemeRaw === 'dark' ? colorSchemeRaw : null;
    const styles = getStyles(colorScheme);

    // Obtener la configuración del país seleccionado
    const selectedCountry = countryCodes.find(country => country.value === countryCode);
    const maxPhoneLength = selectedCountry?.maxLength || 10;

    // Hook de autenticación
    const { registro, loading, error } = useAuth();

    // Función para actualizar la fecha de nacimiento completa
    const updateBirthDate = (day: number | null, month: number | null, year: number | null) => {
        if (day && month && year) {
            const date = new Date(year, month - 1, day);
            setBirthDate(date);
        } else {
            setBirthDate(null);
        }
    };

    // Validar que sea mayor de 18 años
    const isValidAge = () => {
        if (!birthDate) return false;

        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            return age - 1 >= 18;
        }

        return age >= 18;
    };

    // Validar días según el mes y año seleccionados
    const getValidDays = () => {
        if (!selectedMonth || !selectedYear) return days;

        const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
        return days.filter(day => day.value <= daysInMonth);
    };

    // Validación del número de teléfono según el país
    const isPhoneValid = () => {
        if (!phone.trim()) return false;

        // Validar que solo contenga números
        if (!/^\d+$/.test(phone)) return false;

        // Validar longitud según el país
        const phoneLength = phone.length;

        switch (countryCode) {
            case "+52": // México
                return phoneLength === 10;
            case "+1": // EE.UU. y Canadá
                return phoneLength === 10;
            case "+34": // España
                return phoneLength === 9;
            case "+54": // Argentina
                return phoneLength === 10;
            case "+57": // Colombia
                return phoneLength === 10;
            case "+56": // Chile
                return phoneLength === 9;
            case "+51": // Perú
                return phoneLength === 9;
            case "+55": // Brasil
                return phoneLength === 10 || phoneLength === 11;
            case "+44": // Reino Unido
                return phoneLength === 10;
            case "+33": // Francia
                return phoneLength === 10;
            case "+49": // Alemania
                return phoneLength === 10 || phoneLength === 11;
            case "+39": // Italia
                return phoneLength === 10;
            case "+86": // China
                return phoneLength === 11;
            case "+81": // Japón
                return phoneLength === 10;
            case "+82": // Corea del Sur
                return phoneLength === 10;
            case "+91": // India
                return phoneLength === 10;
            case "+61": // Australia
                return phoneLength === 9;
            default:
                return phoneLength >= 7 && phoneLength <= 15;
        }
    };

    const isFormValid =
        username.trim() !== "" &&
        email.includes("@") &&
        password.length >= 6 &&
        confirmPassword === password &&
        firstName.trim() !== "" &&
        lastName.trim() !== "" &&
        isPhoneValid() &&
        birthDate !== null &&
        isValidAge() &&
        termsAccepted &&
        privacyAccepted;

    const handlePhoneChange = (text: string) => {
        // Solo permitir números
        const numericText = text.replace(/[^0-9]/g, '');

        // Limitar la longitud según el país
        if (numericText.length <= maxPhoneLength) {
            setPhone(numericText);
        }
    };

    const handleCountrySelect = (country: typeof countryCodes[0]) => {
        setCountryCode(country.value);
        setPhone(""); // Limpiar el teléfono al cambiar de país
        setShowCountryPicker(false);
    };

    const handleDaySelect = (day: number) => {
        setSelectedDay(day);
        updateBirthDate(day, selectedMonth, selectedYear);
        setShowDayPicker(false);
    };

    const handleMonthSelect = (month: number) => {
        setSelectedMonth(month);
        // Si el día seleccionado no es válido para el nuevo mes, resetearlo
        if (selectedDay && selectedYear) {
            const daysInMonth = new Date(selectedYear, month, 0).getDate();
            if (selectedDay > daysInMonth) {
                setSelectedDay(null);
                updateBirthDate(null, month, selectedYear);
            } else {
                updateBirthDate(selectedDay, month, selectedYear);
            }
        } else {
            updateBirthDate(selectedDay, month, selectedYear);
        }
        setShowMonthPicker(false);
    };

    const handleYearSelect = (year: number) => {
        setSelectedYear(year);
        // Verificar si el día sigue siendo válido (para años bisiestos)
        if (selectedDay && selectedMonth) {
            const daysInMonth = new Date(year, selectedMonth, 0).getDate();
            if (selectedDay > daysInMonth) {
                setSelectedDay(null);
                updateBirthDate(null, selectedMonth, year);
            } else {
                updateBirthDate(selectedDay, selectedMonth, year);
            }
        } else {
            updateBirthDate(selectedDay, selectedMonth, year);
        }
        setShowYearPicker(false);
    };


    const handleRegister = async () => {
        if (isFormValid) {
            const fechaNacimiento = birthDate ? birthDate.toISOString().split('T')[0] : '';
            const registroRequest: RegistroRequest = {
                username,
                email,
                password,
                nombre: firstName,
                apellido: lastName,
                ladaTelefono: countryCode,
                numeroTelefono: phone,
                fechaNacimiento,
            };
            try {
                const action = await registro(registroRequest);
                // Si el registro fue exitoso
                if (
                    action &&
                    action.payload &&
                    typeof action.payload === 'object' &&
                    'success' in action.payload &&
                    (action.payload as any).success
                ) {
                    Alert.alert('Registro exitoso', 'Tu cuenta ha sido creada correctamente.');
                    navigation.navigate('Home');
                } else {
                    Alert.alert(
                        'Error',
                        typeof action?.payload === 'object' && action?.payload?.message
                            ? action.payload.message
                            : (typeof action?.payload === 'string' ? action.payload : 'No se pudo registrar')
                    );
                }
            } catch (e: any) {
                Alert.alert('Error', e?.message || 'No se pudo registrar');
            }
        }
    };

    const renderCountryItem = ({ item }: { item: typeof countryCodes[0] }) => (
        <TouchableOpacity
            style={[
                styles.countryItem,
                item.value === countryCode && styles.selectedCountryItem
            ]}
            onPress={() => handleCountrySelect(item)}
        >
            <Text style={[
                styles.countryItemText,
                item.value === countryCode && styles.selectedCountryItemText
            ]}>
                {item.label}
            </Text>
        </TouchableOpacity>
    );

    const renderDayItem = ({ item }: { item: typeof days[0] }) => (
        <TouchableOpacity
            style={[
                styles.countryItem,
                item.value === selectedDay && styles.selectedCountryItem
            ]}
            onPress={() => handleDaySelect(item.value)}
        >
            <Text style={[
                styles.countryItemText,
                item.value === selectedDay && styles.selectedCountryItemText
            ]}>
                {item.label}
            </Text>
        </TouchableOpacity>
    );

    const renderMonthItem = ({ item }: { item: typeof months[0] }) => (
        <TouchableOpacity
            style={[
                styles.countryItem,
                item.value === selectedMonth && styles.selectedCountryItem
            ]}
            onPress={() => handleMonthSelect(item.value)}
        >
            <Text style={[
                styles.countryItemText,
                item.value === selectedMonth && styles.selectedCountryItemText
            ]}>
                {item.label}
            </Text>
        </TouchableOpacity>
    );

    const renderYearItem = ({ item }: { item: typeof years[0] }) => (
        <TouchableOpacity
            style={[
                styles.countryItem,
                item.value === selectedYear && styles.selectedCountryItem
            ]}
            onPress={() => handleYearSelect(item.value)}
        >
            <Text style={[
                styles.countryItemText,
                item.value === selectedYear && styles.selectedCountryItemText
            ]}>
                {item.label}
            </Text>
        </TouchableOpacity>
    );

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

                {/* Fecha de nacimiento */}
                <Text style={styles.label}>Fecha de nacimiento</Text>
                <View style={styles.dateContainer}>
                    <TouchableOpacity
                        style={[styles.dateSelector, { flex: 1 }]}
                        onPress={() => setShowDayPicker(true)}
                    >
                        <Text style={styles.dateSelectorText}>
                            {selectedDay ? selectedDay.toString().padStart(2, '0') : "Día"}
                        </Text>
                        <Text style={styles.dropdownIcon}>▼</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.dateSelector, { flex: 2 }]}
                        onPress={() => setShowMonthPicker(true)}
                    >
                        <Text style={styles.dateSelectorText}>
                            {selectedMonth ? months[selectedMonth - 1].label : "Mes"}
                        </Text>
                        <Text style={styles.dropdownIcon}>▼</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.dateSelector, { flex: 1.2 }]}
                        onPress={() => setShowYearPicker(true)}
                    >
                        <Text style={styles.dateSelectorText}>
                            {selectedYear ? selectedYear.toString() : "Año"}
                        </Text>
                        <Text style={styles.dropdownIcon}>▼</Text>
                    </TouchableOpacity>
                </View>

                {/* Mostrar fecha completa y validación */}
                {birthDate && (
                    <Text style={styles.birthDateDisplay}>
                        Fecha seleccionada: {birthDate.toLocaleDateString('es-ES')}
                    </Text>
                )}

                {birthDate && !isValidAge() && (
                    <Text style={styles.errorText}>
                        Debes ser mayor de 18 años para registrarte
                    </Text>
                )}

                {/* Selector de código de país */}
                <Text style={styles.label}>Código de país</Text>
                <TouchableOpacity
                    style={styles.countrySelector}
                    onPress={() => setShowCountryPicker(true)}
                >
                    <Text style={styles.countrySelectorText}>
                        {selectedCountry?.label || "Seleccionar país"}
                    </Text>
                    <Text style={styles.dropdownIcon}>▼</Text>
                </TouchableOpacity>

                {/* Campo de teléfono */}
                <View style={styles.phoneContainer}>
                    <View style={styles.countryCodeDisplay}>
                        <Text style={styles.countryCodeText}>{countryCode}</Text>
                    </View>
                    <TextInput
                        style={[styles.input, styles.phoneInput]}
                        placeholder={`Número de teléfono (${maxPhoneLength} dígitos)`}
                        keyboardType="numeric"
                        value={phone}
                        onChangeText={handlePhoneChange}
                        placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#888'}
                        maxLength={maxPhoneLength}
                    />
                </View>

                {/* Mostrar validación del teléfono */}
                {phone.length > 0 && !isPhoneValid() && (
                    <Text style={styles.errorText}>
                        El número debe tener {maxPhoneLength} dígitos
                    </Text>
                )}

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
                    style={[styles.button, { backgroundColor: isFormValid && !loading ? "#d32f2f" : "#bdbdbd" }]}
                    onPress={handleRegister}
                    disabled={!isFormValid || loading}
                >
                    <Text style={styles.buttonText}>{loading ? 'Registrando...' : 'Registrarse'}</Text>
                </TouchableOpacity>
                {error && (
                    <Text style={styles.errorText}>{error}</Text>
                )}
                <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                    <Text style={styles.loginText}>Ya tienes cuenta? Inicia sesión</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Modal para selección de país */}
            <Modal
                visible={showCountryPicker}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowCountryPicker(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Seleccionar país</Text>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setShowCountryPicker(false)}
                            >
                                <Text style={styles.closeButtonText}>✕</Text>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={countryCodes}
                            renderItem={renderCountryItem}
                            keyExtractor={(item) => item.value}
                            style={styles.countryList}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                </View>
            </Modal>

            {/* Modal para selección de día */}
            <Modal
                visible={showDayPicker}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowDayPicker(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Seleccionar día</Text>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setShowDayPicker(false)}
                            >
                                <Text style={styles.closeButtonText}>✕</Text>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={getValidDays()}
                            renderItem={renderDayItem}
                            keyExtractor={(item) => item.value.toString()}
                            style={styles.countryList}
                            showsVerticalScrollIndicator={false}
                            numColumns={7}
                        />
                    </View>
                </View>
            </Modal>

            {/* Modal para selección de mes */}
            <Modal
                visible={showMonthPicker}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowMonthPicker(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Seleccionar mes</Text>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setShowMonthPicker(false)}
                            >
                                <Text style={styles.closeButtonText}>✕</Text>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={months}
                            renderItem={renderMonthItem}
                            keyExtractor={(item) => item.value.toString()}
                            style={styles.countryList}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                </View>
            </Modal>

            {/* Modal para selección de año */}
            <Modal
                visible={showYearPicker}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowYearPicker(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Seleccionar año</Text>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setShowYearPicker(false)}
                            >
                                <Text style={styles.closeButtonText}>✕</Text>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={years}
                            renderItem={renderYearItem}
                            keyExtractor={(item) => item.value.toString()}
                            style={styles.countryList}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                </View>
            </Modal>
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
        label: {
            fontSize: 16,
            color: colorScheme === 'dark' ? '#eee' : '#181818',
            marginBottom: 5,
            fontWeight: '500',
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
        dateContainer: {
            flexDirection: 'row',
            marginBottom: 15,
            gap: 10,
        },
        dateSelector: {
            borderWidth: 1,
            borderColor: colorScheme === 'dark' ? '#555' : '#ccc',
            borderRadius: 8,
            padding: 10,
            backgroundColor: colorScheme === 'dark' ? '#222' : '#fff',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        dateSelectorText: {
            color: colorScheme === 'dark' ? '#fff' : '#181818',
            fontSize: 16,
        },
        birthDateDisplay: {
            color: colorScheme === 'dark' ? '#4caf50' : '#2e7d32',
            fontSize: 14,
            marginTop: -10,
            marginBottom: 10,
            textAlign: 'center',
            fontWeight: '500',
        },
        countrySelector: {
            borderWidth: 1,
            borderColor: colorScheme === 'dark' ? '#555' : '#ccc',
            borderRadius: 8,
            padding: 10,
            marginBottom: 15,
            backgroundColor: colorScheme === 'dark' ? '#222' : '#fff',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        countrySelectorText: {
            color: colorScheme === 'dark' ? '#fff' : '#181818',
            fontSize: 16,
        },
        dropdownIcon: {
            color: colorScheme === 'dark' ? '#aaa' : '#888',
            fontSize: 12,
        },
        phoneContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 15,
        },
        countryCodeDisplay: {
            borderWidth: 1,
            borderColor: colorScheme === 'dark' ? '#555' : '#ccc',
            borderRadius: 8,
            padding: 10,
            marginRight: 10,
            backgroundColor: colorScheme === 'dark' ? '#333' : '#f5f5f5',
            minWidth: 60,
            alignItems: 'center',
        },
        countryCodeText: {
            color: colorScheme === 'dark' ? '#fff' : '#181818',
            fontWeight: '600',
        },
        phoneInput: {
            flex: 1,
            marginBottom: 0,
        },
        errorText: {
            color: '#d32f2f',
            fontSize: 12,
            marginTop: -10,
            marginBottom: 10,
            marginLeft: 5,
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
        // Estilos del modal
        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        modalContent: {
            backgroundColor: colorScheme === 'dark' ? '#222' : '#fff',
            borderRadius: 12,
            width: '90%',
            maxHeight: '70%',
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
        },
        modalHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 20,
            borderBottomWidth: 1,
            borderBottomColor: colorScheme === 'dark' ? '#333' : '#eee',
        },
        modalTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colorScheme === 'dark' ? '#fff' : '#181818',
        },
        closeButton: {
            padding: 5,
        },
        closeButtonText: {
            fontSize: 18,
            color: colorScheme === 'dark' ? '#aaa' : '#888',
            fontWeight: 'bold',
        },
        countryList: {
            maxHeight: 400,
        },
        countryItem: {
            padding: 15,
            borderBottomWidth: 1,
            borderBottomColor: colorScheme === 'dark' ? '#333' : '#eee',
        },
        selectedCountryItem: {
            backgroundColor: colorScheme === 'dark' ? '#d32f2f20' : '#d32f2f10',
        },
        countryItemText: {
            fontSize: 16,
            color: colorScheme === 'dark' ? '#fff' : '#181818',
        },
        selectedCountryItemText: {
            color: '#d32f2f',
            fontWeight: '600',
        },
    });