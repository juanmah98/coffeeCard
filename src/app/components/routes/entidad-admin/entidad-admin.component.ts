import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CafeData } from 'src/app/interfaces/cafes_data';
import { Entidades } from 'src/app/interfaces/entdidades';
import { Usuarios } from 'src/app/interfaces/usuarios';
import { Usuarios_admins } from 'src/app/interfaces/usuarios_admin';
import { InternoService } from 'src/app/services/interno.service';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-entidad-admin',
  templateUrl: './entidad-admin.component.html',
  styleUrls: ['./entidad-admin.component.css']
})
export class EntidadAdminComponent implements OnInit {

  entidad!:Entidades;
  usuariosAdmin:Usuarios_admins[]=[];
  usuarios:Usuarios[]=[];
  admin!:Usuarios_admins
  ngZone: any;
  tarjetas:number=0;
  nuevos:number=0;

  constructor(private _supabaseServices: SupabaseService, private router: Router, private _InternoServices: InternoService) { }

  async ngOnInit(): Promise<void> {

    this.admin= this._InternoServices.getUserAdmin();
    this.entidad= this._InternoServices.getEntidad();
   await this.getAdmins();
   await this.getUsers();
   await this.regaladas();

    console.log("admin: ",this.admin)
    console.log("Entidad: ",this.entidad)
    this.nuevos = this.contarUsuariosNuevosDelMes(this.usuarios);
  }


  async getAdmins() {
    try {
      const response:any = await this._supabaseServices.getUsersAdminTable();
      console.log('entidades', response.data);
      this.usuariosAdmin = response.data;
      // Continúa aquí con lo que necesites hacer con la respuesta
      return response; // Retorna la respuesta si es necesario
    } catch (error) {
      console.error('Error al cargar entidades', error);
      throw error; // Propaga el error si es necesario
    }
  }

  async getUsers() {
    try {
      const response:any = (await this._supabaseServices.getTablaContadorData('*',this.entidad.tabla_contador)).data
      console.log('Tablas user', response);
        await this.usuariosEntidad(response)
      // Continúa aquí con lo que necesites hacer con la respuesta
      return response; // Retorna la respuesta si es necesario
    } catch (error) {
      console.error('Error al cargar entidades', error);
      throw error; // Propaga el error si es necesario
    }
  }

 
  async usuariosEntidad(users: CafeData[]){
    console.log("users: ", users)
    let index = 0;
    users.forEach(async user=>{
     await this.getUser(user, index++)
    })
    console.log('usuarios totales', this.usuarios);

  }

  async getUser(user: CafeData, index: number) {
    try {
      const response:any = (await this._supabaseServices.getUsuariosId(user.usuario_id)).data
      
      this.usuarios[index] = response;
      // Continúa aquí con lo que necesites hacer con la respuesta
      return response; // Retorna la respuesta si es necesario
    } catch (error) {
      console.error('Error al cargar entidades', error);
      throw error; // Propaga el error si es necesario
    }
  }

 async regaladas(){
  try {
    const response:any = (await this._supabaseServices.getTablaContadorData('cantidad_gratis',this.entidad.tabla_contador)).data
    console.log("entidad: ", this.entidad.tabla_contador)
    console.log('tabla', response);
    await this.suma(response);
    // Continúa aquí con lo que necesites hacer con la respuesta
    return response; // Retorna la respuesta si es necesario
  } catch (error) {
    console.error('Error al cargar entidades', error);
    throw error; // Propaga el error si es necesario
  }  
  }

  async suma(contador: any[]){
    console.log("contador: ", contador)
    contador.forEach(element => {
     this.tarjetas = this.tarjetas + parseInt(element.cantidad_gratis); 
    });

    console.log("tarjetas: ", this.tarjetas)
  }

  contarUsuariosNuevosDelMes(usuarios: Usuarios[]): number {
    const fechaActual: Date = new Date();
    const mesActual: number = fechaActual.getMonth();
    const anioActual: number = fechaActual.getFullYear();

    // Filtrar los usuarios cuya fecha de registro coincide con el mes actual
    const usuariosDelMes: Usuarios[] = usuarios.filter(usuario => {
        // Convertir el string de fecha_creacion a un objeto Date si es necesario
        const fechaCreacion: Date = new Date(usuario.fecha_creacion);
        const mesRegistro: number = fechaCreacion.getMonth();
        const anioRegistro: number = fechaCreacion.getFullYear();
        return mesRegistro === mesActual && anioRegistro === anioActual;
    });

    // Devolver la cantidad de usuarios registrados este mes
    return usuariosDelMes.length;
}


  scan(){
    this.router.navigate(['/qrscan']);
  }

}
