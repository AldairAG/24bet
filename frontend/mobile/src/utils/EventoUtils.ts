import { DateGroup, EventosPorLigaResponse } from "../types/EventosType";

export const formatDisplayDate = (dateString: string): string => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const isToday = date.toDateString() === today.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();

    if (isToday) return 'Hoy';
    if (isTomorrow) return 'Mañana';

    return date.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

export const groupEventsByDate = (events: EventosPorLigaResponse[]): DateGroup[] => {
    const grouped: { [key: string]: EventosPorLigaResponse[] } = {};

    events.forEach(evento => {
        const fechaEvento = new Date(evento.fixture.date).toDateString();
        if (!grouped[fechaEvento]) {
            grouped[fechaEvento] = [];
        }
        grouped[fechaEvento].push(evento);
    });

    const fechasFiltradas = Object.keys(grouped)
        .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
        .map(date => ({
            date,
            displayDate: formatDisplayDate(date),
            events: grouped[date].sort((a, b) =>
                new Date(a.fixture.date).getTime() - new Date(b.fixture.date).getTime()
            ),
            isExpanded: false
        }));

    return fechasFiltradas;
};