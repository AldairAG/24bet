import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    StyleSheet, 
    ScrollView, 
    TouchableOpacity, 
    KeyboardAvoidingView, 
    Platform, 
    useColorScheme,
    SafeAreaView,
    Modal,
    FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../hooks/useAuth';
import { EditUserProfile } from '../../types/userTypes';
import { Genero } from '../../types/kycTypes';
import Toast from 'react-native-toast-message';
import { useUser } from '../../hooks/useUser';

// Lista de códigos de área internacionales (simplificada)
const countryCodes = [
    { label: "México (+52)", value: "+52", maxLength: 10 },
    { label: "Estados Unidos o Canadá (+1)", value: "+1", maxLength: 10 },
    { label: "España (+34)", value: "+34", maxLength: 9 },
    { label: "Argentina (+54)", value: "+54", maxLength: 10 },
    { label: "Colombia (+57)", value: "+57", maxLength: 10 },
    { label: "Chile (+56)", value: "+56", maxLength: 9 },
    { label: "Perú (+51)", value: "+51", maxLength: 9 },
    { label: "Brasil (+55)", value: "+55", maxLength: 11 },
];

// Opciones de género
const generoOpciones = [
    { label: "Masculino", value: Genero.MASCULINO },
    { label: "Femenino", value: Genero.FEMENINO },
    { label: "Otro", value: Genero.OTRO },
    { label: "Prefiero no especificar", value: Genero.NO_ESPECIFICADO }
];

// Schema de validación con Yup
const validationSchema = Yup.object().shape({
    /*username: Yup.string()
        .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
        .required('El nombre de usuario es requerido'),
    email: Yup.string()
        .email('Email inválido')
        .required('El email es requerido'),
    nombre: Yup.string()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .required('El nombre es requerido'),
    apellido: Yup.string()
        .min(2, 'El apellido debe tener al menos 2 caracteres')
        .required('El apellido es requerido'),
    ladaTelefono: Yup.string()
        .required('El código de país es requerido'),
    numeroTelefono: Yup.string()
        .matches(/^\d+$/, 'Solo se permiten números')
        .required('El número de teléfono es requerido'),
    // Validaciones para InformacionPersonal
    informacionPersonal: Yup.object().shape({
        genero: Yup.string()
            .required('El género es requerido'),
        calle: Yup.string()
            .min(2, 'La calle debe tener al menos 2 caracteres')
            .required('La calle es requerida'),
        numeroExterior: Yup.string()
            .required('El número exterior es requerido'),
        numeroInterior: Yup.string(),
        colonia: Yup.string()
            .min(2, 'La colonia debe tener al menos 2 caracteres')
            .required('La colonia es requerida'),
        codigoPostal: Yup.string()
            .matches(/^\d{5}$/, 'El código postal debe tener 5 dígitos')
            .required('El código postal es requerido'),
        ciudad: Yup.string()
            .min(2, 'La ciudad debe tener al menos 2 caracteres')
            .required('La ciudad es requerida'),
        estado: Yup.string()
            .min(2, 'El estado debe tener al menos 2 caracteres')
            .required('El estado es requerido'),
        pais: Yup.string()
            .min(2, 'El país debe tener al menos 2 caracteres')
            .required('El país es requerido'),
        rfc: Yup.string()
            .matches(/^[A-Z&Ñ]{3,4}[0-9]{6}[A-Z0-9]{3}$/, 'RFC inválido'),
        ocupacion: Yup.string()
            .min(2, 'La ocupación debe tener al menos 2 caracteres')
            .required('La ocupación es requerida'),*/
    })

export default function EditProfileScreen() {
    const navigation = useNavigation();
    const { usuario } = useAuth();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const [showCountryPicker, setShowCountryPicker] = useState(false);
    const [showGeneroPicker, setShowGeneroPicker] = useState(false);
    const { editarPerfil } = useUser();

    // Valores iniciales basados en el usuario actual
    const initialValues: EditUserProfile = {
        username: usuario?.username || '',
        email: usuario?.email || '',
        nombre: usuario?.nombre || '',
        apellido: usuario?.apellido || '',
        ladaTelefono: usuario?.ladaTelefono || '+52',
        numeroTelefono: usuario?.numeroTelefono || '',
        informacionPersonal: {
            id: 0,
            genero: Genero.MASCULINO,
            calle: usuario?.informacionPersonal?.calle || '',
            numeroExterior: usuario?.informacionPersonal?.numeroExterior || '',
            numeroInterior: usuario?.informacionPersonal?.numeroInterior || '',
            colonia: usuario?.informacionPersonal?.colonia || '',
            codigoPostal: usuario?.informacionPersonal?.codigoPostal || '',
            ciudad: usuario?.informacionPersonal?.ciudad || '',
            estado: usuario?.informacionPersonal?.estado || '',
            pais: usuario?.informacionPersonal?.pais || '',
            rfc: usuario?.informacionPersonal?.rfc || '',
            ocupacion: usuario?.informacionPersonal?.ocupacion || '',
            fechaCreacion: new Date(),
            fechaActualizacion: new Date(),
        },
    };

    const handleSubmit = async (values: EditUserProfile) => {
        try {
            // Aquí implementarías la llamada al API para actualizar el usuario
            console.log('Actualizando usuario:', values);
            await editarPerfil(values);
            
            Toast.show({
                type: 'success',
                text1: 'Perfil actualizado',
                text2: 'Tu información se ha guardado correctamente'
            });
            
            navigation.goBack();
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'No se pudo actualizar el perfil'
            });
        }
    };

    const getCountryLabel = (code: string) => {
        return countryCodes.find(c => c.value === code)?.label || code;
    };

    const getMaxPhoneLength = (code: string) => {
        return countryCodes.find(c => c.value === code)?.maxLength || 10;
    };

    const getGeneroLabel = (genero: Genero) => {
        return generoOpciones.find(g => g.value === genero)?.label || 'Seleccionar';
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f5f5f5' }]}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
            >
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, isValid }) => (
                        <ScrollView 
                            style={styles.scrollContainer}
                            contentContainerStyle={styles.scrollContent}
                            keyboardShouldPersistTaps="handled"
                        >
                            <View style={styles.content}>
                                {/* Información de cuenta */}
                                <View style={[styles.section, { backgroundColor: isDark ? '#2a2a2a' : 'white' }]}>
                                    <Text style={[styles.sectionTitle, { color: '#d32f2f' }]}>
                                        Información de Cuenta
                                    </Text>
                                    
                                    <View style={styles.inputContainer}>
                                        <Text style={[styles.label, { color: isDark ? '#fff' : '#333' }]}>
                                            Nombre de usuario *
                                        </Text>
                                        <TextInput
                                            style={[
                                                styles.input,
                                                {
                                                    backgroundColor: isDark ? '#3a3a3a' : '#f8f9fa',
                                                    borderColor: touched.username && errors.username ? '#f44336' : (isDark ? '#555' : '#e0e0e0'),
                                                    color: isDark ? '#fff' : '#333'
                                                }
                                            ]}
                                            value={values.username}
                                            onChangeText={handleChange('username')}
                                            onBlur={handleBlur('username')}
                                            placeholder="Ingresa tu nombre de usuario"
                                            placeholderTextColor={isDark ? '#aaa' : '#666'}
                                        />
                                        {touched.username && errors.username && (
                                            <Text style={styles.errorText}>{errors.username}</Text>
                                        )}
                                    </View>

                                    <View style={styles.inputContainer}>
                                        <Text style={[styles.label, { color: isDark ? '#fff' : '#333' }]}>
                                            Email *
                                        </Text>
                                        <TextInput
                                            style={[
                                                styles.input,
                                                {
                                                    backgroundColor: isDark ? '#3a3a3a' : '#f8f9fa',
                                                    borderColor: touched.email && errors.email ? '#f44336' : (isDark ? '#555' : '#e0e0e0'),
                                                    color: isDark ? '#fff' : '#333'
                                                }
                                            ]}
                                            value={values.email}
                                            onChangeText={handleChange('email')}
                                            onBlur={handleBlur('email')}
                                            placeholder="Ingresa tu email"
                                            placeholderTextColor={isDark ? '#aaa' : '#666'}
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                        />
                                        {touched.email && errors.email && (
                                            <Text style={styles.errorText}>{errors.email}</Text>
                                        )}
                                    </View>
                                </View>

                                {/* Información Personal */}
                                <View style={[styles.section, { backgroundColor: isDark ? '#2a2a2a' : 'white' }]}>
                                    <Text style={[styles.sectionTitle, { color: '#d32f2f' }]}>
                                        Información Personal
                                    </Text>

                                    <View style={styles.inputContainer}>
                                        <Text style={[styles.label, { color: isDark ? '#fff' : '#333' }]}>
                                            Nombre *
                                        </Text>
                                        <TextInput
                                            style={[
                                                styles.input,
                                                {
                                                    backgroundColor: isDark ? '#3a3a3a' : '#f8f9fa',
                                                    borderColor: touched.nombre && errors.nombre ? '#f44336' : (isDark ? '#555' : '#e0e0e0'),
                                                    color: isDark ? '#fff' : '#333'
                                                }
                                            ]}
                                            value={values.nombre}
                                            onChangeText={handleChange('nombre')}
                                            onBlur={handleBlur('nombre')}
                                            placeholder="Ingresa tu nombre"
                                            placeholderTextColor={isDark ? '#aaa' : '#666'}
                                        />
                                        {touched.nombre && errors.nombre && (
                                            <Text style={styles.errorText}>{errors.nombre}</Text>
                                        )}
                                    </View>

                                    <View style={styles.inputContainer}>
                                        <Text style={[styles.label, { color: isDark ? '#fff' : '#333' }]}>
                                            Apellido *
                                        </Text>
                                        <TextInput
                                            style={[
                                                styles.input,
                                                {
                                                    backgroundColor: isDark ? '#3a3a3a' : '#f8f9fa',
                                                    borderColor: touched.apellido && errors.apellido ? '#f44336' : (isDark ? '#555' : '#e0e0e0'),
                                                    color: isDark ? '#fff' : '#333'
                                                }
                                            ]}
                                            value={values.apellido}
                                            onChangeText={handleChange('apellido')}
                                            onBlur={handleBlur('apellido')}
                                            placeholder="Ingresa tu apellido"
                                            placeholderTextColor={isDark ? '#aaa' : '#666'}
                                        />
                                        {touched.apellido && errors.apellido && (
                                            <Text style={styles.errorText}>{errors.apellido}</Text>
                                        )}
                                    </View>
                                </View>

                                {/* Información de Contacto */}
                                <View style={[styles.section, { backgroundColor: isDark ? '#2a2a2a' : 'white' }]}>
                                    <Text style={[styles.sectionTitle, { color: '#d32f2f' }]}>
                                        Información de Contacto
                                    </Text>

                                    <View style={styles.inputContainer}>
                                        <Text style={[styles.label, { color: isDark ? '#fff' : '#333' }]}>
                                            Código de país *
                                        </Text>
                                        <TouchableOpacity
                                            style={[
                                                styles.countrySelector,
                                                {
                                                    backgroundColor: isDark ? '#3a3a3a' : '#f8f9fa',
                                                    borderColor: isDark ? '#555' : '#e0e0e0',
                                                }
                                            ]}
                                            onPress={() => setShowCountryPicker(true)}
                                        >
                                            <Text style={[styles.countrySelectorText, { color: isDark ? '#fff' : '#333' }]}>
                                                {getCountryLabel(values.ladaTelefono)}
                                            </Text>
                                            <Ionicons name="chevron-down" size={20} color={isDark ? '#aaa' : '#666'} />
                                        </TouchableOpacity>
                                    </View>

                                    <View style={styles.inputContainer}>
                                        <Text style={[styles.label, { color: isDark ? '#fff' : '#333' }]}>
                                            Número de teléfono *
                                        </Text>
                                        <View style={styles.phoneContainer}>
                                            <View style={[
                                                styles.phonePrefix,
                                                { backgroundColor: isDark ? '#444' : '#e9ecef' }
                                            ]}>
                                                <Text style={[styles.phonePrefixText, { color: isDark ? '#fff' : '#333' }]}>
                                                    {values.ladaTelefono}
                                                </Text>
                                            </View>
                                            <TextInput
                                                style={[
                                                    styles.phoneInput,
                                                    {
                                                        backgroundColor: isDark ? '#3a3a3a' : '#f8f9fa',
                                                        borderColor: touched.numeroTelefono && errors.numeroTelefono ? '#f44336' : (isDark ? '#555' : '#e0e0e0'),
                                                        color: isDark ? '#fff' : '#333'
                                                    }
                                                ]}
                                                value={values.numeroTelefono}
                                                onChangeText={(text) => {
                                                    const numericText = text.replace(/[^0-9]/g, '');
                                                    if (numericText.length <= getMaxPhoneLength(values.ladaTelefono)) {
                                                        setFieldValue('numeroTelefono', numericText);
                                                    }
                                                }}
                                                onBlur={handleBlur('numeroTelefono')}
                                                placeholder={`Número (${getMaxPhoneLength(values.ladaTelefono)} dígitos)`}
                                                placeholderTextColor={isDark ? '#aaa' : '#666'}
                                                keyboardType="numeric"
                                                maxLength={getMaxPhoneLength(values.ladaTelefono)}
                                            />
                                        </View>
                                        {touched.numeroTelefono && errors.numeroTelefono && (
                                            <Text style={styles.errorText}>{errors.numeroTelefono}</Text>
                                        )}
                                    </View>
                                </View>

                                {/* Información Adicional */}
                                <View style={[styles.section, { backgroundColor: isDark ? '#2a2a2a' : 'white' }]}>
                                    <Text style={[styles.sectionTitle, { color: '#d32f2f' }]}>
                                        Información Adicional
                                    </Text>

                                    <View style={styles.inputContainer}>
                                        <Text style={[styles.label, { color: isDark ? '#fff' : '#333' }]}>
                                            Género *
                                        </Text>
                                        <TouchableOpacity
                                            style={[
                                                styles.countrySelector,
                                                {
                                                    backgroundColor: isDark ? '#3a3a3a' : '#f8f9fa',
                                                    borderColor: touched.informacionPersonal?.genero && errors.informacionPersonal?.genero ? '#f44336' : (isDark ? '#555' : '#e0e0e0'),
                                                }
                                            ]}
                                            onPress={() => setShowGeneroPicker(true)}
                                        >
                                            <Text style={[styles.countrySelectorText, { color: isDark ? '#fff' : '#333' }]}>
                                                {getGeneroLabel(values.informacionPersonal.genero)}
                                            </Text>
                                            <Ionicons name="chevron-down" size={20} color={isDark ? '#aaa' : '#666'} />
                                        </TouchableOpacity>
                                        {touched.informacionPersonal?.genero && errors.informacionPersonal?.genero && (
                                            <Text style={styles.errorText}>
                                                {typeof errors.informacionPersonal.genero === 'string' ? errors.informacionPersonal.genero : 'Género requerido'}
                                            </Text>
                                        )}
                                    </View>

                                    <View style={styles.inputContainer}>
                                        <Text style={[styles.label, { color: isDark ? '#fff' : '#333' }]}>
                                            Ocupación *
                                        </Text>
                                        <TextInput
                                            style={[
                                                styles.input,
                                                {
                                                    backgroundColor: isDark ? '#3a3a3a' : '#f8f9fa',
                                                    borderColor: touched.informacionPersonal?.ocupacion && errors.informacionPersonal?.ocupacion ? '#f44336' : (isDark ? '#555' : '#e0e0e0'),
                                                    color: isDark ? '#fff' : '#333'
                                                }
                                            ]}
                                            value={values.informacionPersonal.ocupacion}
                                            onChangeText={(text) => setFieldValue('informacionPersonal.ocupacion', text)}
                                            onBlur={handleBlur('informacionPersonal.ocupacion')}
                                            placeholder="Ingresa tu ocupación"
                                            placeholderTextColor={isDark ? '#aaa' : '#666'}
                                        />
                                        {touched.informacionPersonal?.ocupacion && errors.informacionPersonal?.ocupacion && (
                                            <Text style={styles.errorText}>
                                                {typeof errors.informacionPersonal.ocupacion === 'string' ? errors.informacionPersonal.ocupacion : 'Ocupación requerida'}
                                            </Text>
                                        )}
                                    </View>
                                </View>

                                {/* Dirección */}
                                <View style={[styles.section, { backgroundColor: isDark ? '#2a2a2a' : 'white' }]}>
                                    <Text style={[styles.sectionTitle, { color: '#d32f2f' }]}>
                                        Dirección
                                    </Text>

                                    <View style={styles.inputContainer}>
                                        <Text style={[styles.label, { color: isDark ? '#fff' : '#333' }]}>
                                            Calle *
                                        </Text>
                                        <TextInput
                                            style={[
                                                styles.input,
                                                {
                                                    backgroundColor: isDark ? '#3a3a3a' : '#f8f9fa',
                                                    borderColor: touched.informacionPersonal?.calle && errors.informacionPersonal?.calle ? '#f44336' : (isDark ? '#555' : '#e0e0e0'),
                                                    color: isDark ? '#fff' : '#333'
                                                }
                                            ]}
                                            value={values.informacionPersonal.calle}
                                            onChangeText={(text) => setFieldValue('informacionPersonal.calle', text)}
                                            onBlur={handleBlur('informacionPersonal.calle')}
                                            placeholder="Ingresa la calle"
                                            placeholderTextColor={isDark ? '#aaa' : '#666'}
                                        />
                                        {touched.informacionPersonal?.calle && errors.informacionPersonal?.calle && (
                                            <Text style={styles.errorText}>
                                                {typeof errors.informacionPersonal.calle === 'string' ? errors.informacionPersonal.calle : 'Calle requerida'}
                                            </Text>
                                        )}
                                    </View>

                                    <View style={styles.inputContainer}>
                                        <Text style={[styles.label, { color: isDark ? '#fff' : '#333' }]}>
                                            Número exterior *
                                        </Text>
                                        <TextInput
                                            style={[
                                                styles.input,
                                                {
                                                    backgroundColor: isDark ? '#3a3a3a' : '#f8f9fa',
                                                    borderColor: touched.informacionPersonal?.numeroExterior && errors.informacionPersonal?.numeroExterior ? '#f44336' : (isDark ? '#555' : '#e0e0e0'),
                                                    color: isDark ? '#fff' : '#333'
                                                }
                                            ]}
                                            value={values.informacionPersonal.numeroExterior}
                                            onChangeText={(text) => setFieldValue('informacionPersonal.numeroExterior', text)}
                                            onBlur={handleBlur('informacionPersonal.numeroExterior')}
                                            placeholder="Ingresa el número exterior"
                                            placeholderTextColor={isDark ? '#aaa' : '#666'}
                                        />
                                        {touched.informacionPersonal?.numeroExterior && errors.informacionPersonal?.numeroExterior && (
                                            <Text style={styles.errorText}>
                                                {typeof errors.informacionPersonal.numeroExterior === 'string' ? errors.informacionPersonal.numeroExterior : 'Número exterior requerido'}
                                            </Text>
                                        )}
                                    </View>

                                    <View style={styles.inputContainer}>
                                        <Text style={[styles.label, { color: isDark ? '#fff' : '#333' }]}>
                                            Número interior
                                        </Text>
                                        <TextInput
                                            style={[
                                                styles.input,
                                                {
                                                    backgroundColor: isDark ? '#3a3a3a' : '#f8f9fa',
                                                    borderColor: isDark ? '#555' : '#e0e0e0',
                                                    color: isDark ? '#fff' : '#333'
                                                }
                                            ]}
                                            value={values.informacionPersonal.numeroInterior}
                                            onChangeText={(text) => setFieldValue('informacionPersonal.numeroInterior', text)}
                                            onBlur={handleBlur('informacionPersonal.numeroInterior')}
                                            placeholder="Ingresa el número interior (opcional)"
                                            placeholderTextColor={isDark ? '#aaa' : '#666'}
                                        />
                                    </View>

                                    <View style={styles.inputContainer}>
                                        <Text style={[styles.label, { color: isDark ? '#fff' : '#333' }]}>
                                            Colonia *
                                        </Text>
                                        <TextInput
                                            style={[
                                                styles.input,
                                                {
                                                    backgroundColor: isDark ? '#3a3a3a' : '#f8f9fa',
                                                    borderColor: touched.informacionPersonal?.colonia && errors.informacionPersonal?.colonia ? '#f44336' : (isDark ? '#555' : '#e0e0e0'),
                                                    color: isDark ? '#fff' : '#333'
                                                }
                                            ]}
                                            value={values.informacionPersonal.colonia}
                                            onChangeText={(text) => setFieldValue('informacionPersonal.colonia', text)}
                                            onBlur={handleBlur('informacionPersonal.colonia')}
                                            placeholder="Ingresa la colonia"
                                            placeholderTextColor={isDark ? '#aaa' : '#666'}
                                        />
                                        {touched.informacionPersonal?.colonia && errors.informacionPersonal?.colonia && (
                                            <Text style={styles.errorText}>
                                                {typeof errors.informacionPersonal.colonia === 'string' ? errors.informacionPersonal.colonia : 'Colonia requerida'}
                                            </Text>
                                        )}
                                    </View>

                                    <View style={styles.inputContainer}>
                                        <Text style={[styles.label, { color: isDark ? '#fff' : '#333' }]}>
                                            Código postal *
                                        </Text>
                                        <TextInput
                                            style={[
                                                styles.input,
                                                {
                                                    backgroundColor: isDark ? '#3a3a3a' : '#f8f9fa',
                                                    borderColor: touched.informacionPersonal?.codigoPostal && errors.informacionPersonal?.codigoPostal ? '#f44336' : (isDark ? '#555' : '#e0e0e0'),
                                                    color: isDark ? '#fff' : '#333'
                                                }
                                            ]}
                                            value={values.informacionPersonal.codigoPostal}
                                            onChangeText={(text) => setFieldValue('informacionPersonal.codigoPostal', text.replace(/[^0-9]/g, ''))}
                                            onBlur={handleBlur('informacionPersonal.codigoPostal')}
                                            placeholder="Ingresa el código postal"
                                            placeholderTextColor={isDark ? '#aaa' : '#666'}
                                            keyboardType="numeric"
                                            maxLength={5}
                                        />
                                        {touched.informacionPersonal?.codigoPostal && errors.informacionPersonal?.codigoPostal && (
                                            <Text style={styles.errorText}>
                                                {typeof errors.informacionPersonal.codigoPostal === 'string' ? errors.informacionPersonal.codigoPostal : 'Código postal requerido'}
                                            </Text>
                                        )}
                                    </View>

                                    <View style={styles.inputContainer}>
                                        <Text style={[styles.label, { color: isDark ? '#fff' : '#333' }]}>
                                            Ciudad *
                                        </Text>
                                        <TextInput
                                            style={[
                                                styles.input,
                                                {
                                                    backgroundColor: isDark ? '#3a3a3a' : '#f8f9fa',
                                                    borderColor: touched.informacionPersonal?.ciudad && errors.informacionPersonal?.ciudad ? '#f44336' : (isDark ? '#555' : '#e0e0e0'),
                                                    color: isDark ? '#fff' : '#333'
                                                }
                                            ]}
                                            value={values.informacionPersonal.ciudad}
                                            onChangeText={(text) => setFieldValue('informacionPersonal.ciudad', text)}
                                            onBlur={handleBlur('informacionPersonal.ciudad')}
                                            placeholder="Ingresa la ciudad"
                                            placeholderTextColor={isDark ? '#aaa' : '#666'}
                                        />
                                        {touched.informacionPersonal?.ciudad && errors.informacionPersonal?.ciudad && (
                                            <Text style={styles.errorText}>
                                                {typeof errors.informacionPersonal.ciudad === 'string' ? errors.informacionPersonal.ciudad : 'Ciudad requerida'}
                                            </Text>
                                        )}
                                    </View>

                                    <View style={styles.inputContainer}>
                                        <Text style={[styles.label, { color: isDark ? '#fff' : '#333' }]}>
                                            Estado *
                                        </Text>
                                        <TextInput
                                            style={[
                                                styles.input,
                                                {
                                                    backgroundColor: isDark ? '#3a3a3a' : '#f8f9fa',
                                                    borderColor: touched.informacionPersonal?.estado && errors.informacionPersonal?.estado ? '#f44336' : (isDark ? '#555' : '#e0e0e0'),
                                                    color: isDark ? '#fff' : '#333'
                                                }
                                            ]}
                                            value={values.informacionPersonal.estado}
                                            onChangeText={(text) => setFieldValue('informacionPersonal.estado', text)}
                                            onBlur={handleBlur('informacionPersonal.estado')}
                                            placeholder="Ingresa el estado"
                                            placeholderTextColor={isDark ? '#aaa' : '#666'}
                                        />
                                        {touched.informacionPersonal?.estado && errors.informacionPersonal?.estado && (
                                            <Text style={styles.errorText}>
                                                {typeof errors.informacionPersonal.estado === 'string' ? errors.informacionPersonal.estado : 'Estado requerido'}
                                            </Text>
                                        )}
                                    </View>

                                    <View style={styles.inputContainer}>
                                        <Text style={[styles.label, { color: isDark ? '#fff' : '#333' }]}>
                                            País *
                                        </Text>
                                        <TextInput
                                            style={[
                                                styles.input,
                                                {
                                                    backgroundColor: isDark ? '#3a3a3a' : '#f8f9fa',
                                                    borderColor: touched.informacionPersonal?.pais && errors.informacionPersonal?.pais ? '#f44336' : (isDark ? '#555' : '#e0e0e0'),
                                                    color: isDark ? '#fff' : '#333'
                                                }
                                            ]}
                                            value={values.informacionPersonal.pais}
                                            onChangeText={(text) => setFieldValue('informacionPersonal.pais', text)}
                                            onBlur={handleBlur('informacionPersonal.pais')}
                                            placeholder="Ingresa el país"
                                            placeholderTextColor={isDark ? '#aaa' : '#666'}
                                        />
                                        {touched.informacionPersonal?.pais && errors.informacionPersonal?.pais && (
                                            <Text style={styles.errorText}>
                                                {typeof errors.informacionPersonal.pais === 'string' ? errors.informacionPersonal.pais : 'País requerido'}
                                            </Text>
                                        )}
                                    </View>
                                </View>

                                {/* Información Fiscal */}
                                <View style={[styles.section, { backgroundColor: isDark ? '#2a2a2a' : 'white' }]}>
                                    <Text style={[styles.sectionTitle, { color: '#d32f2f' }]}>
                                        Información Fiscal
                                    </Text>

                                    <View style={styles.inputContainer}>
                                        <Text style={[styles.label, { color: isDark ? '#fff' : '#333' }]}>
                                            RFC
                                        </Text>
                                        <TextInput
                                            style={[
                                                styles.input,
                                                {
                                                    backgroundColor: isDark ? '#3a3a3a' : '#f8f9fa',
                                                    borderColor: touched.informacionPersonal?.rfc && errors.informacionPersonal?.rfc ? '#f44336' : (isDark ? '#555' : '#e0e0e0'),
                                                    color: isDark ? '#fff' : '#333'
                                                }
                                            ]}
                                            value={values.informacionPersonal.rfc}
                                            onChangeText={(text) => setFieldValue('informacionPersonal.rfc', text.toUpperCase())}
                                            onBlur={handleBlur('informacionPersonal.rfc')}
                                            placeholder="Ingresa tu RFC (opcional)"
                                            placeholderTextColor={isDark ? '#aaa' : '#666'}
                                            autoCapitalize="characters"
                                            maxLength={13}
                                        />
                                        {touched.informacionPersonal?.rfc && errors.informacionPersonal?.rfc && (
                                            <Text style={styles.errorText}>
                                                {typeof errors.informacionPersonal.rfc === 'string' ? errors.informacionPersonal.rfc : 'RFC inválido'}
                                            </Text>
                                        )}
                                    </View>
                                </View>

                                {/* Botones de acción */}
                                <View style={styles.actionButtons}>
                                    <TouchableOpacity
                                        style={[
                                            styles.button,
                                            styles.cancelButton,
                                            { backgroundColor: isDark ? '#444' : '#f5f5f5' }
                                        ]}
                                        onPress={() => navigation.goBack()}
                                    >
                                        <Text style={[
                                            styles.cancelButtonText,
                                            { color: isDark ? '#fff' : '#666' }
                                        ]}>
                                            Cancelar
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[
                                            styles.button,
                                            styles.saveButton,
                                            {
                                                backgroundColor: isValid ? '#d32f2f' : (isDark ? '#555' : '#ccc'),
                                                opacity: isValid ? 1 : 0.6
                                            }
                                        ]}
                                        onPress={() => handleSubmit()}
                                        disabled={!isValid}
                                    >
                                        <Text style={styles.saveButtonText}>Guardar Cambios</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Modal selector de país */}
                            <Modal visible={showCountryPicker} transparent animationType="slide">
                                <View style={styles.modalOverlay}>
                                    <View style={[styles.modalContent, { backgroundColor: isDark ? '#2a2a2a' : 'white' }]}>
                                        <View style={[styles.modalHeader, { borderBottomColor: isDark ? '#444' : '#f0f0f0' }]}>
                                            <Text style={[styles.modalTitle, { color: isDark ? '#fff' : '#333' }]}>
                                                Seleccionar código de país
                                            </Text>
                                            <TouchableOpacity 
                                                style={styles.closeButton} 
                                                onPress={() => setShowCountryPicker(false)}
                                            >
                                                <Ionicons name="close" size={24} color={isDark ? '#aaa' : '#666'} />
                                            </TouchableOpacity>
                                        </View>
                                        <FlatList
                                            data={countryCodes}
                                            keyExtractor={(item) => item.value}
                                            renderItem={({ item }) => (
                                                <TouchableOpacity
                                                    style={[
                                                        styles.countryOption,
                                                        {
                                                            backgroundColor: values.ladaTelefono === item.value 
                                                                ? (isDark ? 'rgba(211, 47, 47, 0.2)' : 'rgba(211, 47, 47, 0.1)')
                                                                : 'transparent'
                                                        }
                                                    ]}
                                                    onPress={() => {
                                                        setFieldValue('ladaTelefono', item.value);
                                                        setFieldValue('numeroTelefono', ''); // Limpiar teléfono al cambiar país
                                                        setShowCountryPicker(false);
                                                    }}
                                                >
                                                    <Text style={[
                                                        styles.countryOptionText,
                                                        { 
                                                            color: values.ladaTelefono === item.value 
                                                                ? '#d32f2f' 
                                                                : (isDark ? '#fff' : '#333')
                                                        }
                                                    ]}>
                                                        {item.label}
                                                    </Text>
                                                </TouchableOpacity>
                                            )}
                                        />
                                    </View>
                                </View>
                            </Modal>

                            {/* Modal selector de género */}
                            <Modal visible={showGeneroPicker} transparent animationType="slide">
                                <View style={styles.modalOverlay}>
                                    <View style={[styles.modalContent, { backgroundColor: isDark ? '#2a2a2a' : 'white' }]}>
                                        <View style={[styles.modalHeader, { borderBottomColor: isDark ? '#444' : '#f0f0f0' }]}>
                                            <Text style={[styles.modalTitle, { color: isDark ? '#fff' : '#333' }]}>
                                                Seleccionar género
                                            </Text>
                                            <TouchableOpacity 
                                                style={styles.closeButton} 
                                                onPress={() => setShowGeneroPicker(false)}
                                            >
                                                <Ionicons name="close" size={24} color={isDark ? '#aaa' : '#666'} />
                                            </TouchableOpacity>
                                        </View>
                                        <FlatList
                                            data={generoOpciones}
                                            keyExtractor={(item) => item.value}
                                            renderItem={({ item }) => (
                                                <TouchableOpacity
                                                    style={[
                                                        styles.countryOption,
                                                        {
                                                            backgroundColor: values.informacionPersonal.genero === item.value 
                                                                ? (isDark ? 'rgba(211, 47, 47, 0.2)' : 'rgba(211, 47, 47, 0.1)')
                                                                : 'transparent'
                                                        }
                                                    ]}
                                                    onPress={() => {
                                                        setFieldValue('informacionPersonal.genero', item.value);
                                                        setShowGeneroPicker(false);
                                                    }}
                                                >
                                                    <Text style={[
                                                        styles.countryOptionText,
                                                        { 
                                                            color: values.informacionPersonal.genero === item.value 
                                                                ? '#d32f2f' 
                                                                : (isDark ? '#fff' : '#333')
                                                        }
                                                    ]}>
                                                        {item.label}
                                                    </Text>
                                                </TouchableOpacity>
                                            )}
                                        />
                                    </View>
                                </View>
                            </Modal>
                        </ScrollView>
                    )}
                </Formik>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollContainer: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    content: {
        padding: 20,
    },
    section: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        color: '#333',
    },
    input: {
        borderWidth: 1.5,
        borderColor: '#e0e0e0',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        backgroundColor: '#f8f9fa',
    },
    errorText: {
        color: '#f44336',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
    countrySelector: {
        borderWidth: 1.5,
        borderColor: '#e0e0e0',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: '#f8f9fa',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    countrySelectorText: {
        fontSize: 16,
        color: '#333',
    },
    phoneContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    phonePrefix: {
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: '#e9ecef',
        minWidth: 80,
        alignItems: 'center',
    },
    phonePrefixText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    phoneInput: {
        flex: 1,
        borderWidth: 1.5,
        borderColor: '#e0e0e0',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        backgroundColor: '#f8f9fa',
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 16,
        marginTop: 20,
    },
    button: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {
        backgroundColor: '#f5f5f5',
        borderWidth: 1.5,
        borderColor: '#e0e0e0',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
    },
    saveButton: {
        backgroundColor: '#d32f2f',
        elevation: 2,
        shadowColor: '#d32f2f',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    // Estilos del modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 16,
        width: '90%',
        maxHeight: '70%',
        overflow: 'hidden',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    closeButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(211, 47, 47, 0.1)',
    },
    countryOption: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 0.5,
        borderBottomColor: '#f0f0f0',
    },
    countryOptionText: {
        fontSize: 16,
        color: '#333',
    },
});
