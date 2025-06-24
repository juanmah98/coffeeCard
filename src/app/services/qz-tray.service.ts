import { Injectable } from '@angular/core';
import { hextorstr, KEYUTIL, KJUR, stob64 } from 'jsrsasign';
import * as qz from 'qz-tray';
import * as forge from 'node-forge';


@Injectable({
  providedIn: 'root',
})

export class QzTrayService {
  private selectedPrinterName: string = ''; // Almacenar la impresora seleccionada
  privateKeyPem:any;
  constructor() {
    this.configureQZTraySecurity();
  }

  
  private async loadPrivateKey(): Promise<void> {
    try {
      const response = await fetch('../../assets/js/key.pem');
      this.privateKeyPem = await response.text();
      
      if (!this.privateKeyPem.includes('-----BEGIN PRIVATE KEY-----')) {
        throw new Error('Formato de clave privada inválido');
      }
    } catch (error) {
      console.error('Error cargando clave privada:', error);
      throw error;
    }
  }

  // Configurar la seguridad de QZ Tray
  private async configureQZTraySecurity(): Promise<void> {
   
    
  
  /*    qz.security.setCertificatePromise(() => {
      return fetch("../../assets/js/cert.pem").then(res => res.text());
    }); 
 */
 
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
  
  /*   qz.api.setSha256Type((data:any) => sha256(data));
    qz.api.setPromiseType(resolver => new Promise(resolver)); */

    qz.security.setSignaturePromise((toSign) => {
      return async (resolve, reject) => {
        try {
          const privateKey = forge.pki.privateKeyFromPem(this.privateKeyPem);
          const md = forge.md.sha1.create();
          md.update(toSign, 'utf8');
          
          // Generar firma en formato DER y convertir a Base64
          const signature = privateKey.sign(md);
          const base64Signature = forge.util.encode64(signature);
          
          resolve(base64Signature);
        } catch (error) {
          console.error('Error firmando:', error);
          reject('Firma inválida');
        }
      };
    });

   /*  qz.api.setSha256Type((data: any) => sha256(data)); */
    qz.api.setPromiseType(resolver => new Promise(resolver));
   /*  qz.security.setSignaturePromise(hash => {
      return (resolve, reject) => {
       fetch("../../assets/js/key.pem", {cache: 'no-store', headers: {'Content-Type': 'text/plain'}})
        .then(wrapped => wrapped.text())
        .then(data => {
          var pk = KEYUTIL.getKey(data);
          var sig = new KJUR.crypto.Signature({"alg": "SHA1withRSA"});
          sig.init(pk);
          sig.updateString(hash);
          var hex = sig.sign();
          console.log("DEBUG: \n\n" + stob64(hextorstr(hex)));
          resolve(stob64(hextorstr(hex)));
        })
        .catch(err => console.error(err));
       };
     }); */
    /* qz.security.setCertificatePromise(() => fetch("../../assets/js/cert.pem").then(res => res.text())); */
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
      await this.loadPrivateKey();
      await this.configureQZTraySecurity();
      await qz.websocket.connect();
      console.log('Conexión exitosa con QZ Tray');
    } catch (error) {
      console.error('Error inicializando QZ Tray:', error);
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

  async getPrinterCapabilities(printerName: string): Promise<void> {
    try {
      const capabilities = await qz.printers.getDefault(printerName);
      console.log(`Capacidades de la impresora ${printerName}:`, capabilities);
    } catch (error) {
      console.error('Error obteniendo capacidades de la impresora:', error);
    }
  }
  
  

  async printRaw(printData: any[]): Promise<void> {
    try {
      const defaultPrinter = await qz.printers.getDefault();
      const config = qz.configs.create(defaultPrinter);
      await qz.print(config, printData);
      console.log('Impresión exitosa' + defaultPrinter);
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
