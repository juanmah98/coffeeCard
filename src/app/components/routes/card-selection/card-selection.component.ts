import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CafeData } from 'src/app/interfaces/cafes_data';
import { Usuarios } from 'src/app/interfaces/usuarios';
import { InternoService } from 'src/app/services/interno.service';
import { SupabaseService } from 'src/app/services/supabase.service';
import * as CryptoJS from 'crypto-js';
import { Subscription, interval } from 'rxjs';
import { PopupQrService } from 'src/app/services/popup-qr.service';
import { ToastComponent } from '../../layout/toast/toast.component';


@Component({
  selector: 'app-card-selection',
  templateUrl: './card-selection.component.html',
  styleUrls: ['./card-selection.component.css']
})
export class CardSelectionComponent implements OnInit, OnDestroy  {
  imagen = '';
  
  gratis:boolean=false;
  upload:boolean = false;
  nombre:any = '';
  foto:any='';
  contadorArray: number[] = Array(10).fill(0).map((x, i) => i);
  @ViewChild('toast') toast!: ToastComponent; // ViewChild está aquí

  dataUser:Usuarios = {
    id: "",
    email: "",
    contador_cafe_id: "",
    admin: false,
    name: "",
    entidad_id: "e4180b6c-a43e-4157-86c1-3c134ede2bb8"
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
  users: any[] = [];
  coffes: any[] = [];
  private dataSubscription: Subscription = new Subscription();
  constructor(private _SupabaseService:SupabaseService, private _dataInterna: InternoService, public popupService: PopupQrService) { }

  async ngOnInit(): Promise<void> {

    /* this._SupabaseService.getUserss().subscribe(message => {
      // Actualiza la lista de usuarios cuando se recibe un mensaje
      console.log("REALTIME")
      console.log(message.payload)
      this.users = message.payload;
    }); */

    /* this.users = await this._SupabaseService.getUs()
    console.log("USUARIOS US:", this.users); */

    this.dataUser = this._dataInterna.getUser();
    this.nombre = localStorage.getItem("name");
    this.foto = localStorage.getItem("photo");
    this.actualizarDatos();

    // Establece un intervalo para actualizar los datos cada x segundos
    /* this.dataSubscription = interval(1500) // Cambia el valor según sea necesario (en milisegundos)
      .pipe(
        switchMap(() => this._SupabaseService.getDataCard(this.dataUser.contador_cafe_id))
      )
      .subscribe((data: any) => {
        // Actualiza los datos recibidos
        this.data_cafe = data[0];
        console.log(data[0]);
        if(data[0]!='')
      {
        this.upload = true;
      }
      }); */

      console.log();
      this.data_cafe = (await this._SupabaseService.getCofess(this.dataUser.contador_cafe_id)).data
    
      console.log("DATA CAFE NUEVA: ",this.data_cafe);
      
      
    /* setTimeout(() => {
      
      this.cifrado();
    }, 2000) */

    this.handleRealTimeUpdate();
  }

  ngOnDestroy(): void {
    // Desuscribe la suscripción al destruir el componente para evitar fugas de memoria
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  handleRealTimeUpdate(){
    console.log("ESTAMSO EN REALTIME")
    this._SupabaseService.getTablaCafesRealtime(this.dataUser.contador_cafe_id).subscribe(update => {
      const data:any = update;
      console.log('UPDATE:', data);
      if(data.new.id == this.data_cafe.id){
        console.log('UPDATE == A USUARIO');
        this.data_cafe.opcion = data.new.opcion
        this.data_cafe.contador = data.new.contador
        this.data_cafe.cantidad_gratis = data.new.cantidad_gratis
        this.data_cafe.gratis = data.new.gratis
        this.popupService.actualizarMostrar(false);
        this.showToast();

      }
    })
  }

  showToast(): void {
    this.toast.showMessage('¡QR leido con éxito!');
  }

 async actualizarDatos(): Promise<void> {
  await  this._SupabaseService.getDataCard(this.dataUser.contador_cafe_id).subscribe((data: any) => {
      this.data_cafe = data[0];
      console.log(data[0]);
      {
        this.upload = true;
      }
    });
  }

 async op1(){
    this.upload = false;
    const response:any = (await this._SupabaseService.updateOpcion(this.dataUser.contador_cafe_id,1)).data;
    console.log("Opcion 1 actualizada", response);
    this.data_cafe.opcion = response[0].opcion        
    this.upload = true;
    
  }

  async op2(){
    this.upload = false;
    const response:any = (await this._SupabaseService.updateOpcion(this.dataUser.contador_cafe_id,2)).data;
    console.log("Opcion 2 actualizada", response);
    this.data_cafe.opcion = response[0].opcion      
    this.upload = true;
   
  }

  async op3(){
    this.upload = false;
    const response:any = (await this._SupabaseService.updateOpcion(this.dataUser.contador_cafe_id,3)).data;
    console.log("Opcion 3 actualizada", response);
    this.data_cafe.opcion = response[0].opcion    
    this.upload = true;
  }

  async sumar(){
    if(this.data_cafe.contador==10){

      this.data_cafe.contador=0;
      this.data_cafe.opcion=0;

      const responseOpcion:any = (await this._SupabaseService.updateOpcion(this.dataUser.contador_cafe_id,0)).data;
      console.log("Opcion set 0", responseOpcion);

      const responseContador:any = (await this._SupabaseService.updateContador(this.dataUser.contador_cafe_id,0)).data;
      console.log("Opcion set 0", responseContador);

      
    /*  await this._SupabaseService.postOpcion(this.dataUser.contador_cafe_id,0).subscribe(
        (response) => {
          console.log('suma opcion recet', response);
         
        },
        (error) => {
          console.error('Error al crear cafe', error);
        }
      ); */

     /*  await this._SupabaseService.postContador(this.dataUser.contador_cafe_id,0).subscribe(
        (response) => {
          console.log('suma contador con recet', response);
          
        },
        (error) => {
          console.error('Error al crear cafe', error);
        }
      ); */
      /* this.ngOnInit(); */
    }else{      
      const responseContador:any = (await this._SupabaseService.updateContador(this.dataUser.contador_cafe_id,this.data_cafe.contador+1)).data;
      console.log("Opcion set 0", responseContador);

      /* await this._SupabaseService.postContador(this.dataUser.contador_cafe_id,this.data_cafe.contador+1).subscribe(
        (response) => {
          console.log('contador aumentado', response);
         
        },
        (error) => {
          console.error('Error al crear cafe', error);
        }
      ); */

     await this.decifrado();
     /* await this.ngOnInit(); */
    }

   

  }

  

  reload(){
    /* this.ngOnInit(); */
  }

  cifrado(){
    this.uuidCifrado = this.cifrarUUID(this.data_cafe.id, this.clave);
    console.log('UUID cifrado:', this.uuidCifrado);
    this.onInfoTouch()
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

onInfoTouch() {
  this.popupService.setData(this.uuidCifrado);
  this.popupService.actualizarMostrar(true)
}

/* onInfoTouch() {
  this.popupService.actualizarMostrar(true)
} */

// UUID original


// Cifrar el UUID


// Descifrar el UUID cifrado


}
