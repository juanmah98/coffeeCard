import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from 'src/app/services/supabase.service';
import jsPDF from 'jspdf';


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

  ngOnInit(): void {}

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

  generatePDF() {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [80, this.qrCodes.length * 70 + 20], // Ajustamos el tamaño del papel dinámicamente
    });
  
    let yOffset = 15; // Margen superior inicial más reducido
  
    this.qrCodes.forEach((qr, index) => {
      // Añadir el título en negrita
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(this.entidadName, 40, yOffset, { align: 'center' });
      yOffset += 2; // Reducimos el espacio entre el título y el QR
  
      // Generar el QR
      const qrCanvas = document.querySelectorAll('qrcode canvas')[index] as HTMLCanvasElement;
      if (qrCanvas) {
        const qrImageData = qrCanvas.toDataURL('image/png');
        doc.addImage(qrImageData, 'PNG', 15, yOffset, 50, 50); // Centrado horizontalmente
        yOffset += 55; // Dejar espacio después del QR
      }
  
      // Añadir texto descriptivo debajo del QR
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Escanea para sumar 1 punto', 40, yOffset, { align: 'center' });
      yOffset += 6;
      doc.text('https://fidecards.com', 40, yOffset, { align: 'center' });
      yOffset += 15; // Separación entre QR y el siguiente
  
      // Si el contenido excede el límite de la página, crear una nueva
      if (yOffset > 270 && index < this.qrCodes.length - 1) {
        doc.addPage();
        yOffset = 15; // Reiniciamos el margen superior
      }
    });
  
    // Descargar el archivo PDF
    doc.save('qrcodes.pdf');
  }
  

  back(): void {
    console.log("back: ");
    this.ngZone.run(() => {
      this.router.navigate(['/admin']);
    });
  }
}
