import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Entidades } from 'src/app/interfaces/entdidades';
import { Qrs } from 'src/app/interfaces/qrs';
import { Usuarios } from 'src/app/interfaces/usuarios';
import { Usuarios_admins } from 'src/app/interfaces/usuarios_admin';
import { AuthService } from 'src/app/services/auth.service.service';
import { InternoService } from 'src/app/services/interno.service';
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
    {nombre: '', usuarios: '', regalo: ''},
  ];
  displayedColumns: string[] = ['id', 'email', 'name', 'fecha_creacion', 'pais'];
  regalos: string[] = [];
  totalRegalos = 0;
  totalQrs = 0;
  totalQrsUsados = 0;
  totalAdmins = 0;
  usadosPor:string[] = [];

  constructor(private supabaseService: SupabaseService,
    private router: Router,
    private internoService: InternoService,
    private ngZone: NgZone,
    private authService:AuthService,
    private cdr: ChangeDetectorRef) {}

  async ngOnInit(): Promise<void> {
    this.getUsuarios();
    this.getEntidades();
    this.cdr.detectChanges();
  }

  async getUsuarios() {
    try {
      const response = await this.supabaseService.getUsersTable();
      const response2 = await this.supabaseService.getTablasTotalUsuarios('qrs');
      const response3 = await this.supabaseService.getTablasTotalUsuarios('usuarios_admin');
      const users:any = response.data;
      const qrs:any = response2.data;
      const admins:any = response3.data;
      this.usuarios = users;
      this.totalQrs = qrs.length;
      this.totalAdmins = admins.length;
       await this.qrsUsados(qrs);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      throw error;
    }

    
  }

 async qrsUsados(qrs:Qrs[]){

  qrs.forEach(element => {
    if(element.is_used == true){
      this.totalQrsUsados++;
      this.usadosPor.push(element.usuario) 
    }
  });
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

  async getEntidadesUsers(tabla: string, nombre: string, regalos:number) {
    try {
      const response = await this.supabaseService.getTablasTotalUsuarios(tabla);
      const entidad:any = response.data;
/*       console.log(entidad) */
      this.agregarUsuario(nombre,entidad.length, regalos)
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
    await this.getEntidadesUsers(data.tabla_contador, data.nombre, regalos)
    
    })
  }

agregarUsuario(nombre: string, usuario: string, regalo:number) {
    // Verifica si el primer elemento tiene valores vacíos
    if (this.usuariosAdmin.length > 0 && this.usuariosAdmin[0].nombre === '' && this.usuariosAdmin[0].usuarios === '') {
        this.usuariosAdmin.shift(); // Elimina el primer elemento si está vacío
    }

    // Agrega el nuevo usuario
    this.usuariosAdmin.push({ nombre, usuarios: usuario , regalo:regalo});
    this.usuariosAdmin.sort((a, b) => {
      return Number(b.usuarios) - Number(a.usuarios);
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
}
