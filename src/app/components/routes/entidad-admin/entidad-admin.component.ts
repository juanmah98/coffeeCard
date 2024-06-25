import { Component, NgZone, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CafeData } from 'src/app/interfaces/cafes_data';
import { Entidades } from 'src/app/interfaces/entdidades';
import { Usuarios } from 'src/app/interfaces/usuarios';
import { Usuarios_admins } from 'src/app/interfaces/usuarios_admin';
import { AuthService } from 'src/app/services/auth.service.service';
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
  rolesAdmins: Usuarios_admins[] = [];
  admin!: Usuarios_admins;
  tarjetas: number = 0;
  nuevos: number = 0;
  opcion: boolean = false;
  allUsers: Usuarios[] = [];
  status: string = '1';
  adminForm = new FormGroup({
    nombre: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  constructor(
    private supabaseService: SupabaseService,
    private router: Router,
    private internoService: InternoService,
    private ngZone: NgZone,
    private authService:AuthService
  ) { }

  async ngOnInit(): Promise<void> {

    this.admin = this.internoService.getUserAdmin();
    this.entidad = this.internoService.getEntidad();
    this.opcion = false;

    try {
      await Promise.all([
        this.loadAdmins(),
        this.loadUsers(),
        this.loadRegaladas(),
        this.loadAllUserWhatilist()
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

      this.rolesAdmins = this.usuariosAdmin.filter(usuario => {
        return usuario.entidad_id === this.entidad.id;
      });



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

  async loadAllUserWhatilist(): Promise<void> {
    try {
      const response = await this.supabaseService.getUs();
      const users:any = response.data;
      this.allUsers = users
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
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

  async toggleSoloLectura(admin: Usuarios_admins) {
    admin.soloLectura = !admin.soloLectura;

    const response:any = (await this.supabaseService.updateAdmin(admin.id, admin.soloLectura)).data;
    console.log("Update rol", response);  
  }

  async togglewaitlist(user: Usuarios) {
    user.waitlist = !user.waitlist;

    const response:any = (await this.supabaseService.updateUser(user.id, user.waitlist)).data;
    console.log("Update waitlist", response);  
  }


  async agregarAdmin() {
   const userAdmin:any = ({  
      "entidad_id": this.admin.entidad_id,
      "nombre": "",
      "email": "",
      "soloLectura": true
  });


    if (this.adminForm.valid) {
      const newAdmin:any = this.adminForm.value;
      userAdmin.nombre=newAdmin.nombre;
      userAdmin.email=newAdmin.email;
      console.log('Nuevo Admin:', newAdmin);
      console.log('Nuevo userAdmin:', userAdmin);
       const responseUser:any = (await this.supabaseService.postNewAdmin(userAdmin)).data;
      console.log("Usuario CREADO", responseUser); 
      // Aquí puedes manipular los datos del nuevo administrador como desees
      this.adminForm.reset();
      this.ngOnInit()
    } else {
      console.log('Formulario no válido');
    }
  }

  clearStorage(): void {
    localStorage.clear();
    this.authService.login();
    this.ngZone.run(() => {   
      this.router.navigate(['/home']);
      }); 
  }

  statusChange(dato:string){
    this.status = dato;
  }
}
