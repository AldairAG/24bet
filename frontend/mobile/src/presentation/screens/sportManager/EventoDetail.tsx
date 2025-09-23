import { useEffect } from "react";
import useEventos from "../../../hooks/useEventos";
import { View } from "react-native-reanimated/lib/typescript/Animated";

const EventoDetail = (eventoId: String) => {;
    const { eventoDetail, isLoadingEventoDetail, loadEventoDetailError, loadEventoDetail } = useEventos();

    useEffect(() => {
        loadEventoDetail(eventoId);
    }, [eventoId]);
    
    return (
        <View>

        </View>
    );
};

export default EventoDetail;