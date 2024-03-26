import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import jsQR from 'jsqr';
import * as CryptoJS from 'crypto-js';
import { SupabaseService } from 'src/app/services/supabase.service';
import { CafeData } from 'src/app/interfaces/cafes_data';
import { Subscription, interval } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-lector-qr',
  templateUrl: './lector-qr.component.html',
  styleUrls: ['./lector-qr.component.css']
})
export class LectorQrComponent implements OnInit {
  @ViewChild('video') videoElement!: ElementRef;
  @ViewChild('canvas') canvasElement!: ElementRef;

  uuidCifrado: string = '';
  data_cafe: CafeData = {
    id: "",
    contador: 0,
    gratis: false,
    opcion: 0,
    cantidad_gratis: 0
  };

  // Clave para cifrar/descifrar
  clave = 'piazzetta';
  private scanSubscription: Subscription = new Subscription();
 continueScanning = true;

  constructor(private _SupabaseService: SupabaseService) { }

  ngOnInit(): void {
    this.startCamera();
    this.initScanInterval();
  }

  ngOnDestroy(): void {
    if (this.scanSubscription) {
      this.scanSubscription.unsubscribe();
    }
  }

  startCamera() {
    if (!!navigator.mediaDevices && !!navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(stream => {
          this.videoElement.nativeElement.srcObject = stream;
        })
        .catch(err => {
          console.error('Error al acceder a la cámara:', err);
          this.handleError('getUserMedia');
        });
    } else if (!!navigator.userAgent.match(/iPad|iPhone|iPod/i)) {
      const constraints = { audio: false, video: { facingMode: { exact: 'environment' } } };
      navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
          const video: HTMLVideoElement = this.videoElement.nativeElement;
          video.setAttribute('playsinline', '');
          video.setAttribute('webkit-playsinline', '');
          video.setAttribute('muted', '');
          video.srcObject = new MediaStream();
          video.srcObject!.addTrack(stream.getVideoTracks()[0].clone());
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
      .subscribe(() => {
        this.scanQRCode();
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

  scanQRCode() {
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
      console.log('Código QR escaneado:', code.data);
      const uuidDescifrado = this.descifrarUUID(code.data, this.clave);
      console.log('UUID descifrado:', uuidDescifrado);
  
      this._SupabaseService.getDataCard(uuidDescifrado).subscribe((data: any) => {
        this.data_cafe = data[0]; 
        console.log(data[0]);
      });
      
      // Detener el escaneo después de leer un código QR
      this.detenerEscaneo();
  
      // Aquí puedes enviar una solicitud HTTP al servidor para incrementar el contador
    } else {
      console.error('No se pudo detectar ningún código QR.');
    }
  }
  
  

  detenerEscaneo(): void {
    this.continueScanning = false;
  }

  reiniciarEscaneo(): void {
    this.continueScanning = true;
    this.initScanInterval();
  }

  descifrarUUID(uuidCifrado: string, clave: string): string {
    const bytes = CryptoJS.AES.decrypt(uuidCifrado, clave);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  async sumar(): Promise<void> {
    if (this.data_cafe.contador === 10) {
      this.data_cafe.contador = 0;
      this.data_cafe.opcion = 0;
      this.data_cafe.cantidad_gratis=this.data_cafe.cantidad_gratis+1;

      try {
        await this._SupabaseService.postOpcion(this.data_cafe.id, 0).toPromise();
        await this._SupabaseService.postContador(this.data_cafe.id, 0).toPromise();
        this.reiniciarEscaneo();
      } catch (error) {
        console.error('Error al crear cafe', error);
      }
    } else {
      try {
        await this._SupabaseService.postContador(this.data_cafe.id, this.data_cafe.contador + 1).toPromise();
        this.reiniciarEscaneo();
      } catch (error) {
        console.error('Error al crear cafe', error);
      }
    }
  }

}
