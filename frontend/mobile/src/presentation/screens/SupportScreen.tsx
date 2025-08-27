import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    useColorScheme,
    Modal,
    TextInput,
    Alert,
    FlatList
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

interface TicketSoporte {
    id: string;
    tipo: string;
    asunto: string;
    descripcion: string;
    estado: 'abierto' | 'en_proceso' | 'resuelto' | 'cerrado';
    fechaCreacion: Date;
    fechaActualizacion: Date;
    prioridad: 'baja' | 'media' | 'alta' | 'urgente';
}

const tiposProblema = [
    {
        id: 'cuenta',
        titulo: 'Problemas de cuenta',
        descripcion: 'Problemas con acceso, configuración o información de cuenta',
        icono: 'person-circle-outline',
        color: '#2196F3'
    },
    {
        id: 'pagos',
        titulo: 'Problemas de pagos',
        descripcion: 'Depósitos, retiros y transacciones',
        icono: 'card-outline',
        color: '#4CAF50'
    },
    {
        id: 'tecnico',
        titulo: 'Problemas técnicos',
        descripcion: 'Errores de la app, rendimiento o funcionalidad',
        icono: 'settings-outline',
        color: '#FF9800'
    },
    {
        id: 'juegos',
        titulo: 'Problemas de juegos',
        descripcion: 'Apuestas, resultados y funcionamiento de juegos',
        icono: 'game-controller-outline',
        color: '#9C27B0'
    },
    {
        id: 'seguridad',
        titulo: 'Seguridad',
        descripcion: 'Actividad sospechosa, verificación de identidad',
        icono: 'shield-checkmark-outline',
        color: '#F44336'
    },
    {
        id: 'otro',
        titulo: 'Otros',
        descripcion: 'Consultas generales y otros temas',
        icono: 'help-circle-outline',
        color: '#607D8B'
    }
];

// Datos de ejemplo para tickets
const ticketsEjemplo: TicketSoporte[] = [
    {
        id: 'TKT-001',
        tipo: 'pagos',
        asunto: 'Retiro pendiente',
        descripcion: 'Mi retiro de $500 lleva 3 días pendiente',
        estado: 'en_proceso',
        fechaCreacion: new Date('2025-08-24'),
        fechaActualizacion: new Date('2025-08-25'),
        prioridad: 'media'
    },
    {
        id: 'TKT-002',
        tipo: 'tecnico',
        asunto: 'Error al cargar juegos',
        descripcion: 'La aplicación se cierra cuando intento abrir los juegos',
        estado: 'resuelto',
        fechaCreacion: new Date('2025-08-20'),
        fechaActualizacion: new Date('2025-08-21'),
        prioridad: 'alta'
    },
    {
        id: 'TKT-003',
        tipo: 'cuenta',
        asunto: 'Actualizar información personal',
        descripcion: 'Necesito cambiar mi número de teléfono',
        estado: 'cerrado',
        fechaCreacion: new Date('2025-08-18'),
        fechaActualizacion: new Date('2025-08-19'),
        prioridad: 'baja'
    }
];

export default function SupportScreen() {
    const navigation = useNavigation();
    const colorScheme = useColorScheme();
    const styles = getStyles((colorScheme === 'light' || colorScheme === 'dark') ? colorScheme : null);

    const [showNewTicketModal, setShowNewTicketModal] = useState(false);
    const [selectedTipo, setSelectedTipo] = useState('');
    const [asunto, setAsunto] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [tickets, setTickets] = useState<TicketSoporte[]>(ticketsEjemplo);

    const getEstadoColor = (estado: string) => {
        switch (estado) {
            case 'abierto':
                return '#2196F3';
            case 'en_proceso':
                return '#FF9800';
            case 'resuelto':
                return '#4CAF50';
            case 'cerrado':
                return '#9E9E9E';
            default:
                return '#9E9E9E';
        }
    };

    const getEstadoTexto = (estado: string) => {
        switch (estado) {
            case 'abierto':
                return 'Abierto';
            case 'en_proceso':
                return 'En proceso';
            case 'resuelto':
                return 'Resuelto';
            case 'cerrado':
                return 'Cerrado';
            default:
                return 'Desconocido';
        }
    };

    const getPrioridadColor = (prioridad: string) => {
        switch (prioridad) {
            case 'baja':
                return '#4CAF50';
            case 'media':
                return '#FF9800';
            case 'alta':
                return '#FF5722';
            case 'urgente':
                return '#F44336';
            default:
                return '#9E9E9E';
        }
    };

    const handleCrearTicket = () => {
        if (!selectedTipo || !asunto.trim() || !descripcion.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Por favor completa todos los campos'
            });
            return;
        }

        const nuevoTicket: TicketSoporte = {
            id: `TKT-${String(tickets.length + 1).padStart(3, '0')}`,
            tipo: selectedTipo,
            asunto: asunto.trim(),
            descripcion: descripcion.trim(),
            estado: 'abierto',
            fechaCreacion: new Date(),
            fechaActualizacion: new Date(),
            prioridad: 'media'
        };

        setTickets([nuevoTicket, ...tickets]);
        setShowNewTicketModal(false);
        setSelectedTipo('');
        setAsunto('');
        setDescripcion('');

        Toast.show({
            type: 'success',
            text1: 'Ticket creado',
            text2: `Tu ticket ${nuevoTicket.id} ha sido creado exitosamente`
        });
    };

    const renderTipoProblema = ({ item }: { item: typeof tiposProblema[0] }) => (
        <TouchableOpacity
            style={styles.tipoCard}
            onPress={() => {
                setSelectedTipo(item.id);
                setShowNewTicketModal(true);
            }}
        >
            <View style={[styles.tipoIconContainer, { backgroundColor: item.color }]}>
                <Ionicons name={item.icono as any} size={24} color="#fff" />
            </View>
            <View style={styles.tipoTextContainer}>
                <Text style={styles.tipoTitulo}>{item.titulo}</Text>
                <Text style={styles.tipoDescripcion}>{item.descripcion}</Text>
            </View>
            <Ionicons 
                name="chevron-forward" 
                size={20} 
                color={colorScheme === 'dark' ? '#aaa' : '#666'} 
            />
        </TouchableOpacity>
    );

    const renderTicket = ({ item }: { item: TicketSoporte }) => {
        const tipoInfo = tiposProblema.find(t => t.id === item.tipo);
        
        return (
            <TouchableOpacity style={styles.ticketCard}>
                <View style={styles.ticketHeader}>
                    <View style={styles.ticketIdContainer}>
                        <Text style={styles.ticketId}>{item.id}</Text>
                        <View style={[styles.estadoBadge, { backgroundColor: getEstadoColor(item.estado) }]}>
                            <Text style={styles.estadoTexto}>{getEstadoTexto(item.estado)}</Text>
                        </View>
                    </View>
                    <View style={[styles.prioridadBadge, { backgroundColor: getPrioridadColor(item.prioridad) }]}>
                        <Text style={styles.prioridadTexto}>{item.prioridad.toUpperCase()}</Text>
                    </View>
                </View>

                <View style={styles.ticketContent}>
                    <View style={styles.ticketTipoContainer}>
                        <View style={[styles.ticketTipoIcon, { backgroundColor: tipoInfo?.color || '#9E9E9E' }]}>
                            <Ionicons name={tipoInfo?.icono as any} size={16} color="#fff" />
                        </View>
                        <Text style={styles.ticketTipo}>{tipoInfo?.titulo || 'Tipo desconocido'}</Text>
                    </View>
                    
                    <Text style={styles.ticketAsunto}>{item.asunto}</Text>
                    <Text style={styles.ticketDescripcion} numberOfLines={2}>
                        {item.descripcion}
                    </Text>
                </View>

                <View style={styles.ticketFooter}>
                    <View style={styles.fechaContainer}>
                        <Ionicons name="time-outline" size={14} color={colorScheme === 'dark' ? '#aaa' : '#666'} />
                        <Text style={styles.fechaTexto}>
                            Creado: {item.fechaCreacion.toLocaleDateString('es-ES')}
                        </Text>
                    </View>
                    <View style={styles.fechaContainer}>
                        <Ionicons name="sync-outline" size={14} color={colorScheme === 'dark' ? '#aaa' : '#666'} />
                        <Text style={styles.fechaTexto}>
                            Actualizado: {item.fechaActualizacion.toLocaleDateString('es-ES')}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="chevron-back" size={24} color="#d32f2f" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Centro de Soporte</Text>
                <TouchableOpacity
                    style={styles.newTicketButton}
                    onPress={() => setShowNewTicketModal(true)}
                >
                    <Ionicons name="add" size={24} color="#d32f2f" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Sección de tipos de problemas */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>¿Qué tipo de problema tienes?</Text>
                    <Text style={styles.sectionSubtitle}>
                        Selecciona la categoría que mejor describa tu consulta
                    </Text>
                    
                    <FlatList
                        data={tiposProblema}
                        renderItem={renderTipoProblema}
                        keyExtractor={(item) => item.id}
                        scrollEnabled={false}
                        showsVerticalScrollIndicator={false}
                    />
                </View>

                {/* Historial de tickets */}
                <View style={styles.section}>
                    <View style={styles.historialHeader}>
                        <Text style={styles.sectionTitle}>Historial de Tickets</Text>
                        <View style={styles.ticketCount}>
                            <Text style={styles.ticketCountText}>{tickets.length}</Text>
                        </View>
                    </View>
                    
                    {tickets.length > 0 ? (
                        <FlatList
                            data={tickets}
                            renderItem={renderTicket}
                            keyExtractor={(item) => item.id}
                            scrollEnabled={false}
                            showsVerticalScrollIndicator={false}
                        />
                    ) : (
                        <View style={styles.noTicketsContainer}>
                            <Ionicons name="ticket-outline" size={48} color={colorScheme === 'dark' ? '#555' : '#ccc'} />
                            <Text style={styles.noTicketsText}>No tienes tickets de soporte</Text>
                            <Text style={styles.noTicketsSubtext}>
                                Crea tu primer ticket seleccionando un tipo de problema arriba
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Modal para crear nuevo ticket */}
            <Modal
                visible={showNewTicketModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowNewTicketModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Crear Nuevo Ticket</Text>
                            <TouchableOpacity
                                style={styles.modalCloseButton}
                                onPress={() => setShowNewTicketModal(false)}
                            >
                                <Ionicons name="close" size={24} color={colorScheme === 'dark' ? '#fff' : '#000'} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalBody}>
                            {/* Selector de tipo */}
                            <Text style={styles.inputLabel}>Tipo de problema *</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tipoSelector}>
                                {tiposProblema.map((tipo) => (
                                    <TouchableOpacity
                                        key={tipo.id}
                                        style={[
                                            styles.tipoOption,
                                            selectedTipo === tipo.id && styles.tipoOptionSelected
                                        ]}
                                        onPress={() => setSelectedTipo(tipo.id)}
                                    >
                                        <Ionicons 
                                            name={tipo.icono as any} 
                                            size={20} 
                                            color={selectedTipo === tipo.id ? '#fff' : tipo.color} 
                                        />
                                        <Text style={[
                                            styles.tipoOptionText,
                                            selectedTipo === tipo.id && styles.tipoOptionTextSelected
                                        ]}>
                                            {tipo.titulo}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>

                            {/* Campo de asunto */}
                            <Text style={styles.inputLabel}>Asunto *</Text>
                            <TextInput
                                style={styles.textInput}
                                value={asunto}
                                onChangeText={setAsunto}
                                placeholder="Describe brevemente tu problema"
                                placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#888'}
                            />

                            {/* Campo de descripción */}
                            <Text style={styles.inputLabel}>Descripción detallada *</Text>
                            <TextInput
                                style={[styles.textInput, styles.textArea]}
                                value={descripcion}
                                onChangeText={setDescripcion}
                                placeholder="Proporciona todos los detalles posibles sobre tu problema"
                                placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#888'}
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                            />
                        </ScrollView>

                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setShowNewTicketModal(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.createButton]}
                                onPress={handleCrearTicket}
                            >
                                <Text style={styles.createButtonText}>Crear Ticket</Text>
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
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 15,
            backgroundColor: colorScheme === 'dark' ? '#222' : '#fff',
            borderBottomWidth: 1,
            borderBottomColor: colorScheme === 'dark' ? '#333' : '#e0e0e0',
        },
        backButton: {
            padding: 8,
            borderRadius: 20,
            backgroundColor: colorScheme === 'dark' ? '#333' : '#f5f5f5',
        },
        headerTitle: {
            fontSize: 20,
            fontWeight: '600',
            color: colorScheme === 'dark' ? '#fff' : '#181818',
        },
        newTicketButton: {
            padding: 8,
            borderRadius: 20,
            backgroundColor: colorScheme === 'dark' ? '#333' : '#f5f5f5',
        },
        content: {
            flex: 1,
            padding: 20,
        },
        section: {
            marginBottom: 30,
        },
        sectionTitle: {
            fontSize: 20,
            fontWeight: '700',
            color: colorScheme === 'dark' ? '#fff' : '#181818',
            marginBottom: 5,
        },
        sectionSubtitle: {
            fontSize: 14,
            color: colorScheme === 'dark' ? '#aaa' : '#666',
            marginBottom: 20,
            lineHeight: 20,
        },
        tipoCard: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colorScheme === 'dark' ? '#222' : '#fff',
            padding: 16,
            borderRadius: 12,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: colorScheme === 'dark' ? '#333' : '#e0e0e0',
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
        },
        tipoIconContainer: {
            width: 48,
            height: 48,
            borderRadius: 24,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 15,
        },
        tipoTextContainer: {
            flex: 1,
        },
        tipoTitulo: {
            fontSize: 16,
            fontWeight: '600',
            color: colorScheme === 'dark' ? '#fff' : '#181818',
            marginBottom: 4,
        },
        tipoDescripcion: {
            fontSize: 14,
            color: colorScheme === 'dark' ? '#aaa' : '#666',
            lineHeight: 18,
        },
        historialHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20,
        },
        ticketCount: {
            backgroundColor: '#d32f2f',
            paddingHorizontal: 12,
            paddingVertical: 4,
            borderRadius: 12,
            minWidth: 24,
            alignItems: 'center',
        },
        ticketCountText: {
            color: '#fff',
            fontSize: 14,
            fontWeight: '600',
        },
        ticketCard: {
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
        ticketHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
        },
        ticketIdContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
        },
        ticketId: {
            fontSize: 14,
            fontWeight: '700',
            color: '#d32f2f',
        },
        estadoBadge: {
            paddingHorizontal: 8,
            paddingVertical: 2,
            borderRadius: 10,
        },
        estadoTexto: {
            color: '#fff',
            fontSize: 10,
            fontWeight: '600',
        },
        prioridadBadge: {
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: 8,
        },
        prioridadTexto: {
            color: '#fff',
            fontSize: 9,
            fontWeight: '700',
        },
        ticketContent: {
            marginBottom: 12,
        },
        ticketTipoContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
        },
        ticketTipoIcon: {
            width: 24,
            height: 24,
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 8,
        },
        ticketTipo: {
            fontSize: 12,
            color: colorScheme === 'dark' ? '#aaa' : '#666',
            fontWeight: '500',
        },
        ticketAsunto: {
            fontSize: 16,
            fontWeight: '600',
            color: colorScheme === 'dark' ? '#fff' : '#181818',
            marginBottom: 6,
        },
        ticketDescripcion: {
            fontSize: 14,
            color: colorScheme === 'dark' ? '#aaa' : '#666',
            lineHeight: 18,
        },
        ticketFooter: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingTop: 8,
            borderTopWidth: 1,
            borderTopColor: colorScheme === 'dark' ? '#333' : '#f0f0f0',
        },
        fechaContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
        },
        fechaTexto: {
            fontSize: 11,
            color: colorScheme === 'dark' ? '#aaa' : '#666',
        },
        noTicketsContainer: {
            alignItems: 'center',
            padding: 40,
        },
        noTicketsText: {
            fontSize: 18,
            fontWeight: '600',
            color: colorScheme === 'dark' ? '#aaa' : '#666',
            marginTop: 16,
            marginBottom: 8,
        },
        noTicketsSubtext: {
            fontSize: 14,
            color: colorScheme === 'dark' ? '#666' : '#888',
            textAlign: 'center',
            lineHeight: 20,
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
        modalTitle: {
            fontSize: 20,
            fontWeight: '600',
            color: colorScheme === 'dark' ? '#fff' : '#181818',
        },
        modalCloseButton: {
            padding: 4,
        },
        modalBody: {
            padding: 20,
            maxHeight: 400,
        },
        inputLabel: {
            fontSize: 16,
            fontWeight: '600',
            color: colorScheme === 'dark' ? '#fff' : '#181818',
            marginBottom: 8,
            marginTop: 16,
        },
        tipoSelector: {
            marginBottom: 10,
        },
        tipoOption: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 12,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: colorScheme === 'dark' ? '#444' : '#e0e0e0',
            marginRight: 10,
            backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f8f8',
            gap: 8,
        },
        tipoOptionSelected: {
            backgroundColor: '#d32f2f',
            borderColor: '#d32f2f',
        },
        tipoOptionText: {
            fontSize: 12,
            fontWeight: '500',
            color: colorScheme === 'dark' ? '#fff' : '#181818',
        },
        tipoOptionTextSelected: {
            color: '#fff',
        },
        textInput: {
            borderWidth: 1,
            borderColor: colorScheme === 'dark' ? '#444' : '#e0e0e0',
            borderRadius: 8,
            padding: 12,
            fontSize: 16,
            color: colorScheme === 'dark' ? '#fff' : '#181818',
            backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f8f8',
            marginBottom: 10,
        },
        textArea: {
            height: 100,
            textAlignVertical: 'top',
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
        createButton: {
            backgroundColor: '#d32f2f',
        },
        createButtonText: {
            color: '#fff',
            fontWeight: '600',
        },
    });
