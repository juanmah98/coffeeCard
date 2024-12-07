import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from 'src/app/services/supabase.service';
import { QzTrayService } from 'src/app/services/qz-tray.service';

@Component({
  selector: 'app-generador-qrs',
  templateUrl: './generador-qrs.component.html',
  styleUrls: ['./generador-qrs.component.css']
})
export class GeneradorQrsComponent implements OnInit {
  quantity: number = 1; // Cantidad de QR a generar
  qrCodes: any[] = []; // QR generados
  entidadName: string = ''; // Nombre de la entidad
  printers: string[] = []; // Lista de impresoras disponibles
  selectedPrinter: string = ''; // Impresora seleccionada por el usuario

  constructor(private qrService: SupabaseService, private router: Router, private ngZone: NgZone, private qzTrayService: QzTrayService) {}

  ngOnInit(): void {
    this.initializar();
    
    this.loadPrinters();
  }

  async initializar() {
    let a;
    try {
      a = await this.qzTrayService.initialize();
      console.log(a);
    } catch (error) {
      console.error('Error al cargar las impresoras:', error);
    }
  }

  async loadPrinters() {
    try {
      this.printers = await this.qzTrayService.getPrinters();
      if (this.printers.length > 0) {
        this.selectedPrinter = this.printers[0]; // Seleccionamos la primera impresora disponible por defecto
      }
    } catch (error) {
      console.error('Error al cargar las impresoras:', error);
    }
  }

  async generateQRCodes() {
    try {
      const entidadId = 'acea5b45-6b7d-4464-bf68-e13fde1e7b97'; // Reemplaza con el UUID de la entidad actual
      this.entidadName = await this.qrService.getEntidadName(entidadId); // Obtener el nombre de la entidad
      this.qrCodes = await this.qrService.generateQRCodes(entidadId, this.quantity);
      console.log('QR Codes generados:', this.qrCodes);
    } catch (error) {
      console.error('Error generando QR:', error);
    }
  }

  // Método para imprimir los QR generados
  async printQRCodes() {
    if (!this.selectedPrinter) {
      console.error('No se ha seleccionado ninguna impresora.');
      return;
    }

    try {
      await this.qzTrayService.setPrinter(this.selectedPrinter); // Configurar la impresora seleccionada
      const dataToPrint = this.qrCodes.map((qr) => {
        return `Entidad: ${this.entidadName}\nQR: ${qr.qr_code}\nEscanea para sumar 1 punto\nhttps://fidecards.com`;
      });

      await this.qzTrayService.print(dataToPrint); // Imprimir los QR
      console.log('QRs enviados a la impresora');
    } catch (err) {
      console.error('Error al imprimir los QR:', err);
    }
  }

  back(): void {
    console.log("back: ");
    this.ngZone.run(() => {
      this.router.navigate(['/admin']);
    });
  }
}
