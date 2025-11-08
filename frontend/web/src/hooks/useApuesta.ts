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
    editarMontoParlay,
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
    selectApuestasParlay,
    realizarParlayApuestaThunk,
    selectIsObteniendoHistorial,
    selectHistorialApuestas,
    selectErrorObteniendoHistorial,
    obtenerHistorialApuestasThunk,
    selectHistorialParlays,
    selectIsObteniendoHistorialParlays,
    selectErrorObteniendoHistorialParlays,
    obtenerHistorialParlaysThunk,

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
    const apuestasParlay = useSelector(selectApuestasParlay);
    const historialApuestas = useSelector(selectHistorialApuestas);
    const isObteniendoHistorial = useSelector(selectIsObteniendoHistorial);
    const errorObteniendoHistorial = useSelector(selectErrorObteniendoHistorial);
    const historialParlays = useSelector(selectHistorialParlays);
    const isObteniendoHistorialParlays = useSelector(selectIsObteniendoHistorialParlays);
    const errorObteniendoHistorialParlays = useSelector(selectErrorObteniendoHistorialParlays);

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
     * Editar el monto de una apuesta en parlay
     */
    const editarMontoApuestaParlay = useCallback((nuevoMonto: number) => {
        dispatch(editarMontoParlay({ nuevoMonto }));
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

    /**
     * Realizar parlay de apuestas
     */
    const realizarParlayApuestas = useCallback(async () => {
        return dispatch(realizarParlayApuestaThunk());
    }, [dispatch]);

    // ========== UTILIDADES ==========
    
    /**
     * Verificar si una apuesta específica existe en el boleto
     */
    const existeApuestaEnBoleto = useCallback((id: number, idOddValue: number) => {
        return boleto.some(apuesta => apuesta.id === id && apuesta.eventoId === idOddValue);
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

        
        return { valido: true, mensaje: '' };
    }, [existeApuestaEnBoleto]);

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

    // ========== HISTORIAL ==========
    const obtenerHistorialApuestas = useCallback(() => {
        dispatch(obtenerHistorialApuestasThunk());
    }, [dispatch]);

    const obtenerHistorialParlays = useCallback(() => {
        dispatch(obtenerHistorialParlaysThunk());
    }, [dispatch]);

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
        // Historial de Apuestas
        historialApuestas,
        isObteniendoHistorial,
        errorObteniendoHistorial,
        obtenerHistorialApuestas,

        // Historial de Parlays
        historialParlays,
        isObteniendoHistorialParlays,
        errorObteniendoHistorialParlays,
        obtenerHistorialParlays,

        // Estado de Parlay
        parlayTotal,
        parlayGanancia,
        esParlayValido,
        apuestasParlay,

        // Acciones del boleto
        agregarApuestaAlBoleto,
        eliminarApuestaDelBoleto,
        editarMontoApuesta,
        limpiarBoleto,
        recalcularTotales,
        editarMontoApuestaParlay,

        // Acciones de visibilidad
        toggleVisibilidadCarrito,
        setVisibilidadCarrito,

        // Acciones de errores
        limpiarErroresApuesta,

        // Thunk
        realizarApuestas,
        realizarParlayApuestas,

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
