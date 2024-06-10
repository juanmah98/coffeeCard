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

  entidad!: Entidades;
  usuariosAdmin: Usuarios_admins[] = [];
  usuarios: Usuarios[] = [];
  admin!: Usuarios_admins;
  tarjetas: number = 0;
  nuevos: number = 0;

  constructor(
    private supabaseService: SupabaseService,
    private router: Router,
    private internoService: InternoService
  ) { }

  async ngOnInit(): Promise<void> {
    this.admin = this.internoService.getUserAdmin();
    this.entidad = this.internoService.getEntidad();

    try {
      await Promise.all([
        this.loadAdmins(),
        this.loadUsers(),
        this.loadRegaladas()
      ]);
      this.nuevos = this.contarUsuariosNuevosDelMes(this.usuarios);
    } catch (error) {
      console.error('Error durante la inicialización:', error);
    }

    console.log("Admin:", this.admin);
    console.log("Entidad:", this.entidad);
    console.log(`Cantidad de usuarios nuevos del mes: ${this.nuevos}`);
  }

  async loadAdmins(): Promise<void> {
    try {
      const response:any = await this.supabaseService.getUsersAdminTable();
      this.usuariosAdmin = response.data;
      console.log('Admins:', this.usuariosAdmin);
    } catch (error) {
      console.error('Error al cargar admins:', error);
      throw error;
    }
  }

  async loadUsers(): Promise<void> {
    try {
      const response = await this.supabaseService.getTablaContadorData('*', this.entidad.tabla_contador);
      const users:any = response.data;
      await this.loadUsuariosEntidad(users);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      throw error;
    }
  }

  async loadUsuariosEntidad(users: CafeData[]): Promise<void> {
    const userPromises = users.map((user, index) => this.loadUser(user, index));
    await Promise.all(userPromises);
    console.log('Usuarios totales:', this.usuarios);
  }

  async loadUser(user: CafeData, index: number): Promise<void> {
    try {
      const response = await this.supabaseService.getUsuariosId(user.usuario_id);
      this.usuarios[index] = response.data;
    } catch (error) {
      console.error('Error al cargar usuario:', error);
      throw error;
    }
  }

  async loadRegaladas(): Promise<void> {
    try {
      const response = await this.supabaseService.getTablaContadorData('cantidad_gratis', this.entidad.tabla_contador);
      const contador:any = response.data;
      this.sumaTarjetas(contador);
    } catch (error) {
      console.error('Error al cargar regaladas:', error);
      throw error;
    }
  }

  sumaTarjetas(contador: any[]): void {
    this.tarjetas = contador.reduce((total, item) => total + parseInt(item.cantidad_gratis, 10), 0);
    console.log("Tarjetas:", this.tarjetas);
  }

  contarUsuariosNuevosDelMes(usuarios: Usuarios[]): number {
    const fechaActual = new Date();
    const mesActual = fechaActual.getMonth();
    const anioActual = fechaActual.getFullYear();

    return usuarios.filter(usuario => {
      const fechaCreacion = new Date(usuario.fecha_creacion);
      return fechaCreacion.getMonth() === mesActual && fechaCreacion.getFullYear() === anioActual;
    }).length;
  }

  scan(): void {
    this.router.navigate(['/qrscan']);
  }
}
