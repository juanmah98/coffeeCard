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
      nombre: 'V-1.3',
      cambios: [
        'Mejoras de la vista panel maestro informacion',
        'Visibilidad del historial de versiones.',
        'Nuevas Edge Functions para envío de correos electrónicos.',
        'Actualización en la vista principal del panel maestro.',
        'Mejoras en la interfaz de la vista de usuarios.',
        'Actualización de registro para empresas.',
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
