import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from 'src/app/services/supabase.service';
import { InternoService } from 'src/app/services/interno.service';
import { Entidades } from 'src/app/interfaces/entdidades';
import { Usuarios } from 'src/app/interfaces/usuarios';
import { CafeData } from 'src/app/interfaces/cafes_data';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-sumar-qr',
  templateUrl: './sumar-qr.component.html',
  styleUrls: ['./sumar-qr.component.css']
})
export class SumarQrComponent implements OnInit {
  codigo: string | null = null;
  entidad: Entidades = {
  
      id: "",
      nombre: "",
      email: "",
      background: "0",
      tabla_contador: "",
      fecha_creacion: new Date(),
      pais: '',
      informacion:'',
      direccion:'',
      logo:'',
      numero_contador:0,
      qr_digital: true,
      qr_papel: false,
      rubro: '',
      ciudad: '',
      first_card_count: 0
  };
  dataUser: Usuarios = {
    id: "",
    email: "",
    name: "",
    fecha_creacion: new Date(),
    pais: '',
    ciudad: ''
  };
  data_contador: CafeData = {
    id: "",
    usuario_id: '',
    contador: 0,
    gratis: false,
    opcion: 0,
    cantidad_gratis: 0
  };

 mensaje: string = '';
  cargando: boolean = true;

  constructor(
    private router: Router,
    private _supabaseService: SupabaseService,
    private _internoService: InternoService,
    private ngZone: NgZone, 
    private toastService: ToastService
  ) {}

  async ngOnInit(): Promise<void> {
    this.codigo = this.getCodigoDesdeURL();
    if (!this.codigo) {
      this.mensaje = 'Código QR inválido';
      this.cargando = false;
      return;
    }

    const entidad_id = this.extraerEntidadID(this.codigo);
    this.dataUser = this._internoService.getUser();
    
    const entidad:any = await this.getEntidad(entidad_id)
    if (!entidad) {
      console.error('Entidad no encontrada');
      return;
    }

    this._internoService.setEntidad(entidad);
    /* console.log("this.dataUser", this.dataUser); */
   const datos = await this.getContadorTabla(
      this.dataUser.id,
      entidad.tabla_contador,
      entidad.first_card_count
    );
    /*  console.log("datos", datos); */
   /*  console.log("LOG: " + this.entidad) */

    this.data_contador = this._internoService.getDataContador();


    await this.operacion(this.codigo);
  }

  async getEntidad(entidadId: string) {
  try {
    const response = await this._supabaseService.getEntidadId(entidadId);
    const datos: any = response.data;
    this.entidad = datos;
    return datos;
  } catch (error) {
    console.error('Error al cargar entidades', error);
    throw error;
  }
}

async operacion(codigo:string){
  if(this.dataUser.id){


  let toast = true;
  try {
     /*  console.log("Codigo: ",codigo ) */
      const qrCodes = await this._supabaseService.validateQRCode(codigo, this.entidad.id, this.dataUser.name);
      /* console.log("Codigo: ",qrCodes ) */
      if (qrCodes.success && qrCodes.data) {
        await this.sumar();
        toast = true;
        /*  console.log("Codigo: ",qrCodes ) */
         /*  console.log("Sumado " ) */
      } else {
        this.mensaje = qrCodes.message;
        console.log("mensaje: ",this.mensaje)
        this.toastService.setShowToast(true, 'Este QR ya fue usado', 'error');
        toast = false;
      }
    } catch (error) {
      console.error('Error al procesar QR:', error);
    }
   /*  await this.sumar(); */

    this.back(toast);
    }else {
        console.log("no existe usuario")
        this.ngZone.run(() => {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/home']);
      });
    });
    }
}

  getCodigoDesdeURL(): string | null {
    const params = new URLSearchParams(window.location.search);
    const codigo = params.get('codigo');
    return codigo;
  }

  async getContadorTabla(id: string, tabla: string, first_card_count:number) {
  try {
    const response: any = await this._supabaseService.getTablaContador(id, tabla);

    if (response.data == null) {
      console.log('contador no existe');

      const dataCafe: any = {
        usuario_id: id,
        contador: first_card_count,
        gratis: false,
        opcion: 0,
        cantidad_gratis: 0
      };

      const responseUser: any = (await this._supabaseService.postNewCoffe(dataCafe, tabla)).data;
      this._internoService.setDataContador(responseUser);
    } else {
      // 👇 ESTO FALTABA
      this._internoService.setDataContador(response.data);
    }

    return response;
  } catch (error) {
    console.error('Error al cargar contador:', error);
    throw error;
  }
}


  extraerEntidadID(codigo: string): string {
    const partes = codigo.split('-');
    return partes.slice(0, 5).join('-'); // UUID de 5 partes
  }

  async sumar(): Promise<void> {
   if (!this.data_contador || this.data_contador.contador == null) {
  throw new Error("data_contador está indefinido");
}else{
    try {
       /* console.log("contador: ",this.data_contador.contador) */
      const nuevoContador = this.data_contador.contador + 1;

      const responseContador: any = await this._supabaseService.updateContador(
        this.data_contador.id,
        this.entidad!.tabla_contador,
        nuevoContador
      );

      if (nuevoContador === this.entidad.numero_contador) {
        const payload = {
          usuario_id: this.data_contador.usuario_id,
          contador_id: this.data_contador.id,
          contador: nuevoContador,
          entidad_id: this.entidad!.id
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
    } catch (error) {
      console.error('Error al incrementar el contador:', error);
    }}
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
}
