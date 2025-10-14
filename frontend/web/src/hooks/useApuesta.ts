import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {type ApuestaEnBoleto } from '../types/apuestasTypes';
import type { AppDispatch } from '../store';
import {
    // Acciones
    agregarApuesta,
    eliminarApuesta,
    editarMonto,
    limpiarTodo,
    calcularTotales,
    toggleCarritoVisible,
    setCarritoVisible,
    limpiarErrores,
    // Thunk
    realizarApuestaThunk,
    // Selectores
    selectBoleto,
    selectCarritoVisible,
    selectTotalApostar,
    selectGananciaPotencial,
    selectIsRealizandoApuesta,
    selectErrorRealizandoApuesta,
    selectCantidadApuestas,
    selectHayApuestas,
    selectParlayTotal,
    selectParlayGanancia,
    selectEsParlayValido,
} from '../store/slices/apuestaSlice';

/**
 * Hook personalizado para manejar las apuestas y el boleto
 */
export const useApuesta = () => {
    const dispatch = useDispatch<AppDispatch>();

    // ========== SELECTORES ==========
    const boleto = useSelector(selectBoleto);
    const carritoVisible = useSelector(selectCarritoVisible);
    const totalApostar = useSelector(selectTotalApostar);
    const gananciaPotencial = useSelector(selectGananciaPotencial);
    const isRealizandoApuesta = useSelector(selectIsRealizandoApuesta);
    const errorRealizandoApuesta = useSelector(selectErrorRealizandoApuesta);
    const cantidadApuestas = useSelector(selectCantidadApuestas);
    const hayApuestas = useSelector(selectHayApuestas);
    const parlayTotal = useSelector(selectParlayTotal);
    const parlayGanancia = useSelector(selectParlayGanancia);
    const esParlayValido = useSelector(selectEsParlayValido);

    // ========== ACCIONES DEL BOLETO ==========
    
    /**
     * Agregar una apuesta al boleto
     */
    const agregarApuestaAlBoleto = useCallback((apuesta: ApuestaEnBoleto) => {
        dispatch(agregarApuesta(apuesta));
    }, [dispatch]);

    /**
     * Eliminar una apuesta del boleto
     */
    const eliminarApuestaDelBoleto = useCallback((id: number, eventoId: number) => {
        dispatch(eliminarApuesta({ id, eventoId }));
    }, [dispatch]);

    /**
     * Editar el monto de una apuesta específica
     */
    const editarMontoApuesta = useCallback((id: number, eventoId: number, nuevoMonto: number) => {
        dispatch(editarMonto({ id, eventoId, nuevoMonto }));
    }, [dispatch]);

    /**
     * Limpiar todo el boleto
     */
    const limpiarBoleto = useCallback(() => {
        dispatch(limpiarTodo());
    }, [dispatch]);

    /**
     * Recalcular totales manualmente (normalmente se hace automáticamente)
     */
    const recalcularTotales = useCallback(() => {
        dispatch(calcularTotales());
    }, [dispatch]);

    // ========== ACCIONES DE VISIBILIDAD ==========
    
    /**
     * Alternar visibilidad del carrito
     */
    const toggleVisibilidadCarrito = useCallback(() => {
        dispatch(toggleCarritoVisible());
    }, [dispatch]);

    /**
     * Establecer visibilidad del carrito
     */
    const setVisibilidadCarrito = useCallback((visible: boolean) => {
        dispatch(setCarritoVisible(visible));
    }, [dispatch]);

    // ========== ACCIONES DE ERRORES ==========
    
    /**
     * Limpiar errores
     */
    const limpiarErroresApuesta = useCallback(() => {
        dispatch(limpiarErrores());
    }, [dispatch]);

    // ========== THUNK PARA REALIZAR APUESTAS ==========
    
    /**
     * Realizar todas las apuestas del boleto
     */
    const realizarApuestas = useCallback(async () => {
        return dispatch(realizarApuestaThunk());
    }, [dispatch]);

    // ========== UTILIDADES ==========
    
    /**
     * Verificar si una apuesta específica existe en el boleto
     */
    const existeApuestaEnBoleto = useCallback((id: number, eventoId: number) => {
        return boleto.some(apuesta => apuesta.id === id && apuesta.eventoId === eventoId);
    }, [boleto]);

    /**
     * Obtener una apuesta específica del boleto
     */
    const obtenerApuestaDelBoleto = useCallback((id: number, eventoId: number) => {
        return boleto.find(apuesta => apuesta.id === id && apuesta.eventoId === eventoId);
    }, [boleto]);

    /**
     * Obtener apuestas por evento específico
     */
    const obtenerApuestasPorEvento = useCallback((eventoId: number) => {
        return boleto.filter(apuesta => apuesta.eventoId === eventoId);
    }, [boleto]);

    /**
     * Calcular ganancia potencial de una apuesta específica
     */
    const calcularGananciaPotencialApuesta = useCallback((monto: number, odd: number) => {
        return monto * odd;
    }, []);

    /**
     * Validar si se puede agregar una apuesta (validaciones de negocio avanzadas)
     */
    const puedeAgregarApuesta = useCallback((apuesta: ApuestaEnBoleto) => {
        // Verificar si ya existe
        if (existeApuestaEnBoleto(apuesta.id, apuesta.eventoId)) {
            return { valido: false, mensaje: 'Esta apuesta ya está en el boleto' };
        }

        // Validar monto mínimo
        if (apuesta.monto <= 0) {
            return { valido: false, mensaje: 'El monto debe ser mayor a 0' };
        }

        // Validar monto máximo
        if (apuesta.monto > 10000) {
            return { valido: false, mensaje: 'El monto máximo permitido es $10,000' };
        }

        // Validar odd mínima
        if (apuesta.odd <= 1) {
            return { valido: false, mensaje: 'La cuota debe ser mayor a 1' };
        }

        // Validar conflictos en el mismo evento (no apostar a ambos equipos)
        const apuestasDelEvento = obtenerApuestasPorEvento(apuesta.eventoId);
        
        // Tipos de apuestas que son mutuamente excluyentes (solo se puede apostar a una opción)
        const tiposConflictivos = [
            'Resultado Final', 
            'Ganador', 
            'Moneyline', 
            '1X2',
            'Match Winner',
            'Winner',
            'Full Time Result',
            'Handicap',
            'Asian Handicap'
        ];
        
        // Para apuestas de resultado (ganar/perder), verificar conflictos más específicos
        if (tiposConflictivos.some(tipo => apuesta.tipoApuesta.toLowerCase().includes(tipo.toLowerCase()))) {
            // Buscar conflictos en apuestas del mismo tipo y diferentes resultados EN EL MISMO EVENTO
            const hayConflicto = apuestasDelEvento.some(ap => {
                // Si es el mismo tipo de apuesta pero diferente resultado
                const mismaTipoApuesta = tiposConflictivos.some(tipo => 
                    ap.tipoApuesta.toLowerCase().includes(tipo.toLowerCase())
                );
                
                if (mismaTipoApuesta && ap.descripcion !== apuesta.descripcion) {
                    // Detectar conflictos específicos entre equipos/resultados
                    return true; // Simplificado: cualquier diferencia en el mismo tipo es conflicto
                }
                return false;
            });
            
            if (hayConflicto) {
                return { 
                    valido: false, 
                    mensaje: 'No puedes apostar a resultados diferentes en el mismo tipo de apuesta para este evento' 
                };
            }
        }
        
        // Validación adicional: No permitir múltiples apuestas del mismo tipo exacto EN EL MISMO EVENTO
        const apuestaMismoTipo = apuestasDelEvento.find(ap => 
            ap.tipoApuesta === apuesta.tipoApuesta && ap.descripcion === apuesta.descripcion
        );
        
        if (apuestaMismoTipo) {
            return {
                valido: false,
                mensaje: `Ya tienes esta misma apuesta en este evento`
            };
        }

        // Validar límite de apuestas por evento (máximo 3)
        if (apuestasDelEvento.length >= 3) {
            return { 
                valido: false, 
                mensaje: 'Máximo 3 apuestas por evento permitidas' 
            };
        }

        // Validar límite total de apuestas en el boleto (máximo 15)
        if (boleto.length >= 15) {
            return { 
                valido: false, 
                mensaje: 'Máximo 15 apuestas permitidas en el boleto' 
            };
        }

        return { valido: true, mensaje: '' };
    }, [existeApuestaEnBoleto, obtenerApuestasPorEvento, boleto]);

    /**
     * Obtener resumen del boleto
     */
    const obtenerResumenBoleto = useCallback(() => {
        return {
            cantidadApuestas,
            totalApostar,
            gananciaPotencial,
            gananciaEsperada: gananciaPotencial - totalApostar,
            multiplicadorPromedio: totalApostar > 0 ? gananciaPotencial / totalApostar : 0,
        };
    }, [cantidadApuestas, totalApostar, gananciaPotencial]);

    /**
     * Validar boleto antes de realizar apuestas
     */
    const validarBoleto = useCallback(() => {
        if (!hayApuestas) {
            return { valido: false, mensaje: 'El boleto está vacío' };
        }

        const apuestasInvalidas = boleto.filter(apuesta => 
            apuesta.monto <= 0 || apuesta.odd <= 1
        );

        if (apuestasInvalidas.length > 0) {
            return { 
                valido: false, 
                mensaje: `Hay ${apuestasInvalidas.length} apuesta(s) con valores inválidos` 
            };
        }

        return { valido: true, mensaje: 'Boleto válido' };
    }, [hayApuestas, boleto]);

    // ========== RETORNO DEL HOOK ==========
    return {
        // Estado
        boleto,
        carritoVisible,
        totalApostar,
        gananciaPotencial,
        isRealizandoApuesta,
        errorRealizandoApuesta,
        cantidadApuestas,
        hayApuestas,
        // Estado de Parlay
        parlayTotal,
        parlayGanancia,
        esParlayValido,

        // Acciones del boleto
        agregarApuestaAlBoleto,
        eliminarApuestaDelBoleto,
        editarMontoApuesta,
        limpiarBoleto,
        recalcularTotales,

        // Acciones de visibilidad
        toggleVisibilidadCarrito,
        setVisibilidadCarrito,

        // Acciones de errores
        limpiarErroresApuesta,

        // Thunk
        realizarApuestas,

        // Utilidades
        existeApuestaEnBoleto,
        obtenerApuestaDelBoleto,
        obtenerApuestasPorEvento,
        calcularGananciaPotencialApuesta,
        puedeAgregarApuesta,
        obtenerResumenBoleto,
        validarBoleto,
    };
};

export default useApuesta;
