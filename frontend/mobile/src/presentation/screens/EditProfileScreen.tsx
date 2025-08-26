import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    StyleSheet, 
    ScrollView, 
    TouchableOpacity, 
    Alert, 
    KeyboardAvoidingView, 
    Platform, 
    useColorScheme,
    Modal,
    FlatList
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../hooks/useAuth';
import Toast from 'react-native-toast-message';

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

// Opciones para los selectores
const generoOpciones = [
    { label: "Masculino", value: "masculino" },
    { label: "Femenino", value: "femenino" },
    { label: "Otro", value: "otro" },
    { label: "Prefiero no especificar", value: "no_especifica" }
];

const estadoCivilOpciones = [
    { label: "Soltero/a", value: "soltero" },
    { label: "Casado/a", value: "casado" },
    { label: "Divorciado/a", value: "divorciado" },
    { label: "Viudo/a", value: "viudo" },
    { label: "Unión libre", value: "union_libre" }
];

const paisesOpciones = [
    { label: "México", value: "mexico" },
    { label: "Estados Unidos", value: "usa" },
    { label: "España", value: "espana" },
    { label: "Argentina", value: "argentina" },
    { label: "Colombia", value: "colombia" },
    { label: "Chile", value: "chile" },
    { label: "Perú", value: "peru" },
    { label: "Brasil", value: "brasil" }
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

const initialForm = {
    email: 'juan.perez@email.com',
    nombre: 'Juan',
    segundoNombre: '',
    apellidoPaterno: 'Pérez',
    apellidoMaterno: 'García',
    ladaTelefono: '+52',
    numeroTelefono: '5551234567',
    fechaNacimiento: new Date('1990-05-15'),
    genero: 'masculino',
    calle: 'Av. Reforma',
    numeroExterior: '123',
    colonia: 'Centro',
    codigoPostal: '06000',
    ciudad: 'Ciudad de México',
    estado: 'CDMX',
    pais: 'mexico',
    rfc: 'PEGJ900515ABC',
    estadoCivil: 'soltero',
    ocupacion: 'Ingeniero',
    nacionalidad: 'Mexicana'
};

export default function EditProfileScreen() {
    const navigation = useNavigation();
    const { user } = useAuth();
    const [form, setForm] = useState(initialForm);
    
    // Estados para fecha de nacimiento
    const [selectedDay, setSelectedDay] = useState<number>(form.fechaNacimiento.getDate());
    const [selectedMonth, setSelectedMonth] = useState<number>(form.fechaNacimiento.getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState<number>(form.fechaNacimiento.getFullYear());

    // Estados para modales
    const [showCountryPicker, setShowCountryPicker] = useState(false);
    const [showDayPicker, setShowDayPicker] = useState(false);
    const [showMonthPicker, setShowMonthPicker] = useState(false);
    const [showYearPicker, setShowYearPicker] = useState(false);
    const [showGeneroPicker, setShowGeneroPicker] = useState(false);
    const [showEstadoCivilPicker, setShowEstadoCivilPicker] = useState(false);
    const [showPaisPicker, setShowPaisPicker] = useState(false);

    const colorScheme = useColorScheme();
    const styles = getStyles((colorScheme === 'light' || colorScheme === 'dark') ? colorScheme : null);

    // Obtener la configuración del país seleccionado
    const selectedCountry = countryCodes.find(country => country.value === form.ladaTelefono);
    const maxPhoneLength = selectedCountry?.maxLength || 10;

    const handleChange = (field: string, value: string) => {
        setForm({ ...form, [field]: value });
    };

    // Función para actualizar la fecha de nacimiento completa
    const updateBirthDate = (day: number, month: number, year: number) => {
        const newDate = new Date(year, month - 1, day);
        setForm({ ...form, fechaNacimiento: newDate });
    };

    // Validar que sea mayor de 18 años
    const isValidAge = () => {
        if (!form.fechaNacimiento) return false;

        const today = new Date();
        const age = today.getFullYear() - form.fechaNacimiento.getFullYear();
        const monthDiff = today.getMonth() - form.fechaNacimiento.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < form.fechaNacimiento.getDate())) {
            return age - 1 >= 18;
        }

        return age >= 18;
    };

    // Validación del número de teléfono según el país
    const isPhoneValid = () => {
        if (!form.numeroTelefono.trim()) return false;
        if (!/^\d+$/.test(form.numeroTelefono)) return false;
        return form.numeroTelefono.length === maxPhoneLength;
    };

    const isFormValid = () => {
        return form.email.includes("@") &&
               form.nombre.trim() !== "" &&
               form.apellidoPaterno.trim() !== "" &&
               form.apellidoMaterno.trim() !== "" &&
               isPhoneValid() &&
               form.fechaNacimiento !== null &&
               isValidAge() &&
               form.genero.trim() !== "" &&
               form.calle.trim() !== "" &&
               form.numeroExterior.trim() !== "" &&
               form.colonia.trim() !== "" &&
               form.codigoPostal.trim() !== "" &&
               form.ciudad.trim() !== "" &&
               form.estado.trim() !== "" &&
               form.pais.trim() !== "" &&
               form.estadoCivil.trim() !== "" &&
               form.ocupacion.trim() !== "" &&
               form.nacionalidad.trim() !== "";
    };

    const handlePhoneChange = (text: string) => {
        const numericText = text.replace(/[^0-9]/g, '');
        if (numericText.length <= maxPhoneLength) {
            handleChange('numeroTelefono', numericText);
        }
    };

    const handleCountrySelect = (country: typeof countryCodes[0]) => {
        handleChange('ladaTelefono', country.value);
        handleChange('numeroTelefono', ''); // Limpiar el teléfono al cambiar de país
        setShowCountryPicker(false);
    };

    const handleDaySelect = (day: number) => {
        setSelectedDay(day);
        updateBirthDate(day, selectedMonth, selectedYear);
        setShowDayPicker(false);
    };

    const handleMonthSelect = (month: number) => {
        setSelectedMonth(month);
        updateBirthDate(selectedDay, month, selectedYear);
        setShowMonthPicker(false);
    };

    const handleYearSelect = (year: number) => {
        setSelectedYear(year);
        updateBirthDate(selectedDay, selectedMonth, year);
        setShowYearPicker(false);
    };

    const handleGeneroSelect = (genero: string) => {
        handleChange('genero', genero);
        setShowGeneroPicker(false);
    };

    const handleEstadoCivilSelect = (estadoCivil: string) => {
        handleChange('estadoCivil', estadoCivil);
        setShowEstadoCivilPicker(false);
    };

    const handlePaisSelect = (pais: string) => {
        handleChange('pais', pais);
        setShowPaisPicker(false);
    };

    const handleSave = () => {
        if (isFormValid()) {
            Toast.show({
                type: 'success',
                text1: 'Perfil actualizado',
                text2: 'Tu información se ha guardado correctamente'
            });
            navigation.goBack();
        } else {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Por favor completa todos los campos correctamente'
            });
        }
    };

    const renderSelector = (
        items: any[],
        onSelect: Function,
        selectedValue: string | number,
        placeholder: string
    ) => (
        <FlatList
            data={items}
            keyExtractor={(item) => item.value.toString()}
            renderItem={({ item }) => (
                <TouchableOpacity
                    style={[
                        styles.selectorItem,
                        item.value === selectedValue && styles.selectedSelectorItem
                    ]}
                    onPress={() => onSelect(item.value)}
                >
                    <Text style={[
                        styles.selectorItemText,
                        item.value === selectedValue && styles.selectedSelectorItemText
                    ]}>
                        {item.label}
                    </Text>
                </TouchableOpacity>
            )}
        />
    );

    const getGeneroLabel = () => generoOpciones.find(g => g.value === form.genero)?.label || 'Seleccionar';
    const getEstadoCivilLabel = () => estadoCivilOpciones.find(e => e.value === form.estadoCivil)?.label || 'Seleccionar';
    const getPaisLabel = () => paisesOpciones.find(p => p.value === form.pais)?.label || 'Seleccionar';
    const getCountryLabel = () => countryCodes.find(c => c.value === form.ladaTelefono)?.label || 'Seleccionar';

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: colorScheme === 'dark' ? '#181818' : '#fff' }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
        >
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                <Text style={styles.title}>Editar Perfil</Text>

                {/* Información Personal */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Información Personal</Text>
                    
                    <Text style={styles.label}>Email *</Text>
                    <TextInput
                        style={styles.input}
                        value={form.email}
                        onChangeText={(text) => handleChange('email', text)}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        placeholder="Ingresa tu email"
                        placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#888'}
                    />

                    <Text style={styles.label}>Nombre *</Text>
                    <TextInput
                        style={styles.input}
                        value={form.nombre}
                        onChangeText={(text) => handleChange('nombre', text)}
                        placeholder="Ingresa tu nombre"
                        placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#888'}
                    />

                    <Text style={styles.label}>Segundo nombre (opcional)</Text>
                    <TextInput
                        style={styles.input}
                        value={form.segundoNombre}
                        onChangeText={(text) => handleChange('segundoNombre', text)}
                        placeholder="Ingresa tu segundo nombre"
                        placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#888'}
                    />

                    <Text style={styles.label}>Apellido paterno *</Text>
                    <TextInput
                        style={styles.input}
                        value={form.apellidoPaterno}
                        onChangeText={(text) => handleChange('apellidoPaterno', text)}
                        placeholder="Ingresa tu apellido paterno"
                        placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#888'}
                    />

                    <Text style={styles.label}>Apellido materno *</Text>
                    <TextInput
                        style={styles.input}
                        value={form.apellidoMaterno}
                        onChangeText={(text) => handleChange('apellidoMaterno', text)}
                        placeholder="Ingresa tu apellido materno"
                        placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#888'}
                    />
                </View>

                {/* Contacto */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Información de Contacto</Text>
                    
                    <Text style={styles.label}>Código de país *</Text>
                    <TouchableOpacity style={styles.selector} onPress={() => setShowCountryPicker(true)}>
                        <Text style={styles.selectorText}>{getCountryLabel()}</Text>
                        <Ionicons name="chevron-down" size={16} color={colorScheme === 'dark' ? '#aaa' : '#888'} />
                    </TouchableOpacity>

                    <Text style={styles.label}>Número de teléfono *</Text>
                    <View style={styles.phoneContainer}>
                        <View style={styles.countryCodeDisplay}>
                            <Text style={styles.countryCodeText}>{form.ladaTelefono}</Text>
                        </View>
                        <TextInput
                            style={[styles.input, styles.phoneInput]}
                            value={form.numeroTelefono}
                            onChangeText={handlePhoneChange}
                            keyboardType="numeric"
                            placeholder={`Número (${maxPhoneLength} dígitos)`}
                            placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#888'}
                            maxLength={maxPhoneLength}
                        />
                    </View>
                </View>

                {/* Fecha de Nacimiento */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Fecha de Nacimiento</Text>
                    
                    <View style={styles.dateContainer}>
                        <TouchableOpacity style={[styles.dateSelector, { flex: 1 }]} onPress={() => setShowDayPicker(true)}>
                            <Text style={styles.dateSelectorText}>{selectedDay.toString().padStart(2, '0')}</Text>
                            <Ionicons name="chevron-down" size={16} color={colorScheme === 'dark' ? '#aaa' : '#888'} />
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.dateSelector, { flex: 2 }]} onPress={() => setShowMonthPicker(true)}>
                            <Text style={styles.dateSelectorText}>
                                {months.find(m => m.value === selectedMonth)?.label || 'Mes'}
                            </Text>
                            <Ionicons name="chevron-down" size={16} color={colorScheme === 'dark' ? '#aaa' : '#888'} />
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.dateSelector, { flex: 1.5 }]} onPress={() => setShowYearPicker(true)}>
                            <Text style={styles.dateSelectorText}>{selectedYear}</Text>
                            <Ionicons name="chevron-down" size={16} color={colorScheme === 'dark' ? '#aaa' : '#888'} />
                        </TouchableOpacity>
                    </View>

                    {form.fechaNacimiento && (
                        <Text style={styles.birthDateDisplay}>
                            Fecha: {form.fechaNacimiento.toLocaleDateString('es-ES')}
                        </Text>
                    )}
                </View>

                {/* Información Personal Adicional */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Información Adicional</Text>
                    
                    <Text style={styles.label}>Género *</Text>
                    <TouchableOpacity style={styles.selector} onPress={() => setShowGeneroPicker(true)}>
                        <Text style={styles.selectorText}>{getGeneroLabel()}</Text>
                        <Ionicons name="chevron-down" size={16} color={colorScheme === 'dark' ? '#aaa' : '#888'} />
                    </TouchableOpacity>

                    <Text style={styles.label}>Estado civil *</Text>
                    <TouchableOpacity style={styles.selector} onPress={() => setShowEstadoCivilPicker(true)}>
                        <Text style={styles.selectorText}>{getEstadoCivilLabel()}</Text>
                        <Ionicons name="chevron-down" size={16} color={colorScheme === 'dark' ? '#aaa' : '#888'} />
                    </TouchableOpacity>

                    <Text style={styles.label}>Ocupación *</Text>
                    <TextInput
                        style={styles.input}
                        value={form.ocupacion}
                        onChangeText={(text) => handleChange('ocupacion', text)}
                        placeholder="Ingresa tu ocupación"
                        placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#888'}
                    />

                    <Text style={styles.label}>Nacionalidad *</Text>
                    <TextInput
                        style={styles.input}
                        value={form.nacionalidad}
                        onChangeText={(text) => handleChange('nacionalidad', text)}
                        placeholder="Ingresa tu nacionalidad"
                        placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#888'}
                    />
                </View>

                {/* Dirección */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Dirección</Text>
                    
                    <Text style={styles.label}>Calle *</Text>
                    <TextInput
                        style={styles.input}
                        value={form.calle}
                        onChangeText={(text) => handleChange('calle', text)}
                        placeholder="Ingresa la calle"
                        placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#888'}
                    />

                    <Text style={styles.label}>Número exterior *</Text>
                    <TextInput
                        style={styles.input}
                        value={form.numeroExterior}
                        onChangeText={(text) => handleChange('numeroExterior', text)}
                        placeholder="Ingresa el número exterior"
                        placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#888'}
                    />

                    <Text style={styles.label}>Colonia *</Text>
                    <TextInput
                        style={styles.input}
                        value={form.colonia}
                        onChangeText={(text) => handleChange('colonia', text)}
                        placeholder="Ingresa la colonia"
                        placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#888'}
                    />

                    <Text style={styles.label}>Código postal *</Text>
                    <TextInput
                        style={styles.input}
                        value={form.codigoPostal}
                        onChangeText={(text) => handleChange('codigoPostal', text)}
                        keyboardType="numeric"
                        placeholder="Ingresa el código postal"
                        placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#888'}
                    />

                    <Text style={styles.label}>Ciudad *</Text>
                    <TextInput
                        style={styles.input}
                        value={form.ciudad}
                        onChangeText={(text) => handleChange('ciudad', text)}
                        placeholder="Ingresa la ciudad"
                        placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#888'}
                    />

                    <Text style={styles.label}>Estado *</Text>
                    <TextInput
                        style={styles.input}
                        value={form.estado}
                        onChangeText={(text) => handleChange('estado', text)}
                        placeholder="Ingresa el estado"
                        placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#888'}
                    />

                    <Text style={styles.label}>País *</Text>
                    <TouchableOpacity style={styles.selector} onPress={() => setShowPaisPicker(true)}>
                        <Text style={styles.selectorText}>{getPaisLabel()}</Text>
                        <Ionicons name="chevron-down" size={16} color={colorScheme === 'dark' ? '#aaa' : '#888'} />
                    </TouchableOpacity>
                </View>

                {/* Información Fiscal */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Información Fiscal</Text>
                    
                    <Text style={styles.label}>RFC</Text>
                    <TextInput
                        style={styles.input}
                        value={form.rfc}
                        onChangeText={(text) => handleChange('rfc', text.toUpperCase())}
                        placeholder="Ingresa tu RFC"
                        placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#888'}
                        autoCapitalize="characters"
                        maxLength={13}
                    />
                </View>

                {/* Botones */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.button, styles.cancelButton]}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.cancelButtonText}>Cancelar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.button,
                            styles.saveButton,
                            { backgroundColor: isFormValid() ? '#d32f2f' : '#bdbdbd' }
                        ]}
                        onPress={handleSave}
                        disabled={!isFormValid()}
                    >
                        <Text style={styles.saveButtonText}>Guardar</Text>
                    </TouchableOpacity>
                </View>

                {/* Modales */}
                {/* Modal selector de país para teléfono */}
                <Modal visible={showCountryPicker} transparent animationType="slide">
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Seleccionar código de país</Text>
                                <TouchableOpacity 
                                    style={styles.closeButton} 
                                    onPress={() => setShowCountryPicker(false)}
                                >
                                    <Text style={styles.closeButtonText}>✕</Text>
                                </TouchableOpacity>
                            </View>
                            {renderSelector(countryCodes, handleCountrySelect, form.ladaTelefono, 'Seleccionar país')}
                        </View>
                    </View>
                </Modal>

                {/* Modal selector de día */}
                <Modal visible={showDayPicker} transparent animationType="slide">
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
                            {renderSelector(days, handleDaySelect, selectedDay, 'Seleccionar día')}
                        </View>
                    </View>
                </Modal>

                {/* Modal selector de mes */}
                <Modal visible={showMonthPicker} transparent animationType="slide">
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
                            {renderSelector(months, handleMonthSelect, selectedMonth, 'Seleccionar mes')}
                        </View>
                    </View>
                </Modal>

                {/* Modal selector de año */}
                <Modal visible={showYearPicker} transparent animationType="slide">
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
                            {renderSelector(years, handleYearSelect, selectedYear, 'Seleccionar año')}
                        </View>
                    </View>
                </Modal>

                {/* Modal selector de género */}
                <Modal visible={showGeneroPicker} transparent animationType="slide">
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Seleccionar género</Text>
                                <TouchableOpacity 
                                    style={styles.closeButton} 
                                    onPress={() => setShowGeneroPicker(false)}
                                >
                                    <Text style={styles.closeButtonText}>✕</Text>
                                </TouchableOpacity>
                            </View>
                            {renderSelector(generoOpciones, handleGeneroSelect, form.genero, 'Seleccionar género')}
                        </View>
                    </View>
                </Modal>

                {/* Modal selector de estado civil */}
                <Modal visible={showEstadoCivilPicker} transparent animationType="slide">
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Seleccionar estado civil</Text>
                                <TouchableOpacity 
                                    style={styles.closeButton} 
                                    onPress={() => setShowEstadoCivilPicker(false)}
                                >
                                    <Text style={styles.closeButtonText}>✕</Text>
                                </TouchableOpacity>
                            </View>
                            {renderSelector(estadoCivilOpciones, handleEstadoCivilSelect, form.estadoCivil, 'Seleccionar estado civil')}
                        </View>
                    </View>
                </Modal>

                {/* Modal selector de país */}
                <Modal visible={showPaisPicker} transparent animationType="slide">
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Seleccionar país</Text>
                                <TouchableOpacity 
                                    style={styles.closeButton} 
                                    onPress={() => setShowPaisPicker(false)}
                                >
                                    <Text style={styles.closeButtonText}>✕</Text>
                                </TouchableOpacity>
                            </View>
                            {renderSelector(paisesOpciones, handlePaisSelect, form.pais, 'Seleccionar país')}
                        </View>
                    </View>
                </Modal>
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
            fontSize: 28,
            fontWeight: 'bold',
            color: '#d32f2f',
            marginBottom: 20,
            textAlign: 'center',
        },
        section: {
            marginBottom: 25,
            backgroundColor: colorScheme === 'dark' ? '#222' : '#fff',
            borderRadius: 12,
            padding: 20,
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 1,
            },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            borderWidth: 1,
            borderColor: colorScheme === 'dark' ? '#333' : '#f0f0f0',
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: '600',
            color: '#d32f2f',
            marginBottom: 15,
            paddingBottom: 8,
            borderBottomWidth: 1,
            borderBottomColor: colorScheme === 'dark' ? '#333' : '#f0f0f0',
        },
        label: {
            fontSize: 14,
            color: colorScheme === 'dark' ? '#eee' : '#181818',
            marginBottom: 5,
            fontWeight: '500',
        },
        input: {
            borderWidth: 1,
            borderColor: colorScheme === 'dark' ? '#555' : '#ccc',
            borderRadius: 8,
            padding: 12,
            marginBottom: 15,
            backgroundColor: colorScheme === 'dark' ? '#333' : '#fff',
            color: colorScheme === 'dark' ? '#fff' : '#181818',
            fontSize: 16,
        },
        selector: {
            borderWidth: 1,
            borderColor: colorScheme === 'dark' ? '#555' : '#ccc',
            borderRadius: 8,
            padding: 12,
            marginBottom: 15,
            backgroundColor: colorScheme === 'dark' ? '#333' : '#fff',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        selectorText: {
            color: colorScheme === 'dark' ? '#fff' : '#181818',
            fontSize: 16,
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
            padding: 12,
            marginRight: 10,
            backgroundColor: colorScheme === 'dark' ? '#444' : '#f5f5f5',
            minWidth: 70,
            alignItems: 'center',
        },
        countryCodeText: {
            color: colorScheme === 'dark' ? '#fff' : '#181818',
            fontWeight: '600',
            fontSize: 16,
        },
        phoneInput: {
            flex: 1,
            marginBottom: 0,
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
            padding: 12,
            backgroundColor: colorScheme === 'dark' ? '#333' : '#fff',
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
        buttonContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 15,
            marginTop: 20,
        },
        button: {
            flex: 1,
            padding: 15,
            borderRadius: 8,
            alignItems: 'center',
        },
        cancelButton: {
            backgroundColor: colorScheme === 'dark' ? '#444' : '#f5f5f5',
            borderWidth: 1,
            borderColor: colorScheme === 'dark' ? '#666' : '#ddd',
        },
        cancelButtonText: {
            color: colorScheme === 'dark' ? '#fff' : '#666',
            fontWeight: '600',
            fontSize: 16,
        },
        saveButton: {
            backgroundColor: '#d32f2f',
        },
        saveButtonText: {
            color: '#fff',
            fontWeight: 'bold',
            fontSize: 16,
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
        selectorItem: {
            padding: 15,
            borderBottomWidth: 1,
            borderBottomColor: colorScheme === 'dark' ? '#333' : '#eee',
        },
        selectedSelectorItem: {
            backgroundColor: colorScheme === 'dark' ? '#d32f2f20' : '#d32f2f10',
        },
        selectorItemText: {
            fontSize: 16,
            color: colorScheme === 'dark' ? '#fff' : '#181818',
        },
        selectedSelectorItemText: {
            color: '#d32f2f',
            fontWeight: '600',
        },
    });
