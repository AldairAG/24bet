package com._bet.service.file;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
public class FileStorageServiceImpl implements FileStorageService {
    
    private final Path directorioAlmacenamiento;
    
    // Extensiones permitidas para documentos KYC
    private static final List<String> EXTENSIONES_VALIDAS_KYC = Arrays.asList(
        ".jpg", ".jpeg", ".png", ".pdf", ".bmp", ".tiff", ".tif"
    );
    
    // Tamaño máximo en bytes (10 MB)
    private static final long TAMAÑO_MAXIMO_KYC = 10 * 1024 * 1024;
    
    public FileStorageServiceImpl(@Value("${app.file.storage.path:./uploads}") String directorioAlmacenamiento) {
        this.directorioAlmacenamiento = Paths.get(directorioAlmacenamiento).toAbsolutePath().normalize();
        
        try {
            Files.createDirectories(this.directorioAlmacenamiento);
            log.info("Directorio de almacenamiento creado: {}", this.directorioAlmacenamiento);
        } catch (IOException ex) {
            log.error("No se pudo crear el directorio de almacenamiento", ex);
            throw new RuntimeException("No se pudo crear el directorio de almacenamiento", ex);
        }
    }
    
    @Override
    public String almacenarArchivo(MultipartFile archivo, String carpeta, String nombrePersonalizado) throws IOException {
        // Validaciones básicas
        if (archivo == null || archivo.isEmpty()) {
            throw new IllegalArgumentException("El archivo no puede estar vacío");
        }
        
        if (nombrePersonalizado == null || nombrePersonalizado.trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre personalizado es requerido");
        }
        
        // Crear directorio de la carpeta si no existe
        Path directorioDestino = this.directorioAlmacenamiento.resolve(carpeta);
        Files.createDirectories(directorioDestino);
        
        // Obtener extensión del archivo original
        String nombreOriginal = archivo.getOriginalFilename();
        String extension = "";
        if (nombreOriginal != null && nombreOriginal.contains(".")) {
            extension = nombreOriginal.substring(nombreOriginal.lastIndexOf(".")).toLowerCase();
        }
        
        // Generar nombre único para evitar colisiones
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        String uuid = UUID.randomUUID().toString().substring(0, 8);
        String nombreArchivo = String.format("%s_%s_%s%s", nombrePersonalizado, timestamp, uuid, extension);
        
        // Normalizar el nombre del archivo (eliminar caracteres problemáticos)
        nombreArchivo = nombreArchivo.replaceAll("[^a-zA-Z0-9._-]", "_");
        
        // Ruta completa del archivo
        Path rutaDestino = directorioDestino.resolve(nombreArchivo);
        
        // Verificar que la ruta esté dentro del directorio permitido (seguridad)
        if (!rutaDestino.normalize().startsWith(this.directorioAlmacenamiento)) {
            throw new SecurityException("Intento de almacenamiento fuera del directorio permitido");
        }
        
        try {
            Files.copy(archivo.getInputStream(), rutaDestino, StandardCopyOption.REPLACE_EXISTING);
            log.info("Archivo almacenado exitosamente: {}", rutaDestino);
            
            // Retornar ruta relativa
            return this.directorioAlmacenamiento.relativize(rutaDestino).toString();
            
        } catch (IOException ex) {
            log.error("Error al almacenar archivo: {}", rutaDestino, ex);
            throw new IOException("Error al almacenar el archivo", ex);
        }
    }
    
    @Override
    public Path obtenerRutaCompleta(String rutaRelativa) {
        return this.directorioAlmacenamiento.resolve(rutaRelativa).normalize();
    }
    
    @Override
    public boolean eliminarArchivo(String rutaRelativa) {
        try {
            Path rutaCompleta = obtenerRutaCompleta(rutaRelativa);
            
            // Verificar que la ruta esté dentro del directorio permitido
            if (!rutaCompleta.startsWith(this.directorioAlmacenamiento)) {
                log.warn("Intento de eliminación fuera del directorio permitido: {}", rutaCompleta);
                return false;
            }
            
            boolean eliminado = Files.deleteIfExists(rutaCompleta);
            if (eliminado) {
                log.info("Archivo eliminado exitosamente: {}", rutaCompleta);
            }
            return eliminado;
            
        } catch (IOException ex) {
            log.error("Error al eliminar archivo: {}", rutaRelativa, ex);
            return false;
        }
    }
    
    @Override
    public boolean existeArchivo(String rutaRelativa) {
        try {
            Path rutaCompleta = obtenerRutaCompleta(rutaRelativa);
            return Files.exists(rutaCompleta) && Files.isRegularFile(rutaCompleta);
        } catch (Exception ex) {
            log.error("Error al verificar existencia del archivo: {}", rutaRelativa, ex);
            return false;
        }
    }
    
    @Override
    public long obtenerTamañoArchivo(String rutaRelativa) {
        try {
            Path rutaCompleta = obtenerRutaCompleta(rutaRelativa);
            return Files.exists(rutaCompleta) ? Files.size(rutaCompleta) : -1;
        } catch (IOException ex) {
            log.error("Error al obtener tamaño del archivo: {}", rutaRelativa, ex);
            return -1;
        }
    }
    
    @Override
    public boolean esExtensionValidaKyc(MultipartFile archivo) {
        if (archivo == null || archivo.getOriginalFilename() == null) {
            return false;
        }
        
        String nombreArchivo = archivo.getOriginalFilename().toLowerCase();
        return EXTENSIONES_VALIDAS_KYC.stream().anyMatch(nombreArchivo::endsWith);
    }
    
    @Override
    public boolean esTamañoValidoKyc(MultipartFile archivo) {
        if (archivo == null) {
            return false;
        }
        
        return archivo.getSize() <= TAMAÑO_MAXIMO_KYC;
    }
}
