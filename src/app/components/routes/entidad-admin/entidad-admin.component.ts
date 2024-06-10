import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private _supabaseServices: SupabaseService, private router: Router, private _InternoServices: InternoService) { }

  ngOnInit(): void {

    this.admin= this._InternoServices.getUserAdmin();
    this.entidad= this._InternoServices.getEntidad();
    this.getAdmins();
    this.getUsers();

    console.log("admin: ",this.admin)
    console.log("Entidad: ",this.entidad)

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
      const response:any = await this._supabaseServices.getUsersTable();
      console.log('entidades', response.data);
      this.usuarios = response.data;
      // Continúa aquí con lo que necesites hacer con la respuesta
      return response; // Retorna la respuesta si es necesario
    } catch (error) {
      console.error('Error al cargar entidades', error);
      throw error; // Propaga el error si es necesario
    }
  }

  scan(){
    this.router.navigate(['/qrscan']);
  }

}
