import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-generador-qrs',
  templateUrl: './generador-qrs.component.html',
  styleUrls: ['./generador-qrs.component.css']
})
export class GeneradorQrsComponent implements OnInit {

  quantity: number = 1; // Cantidad de QR a generar
  qrCodes: any[] = []; // QR generados
  entidadName: string = ''; // Nombre de la entidad

  constructor(private qrService: SupabaseService, private router: Router, private ngZone: NgZone) {}

  ngOnInit(): void {
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

  // Imprimir los QR generados
  printQRCodes() {
    window.print();
  }

  back(): void {
    console.log("back: ")
    this.ngZone.run(() => {
      this.router.navigate(['/admin']);
    });
  }
}
