import { ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { SupabaseService } from 'src/app/services/supabase.service';
import { CafeData } from 'src/app/interfaces/cafes_data';
import { Router } from '@angular/router';
import { InternoService } from 'src/app/services/interno.service';
import { Entidades } from 'src/app/interfaces/entdidades';
import { AuthService } from 'src/app/services/auth.service.service';
import {  CameraDevice, Html5Qrcode, Html5QrcodeCameraScanConfig, Html5QrcodeScanner, Html5QrcodeScannerState } from 'html5-qrcode';

@Component({
  selector: 'app-lector-qr',
  templateUrl: './lector-qr.component.html',
  styleUrls: ['./lector-qr.component.css']
})
export class LectorQrComponent implements OnInit, OnDestroy {
  @ViewChild('qrScanner', { static: false }) qrScannerElement!: ElementRef;

  video1: boolean = true;  // controla visibilidad del lector QR
  uuidCifrado: string = '';
  html5QrCode!: Html5Qrcode;
  data_cafe: CafeData = {
    id: "",
    usuario_id: '',
    contador: 0,
    gratis: false,
    opcion: 0,
    cantidad_gratis: 0
  };

  bgClass: string = 'bg';
  clave = 'piazzetta';
  continueScanning = true;
  entidad!: Entidades;
  entidadDistinta = false;
  admin = true;
  lectorOnly = false;
  isScanning: boolean = false;

  html5QrcodeScanner!: Html5QrcodeScanner;
  cameras: CameraDevice[] = [];
currentCameraIndex: number = 0;

  constructor(
    private cdr: ChangeDetectorRef,
    private _SupabaseService: SupabaseService,
    private router: Router,
    private _InternoServices: InternoService,
    private ngZone: NgZone,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.entidad = this._InternoServices.getEntidad();
    this.admin = this._InternoServices.getUserAdmin().soloLectura;
    this.lectorOnly = this._InternoServices.getOnlyScaner();
    this.bgClass = `bg-${this.entidad.background}-card`;
  }

  ngAfterViewInit(): void {
 
      setTimeout(() => {
      this.startScanner();
      this.cdr.detectChanges();
    }, 0);
    
  }

  ngOnDestroy(): void {
    this.stopScanner();
  }

async startScanner(): Promise<void> {
  const qrRegionId = "reader";
  this.html5QrCode = new Html5Qrcode(qrRegionId);

  await this.pedirPermisoCamara();

  Html5Qrcode.getCameras().then(devices => {
    if (devices && devices.length) {
      this.cameras = devices;

      // Por defecto, intentar usar trasera si está
      const backCamera = devices.find(device =>
        device.label.toLowerCase().includes("back") ||
        device.label.toLowerCase().includes("rear") ||
        device.label.toLowerCase().includes("environment")
      );
      console.log(backCamera)
      this.currentCameraIndex = backCamera ? devices.indexOf(backCamera) : 0;

      this.iniciarConCamaraActual();

    } else {
      console.error("No hay cámaras disponibles");
    }
  }).catch(err => {
    console.error("Error al obtener cámaras:", err);
  });
}

iniciarConCamaraActual(): void {
  const cameraId = this.cameras[this.currentCameraIndex].id;
  console.log(cameraId)
  const config: Html5QrcodeCameraScanConfig = {
    fps: 10,
    qrbox: undefined,
    aspectRatio: 1.5
  };

  this.html5QrCode
    .start(
      /* deviceId: { exact: cameraId } si queremos otras camaras */
      { facingMode: "environment" },
      config,
      this.onScanSuccess.bind(this),
      this.onScanFailure.bind(this)
    ).then(() => {
    this.isScanning = true;
  })
    .catch(err => {
      console.error("Error al iniciar cámara:", err);
    });
     console.log(this.cameras)
}


async pedirPermisoCamara(): Promise<void> {
  try {
    // Esto fuerza al navegador a pedir permisos antes de llamar a getCameras()
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    stream.getTracks().forEach(track => track.stop()); // detener la cámara inmediatamente
  } catch (err) {
    console.error("Permiso de cámara denegado", err);
  }
}

cambiarCamara(index:any): void {
  if (this.html5QrCode) {
    this.html5QrCode.stop().then(() => {
      // Cambiar índice
      this.currentCameraIndex = (index) % this.cameras.length;

      // Reiniciar con nueva cámara
      this.iniciarConCamaraActual();
    }).catch(err => {
      console.error("Error al detener cámara:", err);
    });
  }
}



async stopScanner(): Promise<void> {
  if (this.html5QrCode && this.isScanning) {
    try {
      await this.html5QrCode.stop();
      await this.html5QrCode.clear();
      this.isScanning = false;
      console.log("Escáner detenido correctamente");
    } catch (err) {
      console.warn('Error al detener el escáner:', err);
    }
  } else {
    console.log("Escáner no estaba activo, no se detuvo");
  }
}


  async onScanSuccess(decodedText: string): Promise<void> {
    if (!this.continueScanning) return;
    this.continueScanning = false;

    try {
      const uuidDescifrado = this.descifrarUUID(decodedText, this.clave);
      const { data, error } = await this._SupabaseService.getDataCard(uuidDescifrado, this.entidad.tabla_contador);

      if (error || !data || data.length === 0) {
        console.log('Entidad inexistente');
        this.entidadDistinta = true;
        this.video1 = false;  // ocultamos lector al detectar error
        this.stopScanner();
        this.cdr.detectChanges();
        return;
      }

      this.data_cafe = data[0];
      this.entidadDistinta = false;
      this.video1 = false;  // ocultamos lector tras escaneo exitoso
      this.stopScanner();
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error al procesar QR:', error);
    }
  }

  onScanFailure(error: string): void {
    // opcional para manejar errores de escaneo
  }

  reiniciarEscaneo(): void {
    this.continueScanning = true;
    this.entidadDistinta = false;
    this.video1 = true;  // mostramos lector nuevamente
    setTimeout(() => {
      this.startScanner();
      this.cdr.detectChanges();
    }, 300);
  }

  descifrarUUID(uuidCifrado: string, clave: string): string {
    const bytes = CryptoJS.AES.decrypt(uuidCifrado, clave);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  async sumar(): Promise<void> {
    if (this.data_cafe.contador === this.entidad.numero_contador) {
      this.data_cafe.contador = 0;
      this.data_cafe.opcion = 0;
      this.data_cafe.cantidad_gratis = this.data_cafe.cantidad_gratis + 1;
      

      try {
        const responseOpcion: any = (await this._SupabaseService.updateOpcion(this.data_cafe.id, this.entidad.tabla_contador, 0)).data;
        /* console.log("Opcion set 0", responseOpcion); */

        const responseContador: any = (await this._SupabaseService.updateContador(this.data_cafe.id, this.entidad.tabla_contador, 0)).data;
        /* console.log("Contador set 0", responseContador); */

        const responseContadorGratis: any = (await this._SupabaseService.updateContadorGratis(this.data_cafe.id, this.entidad.tabla_contador, this.data_cafe.cantidad_gratis)).data;
        /* console.log("Contador Gratis +1", responseContadorGratis); */

        this.reiniciarEscaneo();
      } catch (error) {
        console.error('Error al crear cafe', error);
      }
    } else {
      try {
        const responseContador: any = (await this._SupabaseService.updateContador(this.data_cafe.id, this.entidad.tabla_contador, this.data_cafe.contador + 1)).data;
        /* console.log("Contador +1 ", responseContador); */

        if(this.data_cafe.contador+1 === this.entidad.numero_contador){
          const payload = {
            usuario_id: this.data_cafe.usuario_id,
            contador_id: this.data_cafe.id,
            contador: this.data_cafe.contador,
            entidad_id: this.entidad.id
          };
    
          // Enviar petición HTTP a la Edge Function
          const response = await fetch(
            'https://rwttebejxwncpurszzld.supabase.co/functions/v1/notifyPrize',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(payload),
            }
          );

          /* console.log(response); */
        }

        this.reiniciarEscaneo();
      } catch (error) {
        console.error('Error al crear cafe', error);
      }
    }
    this.continueScanning = true;
  }

async menu() {
  await this.stopScanner();
  this.ngZone.run(() => {
    this.router.navigate(['/menu-admin']);
  });
}



  back(): void {
    console.log("back: ")
    this.ngZone.run(() => {
      this.router.navigate(['/admin']);
    });
  }

  clearStorage(): void {
    const coockies = this._InternoServices.getCoockes();
    localStorage.clear();
    this._InternoServices.setCoockes(coockies);
    this.authService.logout();
  /*   this.detenerEscaneo() */
    this.ngZone.run(() => {
      this.router.navigate(['/home']);
    });
  }

}
