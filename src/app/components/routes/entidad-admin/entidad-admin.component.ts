import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
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
  logoFile!: File | null;
  usuariosAdmin: Usuarios_admins[] = [];
  usuarios: Usuarios[] = [];
  rolesAdmins: Usuarios_admins[] = [];
  admin!: Usuarios_admins;
  tarjetas: number = 0;
  nuevos: number = 0;
  opcion: boolean = false;
  allUsers: Usuarios[] = [];
  status: string = '1';
  logoCargado:string = '';
  adminForm = new FormGroup({
    nombre: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  selectedBackground: string = 'bg'; // Fondo inicial
  backgroundClasses: string[] = ['bg-1-card', 'bg-2-card', 'bg-3-card']; // Lista de opciones
  previewBackground: string = '';

  activeTab: string = 'informacion'; // Pestaña activa por defecto
  entidadSettings = {
    informacion: 'Aquí va la información de la entidad...'
    // Añade más propiedades según sea necesario
  };
  backgrounds = [
    { id: 1, imageUrl: '../../../../assets/imagenes/backGrounds/spaces.jpg' },
    { id: 2, imageUrl: '../../../../assets/imagenes/backGrounds/doodleblack.jpg' },
    { id: 3, imageUrl: '../../../../assets/imagenes/backGrounds/food.jpg' },
    // Agrega más backgrounds según sea necesario
  ];

  constructor(
    private supabaseService: SupabaseService,
    private router: Router,
    private internoService: InternoService,
    private ngZone: NgZone,
    private authService:AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  async ngOnInit(): Promise<void> {

    this.admin = this.internoService.getUserAdmin();
    if(this.admin.email==''){
      let a = this.internoService.getLogged();
      console.log(a)
    }

    this.selectedBackground = `bg-${this.internoService.getEntidad().background}-card`;
    this.entidad = this.internoService.getEntidad();
    this.logoCargado = this.entidad.logo;
    this.opcion = false;
    console.log(this.admin)
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

   /*  console.log("Admin:", this.admin);
    console.log("Entidad:", this.entidad);
    console.log(`Cantidad de usuarios nuevos del mes: ${this.nuevos}`); */
  }

  cambiarBg(valor: string): void {
    this.selectedBackground = valor;
    this.cdr.detectChanges(); // Forzar la detección de cambios si es necesario
  }

  changeBackground(bgClass: string) {
    this.selectedBackground = bgClass;
    // Aquí podrías guardar el fondo seleccionado en el backend o en el almacenamiento local
  }

  showPreview(bgClass: string) {
    this.previewBackground = bgClass;
  }

  async loadAdmins(): Promise<void> {
    try {
      const response:any = await this.supabaseService.getUsersAdminTable();
      this.usuariosAdmin = response.data;
      /* console.log('Admins:', this.usuariosAdmin); */

      this.rolesAdmins = this.usuariosAdmin.filter(usuario => {
        return usuario.entidad_id === this.entidad.id;
      });

      /* this.admin = this.internoService.getUserAdmin() */

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
    /* console.log('Usuarios totales:', this.usuarios); */
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
   /*  console.log("Tarjetas:", this.tarjetas); */
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

    this.ngZone.run(() => {   
      this.router.navigate(['/qrscan']);
      }); 
    
  }

  master(): void {
    this.ngZone.run(() => {   
      this.router.navigate(['/master']);
      }); 
  }

  async toggleSoloLectura(admin: Usuarios_admins) {
    admin.soloLectura = !admin.soloLectura;

    const response:any = (await this.supabaseService.updateAdmin(admin.id, admin.soloLectura)).data;
    /* console.log("Update rol", response); */  
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
     /*  console.log('Nuevo Admin:', newAdmin);
      console.log('Nuevo userAdmin:', userAdmin); */
       const responseUser:any = (await this.supabaseService.postNewAdmin(userAdmin)).data;
     /*  console.log("Usuario CREADO", responseUser);  */
      // Aquí puedes manipular los datos del nuevo administrador como desees
      this.adminForm.reset();
      this.ngOnInit()
    } else {
      /* console.log('Formulario no válido'); */
    }
  }

  clearStorage(): void {
   const coockies = this.internoService.getCoockes()
    localStorage.clear();
    this.internoService.setCoockes(coockies)
    this.authService.login();
    this.ngZone.run(() => {   
      this.router.navigate(['/home']);
      }); 
  }

  statusChange(dato:string){
    this.status = dato;
  }

  setActiveTab(tabName: string) {
    this.activeTab = tabName;
  }

   // Método que actualiza la información de la entidad
   async updateInfo(id: string, info: string, text_card: string) {
   

    // Actualizar la información de la entidad
   
    const response: any = await this.supabaseService.updateInformacion(id, info, text_card);
    this.entidad.informacion = info;
    this.entidad.text_card = text_card;
    this.internoService.setEntidad(this.entidad);
    console.log(response);

  }

  async subirLogo(id: string){
 // Si hay un logo nuevo, subirlo al servidor
    if (this.logoFile) {
      await this.uploadLogo(id);
    }

    const logoUrl: any = await this.supabaseService.getPublicImageUrl(this.entidad.nombre)
    console.log(logoUrl)
     const response: any = await this.supabaseService.updateLogoEntidad(id, logoUrl);
     this.entidad.logo = logoUrl;
    this.internoService.setEntidad(this.entidad);
    console.log(response); 
  }

  async remplazarLogo(id: string){
    // Si hay un logo nuevo, subirlo al servidor
       if (this.logoFile) {
         await this.updateLogo(id);
       }
   
       const logoUrl: any = await this.supabaseService.getPublicImageUrl(this.entidad.nombre)
       console.log(logoUrl)
        const response: any = await this.supabaseService.updateLogoEntidad(id, logoUrl);
        this.entidad.logo = logoUrl;
       this.internoService.setEntidad(this.entidad);
       console.log(response); 
     }

  

  editInfo(){
    console.log(this.entidad)
  }

  onLogoChange(event: any) {
    const file = event.target.files[0];  // Obtiene el archivo seleccionado
    if (file) {
      this.logoFile = file;

      // Mostrar una vista previa de la imagen en la interfaz
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.entidad.logo = e.target.result;  // Asigna la vista previa en Base64 para mostrar en la interfaz
      };
      console.log("LOGO: " + this.logoCargado)
      reader.readAsDataURL(file);  // Esto solo afecta a la vista previa, no al envío del archivo
    }
  }

   // Método para subir el logo al servidor
   async uploadLogo(id: string) {
    if (this.logoFile) {
      try {
        const response = await this.supabaseService.uploadImage(this.logoFile, "logos_fidelity", this.entidad.nombre);  // Aquí subimos el archivo real
        console.log('Logo subido con exito', response);
        this.logoCargado = 'si'
      } catch (error) {
        console.error('Error al subir el logo:', error);
      }
    }
  }

  async updateLogo(id: string) {
    if (this.logoFile) {
      try {
        const response = await this.supabaseService.updateImage(this.logoFile, "logos_fidelity", this.entidad.nombre);  // Aquí subimos el archivo real
        console.log('Logo actualizado con exito', response);
      } catch (error) {
        console.error('Error al subir el logo:', error);
      }
    }
  }
  
}
