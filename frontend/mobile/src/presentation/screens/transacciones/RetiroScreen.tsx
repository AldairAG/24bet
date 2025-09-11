import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Modal,
    TouchableOpacity,
    TextInput,
    Alert,
    useColorScheme,
    Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { getExchangeRates } from '../../../service/crypto/cryptoService';
import { CryptoPrice } from '../../../types/CryptoTypes';
import { 
    WalletInfo, 
    SolicitudRetiro, 
    RetiroFormValues, 
    WalletFormValues,
    CriptomonedaConfig,
    CriptomonedaType
} from '../../../types/withdrawTypes';

const criptomonedas: Record<CriptomonedaType, CriptomonedaConfig> = {
    'bitcoin': {
        nombre: 'Bitcoin',
        simbolo: 'BTC',
        icono: 'logo-bitcoin',
        color: '#F7931A',
        tasaCambio: 43500, // USD por BTC (ejemplo)
    },
    'ethereum': {
        nombre: 'Ethereum',
        simbolo: 'ETH',
        icono: 'logo-ethereum',
        color: '#627EEA',
        tasaCambio: 2650, // USD por ETH (ejemplo)
    },
    'usdt': {
        nombre: 'USDT (TRC20)',
        simbolo: 'USDT',
        icono: 'cash-outline',
        color: '#26A17B',
        tasaCambio: 1, // USD por USDT
    },
    'solana': {
        nombre: 'Solana',
        simbolo: 'SOL',
        icono: 'flash-outline',
        color: '#9945FF',
        tasaCambio: 98, // USD por SOL (ejemplo)
    },
};

// Esquemas de validación con Yup
const retiroValidationSchema = Yup.object().shape({
    cantidadUSD: Yup.number()
        .min(10, 'El monto mínimo de retiro es $10 USD')
        .max(50000, 'El monto máximo de retiro es $50,000 USD')
        .required('La cantidad es obligatoria')
        .typeError('Debe ser un número válido'),
});

const walletValidationSchema = Yup.object().shape({
    nombre: Yup.string()
        .min(3, 'El nombre debe tener al menos 3 caracteres')
        .max(50, 'El nombre no puede tener más de 50 caracteres')
        .required('El nombre es obligatorio'),
    direccion: Yup.string()
        .min(10, 'La dirección debe tener al menos 10 caracteres')
        .max(200, 'La dirección no puede tener más de 200 caracteres')
        .required('La dirección es obligatoria'),
    criptomoneda: Yup.string()
        .oneOf(Object.keys(criptomonedas), 'Selecciona una criptomoneda válida')
        .required('La criptomoneda es obligatoria'),
});

export default function RetiroScreen() {
    const navigation = useNavigation();
    const colorScheme = useColorScheme();
    const styles = getStyles((colorScheme === 'light' || colorScheme === 'dark') ? colorScheme : null);
    const [exchangeRates, setExchangeRates] = useState<CryptoPrice | null>(null);

    useEffect(() => {
        getExchangeRates().then((data) => {
            setExchangeRates(data);
        });
    }, []);

    // Estados principales
    const [wallets, setWallets] = useState<WalletInfo[]>([]);
    const [solicitudesRetiro, setSolicitudesRetiro] = useState<SolicitudRetiro[]>([]);
    
    // Estados para modales
    const [modalAgregarVisible, setModalAgregarVisible] = useState(false);
    const [modalRetiroVisible, setModalRetiroVisible] = useState(false);
    
    // Estado para wallet seleccionada
    const [walletSeleccionada, setWalletSeleccionada] = useState<WalletInfo | null>(null);

    // Simular carga de datos inicial
    useEffect(() => {
        cargarWallets();
        cargarSolicitudesRetiro();
    }, []);

    const cargarWallets = () => {
        // Simular wallets guardadas (en producción vendría de la API)
        const walletsGuardadas: WalletInfo[] = [
            {
                id: '1',
                nombre: 'Mi wallet Bitcoin',
                direccion: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
                criptomoneda: 'bitcoin',
                simbolo: 'BTC',
                icono: 'logo-bitcoin',
                color: '#F7931A',
            },
            {
                id: '2',
                nombre: 'Mi wallet USDT',
                direccion: 'TRX7n8fjn8fjn8fjn8fjn8fjn8fjn8fjn8fjn8f',
                criptomoneda: 'usdt',
                simbolo: 'USDT',
                icono: 'cash-outline',
                color: '#26A17B',
            },
        ];
        setWallets(walletsGuardadas);
    };

    const cargarSolicitudesRetiro = () => {
        // Simular solicitudes de retiro (en producción vendría de la API)
        const solicitudes: SolicitudRetiro[] = [
            {
                id: '1',
                walletId: '1',
                cantidadUSD: 500,
                cantidadCripto: 0.0115,
                simbolo: 'BTC',
                estado: 'pendiente',
                fechaCreacion: new Date(),
            },
        ];
        setSolicitudesRetiro(solicitudes);
    };

    const calcularCantidadCripto = (cantidadUSD: string, criptomoneda: string) => {
        const cantidad = parseFloat(cantidadUSD);
        if (!cantidad || !criptomonedas[criptomoneda as CriptomonedaType]) return 0;
        
        const tasa = criptomonedas[criptomoneda as CriptomonedaType].tasaCambio;
        return cantidad / tasa;
    };

    const abrirModalAgregar = () => {
        setModalAgregarVisible(true);
    };

    const cerrarModalAgregar = () => {
        setModalAgregarVisible(false);
    };

    const guardarWallet = (values: WalletFormValues) => {
        const criptoInfo = criptomonedas[values.criptomoneda as CriptomonedaType];
        if (!criptoInfo) return;

        const nuevaWalletInfo: WalletInfo = {
            id: Date.now().toString(),
            nombre: values.nombre.trim(),
            direccion: values.direccion.trim(),
            criptomoneda: values.criptomoneda,
            simbolo: criptoInfo.simbolo,
            icono: criptoInfo.icono,
            color: criptoInfo.color,
        };

        setWallets(prev => [...prev, nuevaWalletInfo]);
        cerrarModalAgregar();
        
        Toast.show({
            type: 'success',
            text1: 'Wallet agregada',
            text2: 'Tu wallet ha sido guardada correctamente'
        });
    };

    const abrirModalRetiro = (wallet: WalletInfo) => {
        setWalletSeleccionada(wallet);
        setModalRetiroVisible(true);
    };

    const cerrarModalRetiro = () => {
        setModalRetiroVisible(false);
        setWalletSeleccionada(null);
    };

    const solicitarRetiro = (values: RetiroFormValues) => {
        if (!walletSeleccionada) return;

        const cantidadCripto = calcularCantidadCripto(values.cantidadUSD, walletSeleccionada.criptomoneda);

        Alert.alert(
            'Confirmar solicitud de retiro',
            `¿Deseas solicitar el retiro de $${values.cantidadUSD} USD (${cantidadCripto.toFixed(8)} ${walletSeleccionada.simbolo}) a tu wallet "${walletSeleccionada.nombre}"?`,
            [
                {
                    text: 'Cancelar',
                    style: 'cancel'
                },
                {
                    text: 'Confirmar',
                    onPress: () => {
                        const nuevaSolicitud: SolicitudRetiro = {
                            id: Date.now().toString(),
                            walletId: walletSeleccionada.id,
                            cantidadUSD: parseFloat(values.cantidadUSD),
                            cantidadCripto: cantidadCripto,
                            simbolo: walletSeleccionada.simbolo,
                            estado: 'pendiente',
                            fechaCreacion: new Date(),
                        };

                        setSolicitudesRetiro(prev => [nuevaSolicitud, ...prev]);
                        cerrarModalRetiro();

                        Toast.show({
                            type: 'success',
                            text1: 'Solicitud enviada',
                            text2: 'Tu solicitud de retiro está siendo procesada'
                        });
                    }
                }
            ]
        );
    };

    const eliminarWallet = (walletId: string) => {
        Alert.alert(
            'Eliminar wallet',
            '¿Estás seguro de que quieres eliminar esta wallet?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel'
                },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: () => {
                        setWallets(prev => prev.filter(w => w.id !== walletId));
                        Toast.show({
                            type: 'success',
                            text1: 'Wallet eliminada',
                            text2: 'La wallet ha sido eliminada correctamente'
                        });
                    }
                }
            ]
        );
    };

    const renderWalletCard = (wallet: WalletInfo) => (
        <View key={wallet.id} style={styles.walletCard}>
            <View style={styles.walletHeader}>
                <View style={[styles.walletIconContainer, { backgroundColor: wallet.color }]}>
                    <Ionicons name={wallet.icono as any} size={24} color="#fff" />
                </View>
                <View style={styles.walletInfo}>
                    <Text style={styles.walletNombre}>{wallet.nombre}</Text>
                    <Text style={styles.walletSimbolo}>{wallet.simbolo}</Text>
                    <Text style={styles.walletDireccion} numberOfLines={1}>
                        {wallet.direccion}
                    </Text>
                </View>
                <View style={styles.walletActions}>
                    <TouchableOpacity 
                        style={[styles.actionButton, styles.retiroButton]}
                        onPress={() => abrirModalRetiro(wallet)}
                    >
                        <MaterialIcons name="attach-money" size={16} color="#fff" />
                        <Text style={styles.actionButtonText}>Retirar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.actionButton, styles.deleteButton]}
                        onPress={() => eliminarWallet(wallet.id)}
                    >
                        <Ionicons name="trash-outline" size={16} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    const renderSolicitudCard = (solicitud: SolicitudRetiro) => {
        const wallet = wallets.find(w => w.id === solicitud.walletId);
        const estadoColor = {
            pendiente: '#FF9800',
            aprobado: '#4CAF50',
            rechazado: '#f44336',
        };

        return (
            <View key={solicitud.id} style={styles.solicitudCard}>
                <View style={styles.solicitudHeader}>
                    <Text style={styles.solicitudTitulo}>
                        Retiro de ${solicitud.cantidadUSD} USD
                    </Text>
                    <View style={[styles.estadoBadge, { backgroundColor: estadoColor[solicitud.estado] }]}>
                        <Text style={styles.estadoText}>{solicitud.estado.toUpperCase()}</Text>
                    </View>
                </View>
                <Text style={styles.solicitudDetalle}>
                    {solicitud.cantidadCripto.toFixed(8)} {solicitud.simbolo}
                </Text>
                <Text style={styles.solicitudWallet}>
                    Wallet: {wallet?.nombre || 'Wallet eliminada'}
                </Text>
                <Text style={styles.solicitudFecha}>
                    {solicitud.fechaCreacion.toLocaleDateString()}
                </Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
                {/* Sección de información */}
                <View style={styles.infoSection}>
                    <View style={styles.infoHeader}>
                        <MaterialIcons name="account-balance-wallet" size={24} color="#d32f2f" />
                        <Text style={styles.infoTitle}>Retiros de Criptomonedas</Text>
                    </View>
                    <Text style={styles.infoDescription}>
                        Gestiona tus wallets y solicita retiros de tus ganancias. Las solicitudes serán revisadas y procesadas por nuestro equipo.
                    </Text>
                </View>

                {/* Sección de Wallets */}
                <View style={styles.walletsSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Mis Wallets</Text>
                        <TouchableOpacity style={styles.addButton} onPress={abrirModalAgregar}>
                            <Ionicons name="add" size={20} color="#fff" />
                            <Text style={styles.addButtonText}>Agregar</Text>
                        </TouchableOpacity>
                    </View>

                    {wallets.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Ionicons name="wallet-outline" size={48} color={colorScheme === 'dark' ? '#666' : '#ccc'} />
                            <Text style={styles.emptyStateText}>
                                No tienes wallets guardadas
                            </Text>
                            <Text style={styles.emptyStateSubtext}>
                                Agrega una wallet para poder realizar retiros
                            </Text>
                        </View>
                    ) : (
                        wallets.map(renderWalletCard)
                    )}
                </View>

                {/* Sección de Solicitudes */}
                {solicitudesRetiro.length > 0 && (
                    <View style={styles.solicitudesSection}>
                        <Text style={styles.sectionTitle}>Mis Solicitudes</Text>
                        {solicitudesRetiro.map(renderSolicitudCard)}
                    </View>
                )}

                {/* Sección de advertencias */}
                <View style={styles.warningSection}>
                    <View style={styles.warningHeader}>
                        <Ionicons name="warning-outline" size={20} color="#FF9800" />
                        <Text style={styles.warningTitle}>Información importante</Text>
                    </View>
                    <Text style={styles.warningText}>• Monto mínimo de retiro: $10 USD</Text>
                    <Text style={styles.warningText}>• Las solicitudes son procesadas en 24-48 horas</Text>
                    <Text style={styles.warningText}>• Verifica la dirección de tu wallet antes de solicitar</Text>
                    <Text style={styles.warningText}>• Los retiros solo se procesan en días hábiles</Text>
                </View>
            </ScrollView>

            {/* Modal para agregar wallet */}
            <Modal
                visible={modalAgregarVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={cerrarModalAgregar}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Agregar Nueva Wallet</Text>
                            <TouchableOpacity onPress={cerrarModalAgregar}>
                                <Ionicons name="close" size={24} color={colorScheme === 'dark' ? '#fff' : '#181818'} />
                            </TouchableOpacity>
                        </View>

                        <Formik<WalletFormValues>
                            initialValues={{
                                nombre: '',
                                direccion: '',
                                criptomoneda: '',
                            }}
                            validationSchema={walletValidationSchema}
                            onSubmit={(values, { resetForm }) => {
                                guardarWallet(values);
                                resetForm();
                            }}
                        >
                            {({ values, errors, touched, handleChange, handleSubmit, setFieldValue, isValid }) => (
                                <>
                                    <ScrollView style={styles.modalBody}>
                                        <View style={styles.inputSection}>
                                            <Text style={styles.inputLabel}>Nombre de la wallet</Text>
                                            <TextInput
                                                style={[
                                                    styles.textInput,
                                                    touched.nombre && errors.nombre && styles.textInputError
                                                ]}
                                                value={values.nombre}
                                                onChangeText={handleChange('nombre')}
                                                placeholder="Ej: Mi wallet Bitcoin"
                                                placeholderTextColor={colorScheme === 'dark' ? '#666' : '#999'}
                                            />
                                            {touched.nombre && errors.nombre && (
                                                <Text style={styles.errorText}>{errors.nombre}</Text>
                                            )}
                                        </View>

                                        <View style={styles.inputSection}>
                                            <Text style={styles.inputLabel}>Dirección de la wallet</Text>
                                            <TextInput
                                                style={[
                                                    styles.textInput, 
                                                    styles.textArea,
                                                    touched.direccion && errors.direccion && styles.textInputError
                                                ]}
                                                value={values.direccion}
                                                onChangeText={handleChange('direccion')}
                                                placeholder="Ingresa la dirección de tu wallet"
                                                placeholderTextColor={colorScheme === 'dark' ? '#666' : '#999'}
                                                multiline
                                            />
                                            {touched.direccion && errors.direccion && (
                                                <Text style={styles.errorText}>{errors.direccion}</Text>
                                            )}
                                        </View>

                                        <View style={styles.inputSection}>
                                            <Text style={styles.inputLabel}>Tipo de criptomoneda</Text>
                                            <View style={styles.criptoOptions}>
                                                {Object.entries(criptomonedas).map(([key, cripto]) => (
                                                    <TouchableOpacity
                                                        key={key}
                                                        style={[
                                                            styles.criptoOption,
                                                            values.criptomoneda === key && styles.criptoOptionSelected
                                                        ]}
                                                        onPress={() => setFieldValue('criptomoneda', key)}
                                                    >
                                                        <View style={[styles.criptoOptionIcon, { backgroundColor: cripto.color }]}>
                                                            <Ionicons name={cripto.icono as any} size={20} color="#fff" />
                                                        </View>
                                                        <Text style={styles.criptoOptionText}>{cripto.nombre}</Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                            {touched.criptomoneda && errors.criptomoneda && (
                                                <Text style={styles.errorText}>{errors.criptomoneda}</Text>
                                            )}
                                        </View>
                                    </ScrollView>

                                    <View style={styles.modalFooter}>
                                        <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={cerrarModalAgregar}>
                                            <Text style={styles.cancelButtonText}>Cancelar</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity 
                                            style={[
                                                styles.modalButton, 
                                                styles.saveButton,
                                                !isValid && styles.disabledButton
                                            ]} 
                                            onPress={() => handleSubmit()}
                                            disabled={!isValid}
                                        >
                                            <Text style={[
                                                styles.saveButtonText,
                                                !isValid && styles.disabledButtonText
                                            ]}>
                                                Guardar
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            )}
                        </Formik>
                    </View>
                </View>
            </Modal>

            {/* Modal para solicitar retiro */}
            <Modal
                visible={modalRetiroVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={cerrarModalRetiro}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <View style={styles.modalTitleContainer}>
                                {walletSeleccionada && (
                                    <View style={[styles.modalCriptoIcon, { backgroundColor: walletSeleccionada.color }]}>
                                        <Ionicons name={walletSeleccionada.icono as any} size={20} color="#fff" />
                                    </View>
                                )}
                                <Text style={styles.modalTitle}>Solicitar Retiro</Text>
                            </View>
                            <TouchableOpacity onPress={cerrarModalRetiro}>
                                <Ionicons name="close" size={24} color={colorScheme === 'dark' ? '#fff' : '#181818'} />
                            </TouchableOpacity>
                        </View>

                        <Formik<RetiroFormValues>
                            initialValues={{
                                cantidadUSD: '',
                            }}
                            validationSchema={retiroValidationSchema}
                            onSubmit={(values, { resetForm }) => {
                                solicitarRetiro(values);
                                resetForm();
                            }}
                        >
                            {({ values, errors, touched, handleChange, handleSubmit, isValid }) => {
                                const cantidadCripto = walletSeleccionada 
                                    ? calcularCantidadCripto(values.cantidadUSD, walletSeleccionada.criptomoneda)
                                    : 0;

                                return (
                                    <>
                                        <ScrollView style={styles.modalBody}>
                                            {walletSeleccionada && (
                                                <>
                                                    <View style={styles.walletSelectedInfo}>
                                                        <Text style={styles.walletSelectedTitle}>Wallet seleccionada:</Text>
                                                        <Text style={styles.walletSelectedName}>{walletSeleccionada.nombre}</Text>
                                                        <Text style={styles.walletSelectedAddress} numberOfLines={1}>
                                                            {walletSeleccionada.direccion}
                                                        </Text>
                                                    </View>

                                                    <View style={styles.cantidadSection}>
                                                        <Text style={styles.cantidadTitle}>Cantidad a retirar (USD)</Text>
                                                        <View style={styles.cantidadContainer}>
                                                            <Text style={styles.cantidadSimbolo}>$</Text>
                                                            <TextInput
                                                                style={[
                                                                    styles.cantidadInput,
                                                                    touched.cantidadUSD && errors.cantidadUSD && styles.textInputError
                                                                ]}
                                                                value={values.cantidadUSD}
                                                                onChangeText={handleChange('cantidadUSD')}
                                                                placeholder="0.00"
                                                                placeholderTextColor={colorScheme === 'dark' ? '#666' : '#999'}
                                                                keyboardType="numeric"
                                                            />
                                                            <Text style={styles.cantidadSimbolo}>USD</Text>
                                                        </View>
                                                        {touched.cantidadUSD && errors.cantidadUSD && (
                                                            <Text style={styles.errorText}>{errors.cantidadUSD}</Text>
                                                        )}
                                                        
                                                        {cantidadCripto > 0 && (
                                                            <View style={styles.conversionInfo}>
                                                                <Text style={styles.conversionText}>
                                                                    ≈ {cantidadCripto.toFixed(8)} {walletSeleccionada.simbolo}
                                                                </Text>
                                                                <Text style={styles.conversionRate}>
                                                                    Tasa: 1 {walletSeleccionada.simbolo} = ${criptomonedas[walletSeleccionada.criptomoneda as CriptomonedaType]?.tasaCambio.toLocaleString()} USD
                                                                </Text>
                                                            </View>
                                                        )}
                                                    </View>

                                                    <View style={styles.infoTransaccion}>
                                                        <View style={styles.infoRow}>
                                                            <Text style={styles.infoLabel}>Monto mínimo:</Text>
                                                            <Text style={styles.infoValue}>$10 USD</Text>
                                                        </View>
                                                        <View style={styles.infoRow}>
                                                            <Text style={styles.infoLabel}>Tiempo de procesamiento:</Text>
                                                            <Text style={styles.infoValue}>24-48 horas</Text>
                                                        </View>
                                                        <View style={styles.infoRow}>
                                                            <Text style={styles.infoLabel}>Estado inicial:</Text>
                                                            <Text style={styles.infoValue}>Pendiente</Text>
                                                        </View>
                                                    </View>
                                                </>
                                            )}
                                        </ScrollView>

                                        <View style={styles.modalFooter}>
                                            <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={cerrarModalRetiro}>
                                                <Text style={styles.cancelButtonText}>Cancelar</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity 
                                                style={[
                                                    styles.modalButton, 
                                                    styles.withdrawButton,
                                                    !isValid && styles.disabledButton
                                                ]} 
                                                onPress={() => handleSubmit()}
                                                disabled={!isValid}
                                            >
                                                <Text style={[
                                                    styles.withdrawButtonText,
                                                    !isValid && styles.disabledButtonText
                                                ]}>
                                                    Solicitar Retiro
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </>
                                );
                            }}
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
            paddingBottom: 100,
        },
        
        // Sección de información
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

        // Sección de wallets
        walletsSection: {
            marginBottom: 24,
        },
        sectionHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: '600',
            color: colorScheme === 'dark' ? '#fff' : '#181818',
        },
        addButton: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#d32f2f',
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 8,
            gap: 6,
        },
        addButtonText: {
            color: '#fff',
            fontWeight: '600',
            fontSize: 14,
        },

        // Cards de wallets
        walletCard: {
            backgroundColor: colorScheme === 'dark' ? '#222' : '#fff',
            borderRadius: 12,
            padding: 16,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: colorScheme === 'dark' ? '#333' : '#e0e0e0',
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
        },
        walletHeader: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        walletIconContainer: {
            width: 48,
            height: 48,
            borderRadius: 24,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
        },
        walletInfo: {
            flex: 1,
        },
        walletNombre: {
            fontSize: 16,
            fontWeight: '600',
            color: colorScheme === 'dark' ? '#fff' : '#181818',
            marginBottom: 2,
        },
        walletSimbolo: {
            fontSize: 14,
            fontWeight: '500',
            color: colorScheme === 'dark' ? '#ccc' : '#555',
            marginBottom: 4,
        },
        walletDireccion: {
            fontSize: 11,
            color: colorScheme === 'dark' ? '#aaa' : '#666',
            fontFamily: 'monospace',
        },
        walletActions: {
            flexDirection: 'row',
            gap: 8,
        },
        actionButton: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 6,
            gap: 4,
        },
        retiroButton: {
            backgroundColor: '#d32f2f',
        },
        deleteButton: {
            backgroundColor: '#f44336',
            paddingHorizontal: 8,
        },
        actionButtonText: {
            color: '#fff',
            fontSize: 12,
            fontWeight: '600',
        },

        // Estado vacío
        emptyState: {
            alignItems: 'center',
            paddingVertical: 40,
            backgroundColor: colorScheme === 'dark' ? '#222' : '#fff',
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colorScheme === 'dark' ? '#333' : '#e0e0e0',
        },
        emptyStateText: {
            fontSize: 16,
            fontWeight: '600',
            color: colorScheme === 'dark' ? '#666' : '#999',
            marginTop: 12,
        },
        emptyStateSubtext: {
            fontSize: 14,
            color: colorScheme === 'dark' ? '#555' : '#aaa',
            marginTop: 4,
            textAlign: 'center',
        },

        // Sección de solicitudes
        solicitudesSection: {
            marginBottom: 24,
        },
        solicitudCard: {
            backgroundColor: colorScheme === 'dark' ? '#222' : '#fff',
            borderRadius: 12,
            padding: 16,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: colorScheme === 'dark' ? '#333' : '#e0e0e0',
        },
        solicitudHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
        },
        solicitudTitulo: {
            fontSize: 16,
            fontWeight: '600',
            color: colorScheme === 'dark' ? '#fff' : '#181818',
        },
        estadoBadge: {
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 12,
        },
        estadoText: {
            color: '#fff',
            fontSize: 10,
            fontWeight: '700',
        },
        solicitudDetalle: {
            fontSize: 14,
            fontWeight: '500',
            color: colorScheme === 'dark' ? '#ccc' : '#555',
            marginBottom: 4,
        },
        solicitudWallet: {
            fontSize: 12,
            color: colorScheme === 'dark' ? '#aaa' : '#666',
            marginBottom: 4,
        },
        solicitudFecha: {
            fontSize: 12,
            color: colorScheme === 'dark' ? '#aaa' : '#666',
        },

        // Sección de advertencias
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
        modalBody: {
            padding: 20,
            maxHeight: 400,
        },

        // Formularios
        inputSection: {
            marginBottom: 20,
        },
        inputLabel: {
            fontSize: 16,
            fontWeight: '600',
            color: colorScheme === 'dark' ? '#fff' : '#181818',
            marginBottom: 8,
        },
        textInput: {
            borderWidth: 1,
            borderColor: colorScheme === 'dark' ? '#444' : '#e0e0e0',
            borderRadius: 8,
            padding: 12,
            fontSize: 16,
            color: colorScheme === 'dark' ? '#fff' : '#181818',
            backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f8f8',
        },
        textInputError: {
            borderColor: '#f44336',
        },
        errorText: {
            fontSize: 12,
            color: '#f44336',
            marginTop: 4,
            marginLeft: 4,
        },
        textArea: {
            minHeight: 80,
            textAlignVertical: 'top',
        },

        // Opciones de cripto
        criptoOptions: {
            gap: 12,
        },
        criptoOption: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 12,
            borderRadius: 8,
            borderWidth: 2,
            borderColor: 'transparent',
            backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f8f8',
        },
        criptoOptionSelected: {
            borderColor: '#d32f2f',
            backgroundColor: colorScheme === 'dark' ? '#2a1a1a' : '#fff5f5',
        },
        criptoOptionIcon: {
            width: 32,
            height: 32,
            borderRadius: 16,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
        },
        criptoOptionText: {
            fontSize: 16,
            fontWeight: '500',
            color: colorScheme === 'dark' ? '#fff' : '#181818',
        },

        // Información de wallet seleccionada
        walletSelectedInfo: {
            backgroundColor: colorScheme === 'dark' ? '#2a2a2a' : '#f9f9f9',
            borderRadius: 8,
            padding: 16,
            marginBottom: 20,
        },
        walletSelectedTitle: {
            fontSize: 14,
            color: colorScheme === 'dark' ? '#aaa' : '#666',
            marginBottom: 4,
        },
        walletSelectedName: {
            fontSize: 16,
            fontWeight: '600',
            color: colorScheme === 'dark' ? '#fff' : '#181818',
            marginBottom: 4,
        },
        walletSelectedAddress: {
            fontSize: 12,
            color: colorScheme === 'dark' ? '#aaa' : '#666',
            fontFamily: 'monospace',
        },

        // Cantidad
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

        // Conversión
        conversionInfo: {
            marginTop: 12,
            padding: 12,
            backgroundColor: colorScheme === 'dark' ? '#1a2a1a' : '#e8f5e8',
            borderRadius: 8,
            borderWidth: 1,
            borderColor: colorScheme === 'dark' ? '#2a5a2a' : '#c8e6c9',
        },
        conversionText: {
            fontSize: 16,
            fontWeight: '600',
            color: colorScheme === 'dark' ? '#4CAF50' : '#2e7d2e',
            textAlign: 'center',
            marginBottom: 4,
        },
        conversionRate: {
            fontSize: 12,
            color: colorScheme === 'dark' ? '#4CAF50' : '#2e7d2e',
            textAlign: 'center',
        },

        // Información de transacción
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

        // Footer del modal
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
        saveButton: {
            backgroundColor: '#d32f2f',
        },
        saveButtonText: {
            color: '#fff',
            fontWeight: '600',
        },
        withdrawButton: {
            backgroundColor: '#d32f2f',
        },
        withdrawButtonText: {
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
