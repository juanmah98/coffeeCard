import { ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import jsQR from 'jsqr';
import { interval, Subscription, takeWhile } from 'rxjs';
import { CafeData } from 'src/app/interfaces/cafes_data';
import { Entidades } from 'src/app/interfaces/entdidades';
import { Usuarios } from 'src/app/interfaces/usuarios';
import { AuthService } from 'src/app/services/auth.service.service';
import { InternoService } from 'src/app/services/interno.service';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-lector-qr-usuario',
  templateUrl: './lector-qr-usuario.component.html',
  styleUrls: ['./lector-qr-usuario.component.css']
})
export class LectorQrUsuarioComponent implements OnInit {

  @ViewChild('video') videoElement!: ElementRef;
  @ViewChild('canvas') canvasElement!: ElementRef;

/*   video1: boolean = true;
  video2: boolean = false; */
  mensaje:string = '';
  data_contador: CafeData = {
    id: "",
    usuario_id: '',
    contador: 0,
    gratis: false,
    opcion: 0,
    cantidad_gratis: 0
}

dataUser:Usuarios = {
  id: "",
  email: "",
  name: "",
  fecha_creacion: new Date(),
  pais: '',
};

  bgClass: string = 'bg';
  private scanSubscription: Subscription = new Subscription();
  continueScanning = true;
  entidad!: Entidades;
  entidadDistinta = false;

  constructor(private cdr: ChangeDetectorRef, private _SupabaseService: SupabaseService, private router: Router, private _InternoServices: InternoService, private ngZone: NgZone, private authService: AuthService) { }

  ngOnInit(): void {
    this.data_contador = this._InternoServices.getDataContador(); // Recupera los datos.
    this.dataUser = this._InternoServices.getUser();
    /* console.log('Data recibida:', this.data_contador); */
    this.startCamera();
    this.initScanInterval();
    this.entidad = this._InternoServices.getEntidad();
    this.bgClass = `bg-${this._InternoServices.getEntidad().background}-card`;
    this.cdr.detectChanges();
    
  }

  ngOnDestroy(): void {
    if (this.scanSubscription) {
      this.scanSubscription.unsubscribe();
    }
  }

  startCamera() {
    if (!!navigator.mediaDevices && !!navigator.mediaDevices.getUserMedia) {
      const constraints = { video: { facingMode: 'environment' } };
      navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
          const video: HTMLVideoElement = this.videoElement.nativeElement;
          video.setAttribute('playsinline', 'true');
          video.setAttribute('webkit-playsinline', 'true');
          video.setAttribute('muted', 'true');
          video.srcObject = stream;
          video.play()
            .catch(err => {
              console.error('Error al acceder a la cámara en Safari:', err);
              this.handleError('HTMLMediaElement');
            });
        })
        .catch(err => {
          console.error('Error al acceder a la cámara en Safari:', err);
          this.handleError('getUserMedia');
        });
    } else {
      console.error('getUserMedia no está soportado por el navegador.');
      this.handleError('getUserMedia');
    }
  }
  

  initScanInterval(): void {
    this.scanSubscription = interval(1000)
      .pipe(
        takeWhile(() => this.continueScanning)
      )
      .subscribe(async () => {
        await this.scanQRCode();
      });
  }

  handleError(method: string): void {
    // Manejar errores específicos de métodos
    switch (method) {
      case 'getUserMedia':
        // Implementa acciones específicas para errores de getUserMedia
        break;
      case 'HTMLMediaElement':
        // Implementa acciones específicas para errores de HTMLMediaElement
        break;
      default:
        // Implementa acciones genéricas para otros errores
        break;
    }
  }

  async scanQRCode() {
    const video = this.videoElement?.nativeElement; // Verificar si videoElement está definido
    if (!video) {
      console.error('Elemento de video no está definido.');
      return;
    }

    const canvas = this.canvasElement?.nativeElement; // Verificar si canvasElement está definido
    if (!canvas) {
      console.error('Elemento de lienzo no está definido.');
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      console.error('No se pudo obtener el contexto 2D del lienzo.');
      return;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);

    if (code) {
     /*  console.log('Código QR escaneado:', code.data); */

      const qrCodes = await this._SupabaseService.validateQRCode(code.data, this.entidad.tabla_contador, this.dataUser.name)
     /* console.log(qrCodes); */
     
      // Detener el escaneo después de leer un código QR
      this.detenerEscaneo();
      if(qrCodes.success == true){
       await this.sumar();
      this.back();
      }else{
        this.mensaje = qrCodes.message;
      }
    /*   console.log(qrCodes.success);  */ 
      // Aquí puedes enviar una solicitud HTTP al servidor para incrementar el contador
    } else {
      console.error('No se pudo detectar ningún código QR.');
    }
  }

  detenerEscaneo(): void {
    this.continueScanning = false;
    /* this.video1 = false;
    this.video2 = true; */
  }

  reiniciarEscaneo(): void {
    this.continueScanning = true;
    /* this.video1 = true;
    this.video2 = false; */
    this.initScanInterval();
  }


  async sumar(): Promise<void> {
     
      try {
        const responseContador: any = (await this._SupabaseService.updateContador(this.data_contador.id, this.entidad.tabla_contador, this.data_contador.contador + 1)).data;
       /*  console.log("Contador +1 ", responseContador); */

      } catch (error) {
        console.error('Error al crear cafe', error);
      }
    
    this.continueScanning = true;
  }


  back(): void {
    this.ngZone.run(() => {
      this.router.navigate(['/cardSelection']);
    });
  }

  clearStorage(): void {
    const coockies = this._InternoServices.getCoockes();
    localStorage.clear();
    this._InternoServices.setCoockes(coockies);
    this.authService.logout();
    this.detenerEscaneo()
    this.ngZone.run(() => {
      this.router.navigate(['/home']);
    });
  }

}
