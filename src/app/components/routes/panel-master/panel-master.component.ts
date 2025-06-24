import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CafeData } from 'src/app/interfaces/cafes_data';
import { Entidades } from 'src/app/interfaces/entdidades';
import { Qrs } from 'src/app/interfaces/qrs';
import { Usuarios } from 'src/app/interfaces/usuarios';
import { Usuarios_admins } from 'src/app/interfaces/usuarios_admin';
import { AuthService } from 'src/app/services/auth.service.service';
import { InternoService } from 'src/app/services/interno.service';
import { PopupQrsMasterService } from 'src/app/services/popup-qrs-master.service';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-panel-master',
  templateUrl: './panel-master.component.html',
  styleUrls: ['./panel-master.component.css']
})
export class PanelMasterComponent implements OnInit {
  usuarios: Usuarios[] = [];
  entidades: Entidades[] = [];
  i = 0;
  usuariosAdmin:any[] = [
    {nombre: '', usuarios: '', regalo: '', idEntidad:''},
  ];
  usuariosTop:any[] = [
    {nombre: '',  regalos: '', entidad:''},
  ];
  contador_data:CafeData[] = [] ;
  displayedColumns: string[] = ['id', 'email', 'name', 'fecha_creacion', 'pais'];
  regalos: string[] = [];
  totalRegalos = 0;
  totalQrs = 0;
  totalQrsUsados = 0;
  totalQrsUsadosEntidad = {};
  totalAdmins = 0;
  qrs: Qrs[] = [];
  usadosPor:string[] = [];
  usadosHoy:string[] = [];
  deleteResult = '';
  hoy: Date = new Date()
  await: any;
  loading:boolean = false;
  constructor(private supabaseService: SupabaseService,
    private router: Router,
    private internoService: InternoService,
    private ngZone: NgZone,
    private authService:AuthService,
    private cdr: ChangeDetectorRef,
    public popupService: PopupQrsMasterService) {}

  async ngOnInit(): Promise<void> {
    this.loading = false;
    try {
      await this.getUsuarios();
      await this.getEntidades(); // Este ya ejecuta `this.for()` internamente
    } catch (error) {
      console.error("Error cargando los datos:", error);
    }
  
    this.loading = true; // Mostrar pantalla cuando todo terminó
    this.cdr.detectChanges(); // Asegura que Angular refresque la vista
  }

  async getUsuarios() {
    try {
      const response = await this.supabaseService.getUsersTable();
      const response3 = await this.supabaseService.getTablasTotalUsuarios('usuarios_admin');
      
      // Obtener todos los QRs sin límite de 1000
      const qrs = await this.supabaseService.getAllQrs();
  
      const users: any = response.data;
      const admins: any = response3.data;
  
      this.usuarios = users;
      this.totalQrs = qrs.length;
      this.totalAdmins = admins.length;
      this.usadosHoy = await this.qrsUsados(qrs);
      this.qrs = qrs;
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      throw error;
    }
  }

  async qrsUsados(qrs: Qrs[]) {
    const hoy = new Date(); // Obtiene la fecha actual
    const usadosHoy: string[] = []; // Nuevo arreglo para los nombres de los usuarios que usaron hoy
  
    qrs.forEach(element => {
      if (element.is_used === true) {
        this.totalQrsUsados++;
        this.usadosPor.push(element.usuario);
  
        // Convertir used_at a Date y comparar si es del mismo día
        const fechaUsado = new Date(element.used_at);
        if (
          fechaUsado.getFullYear() === hoy.getFullYear() &&
          fechaUsado.getMonth() === hoy.getMonth() &&
          fechaUsado.getDate() === hoy.getDate()
        ) {
          usadosHoy.push(element.usuario); // Agregar el usuario al arreglo si es del día actual
        }
      }
    });
  
   /*  console.log('Usuarios que usaron hoy:', usadosHoy); */
    return usadosHoy; // Devuelve el arreglo por si lo necesitas
  }


qrsUsadosEntidad(entidaId: string){
  let total = 0;
  this.qrs.forEach(element => {
    if(element.entidad_id == entidaId && element.is_used == true){
      total++;
    }
  });
  /* console.log(total , entidaId); */
  return total;
}

  async getEntidades() {
    try {
      const response = await this.supabaseService.getEntidades();
      const entidad:any = response.data;
      this.entidades = entidad;
      await this.for();
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      throw error;
    }
  }

  async getEntidadesUsers(tabla: string, nombre: string, regalos:number, idEntidad: string) {
    try {
      const response = await this.supabaseService.getTablasTotalUsuarios(tabla);
      const entidad:any = response.data;
      this.contador_data = entidad;
/*       console.log(entidad) */
      this.agregarUsuario(nombre,entidad.length, regalos, idEntidad)
      this.agregarUsuarioTop(this.contador_data,idEntidad);
   /*    console.log(this.contador_data) */
       /* console.log("this.usuariosAdmin") */
    /* console.log(this.usuariosAdmin) */
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      throw error;
    }
    this.cdr.detectChanges();
  }

  async for(){
    let regalos = 0;
    this.entidades.forEach(async data => {
    regalos = await this.getRegalosTablas(data.tabla_contador)
    await this.getEntidadesUsers(data.tabla_contador, data.nombre, regalos, data.id)
    
    })
  }

agregarUsuario(nombre: string, usuario: string, regalo:number, idEntidad: string) {
    // Verifica si el primer elemento tiene valores vacíos
    if (this.usuariosAdmin.length > 0 && this.usuariosAdmin[0].nombre === '' && this.usuariosAdmin[0].usuarios === '') {
        this.usuariosAdmin.shift(); // Elimina el primer elemento si está vacío
    }

    // Agrega el nuevo usuario
    this.usuariosAdmin.push({ nombre, usuarios: usuario , regalo:regalo, idEntidad});
    this.usuariosAdmin.sort((a, b) => {
      return Number(b.usuarios) - Number(a.usuarios);
    });
}

agregarUsuarioTop(contador_data:CafeData[], entidad: string) {

 
  // Verifica si el primer elemento tiene valores vacíos
  if (this.usuariosTop.length > 0 && this.usuariosTop[0].nombre === '' && this.usuariosTop[0].regalos === '') {
      this.usuariosTop.shift(); // Elimina el primer elemento si está vacío
  }

  contador_data.forEach(async element => {
    if(element.cantidad_gratis>0){
        // Agrega el nuevo usuario
        const response = await this.supabaseService.getUsuarioName(element.usuario_id);
        let nombre = response
       
      this.usuariosTop.push({ nombre, regalos:element.cantidad_gratis, entidad });
      this.usuariosTop.sort((a, b) => {
        return Number(b.regalos) - Number(a.regalos);
      });
    }
  });

}

async getRegalosTablas(tabla: string) {
  let regaloReturn:number;
  try {
    const response = await this.supabaseService.getTablaContadorData('cantidad_gratis', tabla );
    const regalos:any = response.data;
   /*  console.log(regalos)  */
    regaloReturn = await this.suma(regalos);
    /*  console.log("this.Regalos") */
  } catch (error) {
    console.error('Error al cargar usuarios:', error);
    throw error;
  }
  this.cdr.detectChanges();
  return regaloReturn
}

 async suma(contadores: any){
  let total:number = 0;
  contadores.forEach((element: any) => {
    total = total + parseInt(element.cantidad_gratis);
    this.totalRegalos =  this.totalRegalos + parseInt(element.cantidad_gratis)
/*     console.log("this.totalRegalos " + this.totalRegalos) */
  });
  this.cdr.detectChanges();
  return total
 }

 back(): void {
  console.log("back: ")
  this.ngZone.run(() => {
    this.router.navigate(['/admin']);
  });
}

borrarQrs() {
  this.supabaseService.deleteUnusedQrs().then(() => {
    console.log('Operación completada');
    this.deleteResult = 'QRs antiguos eliminados correctamente';
    setTimeout(() => this.deleteResult = '', 3000); // Ocultar mensaje después de 3 segundos
  }).catch(err => {
    console.error('Error al eliminar filas:', err);
  });
}

onInfoTouch(usuarios: string[]) {
  this.popupService.actualizarMostrar(true);
  this.popupService.setData(usuarios);
}


}
