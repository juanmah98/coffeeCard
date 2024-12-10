import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from 'src/app/services/supabase.service';
import { QzTrayService } from 'src/app/services/qz-tray.service';
import { InternoService } from 'src/app/services/interno.service';
import { Entidades } from 'src/app/interfaces/entdidades';

@Component({
  selector: 'app-generador-qrs',
  templateUrl: './generador-qrs.component.html',
  styleUrls: ['./generador-qrs.component.css'],
})
export class GeneradorQrsComponent implements OnInit {
  quantity: number = 1; // Cantidad de QR a generar
  qrCodes: any[] = []; // Lista de QR generados
  entidadName: string = ''; // Nombre de la entidad
  printers: string[] = []; // Lista de impresoras
  selectedPrinter: string = ''; // Impresora seleccionada
  entidad!: Entidades; // Información de la entidad

  constructor(
    private qrService: SupabaseService,
    private router: Router,
    private ngZone: NgZone,
    private qzTrayService: QzTrayService,
    private internoService: InternoService
  ) {}

  async ngOnInit(): Promise<void> {
    this.entidad = this.internoService.getEntidad(); // Obtener entidad actual
    try {
      await this.initializeQZTray();
      await this.loadPrinters();
      console.log('Impresoras cargadas:', this.printers);
    } catch (error) {
      console.error('Error al inicializar QZ Tray o cargar impresoras:', error);
    }
  }

  // Inicializar QZ Tray
  private async initializeQZTray(): Promise<void> {
    await this.qzTrayService.initialize();
    console.log('QZ Tray inicializado correctamente');
  }

  // Cargar impresoras disponibles
  private async loadPrinters(): Promise<void> {
    const printers = await this.qzTrayService.getPrinters();
    this.printers = printers;
    if (this.printers.length > 0) {
      this.selectedPrinter = this.printers[0];
    } else {
      console.warn('No se encontraron impresoras');
    }
  }

  // Generar códigos QR
  async generateQRCodes(): Promise<void> {
    try {
      
      const entidadId = this.entidad.id; // ID de la entidad actual
      this.entidadName = await this.qrService.getEntidadName(entidadId); // Obtener el nombre de la entidad
      this.qrCodes = await this.qrService.generateQRCodes(entidadId, this.quantity); // Generar QR
      console.log('QR generados:', this.qrCodes);
    } catch (error) {
      console.error('Error generando códigos QR:', error);
    }
  }

  // Imprimir los códigos QR generados
  async printQRCodes(): Promise<void> {
    if (!this.selectedPrinter) {
      console.error('No se ha seleccionado ninguna impresora.');
      return;
    }

    if (!this.qrCodes.length) {
      console.error('No hay códigos QR generados para imprimir.');
      return;
    }

    try {
      // Configurar la impresora seleccionada
      await this.qzTrayService.setPrinter(this.selectedPrinter);

      // Preparar los datos para imprimir
      const printData = this.qrCodes.map(
        (qr) =>
          `Entidad: ${this.entidadName}\nQR: ${qr.qr_code}\nEscanea para sumar 1 punto\nhttps://fidecards.com`
      );

      // Enviar datos a imprimir
      await this.qzTrayService.print(printData);
      console.log('QR enviados a la impresora');
    } catch (error) {
      console.error('Error al imprimir los códigos QR:', error);
    }
  }

  // Navegar hacia atrás
  back(): void {
    this.ngZone.run(() => {
      this.router.navigate(['/admin']);
    });
  }
}
