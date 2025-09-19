import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { MainCasinoStackParamList } from '../navigation/DeportesNavigation';

// Tipo para los parámetros de ruta de SportManager
type SportManagerRouteProp = RouteProp<MainCasinoStackParamList, 'SportManager'>;

// Interfaces para tipar los props de los componentes
interface ComponenteDeporteProps {
    deporte?: string;
    region?: string;
    liga?: string;
    evento?: string;
}

const SportManager: React.FC = () => {
    const route = useRoute<SportManagerRouteProp>();
    const { deporte, region, liga, evento } = route.params;

    return (
        <View>
            <View style={styles.breadcrumb}>
                <Text style={styles.breadcrumbText}>
                    {deporte} / {region} / {liga} {evento ? `/ ${evento}` : ''}
                </Text>
            </View>

            {evento ? (<ComponenteEvento evento={evento} />)
                : liga ? (<ComponenteLiga liga={liga} />)
                    : region ? (<ComponenteRegion region={region} />)
                        : deporte && (<ComponenteDeporte deporte={deporte} />)}

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

const ComponenteRegion: React.FC<ComponenteDeporteProps> = ({ deporte, region, liga, evento }) => {
    return (
        <View>
            <Text>Región: {region}</Text>
        </View>
    );
};

const ComponenteLiga: React.FC<ComponenteDeporteProps> = ({ deporte, region, liga, evento }) => {
    return (
        <View>
            <Text>Liga: {liga}</Text>
        </View>
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
    breadcrumb: {
        padding: 10,
        backgroundColor: '#f0f0f0',
        marginBottom: 10,
    },
    breadcrumbText: {
        fontSize: 14,
        color: '#666',
    },
});

export default SportManager;