import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Entidades } from 'src/app/interfaces/entdidades';
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
  usuariosAdmin:any[] = [
    {nombre: '', usuarios: ''},
  ];
  displayedColumns: string[] = ['id', 'email', 'name', 'fecha_creacion', 'pais'];

  constructor(private supabaseService: SupabaseService,
    private router: Router,
    private internoService: InternoService,
    private ngZone: NgZone,
    private authService:AuthService) {}

  ngOnInit(): void {
    this.getUsuarios();
    this.getEntidades();
  }

  async getUsuarios() {
    try {
      const response = await this.supabaseService.getUsersTable();
      const users:any = response.data;
      this.usuarios = users;
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      throw error;
    }
  }

  async getEntidades() {
    try {
      const response = await this.supabaseService.getEntidades();
      const entidad:any = response.data;
      this.entidades = entidad;
      this.for();
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      throw error;
    }
  }

  async getEntidadesUsers(tabla: string, id: string) {
    try {
      const response = await this.supabaseService.getTablaContadorData(tabla, id);
      const entidad:any = response.data;
      console.log(entidad)
      
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      throw error;
    }
  }

  for(){
    let i = 0
    this.entidades.forEach(data => {
    /*  const users = this.getEntidadesUsers(data.tabla_contador, data.id)
     console.log(users) */
      /* this.usuariosAdmin[i+1].nombre = data.nombre;  */
      /* this.usuariosAdmin[i++].usuarios = users;  */
    })
    console.log("this.usuariosAdmin")
    console.log(this.usuariosAdmin)
  }
}
