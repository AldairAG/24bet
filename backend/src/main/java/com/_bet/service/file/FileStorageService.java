package com._bet.service.file;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;

public interface FileStorageService {
    
    /**
     * Almacena un archivo en el sistema de archivos
     * @param archivo El archivo a almacenar
     * @param carpeta La carpeta donde almacenar (ej: "kyc", "profiles")
     * @param nombrePersonalizado Nombre personalizado para el archivo
     * @return La ruta relativa del archivo almacenado
     */
    String almacenarArchivo(MultipartFile archivo, String carpeta, String nombrePersonalizado) throws IOException;
    
    /**
     * Obtiene la ruta completa del archivo
     * @param rutaRelativa Ruta relativa del archivo
     * @return Path completo del archivo
     */
    Path obtenerRutaCompleta(String rutaRelativa);
    
    /**
     * Elimina un archivo del sistema
     * @param rutaRelativa Ruta relativa del archivo a eliminar
     * @return true si se eliminó correctamente
     */
    boolean eliminarArchivo(String rutaRelativa);
    
    /**
     * Verifica si un archivo existe
     * @param rutaRelativa Ruta relativa del archivo
     * @return true si el archivo existe
     */
    boolean existeArchivo(String rutaRelativa);
    
    /**
     * Obtiene el tamaño del archivo en bytes
     * @param rutaRelativa Ruta relativa del archivo
     * @return Tamaño en bytes, -1 si no existe
     */
    long obtenerTamañoArchivo(String rutaRelativa);
    
    /**
     * Valida que el archivo tenga una extensión permitida para documentos KYC
     * @param archivo Archivo a validar
     * @return true si la extensión es válida
     */
    boolean esExtensionValidaKyc(MultipartFile archivo);
    
    /**
     * Valida el tamaño del archivo para documentos KYC
     * @param archivo Archivo a validar
     * @return true si el tamaño es válido
     */
    boolean esTamañoValidoKyc(MultipartFile archivo);
}
