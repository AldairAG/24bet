import React from 'react';
import { View, Text } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';

const EventoDetailScreen = ({ eventoName }: { eventoName: string }) => {

  return (
    <View>
        <Text>Detalles del Evento: {eventoName}</Text>
    </View>
  );
};

export default EventoDetailScreen;
