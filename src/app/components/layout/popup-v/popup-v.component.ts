import { Component } from '@angular/core';
import { PopupVService } from 'src/app/services/popup-v.service';

@Component({
  selector: 'app-popup-v',
  templateUrl: './popup-v.component.html',
  styleUrls: ['./popup-v.component.scss'],
})
export class PopupVComponent {
  versiones = [
      {
    nombre: 'V-1.4', /* 02-06-2025 */
    cambios: [
      'Nuevo sistema de escaneo QR vía cámara utilizando librería más moderna y eficiente.',
      'Escaneo directo desde ticket físico o digital mediante URL única (sin necesidad de iniciar sesión).',
      'Validación del QR con respuesta inmediata y segura a través de funciones edge.',
      'Mejoras en el contador de puntos con sincronización en tiempo real y feedback visual (toast).',
      'Nuevo sistema de redirección inteligente tras escanear QR, con persistencia de mensajes entre rutas.',
      'Mejoras en la confiabilidad del escaneo desde dispositivos móviles y cámaras con baja calidad.',
      'Optimización del flujo de usuario al redirigir desde QR a pantalla de selección con información pre-cargada.',
    ],
    },
    {
      nombre: 'V-1.3',
      cambios: [
        'Nueva libreria para lector de qrs (más rápido y preciso)', 
        'Actualización de registro para empresas.',
        'Mejoras de la vista panel maestro informacion',
        'Visibilidad del historial de versiones.',
        'Nuevas Edge Functions para envío de correos electrónicos.',
        'Actualización en la vista principal del panel maestro.',
        'Mejoras en la interfaz de la vista de usuarios.',
      ],
    },
    {
      nombre: 'V-1.2',
      cambios: [
        'Implementación de un generador de códigos QR.',
        'Integración de tickets QR con impresoras térmicas.',
        'Envío automatizado de correos desde team@fidelity.com.',
        'Creación e integración de nuevas Edge Functions.',
        'Ampliación de funcionalidades para la gestión de entidades.',
        'Rediseño de la página de vista de tarjetas.',
        'Formulario automatizado para la creación de nuevas entidades.',
        'Incorporación de una página informativa (landing page).',
        'Implementación de un panel maestro con vista general de información.',
      ],
    },
    {
      nombre: 'V-1.1',
      cambios: [
        'Primera versión funcional del sistema de login.',
        'Diseño inicial del dashboard principal.',
        'Creación de vistas para la gestión de tarjetas y entidades.',
        'Desarrollo del backend para el almacenamiento de datos.',
        'Implementación de la interfaz de QR.',
        'Despliegue del panel administrativo de entidades.',
        'Integración de una librería para lectura de códigos QR.',
        'Diseño del logotipo y definición de la paleta de colores corporativa.',
      ],
    },
  ];
  

  constructor(private popupService: PopupVService) {}

  onBackgroundTouched() {
    this.popupService.actualizarMostrar(false);
  }
}
