import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { MainCasinoStackParamList } from '../navigation/DeportesNavigation';
import LigaScreen from './sportManager/LigaScreen';

// Tipo para los parámetros de ruta de SportManager
type SportManagerRouteProp = RouteProp<MainCasinoStackParamList, 'SportManager'>;

// Interfaces para tipar los props de los componentes
interface ComponenteDeporteProps {
    deporte?: string;
    region?: string;
    liga?: string;
    evento?: string;
}

// Exportar la interfaz para uso en otras pantallas
export type { ComponenteDeporteProps };

const SportManager: React.FC = () => {
    const route = useRoute<SportManagerRouteProp>();
    const { deporte, region, liga, evento } = route.params;
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    // Función para renderizar el breadcrumb con separadores visuales
    const renderBreadcrumb = () => {
        const items = [];
        
        if (deporte) {
            items.push({ text: deporte, type: 'deporte' });
        }
        
        if (region) {
            items.push({ text: region, type: 'region' });
        }
        
        if (liga) {
            items.push({ text: liga, type: 'liga' });
        }
        
        if (evento) {
            items.push({ text: evento, type: 'evento' });
        }

        return (
            <View style={[styles.breadcrumb, { backgroundColor: isDark ? '#1e1e1e' : '#f8f9fa' }]}>
                <View style={styles.breadcrumbContainer}>
                    <Ionicons 
                        name="location-outline" 
                        size={16} 
                        color={isDark ? '#bbb' : '#666'} 
                        style={styles.breadcrumbIcon} 
                    />
                    {items.map((item, index) => (
                        <View key={index} style={styles.breadcrumbItem}>
                            <Text style={[
                                styles.breadcrumbText,
                                { color: isDark ? '#fff' : '#333' },
                                index === items.length - 1 && styles.breadcrumbActive
                            ]}>
                                {item.text}
                            </Text>
                            {index < items.length - 1 && (
                                <Ionicons 
                                    name="chevron-forward" 
                                    size={12} 
                                    color={isDark ? '#888' : '#999'} 
                                    style={styles.breadcrumbSeparator} 
                                />
                            )}
                        </View>
                    ))}
                </View>
            </View>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#fff' }]}>
            {renderBreadcrumb()}

            <View style={styles.content}>
                {evento ? (<ComponenteEvento evento={evento} />)
                    : liga ? (<ComponenteLiga liga={liga} deporte={deporte} region={region} />)
                            : deporte && (<ComponenteDeporte deporte={deporte} />)}
            </View>
        </View>
    );
};

const ComponenteDeporte: React.FC<ComponenteDeporteProps> = ({ deporte, region, liga, evento }) => {
    return (
        <View>
            <Text>Deporte: {deporte}</Text>
        </View>
    );
};

// Exportar ComponenteDeporte para uso en otras pantallas
export { ComponenteDeporte };


const ComponenteLiga: React.FC<ComponenteDeporteProps> = ({ deporte, region, liga, evento }) => {
    return (
        <LigaScreen 
            liga={liga} 
            deporte={deporte} 
            region={region} 
        />
    );
};

const ComponenteEvento: React.FC<ComponenteDeporteProps> = ({ deporte, region, liga, evento }) => {
    return (
        <View>
            <Text>Evento: {evento}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
    },
    breadcrumb: {
        backgroundColor: '#f8f9fa',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    breadcrumbContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    breadcrumbIcon: {
        marginRight: 8,
    },
    breadcrumbItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    breadcrumbText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
        textTransform: 'capitalize',
    },
    breadcrumbActive: {
        color: '#d32f2f',
        fontWeight: '600',
    },
    breadcrumbSeparator: {
        marginHorizontal: 6,
    },
});

export default SportManager;