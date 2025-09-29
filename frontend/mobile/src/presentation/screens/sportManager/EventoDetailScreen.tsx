import React from 'react';
import { View, Text } from 'react-native';
import MatchWidget from '../../components/widgets/WidgetGameStats';
import WidgetGameStats from '../../components/widgets/WidgetGameStats.web';
const EventoDetailScreen = ({ eventoName }: { eventoName: string }) => {

  return (
    <View>
        {/* <MatchWidget /> */}
        <WidgetGameStats />
    </View>
  );
};

export default EventoDetailScreen;
