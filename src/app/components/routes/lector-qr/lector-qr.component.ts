import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import jsQR from 'jsqr';
import * as CryptoJS from 'crypto-js';
import { SupabaseService } from 'src/app/services/supabase.service';
import { CafeData } from 'src/app/interfaces/cafes_data';

@Component({
  selector: 'app-lector-qr',
  templateUrl: './lector-qr.component.html',
  styleUrls: ['./lector-qr.component.css']
})
export class LectorQrComponent implements OnInit {
  @ViewChild('video') videoElement!: ElementRef;
  @ViewChild('canvas') canvasElement!: ElementRef;

  uuidCifrado:string='';
  data_cafe:CafeData = 
  {
    id: "",
    contador: 0,
    gratis: false,
    opcion: 0,
    cantidad_gratis: 0
}

// Clave para cifrar/descifrar
  clave = 'piazzetta';
  constructor(private _SupabaseService:SupabaseService,) { }

  ngOnInit(): void {
   
  }

  ngAfterViewInit(): void {
    this.startCamera();
  }

  startCamera() {
    if (!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(stream => {
          this.videoElement.nativeElement.srcObject = stream;
        })
        .catch(err => console.error('Error al acceder a la cámara:', err));
    } else {
      console.error('getUserMedia no está soportado por el navegador.');
    }
  }

  scanQRCode() {
    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    const context = canvas.getContext('2d');
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

      // Aquí puedes enviar una solicitud HTTP al servidor para incrementar el contador
    } else {
      console.error('No se pudo detectar ningún código QR.');
    }
  }

  decifrado(){
    const uuidDescifrado = this.descifrarUUID(this.uuidCifrado, this.clave);
    console.log('UUID descifrado:', uuidDescifrado);
  }

  descifrarUUID(uuidCifrado: string, clave: string): string {
    const bytes = CryptoJS.AES.decrypt(uuidCifrado, clave);
    return bytes.toString(CryptoJS.enc.Utf8);
}

async sumar(){
  if(this.data_cafe.contador==10){

    this.data_cafe.contador=0;
    this.data_cafe.opcion=0;
   await this._SupabaseService.postOpcion(this.data_cafe.id,0).subscribe(
      (response) => {
        console.log('suma opcion recet', response);
        /* this.router.navigate(['/user']); */
      },
      (error) => {
        console.error('Error al crear cafe', error);
      }
    );

    await this._SupabaseService.postContador(this.data_cafe.id,0).subscribe(
      (response) => {
        console.log('suma contador con recet', response);
        /* this.router.navigate(['/user']); */
      },
      (error) => {
        console.error('Error al crear cafe', error);
      }
    );

    this.data_cafe = 
    {
      id: "",
      contador: 0,
      gratis: false,
      opcion: 0,
      cantidad_gratis: 0
  }
    this.ngOnInit();
  }else{      
    await this._SupabaseService.postContador(this.data_cafe.id,this.data_cafe.contador+1).subscribe(
      (response) => {
        console.log('contador aumentado', response);
        /* this.router.navigate(['/user']); */
      },
      (error) => {
        console.error('Error al crear cafe', error);
      }
    );
    this.data_cafe = 
    {
      id: "",
      contador: 0,
      gratis: false,
      opcion: 0,
      cantidad_gratis: 0
  }
   await this.ngOnInit();
  }

 

}
}
