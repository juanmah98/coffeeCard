import { Injectable } from '@angular/core';
import * as qz from 'qz-tray';

@Injectable({
  providedIn: 'root',
})
export class QzTrayService {
  private selectedPrinterName: string = ''; // Almacenar la impresora seleccionada
  constructor() {
    this.configureQZTraySecurity();
  }

  // Configurar la seguridad de QZ Tray
  private configureQZTraySecurity(): void {
   
   
    
  


    qz.security.setCertificatePromise((resolve, reject) => {
      resolve(`-----BEGIN CERTIFICATE-----
        MIIEDzCCAvegAwIBAgIUYaXhs8ECfY5lgbtYDkYQK1G7AyMwDQYJKoZIhvcNAQEL
        BQAwgZUxCzAJBgNVBAYTAmFyMRAwDgYDVQQIDAdzYW5qdWFuMRAwDgYDVQQHDAdz
        YW5qdWFuMREwDwYDVQQKDAhmaWRlbGl0eTERMA8GA1UECwwIZmlkZWxpdHkxFjAU
        BgNVBAMMDWZpZGVjYXJkcy5jb20xJDAiBgkqhkiG9w0BCQEWFWhhbG8taG9sYUBo
        b3RtYWlsLmNvbTAgFw0yNDEyMDcxNzE3MjhaGA8yMDU2MDYwMTE3MTcyOFowgZUx
        CzAJBgNVBAYTAmFyMRAwDgYDVQQIDAdzYW5qdWFuMRAwDgYDVQQHDAdzYW5qdWFu
        MREwDwYDVQQKDAhmaWRlbGl0eTERMA8GA1UECwwIZmlkZWxpdHkxFjAUBgNVBAMM
        DWZpZGVjYXJkcy5jb20xJDAiBgkqhkiG9w0BCQEWFWhhbG8taG9sYUBob3RtYWls
        LmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAMD5HSDWXKGtJzDM
        Dx0HwLfWPfjx4VSi1OBij5hs5O2/Mtrrd1QXkadS4WERIWCeZn3Y8fWOZKU9AClv
        JY0DoG8uluxzHCRcEP1FZmPHEyYleXGw4PGhJiau11ye5W6yoRalB6VwNwhlxbt0
        xRq4U1P4SaxZbrqXFaw3qEt12YNnqAC2w5iO/83Q9f/Mgf1+WKQHOzaVkyLfSmP1
        K5UbBvIrJpWi+MluzalhaHTwMjZ0RbeDdyzvfSUMzPHS+uu4HJzFyjVwgtQ2Lb56
        wNb7KCBSyQvvg9UkuDFOmyHQp80X9Cnop1nXp2LmmSVKdHsRe2n8V6V77SIWZRSY
        oGVIrMcCAwEAAaNTMFEwHQYDVR0OBBYEFMXRIaPeBoPkj5DeRwOCNL5D0eDnMB8G
        A1UdIwQYMBaAFMXRIaPeBoPkj5DeRwOCNL5D0eDnMA8GA1UdEwEB/wQFMAMBAf8w
        DQYJKoZIhvcNAQELBQADggEBABLk5ijPdtOHCXpBZ24Y78dctRdxY8NJQCmhbAkA
        9YHQG/H5jSC3Tf1WnkWllZxj9pUrtJ1x3g+Yr60f5HCFjv6lGUecNdJc8jRQv4U3
        Wj05moJf5RheJXmGgpNqdsQzBrPlkvlfY7ugrOVDWSMhHVoM1rqBNSDRLvtk2fqO
        SE08/NdqF4A3tXyUxA+Uj0m6XTJdqLbdObijbdUprDbxNUKO+pgWiX2T+r7VY/+l
        gzKYb87Bj40JzD1fRQgtUR4JCwA6EeoxEICNInTGZgp4vWNM/bBDEGr3anNhR5AM
        dSfZfIGJJjsES0qFo+t0NEDhJbmI0qe4v+xXCPLmm7S8FJY=
        -----END CERTIFICATE-----`);
    });

    qz.security.setSignatureAlgorithm('SHA1');

    qz.api.setSha256Type((data:any) => sha256(data));

    
   /*  qz.security.setSignaturePromise((toSign) => {
      return new Promise((resolve, reject) => {
          try {
              const signature = this.simulateSigning(toSign);
              resolve(signature);  // Promesa resuelta correctamente
          } catch (error) {
              reject('Error al firmar: ' + error);  // Promesa rechazada
          }
      });
  }); */
  
    
   
    
  }

 simulateSigning(toSign:string) {
    // Aquí deberías generar una firma real con el certificado y la clave privada
    return "simulated-signature"; // Esta es solo una simulación, reemplaza con lógica real
  }

  // Inicializar QZ Tray
  async initialize(): Promise<void> {
    try {
      await qz.websocket.connect();
      console.log('Conexión exitosa con QZ Tray');
    } catch (err) {
      console.error('Error al conectar con QZ Tray:', err);
    }
  }

  // Obtener lista de impresoras
  async getPrinters(): Promise<string[]> {
    try {
        console.log('Buscando impresoras...');
        const printers = await qz.printers.find();
        console.log('Impresoras detectadas:', printers);
        return typeof printers === 'string' ? [printers] : printers;
    } catch (err) {
        console.error('Error obteniendo impresoras:', err);
        return [];
    }
}


  // Configurar impresora
  async setPrinter(printerName: string): Promise<void> {
    try {
      // Guardar el nombre de la impresora seleccionada
      this.selectedPrinterName = printerName;

      // Configurar la impresora seleccionada
      const config = qz.configs.create(printerName);
      console.log(`Impresora configurada correctamente: ${printerName}`);
    } catch (err) {
      console.error('Error configurando la impresora:', err);
    }
  }

  // Imprimir datos
  async print(printData: any[]): Promise<void> {
    try {
      // Verificar que hay una impresora seleccionada
      if (!this.selectedPrinterName) {
        throw new Error('No hay una impresora configurada.');
      }

      // Configurar la impresora seleccionada para imprimir
      const config = qz.configs.create(this.selectedPrinterName);
      await qz.print(config, printData);

      console.log('Impresión exitosa');
    } catch (err) {
      console.error('Error durante la impresión:', err);
    }
  }
  

  async printRaw(printData: any[]): Promise<void> {
    try {
      const defaultPrinter = await qz.printers.getDefault();
      const config = qz.configs.create(defaultPrinter);
      await qz.print(config, printData);
      console.log('Impresión exitosa');
    } catch (err) {
      console.error('Error durante la impresión:', err);
    }
  }
  
  
  

  // Desconectar QZ Tray
  disconnect(): void {
    qz.websocket.disconnect();
    console.log('Desconectado de QZ Tray');
  }
}

function sha256(data: string): string {
  // Implementa una función sha256 adecuada aquí
  return ''; // Devuelve el hash de `data`
}
