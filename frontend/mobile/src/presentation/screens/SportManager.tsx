import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Interfaces para tipar los props
interface SportManagerProps {
    deporte: string;
    region: string;
    liga: string;
    evento: string;
}

interface ComponenteDeporteProps {
    deporte?: string;
    region?: string;
    liga?: string;
    evento?: string;
}

const SportManager: React.FC<SportManagerProps> = ({ deporte, region, liga, evento }) => {
    return (
        <View>
            <View style={styles.breadcrumb}>
                <Text style={styles.breadcrumbText}>{deporte} / {region} / {liga} / {evento}</Text>
            </View>
            <ComponenteDeporte deporte={deporte} region={region} liga={liga} evento={evento} />
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