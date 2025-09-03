import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
    Modal,
    Image,
    Alert,
    ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';

interface DocumentoEstado {
    cargado: boolean;
    uri?: string;
    validado?: boolean;
}

interface DocumentosEstado {
    ine: DocumentoEstado;
    comprobanteDomicilio: DocumentoEstado;
}

export default function DocumentsScreen() {
    const navigation = useNavigation();
    const colorScheme = useColorScheme();
    const styles = getStyles((colorScheme === 'light' || colorScheme === 'dark') ? colorScheme : null);

    const [documentos, setDocumentos] = useState<DocumentosEstado>({
        ine: { cargado: false },
        comprobanteDomicilio: { cargado: false }
    });

    const [modalVisible, setModalVisible] = useState(false);
    const [tipoDocumentoActual, setTipoDocumentoActual] = useState<'ine' | 'comprobanteDomicilio' | null>(null);
    const [imagenSeleccionada, setImagenSeleccionada] = useState<string | null>(null);
    const [cargandoImagen, setCargandoImagen] = useState(false);

    const abrirModal = (tipo: 'ine' | 'comprobanteDomicilio') => {
        setTipoDocumentoActual(tipo);
        setImagenSeleccionada(null);
        setModalVisible(true);
    };

    const cerrarModal = () => {
        setModalVisible(false);
        setTipoDocumentoActual(null);
        setImagenSeleccionada(null);
    };

    const solicitarPermisos = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(
                'Permisos requeridos',
                'Necesitamos acceso a tu galería para seleccionar documentos.',
                [{ text: 'OK' }]
            );
            return false;
        }
        return true;
    };

    const seleccionarImagen = async () => {
        const tienePermisos = await solicitarPermisos();
        if (!tienePermisos) return;

        setCargandoImagen(true);

        try {
            const resultado = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });

            if (!resultado.canceled && resultado.assets[0]) {
                setImagenSeleccionada(resultado.assets[0].uri);
                Toast.show({
                    type: 'success',
                    text1: 'Imagen seleccionada',
                    text2: 'Documento cargado correctamente'
                });
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'No se pudo cargar la imagen'
            });
        } finally {
            setCargandoImagen(false);
        }
    };

    const confirmarDocumento = () => {
        if (!tipoDocumentoActual || !imagenSeleccionada) return;

        setDocumentos(prev => ({
            ...prev,
            [tipoDocumentoActual]: {
                cargado: true,
                uri: imagenSeleccionada,
                validado: false
            }
        }));

        Toast.show({
            type: 'success',
            text1: 'Documento enviado',
            text2: 'Tu documento está en proceso de validación'
        });

        cerrarModal();
    };

    const getDocumentoInfo = (tipo: 'ine' | 'comprobanteDomicilio') => {
        const infos = {
            ine: {
                titulo: 'Identificación oficial (INE)',
                descripcion: 'Sube una foto clara de tu INE por ambos lados',
                icono: 'card-outline' as const,
                color: '#2196F3'
            },
            comprobanteDomicilio: {
                titulo: 'Comprobante de domicilio',
                descripcion: 'Recibo de luz, agua, gas o teléfono (no mayor a 3 meses)',
                icono: 'home-outline' as const,
                color: '#4CAF50'
            }
        };
        return infos[tipo];
    };

    const getEstadoColor = (estado: DocumentoEstado) => {
        if (!estado.cargado) return '#9E9E9E';
        if (estado.validado) return '#4CAF50';
        return '#FF9800';
    };

    const getEstadoTexto = (estado: DocumentoEstado) => {
        if (!estado.cargado) return 'Pendiente';
        if (estado.validado) return 'Validado';
        return 'En revisión';
    };

    const getEstadoIcono = (estado: DocumentoEstado) => {
        if (!estado.cargado) return 'time-outline';
        if (estado.validado) return 'checkmark-circle-outline';
        return 'sync-outline';
    };

    const renderDocumentoCard = (tipo: 'ine' | 'comprobanteDomicilio') => {
        const info = getDocumentoInfo(tipo);
        const estado = documentos[tipo];

        return (
            <TouchableOpacity
                key={tipo}
                style={styles.documentCard}
                onPress={() => abrirModal(tipo)}
            >
                <View style={styles.documentHeader}>
                    <View style={[styles.documentIconContainer, { backgroundColor: info.color }]}>
                        <Ionicons name={info.icono} size={24} color="#fff" />
                    </View>
                    <View style={styles.documentInfo}>
                        <Text style={styles.documentTitulo}>{info.titulo}</Text>
                        <Text style={styles.documentDescripcion}>{info.descripcion}</Text>
                    </View>
                </View>

                <View style={styles.documentFooter}>
                    <View style={styles.estadoContainer}>
                        <Ionicons 
                            name={getEstadoIcono(estado)} 
                            size={16} 
                            color={getEstadoColor(estado)} 
                        />
                        <Text style={[styles.estadoTexto, { color: getEstadoColor(estado) }]}>
                            {getEstadoTexto(estado)}
                        </Text>
                    </View>
                    <Ionicons 
                        name="chevron-forward" 
                        size={20} 
                        color={colorScheme === 'dark' ? '#aaa' : '#666'} 
                    />
                </View>

                {estado.cargado && estado.uri && (
                    <View style={styles.previewContainer}>
                        <Image source={{ uri: estado.uri }} style={styles.previewImage} />
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {/* Header de información */}
                <View style={styles.infoSection}>
                    <View style={styles.infoHeader}>
                        <MaterialIcons name="verified-user" size={32} color="#d32f2f" />
                        <Text style={styles.infoTitle}>Validación de documentos</Text>
                    </View>
                    <Text style={styles.infoDescription}>
                        Sube tus documentos para completar la verificación de tu cuenta. 
                        Esto te permitirá acceder a todas las funcionalidades de la plataforma.
                    </Text>
                </View>

                {/* Documentos */}
                <View style={styles.documentsSection}>
                    <Text style={styles.sectionTitle}>Documentos requeridos</Text>
                    {renderDocumentoCard('ine')}
                    {renderDocumentoCard('comprobanteDomicilio')}
                </View>
            </View>

            {/* Modal para subir documento */}
            <Modal
                visible={modalVisible}
                transparent
                animationType="slide"
                onRequestClose={cerrarModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                {tipoDocumentoActual ? getDocumentoInfo(tipoDocumentoActual).titulo : ''}
                            </Text>
                            <TouchableOpacity
                                style={styles.modalCloseButton}
                                onPress={cerrarModal}
                            >
                                <Ionicons name="close" size={24} color={colorScheme === 'dark' ? '#fff' : '#000'} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalBody}>
                            {/* Instrucciones */}
                            <View style={styles.instructionsContainer}>
                                <Ionicons 
                                    name="information-circle-outline" 
                                    size={20} 
                                    color={colorScheme === 'dark' ? '#4CAF50' : '#2196F3'} 
                                />
                                <Text style={styles.instructionsText}>
                                    {tipoDocumentoActual ? getDocumentoInfo(tipoDocumentoActual).descripcion : ''}
                                </Text>
                            </View>

                            {/* Vista previa de la imagen */}
                            {imagenSeleccionada ? (
                                <View style={styles.imagePreviewContainer}>
                                    <Image source={{ uri: imagenSeleccionada }} style={styles.imagePreview} />
                                    <TouchableOpacity 
                                        style={styles.changeImageButton}
                                        onPress={seleccionarImagen}
                                    >
                                        <Ionicons name="camera-outline" size={20} color="#d32f2f" />
                                        <Text style={styles.changeImageText}>Cambiar imagen</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <TouchableOpacity
                                    style={styles.selectImageButton}
                                    onPress={seleccionarImagen}
                                    disabled={cargandoImagen}
                                >
                                    {cargandoImagen ? (
                                        <ActivityIndicator size="small" color="#d32f2f" />
                                    ) : (
                                        <Ionicons name="camera-outline" size={32} color="#d32f2f" />
                                    )}
                                    <Text style={styles.selectImageText}>
                                        {cargandoImagen ? 'Cargando...' : 'Seleccionar desde galería'}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={cerrarModal}
                            >
                                <Text style={styles.cancelButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.modalButton, 
                                    styles.confirmButton,
                                    !imagenSeleccionada && styles.disabledButton
                                ]}
                                onPress={confirmarDocumento}
                                disabled={!imagenSeleccionada}
                            >
                                <Text style={[
                                    styles.confirmButtonText,
                                    !imagenSeleccionada && styles.disabledButtonText
                                ]}>
                                    Confirmar
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const getStyles = (colorScheme: 'light' | 'dark' | null) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colorScheme === 'dark' ? '#181818' : '#f5f5f5',
        },
        content: {
            flex: 1,
            padding: 20,
        },
        infoSection: {
            backgroundColor: colorScheme === 'dark' ? '#222' : '#fff',
            borderRadius: 12,
            padding: 20,
            marginBottom: 24,
            borderWidth: 1,
            borderColor: colorScheme === 'dark' ? '#333' : '#e0e0e0',
        },
        infoHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 12,
        },
        infoTitle: {
            fontSize: 20,
            fontWeight: '700',
            color: colorScheme === 'dark' ? '#fff' : '#181818',
            marginLeft: 12,
        },
        infoDescription: {
            fontSize: 14,
            color: colorScheme === 'dark' ? '#aaa' : '#666',
            lineHeight: 20,
        },
        documentsSection: {
            flex: 1,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: '600',
            color: colorScheme === 'dark' ? '#fff' : '#181818',
            marginBottom: 16,
        },
        documentCard: {
            backgroundColor: colorScheme === 'dark' ? '#222' : '#fff',
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: colorScheme === 'dark' ? '#333' : '#e0e0e0',
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
        },
        documentHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 12,
        },
        documentIconContainer: {
            width: 48,
            height: 48,
            borderRadius: 24,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 15,
        },
        documentInfo: {
            flex: 1,
        },
        documentTitulo: {
            fontSize: 16,
            fontWeight: '600',
            color: colorScheme === 'dark' ? '#fff' : '#181818',
            marginBottom: 4,
        },
        documentDescripcion: {
            fontSize: 14,
            color: colorScheme === 'dark' ? '#aaa' : '#666',
            lineHeight: 18,
        },
        documentFooter: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: colorScheme === 'dark' ? '#333' : '#f0f0f0',
        },
        estadoContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
        },
        estadoTexto: {
            fontSize: 14,
            fontWeight: '500',
        },
        previewContainer: {
            marginTop: 12,
            alignItems: 'center',
        },
        previewImage: {
            width: 100,
            height: 60,
            borderRadius: 8,
            resizeMode: 'cover',
        },
        // Estilos del modal
        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'flex-end',
        },
        modalContent: {
            backgroundColor: colorScheme === 'dark' ? '#222' : '#fff',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            maxHeight: '85%',
        },
        modalHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 20,
            borderBottomWidth: 1,
            borderBottomColor: colorScheme === 'dark' ? '#333' : '#e0e0e0',
        },
        modalTitle: {
            fontSize: 18,
            fontWeight: '600',
            color: colorScheme === 'dark' ? '#fff' : '#181818',
            flex: 1,
        },
        modalCloseButton: {
            padding: 4,
        },
        modalBody: {
            padding: 20,
        },
        instructionsContainer: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            backgroundColor: colorScheme === 'dark' ? '#1a3d1a' : '#e8f5e8',
            padding: 12,
            borderRadius: 8,
            marginBottom: 24,
            gap: 8,
        },
        instructionsText: {
            flex: 1,
            fontSize: 14,
            color: colorScheme === 'dark' ? '#4CAF50' : '#2e7d2e',
            lineHeight: 18,
        },
        selectImageButton: {
            backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f8f8',
            borderWidth: 2,
            borderColor: '#d32f2f',
            borderStyle: 'dashed',
            borderRadius: 12,
            padding: 40,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
        },
        selectImageText: {
            fontSize: 16,
            color: '#d32f2f',
            fontWeight: '600',
            marginTop: 12,
        },
        imagePreviewContainer: {
            alignItems: 'center',
            marginBottom: 20,
        },
        imagePreview: {
            width: 200,
            height: 150,
            borderRadius: 12,
            resizeMode: 'cover',
            marginBottom: 16,
        },
        changeImageButton: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colorScheme === 'dark' ? '#333' : '#f0f0f0',
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 8,
            gap: 8,
        },
        changeImageText: {
            color: '#d32f2f',
            fontWeight: '500',
        },
        modalFooter: {
            flexDirection: 'row',
            padding: 20,
            gap: 12,
            borderTopWidth: 1,
            borderTopColor: colorScheme === 'dark' ? '#333' : '#e0e0e0',
        },
        modalButton: {
            flex: 1,
            padding: 16,
            borderRadius: 8,
            alignItems: 'center',
        },
        cancelButton: {
            backgroundColor: colorScheme === 'dark' ? '#444' : '#f0f0f0',
        },
        cancelButtonText: {
            color: colorScheme === 'dark' ? '#fff' : '#666',
            fontWeight: '600',
        },
        confirmButton: {
            backgroundColor: '#d32f2f',
        },
        confirmButtonText: {
            color: '#fff',
            fontWeight: '600',
        },
        disabledButton: {
            backgroundColor: colorScheme === 'dark' ? '#333' : '#e0e0e0',
        },
        disabledButtonText: {
            color: colorScheme === 'dark' ? '#666' : '#999',
        },
    });
