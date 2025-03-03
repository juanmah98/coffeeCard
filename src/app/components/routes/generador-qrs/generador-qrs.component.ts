import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from 'src/app/services/supabase.service';
import { QzTrayService } from 'src/app/services/qz-tray.service';
import { InternoService } from 'src/app/services/interno.service';
import { Entidades } from 'src/app/interfaces/entdidades';
import * as QRCode from 'qrcode';

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
  
      for (const qr of this.qrCodes) {
        // Enviar texto
        const textData = [
          {
            type: 'raw',
            format: 'plain',
            data: `Entidad: ${this.entidadName}\nEntra en la web\nhttps://fidecards.com\ny escanea para sumar 1 punto\n\n\n`,
          },
        ];
        await this.qzTrayService.print(textData);
        console.log("datos: "+textData)
  
        // Generar la imagen QR en base64
        const imageBase64 = await this.generateQRCodeImage(qr.qr_code);
  
        // Enviar la imagen
        const imageData = [
          {
            type: 'image',
            format: 'base64',
            data: imageBase64,
          },
        ];
        await this.qzTrayService.print(imageData);
        console.log("imagen: "+imageData)
    
      }
  
      console.log('QR enviados a la impresora');
    } catch (error) {
      console.error('Error al imprimir los códigos QR:', error);
    }
  }
  
  

  async printQRImagen(): Promise<void> {
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
  
      // Generar imágenes QR en base64
      const imageData: string[] = await Promise.all(
        this.qrCodes.map((qr) => this.generateQRCodeImage(qr.qr_code))
      );
  
      // Crear los datos de impresión para las imágenes
      const printData = imageData.map((image) => ({
        type: 'image',
        format: 'base64',
        data: image,
      }));
  
      // Enviar los datos a imprimir
      await this.qzTrayService.printRaw(printData);
      console.log('QR enviados a la impresora');
    } catch (error) {
      console.error('Error al imprimir los códigos QR:', error);
    }
  }
  
  
  async printQRMultiples(): Promise<void> {
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
  
      for (const qr of this.qrCodes) {
        // Enviar texto
        const textData = [
          {
            type: 'raw',
            format: 'plain',
            data: `\x1b\x45\x01${this.entidadName}\x1b\x45\x00\n` + // Entidad en negrita
          `Entra en la web\n` +
          `\x1b\x45\x01fidecards.com\x1b\x45\x00\n` + // URL en negrita
          `y escanea para sumar 1 punto\n\n\n`,
  },
        ];
        await this.qzTrayService.print(textData);
        console.log("datos: "+textData)
  
        // Generar la imagen QR en base64
        const imageBase64 = await this.generateQRCodeImage(qr.qr_code);
  
        // Enviar la imagen
        const imageData = [
          {
            type: 'image',
            format: 'base64',
            data: imageBase64,
          },
        ];
        await this.qzTrayService.print(imageData);
        console.log("imagen: "+imageData)
    
      }
  
      console.log('QR enviados a la impresora');
    } catch (error) {
      console.error('Error al imprimir los códigos QR:', error);
    }
  }

  async printQRMultiplesSpaces(): Promise<void> {
    if (!this.selectedPrinter) {
        console.error('No se ha seleccionado ninguna impresora.');
        return;
    }

    if (!this.qrCodes.length) {
        console.error('No hay códigos QR generados para imprimir.');
        return;
    }

    try {
        const printData = [];

        await this.qzTrayService.setPrinter(this.selectedPrinter);

        for (const qr of this.qrCodes) {
            printData.push({
                type: 'raw',
                format: 'plain',
                data: `\x1B\x45\x01${this.entidadName}\x1B\x45\x00\n` +
                      `Entra en la web\n` +
                      `\x1B\x45\x01fidecards.com\x1B\x45\x00\n` +
                      `y escanea para sumar 1 punto\n\n\n`
            });

            const imageBase64 = await this.generateQRCodeImage(qr.qr_code);
            printData.push({
                type: 'image',
                format: 'base64',
                data: imageBase64,
                density: 150
            });

            // Espaciado adicional
            printData.push({
                type: 'raw',
                format: 'plain',
                data: new Uint8Array([0x0A, 0x0A]) // 2 saltos de línea
            });
        }

        // Agregar líneas en blanco antes del corte
        printData.push({
            type: 'raw',
            format: 'plain',
            data: new Uint8Array([0x1B, 0x64, 0x05]) // Avanza 5 líneas
        });

        // Comando de corte total
        printData.push({
            type: 'raw',
            format: 'plain',
            data: new Uint8Array([0x1D, 0x56, 0x00]) // Corte total
        });

        // Forzar vaciado del buffer
        printData.push({
            type: 'raw',
            format: 'plain',
            data: new Uint8Array([0x1B, 0x40]) // Reset + vaciado de buffer
        });

        await this.qzTrayService.print(printData);

        console.log('Impresión completada con corte');
    } catch (error) {
        console.error('Error al imprimir:', error);
    }
}

  
  async printQRMultiplesSpaces2(): Promise<void> {
    if (!this.selectedPrinter) {
      console.error('No se ha seleccionado ninguna impresora.');
      return;
    }
  
    if (!this.qrCodes.length) {
      console.error('No hay códigos QR generados para imprimir.');
      return;
    }
  
    try {
      const printData = [];
  
      // Configurar la impresora seleccionada
      await this.qzTrayService.setPrinter(this.selectedPrinter);
  
      for (const qr of this.qrCodes) {
        // Texto con formato
        printData.push({
          type: 'raw',
          format: 'plain',
          data: `\x1B\x45\x01${this.entidadName}\x1B\x45\x00\n` + // Negrita
                `Entra en la web\n` +
                `\x1B\x45\x01fidecards.com\x1B\x45\x00\n` + // Negrita
                `y escanea para sumar 1 punto\n\n\n`
        });
  
        // Generar y agregar QR
        const imageBase64 = await this.generateQRCodeImage(qr.qr_code);
        printData.push({
          type: 'image',
          format: 'base64',
          data: imageBase64,
          density: 150 // Ajuste para mejor calidad
        });
  
        // Espaciado adicional (opcional)
        printData.push({
          type: 'raw',
          format: 'plain',
          data: new Uint8Array([0x0A, 0x0A]) // 2 saltos de línea
        });
      }
  
      // ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
      // CORTE ESPECÍFICO PARA GLOBAL TP-POS80-USB
      printData.push({
        type: 'raw',
        format: 'plain',
        data: new Uint8Array([
          0x1B, 0x64, 0x05, // Avanzar 5 líneas
          0x1D, 0x56, 0x01 // Corte total alternativo
        ])
      });
      // ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
  
      // Enviar todo en un solo trabajo de impresión
      await this.qzTrayService.print(printData);
  
      console.log('Impresión completada con corte');
    } catch (error) {
      console.error('Error al imprimir:', error);
    }
  }

  async printQRMultiples2(): Promise<void> {
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
  
      for (const qr of this.qrCodes) {
        // Generar la imagen QR en base64
        const imageBase64 = await this.generateQRCodeImage(qr.qr_code);
  
        // Combinar texto e imagen en una sola solicitud de impresión
        const printData = [
          {
            type: 'raw',
            format: 'plain',
            data: `${this.entidadName}\nEscanea para sumar 1 punto\nhttps://fidecards.com\n\n\n`,
          },
          {
            type: 'image',
            format: 'base64',
            data: imageBase64,
          },
        ];
  
        // Enviar la solicitud de impresión
        await this.qzTrayService.print(printData);
      }
  
      console.log('QR enviados a la impresora');
    } catch (error) {
      console.error('Error al imprimir los códigos QR:', error);
    }
  }
  
  async printQRBatch(): Promise<void> {
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
  
      // Crear un lote de datos para impresión
      const batchData = [];
  
      for (const qr of this.qrCodes) {
        // Generar la imagen QR en base64
        const imageBase64 = await this.generateQRCodeImage(qr.qr_code);
  
        // Agregar texto e imagen al lote
        batchData.push(
          {
            type: 'raw',
            format: 'plain',
            data: `${this.entidadName}\nEscanea para sumar 1 punto\nhttps://fidecards.com\n\n\n`,
          },
          {
            type: 'image',
            format: 'base64',
            data: imageBase64,
          }
        );
      }
  
      // Enviar el lote completo a la impresora
      await this.qzTrayService.print(batchData);
  
      console.log('Lote de QR enviados a la impresora');
    } catch (error) {
      console.error('Error al imprimir los códigos QR:', error);
    }
  }
  
  
  async printQRMultiplesHtml(): Promise<void> {
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
  
      // Preparar datos para impresión combinada
      const printData: any[] = [];
  
      for (const qr of this.qrCodes) {
        // Texto descriptivo para el QR
        printData.push({
          type: 'html',
          format: 'plain',
          data: `Entidad: ${this.entidadName}\nEscanea para sumar 1 punto\nhttps://fidecards.com\n\n`,
        });
  
        // Generar la imagen QR en base64 y añadirla al trabajo de impresión
        const imageBase64 = await this.generateQRCodeImage(qr.qr_code);
        printData.push({
          type: 'image',
          format: 'base64',
          data: imageBase64,
        });
  
        // Añadir espacio entre QR (aproximadamente 2-3 cm de separación)
        printData.push({
          type: 'html',
          format: 'plain',
          data: '\n\n\n\n\n\n', // Ajusta la cantidad de saltos según sea necesario
        });
      }
  
      // Enviar el trabajo de impresión combinado
      await this.qzTrayService.print(printData);
      console.log('QR enviados a la impresora');
      console.log('Datos enviados a imprimir:', printData);
    } catch (error) {
      console.error('Error al imprimir los códigos QR:', error);
    }
  }

  // Generar imagen QR en base64 a partir del código QR
  private async generateQRCodeImage(qrCode: string): Promise<string> {
    try {
      // Generar el QR como base64
      const qrBase64 = await QRCode.toDataURL(qrCode, { errorCorrectionLevel: 'L' });
      return qrBase64.split(',')[1];
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error('Error al generar QR como imagen: ' + error.message);
      }
      throw new Error('Error desconocido al generar QR');
    }
  }

  async convertImageToEscPos(base64Image: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = `data:image/png;base64,${base64Image}`;
  
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject('Error al obtener el contexto del canvas');
          return;
        }
  
        canvas.width = img.width;
        canvas.height = img.height;
  
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const pixels = imageData.data;
  
        // Comando inicial ESC/POS para gráficos
        let escPosData = '\x1D\x76\x30\x00'; // ESC * raster command
        escPosData += String.fromCharCode(canvas.width / 8); // Width in bytes (divided by 8 for 1-bit)
        escPosData += '\x00'; // Width high byte
        escPosData += String.fromCharCode(canvas.height & 0xFF); // Height low byte
        escPosData += String.fromCharCode((canvas.height >> 8) & 0xFF); // Height high byte
  
        for (let y = 0; y < img.height; y++) {
          let row = '';
          for (let x = 0; x < img.width; x++) {
            const i = (y * img.width + x) * 4;
            const grayscale = 0.299 * pixels[i] + 0.587 * pixels[i + 1] + 0.114 * pixels[i + 2];
            const bit = grayscale < 128 ? 1 : 0;
            row += bit ? '1' : '0';
            if (x % 8 === 7 || x === img.width - 1) {
              escPosData += String.fromCharCode(parseInt(row, 2));
              row = '';
            }
          }
        }
  
        resolve(escPosData);
      };
  
      img.onerror = (err) => {
        reject('Error al cargar la imagen: ' + err);
      };
    });
  }
  

  async printQRMultiplesPiazzetta2(): Promise<void> {
    if (!this.selectedPrinter) {
      console.error('No se ha seleccionado ninguna impresora.');
      return;
    }
  
    if (!this.qrCodes.length) {
      console.error('No hay códigos QR generados para imprimir.');
      return;
    }
  
    try {
      await this.qzTrayService.setPrinter(this.selectedPrinter);
  
      const printData: any[] = [];
  
      for (const qr of this.qrCodes) {
        // Añadir texto descriptivo
        printData.push({
          type: 'raw',
          format: 'plain',
          data: `Entidad: ${this.entidadName}\nEscanea para sumar 1 punto\nhttps://fidecards.com\n\n`,
        });
  
        // Generar imagen QR en base64
        const imageBase64 = await this.generateQRCodeImage(qr.qr_code);
  
        // Enviar imagen en formato base64
        printData.push({
          type: 'image',
          format: 'base64',
          data: imageBase64,
        });
  
        // Espaciado entre impresiones
        printData.push({
          type: 'raw',
          format: 'plain',
          data: '\n\n\n\n\n',
        });
      }
  
      // Enviar todo el trabajo de impresión
      await this.qzTrayService.print(printData);
      console.log('QR enviados a la impresora en formato base64');
    } catch (error) {
      console.error('Error al imprimir los códigos QR:', error);
    }
  }
  
  
  
  
   // Asignar un valor específico a la cantidad
   setQuantity(value: number): void {
    this.quantity = value;
  }

  // Incrementar la cantidad en 1
  incrementQuantity(): void {
    this.quantity++;
  }
  

  // Navegar hacia atrás
  back(): void {
    this.ngZone.run(() => {
      this.router.navigate(['/admin']);
    });
  }
}
