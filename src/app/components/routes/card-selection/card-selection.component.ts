import { ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CafeData } from 'src/app/interfaces/cafes_data';
import { Usuarios } from 'src/app/interfaces/usuarios';
import { InternoService } from 'src/app/services/interno.service';
import { SupabaseService } from 'src/app/services/supabase.service';
import * as CryptoJS from 'crypto-js';
import { Subscription, interval } from 'rxjs';
import { PopupQrService } from 'src/app/services/popup-qr.service';
import { ToastComponent } from '../../layout/toast/toast.component';
import { PopupInfoService } from 'src/app/services/popup-info.service';
import { Entidades } from 'src/app/interfaces/entdidades';
import { Router } from '@angular/router';



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
  contadorArray: number[] = Array(0).fill(0).map((x, i) => i);
  @ViewChild('toast') toast!: ToastComponent; // ViewChild está aquí

  dataUser:Usuarios = {
    id: "",
    email: "",
    name: "",
    fecha_creacion: new Date(),
    pais: '',
  };

  data_contador:CafeData = 
    {
      id: "",
      usuario_id: '',
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
  bgClass:string='bg';
  entidadOpcion:string='';
  entidad!:Entidades;
  private dataSubscription: Subscription = new Subscription();
  constructor(private cdr: ChangeDetectorRef, private _SupabaseService:SupabaseService, private _dataInterna: InternoService, public popupService: PopupQrService, public infopopupService: PopupInfoService, private ngZone: NgZone,  private router: Router,) { }

  async ngOnInit(): Promise<void> {


    /* this._SupabaseService.getUserss().subscribe(message => {
      // Actualiza la lista de usuarios cuando se recibe un mensaje
      console.log("REALTIME")
      console.log(message.payload)
      this.users = message.payload;
    }); */
    
    this.entidad= this._dataInterna.getEntidad()
    this.contadorArray = Array(this.entidad.numero_contador).fill(0).map((x, i) => i);
   /*  console.log("USUARIOS US:", this.users);  */
    this.bgClass = `bg-${this._dataInterna.getEntidad().background}-card`;
    this.entidadOpcion = this._dataInterna.getEntidad().background;
   /*  console.log('background: ', this.bgClass); */
    await this.getContador()
    this.cdr.detectChanges();
    this.dataUser = this._dataInterna.getUser();
   /*  this.nombre = localStorage.getItem("name"); */
    this.nombre = this.dataUser.name;
    this.foto = localStorage.getItem("photo");
    this.actualizarDatos();

    // Establece un intervalo para actualizar los datos cada x segundos
    /* this.dataSubscription = interval(1500) // Cambia el valor según sea necesario (en milisegundos)
      .pipe(
        switchMap(() => this._SupabaseService.getDataCard(this.dataUser.contador_cafe_id))
      )
      .subscribe((data: any) => {
        // Actualiza los datos recibidos
        this.data_contador = data[0];
        console.log(data[0]);
        if(data[0]!='')
      {
        this.upload = true;
      }
      }); */

/*       console.log();
      this.data_contador = (await this._SupabaseService.getCofess("this.dataUser.contador_cafe_id",'')).data
    
      console.log("DATA CAFE NUEVA: ",this.data_contador); */
      
      
    /* setTimeout(() => {
      
      this.cifrado();
    }, 2000) */

    this.handleRealTimeUpdate();
  }

  async getContador() {
    try {
      const response:any = await this._SupabaseService.getTablaContador(this._dataInterna.getUser().id, this.entidad.tabla_contador)
      /* console.log('contador', response.data); */
      this.data_contador = response.data;
      // Continúa aquí con lo que necesites hacer con la respuesta
      return response; // Retorna la respuesta si es necesario
    } catch (error) {
      console.error('Error al cargar contador', error);
      throw error; // Propaga el error si es necesario
    }
  }

  cambiarBg(valor: string): void {
    this.bgClass = valor;
    this.cdr.detectChanges(); // Forzar la detección de cambios si es necesario
  }

  ngOnDestroy(): void {
    // Desuscribe la suscripción al destruir el componente para evitar fugas de memoria
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  handleRealTimeUpdate(){
    /* console.log("ESTAMSO EN REALTIME") */
    this._SupabaseService.getTablaCafesRealtime(this.data_contador.id, this.entidad.tabla_contador).subscribe(async update => {
      const data:any = update;
      /* console.log('UPDATE:', data); */
      if(data.new.id == this.data_contador.id){
        /* console.log('UPDATE == A USUARIO'); */
/*         this.data_contador.opcion = data.new.opcion */
        this.data_contador.contador = data.new.contador
        this.data_contador.cantidad_gratis = data.new.cantidad_gratis
        this.data_contador.gratis = data.new.gratis
       await this.getContador();
        this.popupService.actualizarMostrar(false);
        if(this.data_contador.contador!=0){
          this.showToast();
        }

      }
    })
  }

  showToast(): void {
    this.toast.showMessage('¡QR leido!');
  }

 async actualizarDatos(): Promise<void> {
 /*  console.log("DATOS A VER: ", this.data_contador ) */
  await  this._SupabaseService.getDataCard(this.data_contador.id, this.entidad.tabla_contador).subscribe((data: any) => {
      this.data_contador = data[0];
      /* console.log("data[0]");
      console.log(data[0]); */
      {
        this.upload = true;
      }
    });
  }

 async op1(){
    this.upload = false;
    const response:any = (await this._SupabaseService.updateOpcion(this.data_contador.id,this.entidad.tabla_contador,1)).data;
    /* console.log("Opcion 1 actualizada", response); */
    this.data_contador.opcion = response[0].opcion        
    this.upload = true;
    
  }

  async op2(){
    this.upload = false;
    const response:any = (await this._SupabaseService.updateOpcion(this.data_contador.id,this.entidad.tabla_contador,2)).data;
   /*  console.log("Opcion 2 actualizada", response); */
    this.data_contador.opcion = response[0].opcion      
    this.upload = true;
   
  }

  async op3(){
    this.upload = false;
    const response:any = (await this._SupabaseService.updateOpcion(this.data_contador.id,this.entidad.tabla_contador,3)).data;
    /* console.log("Opcion 3 actualizada", response); */
    this.data_contador.opcion = response[0].opcion    
    this.upload = true;
  }

  async sumar(){
    if(this.data_contador.contador==this.entidad.numero_contador){

      this.data_contador.contador=0;
      this.data_contador.opcion=0;

      const responseOpcion:any = (await this._SupabaseService.updateOpcion(this.data_contador.id,this.entidad.tabla_contador,0)).data;
      /* console.log("Opcion set 0", responseOpcion); */

      const responseContador:any = (await this._SupabaseService.updateContador(this.data_contador.id,this.entidad.tabla_contador,0)).data;
      /* console.log("Opcion set 0", responseContador); */

      
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
      const responseContador:any = (await this._SupabaseService.updateContador(this.data_contador.id,this.entidad.tabla_contador,this.data_contador.contador+1)).data;
      /* console.log("Opcion set 0", responseContador); */

      /* await this._SupabaseService.postContador(this.dataUser.contador_cafe_id,this.data_contador.contador+1).subscribe(
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
    this.uuidCifrado = this.cifrarUUID(this.data_contador.id, this.clave);
    /* console.log('UUID cifrado:', this.uuidCifrado); */
    this.onPopupTouch()
  }

  decifrado(){
    const uuidDescifrado = this.descifrarUUID(this.uuidCifrado, this.clave);
   /*  console.log('UUID descifrado:', uuidDescifrado); */
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

onPopupTouch() {

  this.popupService.setData(this.uuidCifrado);
  this.popupService.actualizarMostrar(true)
  if(this.data_contador.contador==this.entidad.numero_contador){
    this.popupService.setGratis(true)
  }else{
    this.popupService.setGratis(false)
  }
}

onInfoTouch() {
  this.infopopupService.setDataOpcion("Cafe");
  this.infopopupService.setData(this.entidad.informacion);
  this.infopopupService.actualizarMostrar(true)
}

back(): void {
  this.ngZone.run(() => {   
    this.router.navigate(['/principal']);
    }); 
}

qrscanuser(): void {
  this._dataInterna.setDataContador(this.data_contador);
  this.ngZone.run(() => {   
    this.router.navigate(['/qrscanuser']);
  });
}

/* onPopupTouch() {
  this.popupService.actualizarMostrar(true)
} */

// UUID original


// Cifrar el UUID


// Descifrar el UUID cifrado


}
