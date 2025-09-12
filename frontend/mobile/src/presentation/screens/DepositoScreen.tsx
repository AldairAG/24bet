import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
    Modal,
    TextInput,
    ScrollView,
    Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import Toast from 'react-native-toast-message';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { SolicitudDepositoDto, MetodoPago, TipoCrypto } from '../../types/walletTypes';
import { useWallet } from '../../hooks/useWallet';
import { useAuth } from '../../hooks/useAuth';

interface CriptomonedaInfo {
    id: string;
    nombre: string;
    simbolo: string;
    icono: string;
    color: string;
    wallet: string;
    red: string;
}

// Esquema de validación para el formulario de depósito
const depositoValidationSchema = Yup.object().shape({
    monto: Yup.number()
        .min(10, 'El monto mínimo es $10 USD')
        .max(50000, 'El monto máximo es $50,000 USD')
        .required('El monto es requerido'),
    metodoPago: Yup.string()
        .oneOf(Object.values(MetodoPago), 'Selecciona un método de pago válido')
        .required('El método de pago es requerido'),
    tipoCrypto: Yup.string()
        .oneOf(Object.values(TipoCrypto), 'Selecciona una criptomoneda válida')
        .required('La criptomoneda es requerida'),
    direccionWallet: Yup.string()
        .min(20, 'La dirección de wallet debe tener al menos 20 caracteres')
        .required('La dirección de wallet es requerida')
});

// Valores iniciales del formulario
const initialDepositValues: SolicitudDepositoDto = {
    monto: 0,
    metodoPago: MetodoPago.BITCOIN,
    tipoCrypto: TipoCrypto.BITCOIN,
    direccionWallet: ''
};

const criptomonedas: CriptomonedaInfo[] = [
    {
        id: 'ethereum',
        nombre: 'Ethereum',
        simbolo: 'ETH',
        icono: 'logo-ethereum',
        color: '#627EEA',
        wallet: '0x1234567890abcdef1234567890abcdef12345678',
        red: 'ERC-20'
    },
    {
        id: 'usdt',
        nombre: 'USDT (TRC20)',
        simbolo: 'USDT',
        icono: 'cash-outline',
        color: '#26A17B',
        wallet: 'TRX7n8fjn8fjn8fjn8fjn8fjn8fjn8fjn8fjn8f',
        red: 'TRC-20'
    },
    {
        id: 'bitcoin',
        nombre: 'Bitcoin',
        simbolo: 'BTC',
        icono: 'logo-bitcoin',
        color: '#F7931A',
        wallet: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
        red: 'Bitcoin'
    },
    {
        id: 'solana',
        nombre: 'Solana',
        simbolo: 'SOL',
        icono: 'flash-outline',
        color: '#9945FF',
        wallet: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
        red: 'Solana'
    }
];

export default function DepositoScreen() {
    const colorScheme = useColorScheme();
    const styles = getStyles((colorScheme === 'light' || colorScheme === 'dark') ? colorScheme : null);
    
    // Hooks
    const { createDeposit, isCreatingDepositRequest, depositRequestError, depositRequestResponse, clearDeposit } = useWallet();
    const { user } = useAuth();

    const [modalVisible, setModalVisible] = useState(false);
    const [criptoSeleccionada, setCriptoSeleccionada] = useState<CriptomonedaInfo | null>(null);
    const [qrVisible, setQrVisible] = useState(false);

    // Limpiar respuesta cuando se abra el modal
    useEffect(() => {
        if (modalVisible) {
            clearDeposit();
        }
    }, [modalVisible, clearDeposit]);

    // Manejar respuesta exitosa
    useEffect(() => {
        if (depositRequestResponse) {
            Toast.show({
                type: 'success',
                text1: 'Solicitud de depósito creada',
                text2: depositRequestResponse.mensaje
            });
            setModalVisible(false);
            setCriptoSeleccionada(null);
        }
    }, [depositRequestResponse]);

    // Manejar errores
    useEffect(() => {
        if (depositRequestError) {
            Toast.show({
                type: 'error',
                text1: 'Error en el depósito',
                text2: depositRequestError
            });
        }
    }, [depositRequestError]);

    const abrirModal = (cripto: CriptomonedaInfo) => {
        setCriptoSeleccionada(cripto);
        setModalVisible(true);
    };

    const cerrarModal = () => {
        setModalVisible(false);
        setCriptoSeleccionada(null);
        setQrVisible(false);
    };

    const handleSubmitDeposito = async (values: SolicitudDepositoDto) => {
        if (!user?.id) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Usuario no autenticado'
            });
            return;
        }

        try {
            await createDeposit(user.id, values);
        } catch (error) {
            console.error('Error al crear depósito:', error);
        }
    };

    const copiarWallet = () => {
        if (criptoSeleccionada) {
            // En una app real, aquí usarías Clipboard de react-native
            Toast.show({
                type: 'success',
                text1: 'Copiado',
                text2: 'Dirección de wallet copiada al portapapeles'
            });
        }
    };

    // Mapear criptomoneda a método de pago
    const getMetodoPagoFromCripto = (tipoCrypto: TipoCrypto): MetodoPago => {
        switch (tipoCrypto) {
            case TipoCrypto.BITCOIN:
                return MetodoPago.BITCOIN;
            case TipoCrypto.ETHEREUM:
                return MetodoPago.ETHEREUM;
            case TipoCrypto.USDT:
                return MetodoPago.USDT;
            case TipoCrypto.USDC:
                return MetodoPago.USDC;
            default:
                return MetodoPago.TRANSFERENCIA_CRYPTO;
        }
    };

    const renderCriptoCard = (cripto: CriptomonedaInfo) => (
        <TouchableOpacity
            key={cripto.id}
            style={styles.criptoCard}
            onPress={() => abrirModal(cripto)}
        >
            <View style={[styles.criptoIconContainer, { backgroundColor: cripto.color }]}>
                <Ionicons name={cripto.icono as any} size={32} color="#fff" />
            </View>
            <View style={styles.criptoInfo}>
                <Text style={styles.criptoNombre}>{cripto.nombre}</Text>
                <Text style={styles.criptoSimbolo}>{cripto.simbolo}</Text>
                <Text style={styles.criptoRed}>Red: {cripto.red}</Text>
            </View>
            <Ionicons 
                name="chevron-forward" 
                size={24} 
                color={colorScheme === 'dark' ? '#aaa' : '#666'} 
            />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <ScrollView 
                style={styles.scrollContainer} 
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header de información */}
                <View style={styles.infoSection}>
                    <View style={styles.infoHeader}>
                        <MaterialIcons name="account-balance-wallet" size={32} color="#d32f2f" />
                        <Text style={styles.infoTitle}>Realizar depósito</Text>
                    </View>
                    <Text style={styles.infoDescription}>
                        Selecciona la criptomoneda con la que deseas realizar tu depósito. 
                        Asegúrate de enviar solo la moneda seleccionada a la dirección proporcionada.
                    </Text>
                </View>

                {/* Lista de criptomonedas */}
                <View style={styles.criptosSection}>
                    <Text style={styles.sectionTitle}>Criptomonedas disponibles</Text>
                    {criptomonedas.map(renderCriptoCard)}
                </View>

                {/* Información importante */}
                <View style={styles.warningSection}>
                    <View style={styles.warningHeader}>
                        <Ionicons name="warning-outline" size={20} color="#FF9800" />
                        <Text style={styles.warningTitle}>Importante</Text>
                    </View>
                    <Text style={styles.warningText}>
                        • Los depósitos se procesan automáticamente
                    </Text>
                    <Text style={styles.warningText}>
                        • Tiempo de confirmación: 1-3 confirmaciones de red
                    </Text>
                    <Text style={styles.warningText}>
                        • Monto mínimo: $10 USD
                    </Text>
                </View>
            </ScrollView>

            {/* Modal para realizar depósito */}
            <Modal
                visible={modalVisible}
                transparent
                animationType="slide"
                onRequestClose={cerrarModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <View style={styles.modalTitleContainer}>
                                {criptoSeleccionada && (
                                    <View style={[styles.modalCriptoIcon, { backgroundColor: criptoSeleccionada.color }]}>
                                        <Ionicons name={criptoSeleccionada.icono as any} size={20} color="#fff" />
                                    </View>
                                )}
                                <Text style={styles.modalTitle}>
                                    Depositar {criptoSeleccionada?.nombre}
                                </Text>
                            </View>
                            <TouchableOpacity
                                style={styles.modalCloseButton}
                                onPress={cerrarModal}
                            >
                                <Ionicons name="close" size={24} color={colorScheme === 'dark' ? '#fff' : '#000'} />
                            </TouchableOpacity>
                        </View>

                        <Formik
                            initialValues={{
                                ...initialDepositValues,
                                tipoCrypto: criptoSeleccionada ? 
                                    (Object.values(TipoCrypto).find(crypto => 
                                        crypto === criptoSeleccionada.simbolo
                                    ) || TipoCrypto.BITCOIN) : TipoCrypto.BITCOIN,
                                metodoPago: criptoSeleccionada ? 
                                    getMetodoPagoFromCripto(
                                        Object.values(TipoCrypto).find(crypto => 
                                            crypto === criptoSeleccionada.simbolo
                                        ) || TipoCrypto.BITCOIN
                                    ) : MetodoPago.BITCOIN,
                                direccionWallet: criptoSeleccionada?.wallet || ''
                            }}
                            validationSchema={depositoValidationSchema}
                            onSubmit={handleSubmitDeposito}
                        >
                            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                                <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                                    {/* Instrucciones paso a paso */}
                                    <View style={styles.instructionsSection}>
                                        <Text style={styles.instructionsTitle}>Cómo realizar tu depósito:</Text>
                                        
                                        <View style={styles.stepContainer}>
                                            <View style={styles.stepNumber}>
                                                <Text style={styles.stepNumberText}>1</Text>
                                            </View>
                                            <Text style={styles.stepText}>
                                                Completa el formulario con los datos de tu depósito
                                            </Text>
                                        </View>

                                        <View style={styles.stepContainer}>
                                            <View style={styles.stepNumber}>
                                                <Text style={styles.stepNumberText}>2</Text>
                                            </View>
                                            <Text style={styles.stepText}>
                                                Copia la dirección de wallet o escanea el código QR
                                            </Text>
                                        </View>

                                        <View style={styles.stepContainer}>
                                            <View style={styles.stepNumber}>
                                                <Text style={styles.stepNumberText}>3</Text>
                                            </View>
                                            <Text style={styles.stepText}>
                                                Realiza la transferencia desde tu wallet
                                            </Text>
                                        </View>

                                        <View style={styles.stepContainer}>
                                            <View style={styles.stepNumber}>
                                                <Text style={styles.stepNumberText}>4</Text>
                                            </View>
                                            <Text style={styles.stepText}>
                                                Confirma el depósito y espera las confirmaciones de red
                                            </Text>
                                        </View>
                                    </View>

                                    {/* Formulario de depósito */}
                                    <View style={styles.formSection}>
                                        {/* Campo de cantidad */}
                                        <View style={styles.cantidadSection}>
                                            <Text style={styles.cantidadTitle}>Monto a depositar (USD)</Text>
                                            <View style={styles.cantidadContainer}>
                                                <TextInput
                                                    style={[
                                                        styles.cantidadInput,
                                                        errors.monto && touched.monto && styles.inputError
                                                    ]}
                                                    value={values.monto.toString()}
                                                    onChangeText={(text) => setFieldValue('monto', parseFloat(text) || 0)}
                                                    onBlur={handleBlur('monto')}
                                                    placeholder="Ingresa el monto en USD"
                                                    placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#888'}
                                                    keyboardType="numeric"
                                                />
                                                <Text style={styles.cantidadSimbolo}>USD</Text>
                                            </View>
                                            {errors.monto && touched.monto && (
                                                <Text style={styles.errorText}>{errors.monto}</Text>
                                            )}
                                        </View>

                                        {/* Selección de método de pago */}
                                        <View style={styles.pickerSection}>
                                            <Text style={styles.pickerLabel}>Método de pago</Text>
                                            <View style={[
                                                styles.pickerContainer,
                                                errors.metodoPago && touched.metodoPago && styles.inputError
                                            ]}>
                                                <Text style={styles.selectedValue}>
                                                    {values.metodoPago}
                                                </Text>
                                            </View>
                                            {errors.metodoPago && touched.metodoPago && (
                                                <Text style={styles.errorText}>{errors.metodoPago}</Text>
                                            )}
                                        </View>

                                        {/* Selección de criptomoneda */}
                                        <View style={styles.pickerSection}>
                                            <Text style={styles.pickerLabel}>Criptomoneda</Text>
                                            <View style={[
                                                styles.pickerContainer,
                                                errors.tipoCrypto && touched.tipoCrypto && styles.inputError
                                            ]}>
                                                <Text style={styles.selectedValue}>
                                                    {values.tipoCrypto} - {criptoSeleccionada?.nombre}
                                                </Text>
                                            </View>
                                            {errors.tipoCrypto && touched.tipoCrypto && (
                                                <Text style={styles.errorText}>{errors.tipoCrypto}</Text>
                                            )}
                                        </View>
                                    </View>

                                    {/* Código QR */}
                                    <View style={styles.qrSection}>
                                        <TouchableOpacity 
                                            style={styles.qrToggleButton}
                                            onPress={() => setQrVisible(!qrVisible)}
                                        >
                                            <Text style={styles.qrTitle}>Código QR</Text>
                                            <Ionicons 
                                                name={qrVisible ? "chevron-up" : "chevron-down"} 
                                                size={20} 
                                                color={colorScheme === 'dark' ? '#fff' : '#181818'} 
                                            />
                                        </TouchableOpacity>
                                        
                                        {qrVisible && (
                                            <View style={styles.qrContent}>
                                                <View style={styles.qrContainer}>
                                                    {criptoSeleccionada && (
                                                        <QRCode
                                                            value={values.direccionWallet}
                                                            size={150}
                                                            backgroundColor={colorScheme === 'dark' ? '#fff' : '#fff'}
                                                            color={colorScheme === 'dark' ? '#000' : '#000'}
                                                        />
                                                    )}
                                                </View>
                                                <Text style={styles.qrSubtitle}>
                                                    Escanea este código QR desde tu wallet para obtener automáticamente la dirección
                                                </Text>
                                            </View>
                                        )}
                                    </View>

                                    {/* Dirección de wallet */}
                                    <View style={styles.walletSection}>
                                        <Text style={styles.walletTitle}>Dirección de wallet</Text>
                                        <View style={styles.walletContainer}>
                                            <Text style={styles.walletText} numberOfLines={2}>
                                                {values.direccionWallet}
                                            </Text>
                                            <TouchableOpacity
                                                style={styles.copyButton}
                                                onPress={copiarWallet}
                                            >
                                                <Ionicons name="copy-outline" size={20} color="#d32f2f" />
                                            </TouchableOpacity>
                                        </View>
                                        <Text style={styles.redInfo}>
                                            Red: {criptoSeleccionada?.red}
                                        </Text>
                                    </View>

                                    {/* Información de la transacción */}
                                    <View style={styles.infoTransaccion}>
                                        <View style={styles.infoRow}>
                                            <Text style={styles.infoLabel}>Red:</Text>
                                            <Text style={styles.infoValue}>{criptoSeleccionada?.red}</Text>
                                        </View>
                                        <View style={styles.infoRow}>
                                            <Text style={styles.infoLabel}>Método:</Text>
                                            <Text style={styles.infoValue}>{values.metodoPago}</Text>
                                        </View>
                                        <View style={styles.infoRow}>
                                            <Text style={styles.infoLabel}>Criptomoneda:</Text>
                                            <Text style={styles.infoValue}>{values.tipoCrypto}</Text>
                                        </View>
                                        <View style={styles.infoRow}>
                                            <Text style={styles.infoLabel}>Monto:</Text>
                                            <Text style={styles.infoValue}>${values.monto} USD</Text>
                                        </View>
                                        <View style={styles.infoRow}>
                                            <Text style={styles.infoLabel}>Tiempo estimado:</Text>
                                            <Text style={styles.infoValue}>1-3 confirmaciones</Text>
                                        </View>
                                        <View style={styles.infoRow}>
                                            <Text style={styles.infoLabel}>Monto mínimo:</Text>
                                            <Text style={styles.infoValue}>$10 USD</Text>
                                        </View>
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
                                                styles.depositButton,
                                                (Object.keys(errors).length > 0 || isCreatingDepositRequest) && styles.disabledButton
                                            ]}
                                            onPress={() => handleSubmit()}
                                            disabled={Object.keys(errors).length > 0 || isCreatingDepositRequest}
                                        >
                                            <Text style={[
                                                styles.depositButtonText,
                                                (Object.keys(errors).length > 0 || isCreatingDepositRequest) && styles.disabledButtonText
                                            ]}>
                                                {isCreatingDepositRequest ? 'Procesando...' : 'Crear solicitud de depósito'}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </ScrollView>
                            )}
                        </Formik>
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
        scrollContainer: {
            flex: 1,
        },
        scrollContent: {
            padding: 20,
            paddingBottom: 100, // Espacio extra para evitar que se corte el contenido
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
        criptosSection: {
            marginBottom: 20,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: '600',
            color: colorScheme === 'dark' ? '#fff' : '#181818',
            marginBottom: 16,
        },
        criptoCard: {
            backgroundColor: colorScheme === 'dark' ? '#222' : '#fff',
            borderRadius: 12,
            padding: 16,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: colorScheme === 'dark' ? '#333' : '#e0e0e0',
            flexDirection: 'row',
            alignItems: 'center',
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
        },
        criptoIconContainer: {
            width: 56,
            height: 56,
            borderRadius: 28,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 16,
        },
        criptoInfo: {
            flex: 1,
        },
        criptoNombre: {
            fontSize: 16,
            fontWeight: '600',
            color: colorScheme === 'dark' ? '#fff' : '#181818',
            marginBottom: 4,
        },
        criptoSimbolo: {
            fontSize: 14,
            fontWeight: '500',
            color: colorScheme === 'dark' ? '#ccc' : '#555',
            marginBottom: 2,
        },
        criptoRed: {
            fontSize: 12,
            color: colorScheme === 'dark' ? '#aaa' : '#666',
        },
        warningSection: {
            backgroundColor: colorScheme === 'dark' ? '#2a1f0a' : '#fff8e1',
            borderRadius: 8,
            padding: 16,
            borderWidth: 1,
            borderColor: colorScheme === 'dark' ? '#404020' : '#ffecb3',
        },
        warningHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
        },
        warningTitle: {
            fontSize: 14,
            fontWeight: '600',
            color: '#FF9800',
            marginLeft: 8,
        },
        warningText: {
            fontSize: 12,
            color: colorScheme === 'dark' ? '#ffb74d' : '#f57f17',
            marginBottom: 4,
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
            maxHeight: '90%',
        },
        modalHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 20,
            borderBottomWidth: 1,
            borderBottomColor: colorScheme === 'dark' ? '#333' : '#e0e0e0',
        },
        modalTitleContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
        },
        modalCriptoIcon: {
            width: 32,
            height: 32,
            borderRadius: 16,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
        },
        modalTitle: {
            fontSize: 18,
            fontWeight: '600',
            color: colorScheme === 'dark' ? '#fff' : '#181818',
        },
        modalCloseButton: {
            padding: 4,
        },
        modalBody: {
            padding: 20,
            maxHeight: 500,
        },
        // Estilos para instrucciones paso a paso
        instructionsSection: {
            backgroundColor: colorScheme === 'dark' ? '#1a2a1a' : '#e8f5e8',
            borderRadius: 12,
            padding: 16,
            marginBottom: 24,
            borderWidth: 1,
            borderColor: colorScheme === 'dark' ? '#2a5a2a' : '#c8e6c9',
        },
        instructionsTitle: {
            fontSize: 16,
            fontWeight: '700',
            color: colorScheme === 'dark' ? '#4CAF50' : '#2e7d2e',
            marginBottom: 16,
            textAlign: 'center',
        },
        stepContainer: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginBottom: 12,
            paddingHorizontal: 8,
        },
        stepNumber: {
            width: 24,
            height: 24,
            borderRadius: 12,
            backgroundColor: '#d32f2f',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
            marginTop: 2,
        },
        stepNumberText: {
            color: '#fff',
            fontSize: 12,
            fontWeight: '700',
        },
        stepText: {
            flex: 1,
            fontSize: 14,
            color: colorScheme === 'dark' ? '#4CAF50' : '#2e7d2e',
            lineHeight: 20,
        },
        qrSection: {
            marginBottom: 24,
        },
        qrToggleButton: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f8f8',
            padding: 16,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: colorScheme === 'dark' ? '#444' : '#e0e0e0',
        },
        qrContent: {
            alignItems: 'center',
            marginTop: 16,
        },
        qrTitle: {
            fontSize: 16,
            fontWeight: '600',
            color: colorScheme === 'dark' ? '#fff' : '#181818',
        },
        qrContainer: {
            backgroundColor: '#fff',
            padding: 16,
            borderRadius: 12,
            marginBottom: 12,
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
        },
        qrSubtitle: {
            fontSize: 12,
            color: colorScheme === 'dark' ? '#aaa' : '#666',
            textAlign: 'center',
            lineHeight: 16,
            marginTop: 8,
        },
        walletSection: {
            marginBottom: 24,
        },
        walletTitle: {
            fontSize: 16,
            fontWeight: '600',
            color: colorScheme === 'dark' ? '#fff' : '#181818',
            marginBottom: 12,
        },
        walletContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f8f8',
            borderRadius: 8,
            padding: 12,
            borderWidth: 1,
            borderColor: colorScheme === 'dark' ? '#444' : '#e0e0e0',
        },
        walletText: {
            flex: 1,
            fontSize: 12,
            color: colorScheme === 'dark' ? '#fff' : '#181818',
            fontFamily: 'monospace',
        },
        copyButton: {
            padding: 8,
            marginLeft: 8,
        },
        redInfo: {
            fontSize: 12,
            color: colorScheme === 'dark' ? '#aaa' : '#666',
            marginTop: 8,
        },
        cantidadSection: {
            marginBottom: 24,
        },
        cantidadTitle: {
            fontSize: 16,
            fontWeight: '600',
            color: colorScheme === 'dark' ? '#fff' : '#181818',
            marginBottom: 12,
        },
        cantidadContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: colorScheme === 'dark' ? '#444' : '#e0e0e0',
            borderRadius: 8,
            backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f8f8',
        },
        cantidadInput: {
            flex: 1,
            padding: 12,
            fontSize: 16,
            color: colorScheme === 'dark' ? '#fff' : '#181818',
        },
        cantidadSimbolo: {
            fontSize: 16,
            fontWeight: '600',
            color: '#d32f2f',
            paddingHorizontal: 12,
        },
        infoTransaccion: {
            backgroundColor: colorScheme === 'dark' ? '#2a2a2a' : '#f9f9f9',
            borderRadius: 8,
            padding: 16,
            marginBottom: 20,
        },
        infoRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
        },
        infoLabel: {
            fontSize: 14,
            color: colorScheme === 'dark' ? '#aaa' : '#666',
        },
        infoValue: {
            fontSize: 14,
            fontWeight: '500',
            color: colorScheme === 'dark' ? '#fff' : '#181818',
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
        depositButton: {
            backgroundColor: '#d32f2f',
        },
        depositButtonText: {
            color: '#fff',
            fontWeight: '600',
        },
        disabledButton: {
            backgroundColor: colorScheme === 'dark' ? '#333' : '#e0e0e0',
        },
        disabledButtonText: {
            color: colorScheme === 'dark' ? '#666' : '#999',
        },
        // Estilos para el formulario
        formSection: {
            marginBottom: 24,
        },
        inputError: {
            borderColor: '#f44336',
            borderWidth: 2,
        },
        errorText: {
            color: '#f44336',
            fontSize: 12,
            marginTop: 4,
            marginLeft: 4,
        },
        pickerSection: {
            marginBottom: 16,
        },
        pickerLabel: {
            fontSize: 16,
            fontWeight: '600',
            color: colorScheme === 'dark' ? '#fff' : '#181818',
            marginBottom: 8,
        },
        pickerContainer: {
            backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f8f8',
            borderRadius: 8,
            padding: 12,
            borderWidth: 1,
            borderColor: colorScheme === 'dark' ? '#444' : '#e0e0e0',
            minHeight: 48,
            justifyContent: 'center',
        },
        selectedValue: {
            fontSize: 16,
            color: colorScheme === 'dark' ? '#fff' : '#181818',
            fontWeight: '500',
        },
    });
