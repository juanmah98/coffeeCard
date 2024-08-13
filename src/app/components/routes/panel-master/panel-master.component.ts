import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
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
  i = 0;
  usuariosAdmin:any[] = [
    {nombre: '', usuarios: ''},
  ];
  displayedColumns: string[] = ['id', 'email', 'name', 'fecha_creacion', 'pais'];

  constructor(private supabaseService: SupabaseService,
    private router: Router,
    private internoService: InternoService,
    private ngZone: NgZone,
    private authService:AuthService,
    private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.getUsuarios();
    this.getEntidades();
    this.cdr.detectChanges();
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

  async getEntidadesUsers(tabla: string, nombre: string) {
    try {
      const response = await this.supabaseService.getTablasTotalUsuarios(tabla);
      const entidad:any = response.data;
/*       console.log(entidad) */
      this.agregarUsuario(nombre,entidad.length)
       console.log("this.usuariosAdmin")
    console.log(this.usuariosAdmin)
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      throw error;
    }
    this.cdr.detectChanges();
  }

  async for(){
    
    this.entidades.forEach(async data => {
    await this.getEntidadesUsers(data.tabla_contador, data.nombre)
     
    })
  }

agregarUsuario(nombre: string, usuario: string) {
    // Verifica si el primer elemento tiene valores vacíos
    if (this.usuariosAdmin.length > 0 && this.usuariosAdmin[0].nombre === '' && this.usuariosAdmin[0].usuarios === '') {
        this.usuariosAdmin.shift(); // Elimina el primer elemento si está vacío
    }

    // Agrega el nuevo usuario
    this.usuariosAdmin.push({ nombre, usuarios: usuario });
    this.usuariosAdmin.sort((a, b) => {
      return Number(b.usuarios) - Number(a.usuarios);
    });
}
}
