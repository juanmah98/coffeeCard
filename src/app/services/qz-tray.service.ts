import { Injectable } from '@angular/core';
import * as qz from 'qz-tray';

@Injectable({
  providedIn: 'root'
})
export class QzTrayService {

  constructor() {}

  // Inicializar QZ Tray
  async initialize(): Promise<void> {
    try {
      await qz.websocket.connect();
      console.log("Conexión exitosa con QZ Tray");
    } catch (err) {
      console.error("Error al conectar con QZ Tray:", err);
    }
  }

  // Desconectar QZ Tray
  disconnect(): void {
    qz.websocket.disconnect();
  }

  // Configurar impresora
  setPrinter(printerName: string): void {
    qz.printers.find(printerName).then((printer) => {
      if (typeof printer === 'string') {
        qz.configs.create(printer);
      } else if (Array.isArray(printer)) {
        console.error("Se encontraron múltiples impresoras. Por favor, especifique una.");
      }
    }).catch((err) => {
      console.error("Impresora no encontrada:", err);
    });
  }
  

  // Imprimir datos
  async print(data: string[]): Promise<void> {
    try {
      const defaultPrinter = await qz.printers.getDefault();
      const config = qz.configs.create(defaultPrinter);
      await qz.print(config, data);
      console.log("Impresión exitosa");
    } catch (err) {
      console.error("Error durante la impresión:", err);
    }
  }
  

  // Obtener lista de impresoras
  async getPrinters(): Promise<string[]> {
    const printers = await qz.printers.find();
    console.log("Impresoras detectadas:", printers);
    if (typeof printers === 'string') {
      return [printers]; // Convertir a array si es un solo string
    }
    return printers;
  }
  
}
