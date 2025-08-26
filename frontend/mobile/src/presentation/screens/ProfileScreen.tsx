import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, useColorScheme } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const initialForm = {
    nombreCompleto: '',
    email: '',
    numeroTelefono: '',
};

export default function ProfileScreen() {
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState<any>({});
    const colorScheme = useColorScheme();
    const styles = getStyles((colorScheme === 'light' || colorScheme === 'dark') ? colorScheme : null);

    const handleChange = (field: string, value: string) => {
        setForm({ ...form, [field]: value });
    };

    const validate = () => {
        let newErrors: any = {};

        if (!form.nombreCompleto.trim()) newErrors.nombreCompleto = 'Nombre completo requerido';
        if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Correo inválido';
        if (!form.numeroTelefono.trim() || !/^\d{10}$/.test(form.numeroTelefono)) newErrors.numeroTelefono = 'Teléfono inválido (10 dígitos)';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleUpdate = () => {
        if (validate()) {
            Alert.alert('Actualizado', 'Los datos se actualizaron correctamente.');
        }
    };

    const handleDocumentos = () => {
        Alert.alert('Mis documentos', 'Próximamente disponible');
    };

    const handleDetallesPago = () => {
        Alert.alert('Detalles de pago', 'Próximamente disponible');
    };

    // Validar en cada render para el botón
    React.useEffect(() => {
        validate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form]);

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: colorScheme === 'dark' ? '#181818' : '#fff' }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
        >
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                <Text style={styles.header}>Perfil</Text>

                {/* Card 1: Información Personal */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="person-circle-outline" size={24} color="#d32f2f" />
                        <Text style={styles.cardTitle}>Información personal</Text>
                    </View>

                    <View style={styles.inputContainer}>
                        <Ionicons name="person-outline" size={20} color={colorScheme === 'dark' ? '#aaa' : '#888'} />
                        <TextInput
                            style={styles.input}
                            placeholder="Nombre completo"
                            value={form.nombreCompleto}
                            onChangeText={v => handleChange('nombreCompleto', v)}
                            placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#888'}
                        />
                    </View>
                    {errors.nombreCompleto && <Text style={styles.error}>{errors.nombreCompleto}</Text>}

                    <View style={styles.inputContainer}>
                        <Ionicons name="call-outline" size={20} color={colorScheme === 'dark' ? '#aaa' : '#888'} />
                        <TextInput
                            style={styles.input}
                            placeholder="Número de teléfono"
                            value={form.numeroTelefono}
                            onChangeText={v => handleChange('numeroTelefono', v)}
                            keyboardType="numeric"
                            placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#888'}
                        />
                    </View>
                    {errors.numeroTelefono && <Text style={styles.error}>{errors.numeroTelefono}</Text>}

                    <View style={styles.inputContainer}>
                        <Ionicons name="mail-outline" size={20} color={colorScheme === 'dark' ? '#aaa' : '#888'} />
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            value={form.email}
                            onChangeText={v => handleChange('email', v)}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#888'}
                        />
                    </View>
                    {errors.email && <Text style={styles.error}>{errors.email}</Text>}

                    <TouchableOpacity
                        style={[
                            styles.button,
                            { backgroundColor: Object.keys(errors).length === 0 && form.nombreCompleto ? '#d32f2f' : '#bdbdbd' }
                        ]}
                        onPress={handleUpdate}
                        disabled={Object.keys(errors).length !== 0}
                    >
                        <Text style={styles.buttonText}>Actualizar información</Text>
                    </TouchableOpacity>
                </View>

                {/* Card 2: Validaciones */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <MaterialIcons name="verified-user" size={24} color="#d32f2f" />
                        <Text style={styles.cardTitle}>Validaciones</Text>
                    </View>

                    <View style={styles.validationButtonsContainer}>
                        <TouchableOpacity style={styles.validationButton} onPress={handleDocumentos}>
                            <Ionicons name="document-text-outline" size={24} color="#d32f2f" />
                            <Text style={styles.validationButtonText}>Mis documentos</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.validationButton} onPress={handleDetallesPago}>
                            <MaterialIcons name="payment" size={24} color="#d32f2f" />
                            <Text style={styles.validationButtonText}>Detalles de pago</Text>
                        </TouchableOpacity>
                    </View>
                </View>
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
            flexGrow: 1
        },
        header: {
            fontSize: 28,
            fontWeight: 'bold',
            color: '#d32f2f',
            marginBottom: 20,
            textAlign: 'center'
        },
        card: {
            backgroundColor: colorScheme === 'dark' ? '#222' : '#fff',
            borderRadius: 12,
            padding: 20,
            marginBottom: 20,
            elevation: 3,
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 3.84,
            borderWidth: 1,
            borderColor: colorScheme === 'dark' ? '#333' : '#f0f0f0',
        },
        cardHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
            paddingBottom: 10,
            borderBottomWidth: 1,
            borderBottomColor: colorScheme === 'dark' ? '#333' : '#f0f0f0',
        },
        cardTitle: {
            fontSize: 20,
            fontWeight: '600',
            color: colorScheme === 'dark' ? '#fff' : '#181818',
            marginLeft: 10,
        },
        inputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: colorScheme === 'dark' ? '#555' : '#ccc',
            backgroundColor: colorScheme === 'dark' ? '#333' : '#fff',
            borderRadius: 8,
            paddingHorizontal: 12,
            marginBottom: 5,
        },
        input: {
            flex: 1,
            color: colorScheme === 'dark' ? '#fff' : '#181818',
            padding: 12,
            fontSize: 16,
            marginLeft: 10,
        },
        error: {
            color: '#d32f2f',
            fontSize: 12,
            marginBottom: 10,
            marginLeft: 5,
        },
        button: {
            marginTop: 15,
            padding: 14,
            borderRadius: 8,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
        },
        buttonText: {
            color: '#fff',
            fontWeight: 'bold',
            fontSize: 16,
        },
        validationButtonsContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 10,
        },
        validationButton: {
            flex: 1,
            backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f8f8',
            borderRadius: 10,
            padding: 20,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: colorScheme === 'dark' ? '#555' : '#e0e0e0',
            elevation: 1,
        },
        validationButtonText: {
            color: colorScheme === 'dark' ? '#fff' : '#181818',
            fontWeight: '600',
            fontSize: 14,
            marginTop: 8,
            textAlign: 'center',
        },
    });