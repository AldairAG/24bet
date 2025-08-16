/**
 * Personal Info Service para 24bet
 * Maneja información personal de usuarios
 */

import { BaseApiService, API_ENDPOINTS } from './apiService';
import {
  InformacionPersonalRequest,
  InformacionPersonalResponse
} from '../types/personalInfoTypes';

export class PersonalInfoService extends BaseApiService {
  
  /**
   * Obtener mi información personal
   */
  async getMyPersonalInfo(): Promise<InformacionPersonalResponse> {
    const response = await this.get<InformacionPersonalResponse>(
      API_ENDPOINTS.INFO_PERSONAL.MI_INFO
    );
    return response;
  }

  /**
   * Actualizar mi información personal
   */
  async updateMyPersonalInfo(personalInfo: InformacionPersonalRequest): Promise<InformacionPersonalResponse> {
    const response = await this.put<InformacionPersonalRequest, InformacionPersonalResponse>(
      API_ENDPOINTS.INFO_PERSONAL.MI_INFO,
      personalInfo
    );
    return response;
  }

  /**
   * Obtener información personal de un usuario (admin o propio)
   */
  async getPersonalInfoByUserId(userId: number): Promise<InformacionPersonalResponse> {
    const response = await this.get<InformacionPersonalResponse>(
      API_ENDPOINTS.INFO_PERSONAL.BY_USER(userId)
    );
    return response;
  }

  /**
   * Actualizar información personal de un usuario (admin o propio)
   */
  async updatePersonalInfoByUserId(
    userId: number, 
    personalInfo: InformacionPersonalRequest
  ): Promise<InformacionPersonalResponse> {
    const response = await this.put<InformacionPersonalRequest, InformacionPersonalResponse>(
      API_ENDPOINTS.INFO_PERSONAL.BY_USER(userId),
      personalInfo
    );
    return response;
  }

  // ========== UTILIDADES DE VALIDACIÓN ==========

  /**
   * Validar RFC
   */
  static validateRFC(rfc: string): boolean {
    const rfcRegex = /^[A-ZÑ&]{3,4}[0-9]{6}[A-Z0-9]{3}$/;
    return rfcRegex.test(rfc.toUpperCase());
  }

  /**
   * Validar CURP
   */
  static validateCURP(curp: string): boolean {
    const curpRegex = /^[A-Z]{1}[AEIOUX]{1}[A-Z]{2}[0-9]{2}[0-1][0-9][0-3][0-9][HM]{1}[A-Z]{2}[BCDFGHJKLMNPQRSTVWXYZ]{3}[A-Z0-9]{1}[0-9]{1}$/;
    return curpRegex.test(curp.toUpperCase());
  }

  /**
   * Validar código postal mexicano
   */
  static validateCodigoPostal(cp: string): boolean {
    const cpRegex = /^[0-9]{5}$/;
    return cpRegex.test(cp);
  }

  /**
   * Validar teléfono
   */
  static validateTelefono(telefono: string): boolean {
    const telefonoRegex = /^[0-9+\-\s()]*$/;
    return telefonoRegex.test(telefono) && telefono.replace(/\D/g, '').length >= 10;
  }

  /**
   * Formatear teléfono mexicano
   */
  static formatTelefonoMexicano(telefono: string): string {
    // Remover todos los caracteres que no sean números
    const numeros = telefono.replace(/\D/g, '');
    
    if (numeros.length === 10) {
      // Formato: (55) 1234-5678
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6)}`;
    } else if (numeros.length === 11 && numeros.startsWith('1')) {
      // Celular con 1 al inicio: 1 (55) 1234-5678
      return `1 (${numeros.slice(1, 3)}) ${numeros.slice(3, 7)}-${numeros.slice(7)}`;
    } else if (numeros.length === 12 && numeros.startsWith('52')) {
      // Con código de país: +52 (55) 1234-5678
      return `+52 (${numeros.slice(2, 4)}) ${numeros.slice(4, 8)}-${numeros.slice(8)}`;
    }
    
    return telefono; // Retornar sin cambios si no coincide con ningún formato
  }

  /**
   * Calcular edad basada en fecha de nacimiento
   */
  static calculateAge(fechaNacimiento: string): number {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mesActual = hoy.getMonth();
    const mesNacimiento = nacimiento.getMonth();
    
    if (mesActual < mesNacimiento || (mesActual === mesNacimiento && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    
    return edad;
  }

  /**
   * Validar edad mínima (18 años)
   */
  static isValidAge(fechaNacimiento: string): boolean {
    const edad = PersonalInfoService.calculateAge(fechaNacimiento);
    return edad >= 18;
  }

  /**
   * Obtener lista de estados de México
   */
  static getEstadosMexico(): Array<{ codigo: string; nombre: string }> {
    return [
      { codigo: 'AG', nombre: 'Aguascalientes' },
      { codigo: 'BC', nombre: 'Baja California' },
      { codigo: 'BS', nombre: 'Baja California Sur' },
      { codigo: 'CM', nombre: 'Campeche' },
      { codigo: 'CS', nombre: 'Chiapas' },
      { codigo: 'CH', nombre: 'Chihuahua' },
      { codigo: 'CL', nombre: 'Coahuila' },
      { codigo: 'CO', nombre: 'Colima' },
      { codigo: 'DF', nombre: 'Ciudad de México' },
      { codigo: 'DG', nombre: 'Durango' },
      { codigo: 'GT', nombre: 'Guanajuato' },
      { codigo: 'GR', nombre: 'Guerrero' },
      { codigo: 'HG', nombre: 'Hidalgo' },
      { codigo: 'JA', nombre: 'Jalisco' },
      { codigo: 'EM', nombre: 'Estado de México' },
      { codigo: 'MI', nombre: 'Michoacán' },
      { codigo: 'MO', nombre: 'Morelos' },
      { codigo: 'NA', nombre: 'Nayarit' },
      { codigo: 'NL', nombre: 'Nuevo León' },
      { codigo: 'OA', nombre: 'Oaxaca' },
      { codigo: 'PU', nombre: 'Puebla' },
      { codigo: 'QT', nombre: 'Querétaro' },
      { codigo: 'QR', nombre: 'Quintana Roo' },
      { codigo: 'SL', nombre: 'San Luis Potosí' },
      { codigo: 'SI', nombre: 'Sinaloa' },
      { codigo: 'SO', nombre: 'Sonora' },
      { codigo: 'TB', nombre: 'Tabasco' },
      { codigo: 'TM', nombre: 'Tamaulipas' },
      { codigo: 'TL', nombre: 'Tlaxcala' },
      { codigo: 'VE', nombre: 'Veracruz' },
      { codigo: 'YU', nombre: 'Yucatán' },
      { codigo: 'ZA', nombre: 'Zacatecas' },
    ];
  }
}

// Instancia singleton
export const personalInfoService = new PersonalInfoService();
