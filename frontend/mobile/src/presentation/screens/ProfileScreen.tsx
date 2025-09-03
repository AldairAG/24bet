import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, useColorScheme } from 'react-native';

const initialForm = {
    email: '',
    nombre: '',
    apellido: '',
    ladaTelefono: '',
    numeroTelefono: '',
    fechaNacimiento: '',
    informacionPersonal: {
        primerNombre: '',
        segundoNombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        fechaNacimiento: '',
        genero: '',
        telefono: '',
        calle: '',
        numeroExterior: '',
        colonia: '',
        codigoPostal: '',
        ciudad: '',
        estado: '',
        pais: '',
        rfc: '',
        estadoCivil: '',
        ocupacion: '',
        nacionalidad: ''
    }
};

const generos = ['MASCULINO', 'FEMENINO', 'OTRO'];
const estadosCiviles = ['SOLTERO', 'CASADO', 'DIVORCIADO', 'VIUDO'];
const nacionalidades = ['Mexicana', 'Otra'];

export default function ProfileScreen() {
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState<any>({});
    const colorScheme = useColorScheme();
    const styles = getStyles((colorScheme === 'light' || colorScheme === 'dark') ? colorScheme : null);

    const handleChange = (field: string, value: string) => {
        setForm({ ...form, [field]: value });
    };

    const handleNestedChange = (field: string, value: string) => {
        setForm({
            ...form,
            informacionPersonal: {
                ...form.informacionPersonal,
                [field]: value
            }
        });
    };

    const validate = () => {
        let newErrors: any = {};

        // Campos principales
        if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Correo inválido';
        if (!form.nombre.trim()) newErrors.nombre = 'Nombre requerido';
        if (!form.apellido.trim()) newErrors.apellido = 'Apellido requerido';
        if (!form.ladaTelefono.trim() || !/^\d+$/.test(form.ladaTelefono)) newErrors.ladaTelefono = 'Lada inválida';
        if (!form.numeroTelefono.trim() || !/^\d{7,10}$/.test(form.numeroTelefono)) newErrors.numeroTelefono = 'Teléfono inválido';
        if (!form.fechaNacimiento.trim() || isNaN(Date.parse(form.fechaNacimiento))) newErrors.fechaNacimiento = 'Fecha inválida';

        // Campos de información personal
        const ip = form.informacionPersonal;
        if (!ip.primerNombre.trim()) newErrors.primerNombre = 'Primer nombre requerido';
        if (!ip.apellidoPaterno.trim()) newErrors.apellidoPaterno = 'Apellido paterno requerido';
        if (!ip.apellidoMaterno.trim()) newErrors.apellidoMaterno = 'Apellido materno requerido';
        if (!ip.fechaNacimiento.trim() || isNaN(Date.parse(ip.fechaNacimiento))) newErrors.fechaNacimientoIP = 'Fecha inválida';
        if (!ip.genero.trim() || !generos.includes(ip.genero)) newErrors.genero = 'Género inválido';
        if (!ip.telefono.trim() || !/^\d{10}$/.test(ip.telefono)) newErrors.telefono = 'Teléfono inválido';
        if (!ip.calle.trim()) newErrors.calle = 'Calle requerida';
        if (!ip.numeroExterior.trim()) newErrors.numeroExterior = 'Número exterior requerido';
        if (!ip.colonia.trim()) newErrors.colonia = 'Colonia requerida';
        if (!ip.codigoPostal.trim() || !/^\d{5}$/.test(ip.codigoPostal)) newErrors.codigoPostal = 'Código postal inválido';
        if (!ip.ciudad.trim()) newErrors.ciudad = 'Ciudad requerida';
        if (!ip.estado.trim()) newErrors.estado = 'Estado requerido';
        if (!ip.pais.trim()) newErrors.pais = 'País requerido';
        if (!ip.rfc.trim() || !/^[A-Z]{4}\d{6}[A-Z0-9]{3}$/.test(ip.rfc)) newErrors.rfc = 'RFC inválido';
        if (!ip.estadoCivil.trim() || !estadosCiviles.includes(ip.estadoCivil)) newErrors.estadoCivil = 'Estado civil inválido';
        if (!ip.ocupacion.trim()) newErrors.ocupacion = 'Ocupación requerida';
        if (!ip.nacionalidad.trim() || !nacionalidades.includes(ip.nacionalidad)) newErrors.nacionalidad = 'Nacionalidad inválida';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleUpdate = () => {
        if (validate()) {
            Alert.alert('Actualizado', 'Los datos se actualizaron correctamente.');
            setForm(initialForm);
            setErrors({});
        }
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

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={form.email}
                    onChangeText={v => handleChange('email', v)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#888'}
                />
                {errors.email && <Text style={styles.error}>{errors.email}</Text>}

                <TextInput
                    style={styles.input}
                    placeholder="Nombre"
                    value={form.nombre}
                    onChangeText={v => handleChange('nombre', v)}
                    placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#888'}
                />
                {errors.nombre && <Text style={styles.error}>{errors.nombre}</Text>}

                <TextInput
                    style={styles.input}
                    placeholder="Apellido"
                    value={form.apellido}
                    onChangeText={v => handleChange('apellido', v)}
                    placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#888'}
                />
                {errors.apellido && <Text style={styles.error}>{errors.apellido}</Text>}

                <TextInput
                    style={styles.input}
                    placeholder="Lada Teléfono"
                    value={form.ladaTelefono}
                    onChangeText={v => handleChange('ladaTelefono', v)}
                    keyboardType="numeric"
                    placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#888'}
                />
                {errors.ladaTelefono && <Text style={styles.error}>{errors.ladaTelefono}</Text>}

                <TextInput
                    style={styles.input}
                    placeholder="Número Teléfono"
                    value={form.numeroTelefono}
                    onChangeText={v => handleChange('numeroTelefono', v)}
                    keyboardType="numeric"
                    placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#888'}
                />
                {errors.numeroTelefono && <Text style={styles.error}>{errors.numeroTelefono}</Text>}

                <TextInput
                    style={styles.input}
                    placeholder="Fecha de nacimiento (YYYY-MM-DD)"
                    value={form.fechaNacimiento}
                    onChangeText={v => handleChange('fechaNacimiento', v)}
                    placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#888'}
                />
                {errors.fechaNacimiento && <Text style={styles.error}>{errors.fechaNacimiento}</Text>}

                {/* Información personal */}
                <Text style={styles.subHeader}>Información Personal</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Primer Nombre"
                    value={form.informacionPersonal.primerNombre}
                    onChangeText={v => handleNestedChange('primerNombre', v)}
                    placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#888'}
                />
                {errors.primerNombre && <Text style={styles.error}>{errors.primerNombre}</Text>}

                <TextInput
                    style={styles.input}
                    placeholder="Segundo Nombre"
                    value={form.informacionPersonal.segundoNombre}
                    onChangeText={v => handleNestedChange('segundoNombre', v)}
                    placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#888'}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Apellido Paterno"
                    value={form.informacionPersonal.apellidoPaterno}
                    onChangeText={v => handleNestedChange('apellidoPaterno', v)}
                    placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#888'}
                />
                {errors.apellidoPaterno && <Text style={styles.error}>{errors.apellidoPaterno}</Text>}

                <TextInput
                    style={styles.input}
                    placeholder="Apellido Materno"
                    value={form.informacionPersonal.apellidoMaterno}
                    onChangeText={v => handleNestedChange('apellidoMaterno', v)}
                    placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#888'}
                />
                {errors.apellidoMaterno && <Text style={styles.error}>{errors.apellidoMaterno}</Text>}

                <TextInput
                    style={styles.input}
                    placeholder="Fecha de nacimiento (YYYY-MM-DD)"
                    value={form.informacionPersonal.fechaNacimiento}
                    onChangeText={v => handleNestedChange('fechaNacimiento', v)}
                    placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#888'}
                />
                {errors.fechaNacimientoIP && <Text style={styles.error}>{errors.fechaNacimientoIP}</Text>}

                <TextInput
                    style={styles.input}
                    placeholder="Género (MASCULINO/FEMENINO/OTRO)"
                    value={form.informacionPersonal.genero}
                    onChangeText={v => handleNestedChange('genero', v.toUpperCase())}
                    placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#888'}
                />
                {errors.genero && <Text style={styles.error}>{errors.genero}</Text>}

                <TextInput
                    style={styles.input}
                    placeholder="Teléfono"
                    value={form.informacionPersonal.telefono}
                    onChangeText={v => handleNestedChange('telefono', v)}
                    keyboardType="numeric"
                    placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#888'}
                />
                {errors.telefono && <Text style={styles.error}>{errors.telefono}</Text>}

                <TextInput
                    style={styles.input}
                    placeholder="Calle"
                    value={form.informacionPersonal.calle}
                    onChangeText={v => handleNestedChange('calle', v)}
                    placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#888'}
                />
                {errors.calle && <Text style={styles.error}>{errors.calle}</Text>}

                <TextInput
                    style={styles.input}
                    placeholder="Número Exterior"
                    value={form.informacionPersonal.numeroExterior}
                    onChangeText={v => handleNestedChange('numeroExterior', v)}
                    placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#888'}
                />
                {errors.numeroExterior && <Text style={styles.error}>{errors.numeroExterior}</Text>}

                <TextInput
                    style={styles.input}
                    placeholder="Colonia"
                    value={form.informacionPersonal.colonia}
                    onChangeText={v => handleNestedChange('colonia', v)}
                    placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#888'}
                />
                {errors.colonia && <Text style={styles.error}>{errors.colonia}</Text>}

                <TextInput
                    style={styles.input}
                    placeholder="Código Postal"
                    value={form.informacionPersonal.codigoPostal}
                    onChangeText={v => handleNestedChange('codigoPostal', v)}
                    keyboardType="numeric"
                    placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#888'}
                />
                {errors.codigoPostal && <Text style={styles.error}>{errors.codigoPostal}</Text>}

                <TextInput
                    style={styles.input}
                    placeholder="Ciudad"
                    value={form.informacionPersonal.ciudad}
                    onChangeText={v => handleNestedChange('ciudad', v)}
                    placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#888'}
                />
                {errors.ciudad && <Text style={styles.error}>{errors.ciudad}</Text>}

                <TextInput
                    style={styles.input}
                    placeholder="Estado"
                    value={form.informacionPersonal.estado}
                    onChangeText={v => handleNestedChange('estado', v)}
                    placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#888'}
                />
                {errors.estado && <Text style={styles.error}>{errors.estado}</Text>}

                <TextInput
                    style={styles.input}
                    placeholder="País"
                    value={form.informacionPersonal.pais}
                    onChangeText={v => handleNestedChange('pais', v)}
                    placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#888'}
                />
                {errors.pais && <Text style={styles.error}>{errors.pais}</Text>}

                <TextInput
                    style={styles.input}
                    placeholder="RFC"
                    value={form.informacionPersonal.rfc}
                    onChangeText={v => handleNestedChange('rfc', v.toUpperCase())}
                    autoCapitalize="characters"
                    placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#888'}
                />
                {errors.rfc && <Text style={styles.error}>{errors.rfc}</Text>}

                <TextInput
                    style={styles.input}
                    placeholder="Estado Civil (SOLTERO/CASADO/DIVORCIADO/VIUDO)"
                    value={form.informacionPersonal.estadoCivil}
                    onChangeText={v => handleNestedChange('estadoCivil', v.toUpperCase())}
                    placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#888'}
                />
                {errors.estadoCivil && <Text style={styles.error}>{errors.estadoCivil}</Text>}

                <TextInput
                    style={styles.input}
                    placeholder="Ocupación"
                    value={form.informacionPersonal.ocupacion}
                    onChangeText={v => handleNestedChange('ocupacion', v)}
                    placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#888'}
                />
                {errors.ocupacion && <Text style={styles.error}>{errors.ocupacion}</Text>}

                <TextInput
                    style={styles.input}
                    placeholder="Nacionalidad (Mexicana/Otra)"
                    value={form.informacionPersonal.nacionalidad}
                    onChangeText={v => handleNestedChange('nacionalidad', v)}
                    placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#888'}
                />
                {errors.nacionalidad && <Text style={styles.error}>{errors.nacionalidad}</Text>}

                <TouchableOpacity
                    style={[
                        styles.button,
                        { backgroundColor: Object.keys(errors).length === 0 && form.email ? '#d32f2f' : '#bdbdbd' }
                    ]}
                    onPress={handleUpdate}
                    disabled={Object.keys(errors).length !== 0}
                >
                    <Text style={styles.buttonText}>Actualizar</Text>
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
            flexGrow: 1
        },
        header: {
            fontSize: 28,
            fontWeight: 'bold',
            color: '#d32f2f',
            marginBottom: 10,
            textAlign: 'center'
        },
        subHeader: {
            fontSize: 20,
            fontWeight: '600',
            marginTop: 20,
            marginBottom: 10,
            color: colorScheme === 'dark' ? '#fff' : '#181818'
        },
        input: {
            borderWidth: 1,
            borderColor: colorScheme === 'dark' ? '#555' : '#ccc',
            backgroundColor: colorScheme === 'dark' ? '#222' : '#fff',
            color: colorScheme === 'dark' ? '#fff' : '#181818',
            padding: 10,
            borderRadius: 8,
            marginBottom: 5
        },
        error: {
            color: '#d32f2f',
            fontSize: 12,
            marginBottom: 5,
            marginLeft: 2
        },
        button: {
            marginTop: 20,
            padding: 14,
            borderRadius: 8,
            alignItems: 'center'
        },
        buttonText: {
            color: '#fff',
            fontWeight: 'bold'
        }
    });