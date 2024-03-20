import { Component, OnInit } from '@angular/core';
import { CafeData } from 'src/app/interfaces/cafes_data';
import { Usuarios } from 'src/app/interfaces/usuarios';
import { InternoService } from 'src/app/services/interno.service';
import { SupabaseService } from 'src/app/services/supabase.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-card-selection',
  templateUrl: './card-selection.component.html',
  styleUrls: ['./card-selection.component.css']
})
export class CardSelectionComponent implements OnInit {
  imagen = '';
  

  upload:boolean = false;
  nombre:any = '';
  foto:any='';
  contadorArray: number[] = Array(10).fill(0).map((x, i) => i);

  dataUser:Usuarios = {
      id: "",
      email: '',
      contador_cafe_id: '',
  };

  data_cafe:CafeData = 
    {
      id: "",
      contador: 0,
      gratis: false,
      opcion: 0,
      cantidad_gratis: 0
  }
  qrData: string = '';
  uuidCifrado:string='';
  uuidOriginal = 'b961c774-3dbc-49a8-a03d-cb7372037b1c';

// Clave para cifrar/descifrar
  clave = 'piazzetta';
  constructor(private _SupabaseService:SupabaseService, private _dataInterna: InternoService) { }

  ngOnInit(): void {
    this.dataUser = this._dataInterna.getUser();
    this.nombre = localStorage.getItem("name");
    this.foto = localStorage.getItem("photo");
    this._SupabaseService.getDataCard(this.dataUser.contador_cafe_id).subscribe((data: any) => {
      this.data_cafe = data[0]; 
      console.log(data[0]);
    });

    setTimeout(() => {
      this.upload = true;
      this.cifrado();
    }, 2000)

  }

  op1(){
    this._SupabaseService.postOpcion(this.dataUser.contador_cafe_id,1).subscribe(
      (response) => {
        console.log('opcion 1', response);
        /* this.router.navigate(['/user']); */
      },
      (error) => {
        console.error('Error al crear cafe', error);
      }
    );

    this.ngOnInit();
  }

  op2(){
    this._SupabaseService.postOpcion(this.dataUser.contador_cafe_id,2).subscribe(
      (response) => {
        console.log('opcion 2', response);
        /* this.router.navigate(['/user']); */
      },
      (error) => {
        console.error('Error al crear cafe', error);
      }
    );

    this.ngOnInit();

  }

  op3(){
    this._SupabaseService.postOpcion(this.dataUser.contador_cafe_id,3).subscribe(
      (response) => {
        console.log('opcion 3', response);
        /* this.router.navigate(['/user']); */
      },
      (error) => {
        console.error('Error al crear cafe', error);
      }
    );

    this.ngOnInit();

  }

  async sumar(){
    if(this.data_cafe.contador==10){

      this.data_cafe.contador=0;
      this.data_cafe.opcion=0;
     await this._SupabaseService.postOpcion(this.dataUser.contador_cafe_id,0).subscribe(
        (response) => {
          console.log('suma opcion recet', response);
          /* this.router.navigate(['/user']); */
        },
        (error) => {
          console.error('Error al crear cafe', error);
        }
      );

      await this._SupabaseService.postContador(this.dataUser.contador_cafe_id,0).subscribe(
        (response) => {
          console.log('suma contador con recet', response);
          /* this.router.navigate(['/user']); */
        },
        (error) => {
          console.error('Error al crear cafe', error);
        }
      );
      this.ngOnInit();
    }else{      
      await this._SupabaseService.postContador(this.dataUser.contador_cafe_id,this.data_cafe.contador+1).subscribe(
        (response) => {
          console.log('contador aumentado', response);
          /* this.router.navigate(['/user']); */
        },
        (error) => {
          console.error('Error al crear cafe', error);
        }
      );
     await this.decifrado();
     await this.ngOnInit();
    }

   

  }

  cifrado(){
    this.uuidCifrado = this.cifrarUUID(this.data_cafe.id, this.clave);
    console.log('UUID cifrado:', this.uuidCifrado);
  }

  decifrado(){
    const uuidDescifrado = this.descifrarUUID(this.uuidCifrado, this.clave);
    console.log('UUID descifrado:', uuidDescifrado);
  }


// Función para cifrar el UUID
cifrarUUID(uuid: string, clave: string): string {
    return CryptoJS.AES.encrypt(uuid, clave).toString();
}

// Función para descifrar el UUID cifrado
descifrarUUID(uuidCifrado: string, clave: string): string {
    const bytes = CryptoJS.AES.decrypt(uuidCifrado, clave);
    return bytes.toString(CryptoJS.enc.Utf8);
}

// UUID original


// Cifrar el UUID


// Descifrar el UUID cifrado


}
