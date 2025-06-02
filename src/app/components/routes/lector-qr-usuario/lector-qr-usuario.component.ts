import { ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CafeData } from 'src/app/interfaces/cafes_data';
import { Entidades } from 'src/app/interfaces/entdidades';
import { Usuarios } from 'src/app/interfaces/usuarios';
import { AuthService } from 'src/app/services/auth.service.service';
import { InternoService } from 'src/app/services/interno.service';
import { SupabaseService } from 'src/app/services/supabase.service';
import { Html5Qrcode, Html5QrcodeCameraScanConfig, CameraDevice } from 'html5-qrcode';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-lector-qr-usuario',
  templateUrl: './lector-qr-usuario.component.html',
  styleUrls: ['./lector-qr-usuario.component.css']
})
export class LectorQrUsuarioComponent implements OnInit, OnDestroy {

  @ViewChild('qrScanner', { static: false }) qrScannerElement!: ElementRef;

  mensaje: string = '';
  data_contador: CafeData = {
    id: "",
    usuario_id: '',
    contador: 0,
    gratis: false,
    opcion: 0,
    cantidad_gratis: 0
  }

  dataUser: Usuarios = {
    id: "",
    email: "",
    name: "",
    fecha_creacion: new Date(),
    pais: '',
    ciudad: ''
  };
isScannerRunning: boolean = false;
  bgClass: string = 'bg';
  entidad!: Entidades;
  entidadDistinta = false;
  html5QrCode!: Html5Qrcode;
  continueScanning: boolean = true;
  cameras: CameraDevice[] = [];
  currentCameraIndex: number = 0;

  constructor(
    private cdr: ChangeDetectorRef,
    private _SupabaseService: SupabaseService,
    private router: Router,
    private _InternoServices: InternoService,
    private ngZone: NgZone,
    private authService: AuthService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.data_contador = this._InternoServices.getDataContador();
    this.dataUser = this._InternoServices.getUser();
    this.entidad = this._InternoServices.getEntidad();
    this.bgClass = `bg-${this.entidad.background}-card`;

    setTimeout(() => {
      this.startScanner();
    }, 0);
  }

  ngOnDestroy(): void {
    this.stopScanner();
  }

  async startScanner(): Promise<void> {
    const qrRegionId = "reader"; // Debes tener un div con id="reader"
    this.html5QrCode = new Html5Qrcode(qrRegionId);

    await this.pedirPermisoCamara();

    Html5Qrcode.getCameras().then(devices => {
      if (devices && devices.length) {
        this.cameras = devices;

        const backCamera = devices.find(device =>
          device.label.toLowerCase().includes("back") ||
          device.label.toLowerCase().includes("rear") ||
          device.label.toLowerCase().includes("environment")
        );

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
    const config: Html5QrcodeCameraScanConfig = {
      fps: 10,
      qrbox: undefined,
      aspectRatio: 1.5
    };

    this.html5QrCode
  .start(
    { facingMode: "environment" },
    config,
    this.onScanSuccess.bind(this),
    this.onScanFailure.bind(this)
  )
  .then(() => {
    this.isScannerRunning = true;
  })
  .catch(err => {
    console.error("Error al iniciar cámara:", err);
  });
  }

  async pedirPermisoCamara(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
    } catch (err) {
      console.error("Permiso de cámara denegado", err);
    }
  }

stopScanner(): void {
  if (this.html5QrCode && this.isScannerRunning) {
    this.html5QrCode.stop()
      .then(() => {
        this.html5QrCode.clear();
        this.isScannerRunning = false;
      })
      .catch(err => {
        console.warn("Scanner no estaba corriendo:", err);
      });
  }
}

  async onScanSuccess(decodedText: string): Promise<void> {
    const codigo:any = await this.extraerCodigoQR(decodedText)
    if (!this.continueScanning) return;
    this.continueScanning = false;
    /* console.log("codigo: " + codigo) */
    try {
      const qrCodes = await this._SupabaseService.validateQRCode(codigo, this.entidad.id, this.dataUser.name);

      this.stopScanner();
      if (qrCodes.success) {
        await this.sumar();
        this.back(true);
      } else {
        this.mensaje = qrCodes.message;
      }
    } catch (error) {
      console.error('Error al procesar QR:', error);
    }
  }

 async extraerCodigoQR(qrTexto: string): Promise<string | null> {
  try {
    const url = new URL(qrTexto);
    const codigo = url.searchParams.get("codigo");
    return codigo;
  } catch {
    // No es una URL: validar si el texto tiene pinta de ser un código válido
    const regex = /^[0-9a-fA-F\-]{36}-[a-z0-9]+$/; // UUID + sufijo (ej: wz54bkifsr)
    return regex.test(qrTexto) ? qrTexto : null;
  }
}


  onScanFailure(error: string): void {
    // Opcional: manejar errores de escaneo
  }

  reiniciarEscaneo(): void {
  this.continueScanning = true;
  this.isScannerRunning = false;
  setTimeout(() => {
    this.startScanner();
    this.cdr.detectChanges();
  }, 300);
}

  async sumar(): Promise<void> {
    try {
      const nuevoContador = this.data_contador.contador + 1;

      const responseContador: any = await this._SupabaseService.updateContador(
        this.data_contador.id,
        this.entidad.tabla_contador,
        nuevoContador
      );

      if (nuevoContador === this.entidad.numero_contador) {
        const payload = {
          usuario_id: this.data_contador.usuario_id,
          contador_id: this.data_contador.id,
          contador: nuevoContador,
          entidad_id: this.entidad.id
        };

        const response = await fetch(
          'https://rwttebejxwncpurszzld.supabase.co/functions/v1/notifyPrize',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          }
        );
        if (response.ok) {
          console.log('Notificación enviada con éxito');
        } else {
          console.error('Error al enviar la notificación', await response.json());
        }
      }

      this.continueScanning = true;
    } catch (error) {
      console.error('Error al incrementar el contador:', error);
    }
  }

 back(toast:boolean): void {
  if(toast){
    this.toastService.setShowToast(true, '¡QR leído con éxito!', 'success');
}else{
    this.toastService.setShowToast(true, 'Este QR ya fue usado', 'error');
}
  this.ngZone.run(() => {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/cardSelection']);
    });
  });
}

  clearStorage(): void {
    const coockies = this._InternoServices.getCoockes();
    localStorage.clear();
    this._InternoServices.setCoockes(coockies);
    this.authService.logout();
    this.stopScanner();
    this.ngZone.run(() => {
      this.router.navigate(['/home']);
    });
  }
}
