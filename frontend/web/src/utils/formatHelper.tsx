export const IsoAFechaMesDia = (isoString: string): string => {
    const fecha = new Date(isoString);
    return fecha.toLocaleDateString('es-ES', {
        month: 'numeric',
        day: 'numeric',
    });
};

export const IsoAHora = (isoString: string): string => {
  const fecha = new Date(isoString);
  return fecha.toLocaleTimeString('es-ES', {
        hour: 'numeric',
        minute: 'numeric'
  });
};
