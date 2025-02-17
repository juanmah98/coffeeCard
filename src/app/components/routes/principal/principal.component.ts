import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Entidades } from 'src/app/interfaces/entdidades';
import { Usuarios } from 'src/app/interfaces/usuarios';
import { AuthService } from 'src/app/services/auth.service.service';
import { FiltrosPaisCiudadService } from 'src/app/services/filtros-pais-ciudad.service';
import { InternoService } from 'src/app/services/interno.service';
import { SupabaseService } from 'src/app/services/supabase.service';


@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {

  entidadesArre: any = {};
  entidades: Entidades[] =[];
  usuario: Usuarios = {
    id: '',
    email: '',
    name: '',
    fecha_creacion: new Date(),
    pais: 'todos',
    ciudad: 'valencia'
  };
  selectedRubros: string[] = [];

rubros = [
  { value: 'cafeteria', label: 'Cafetería', icon: '../../../../assets/imagenes/filtros/cafe.png' },
  { value: 'restaurante', label: 'Peluquería', icon: '../../../../assets/imagenes/filtros/restaurante.png' },
  { value: 'peluqueria', label: 'Peluquería', icon: '../../../../assets/imagenes/filtros/tijeras.png' },
  { value: 'estetisista', label: 'Peluquería', icon: '../../../../assets/imagenes/filtros/esmalte-de-unas.png' },
  { value: 'manicurista', label: 'Peluquería', icon: '../../../../assets/imagenes/filtros/unas.png' },
  // ... completa con tus rubros
];
detectandoUbicacion = false;
errorGeolocalizacion = false;
ciudadesDisponibles: string[] = [];
cargandoCiudades = false;
filtroCiudad: string = '';
ciudadesFiltradas: string[] = [];
ciudadesDesplegadas = false;

  constructor(public _interno: InternoService, private router: Router, private ngZone: NgZone, private _supabaseServices: SupabaseService, private authService:AuthService,  private ciudadService: FiltrosPaisCiudadService, private cdr: ChangeDetectorRef,) { }

  async ngOnInit(): Promise<void> {
   await this.getEntidades()
   this.usuario= this._interno.getUser()
   await this.selectPais(this.usuario.pais)
   this.cdr.detectChanges();
  }

  async getEntidades() {
    try {
      const response:any = await this._supabaseServices.getEntidadesTrue();
     /*  console.log('entidades', response.data); */
      this.entidades = response.data;
      // Continúa aquí con lo que necesites hacer con la respuesta
      return response; // Retorna la respuesta si es necesario
    } catch (error) {
      console.error('Error al cargar entidades', error);
      throw error; // Propaga el error si es necesario
    }
  }

  async getContadorTabla(id: string, tabla: string) {
    try {
        const response: any = await this._supabaseServices.getTablaContador(id, tabla);
       /*  console.log('contador:', response.data);
        console.log('tabla:', tabla); */

        if (response.data == null) {
            console.log('contador no existe');
            const dataCafe: any = {
                usuario_id: id,
                contador: 0,
                gratis: false,
                opcion: 0,
                cantidad_gratis: 0
            };

            // Usar JSON.stringify para ver el contenido de dataCafe
          /*   console.log("dataCafe: ", JSON.stringify(dataCafe, null, 2), "Tabla:", tabla) */;

            const responseUser: any = (await this._supabaseServices.postNewCoffe(dataCafe, tabla)).data;
          /*   console.log("Usuario CREADO:", responseUser); */
        }

        return response; // Retorna la respuesta si es necesario
    } catch (error) {
        console.error('Error al cargar contador:', error);
        throw error; // Propaga el error si es necesario
    }
}

  async run(valor: Entidades){
    this._interno.setEntidad(valor);
   await this.getContadorTabla(this.usuario.id, valor.tabla_contador )
    
    
     this.router.navigate(['/cardSelection']);
  }

  clearStorage(): void {
    const coockies = this._interno.getCoockes()
    localStorage.clear();
    this._interno.setCoockes(coockies)
    this.authService.logout();
    this.ngZone.run(() => {   
      this.router.navigate(['/home']);
      }); 
  }

  // Agrega esta propiedad computada
  toggleRubroFilter(rubro: string) {
    this.selectedRubros = this.selectedRubros.includes(rubro) 
        ? this.selectedRubros.filter(r => r !== rubro) 
        : [...this.selectedRubros, rubro];
}

isRubroSelected(rubro: string): boolean {
    return this.selectedRubros.includes(rubro);
}


selectCiudad(ciudad: string) {
  this.usuario.ciudad = ciudad;
  this.ciudadesDesplegadas = false;
  this.filtroCiudad = ''; // Opcional: limpiar filtro al seleccionar
}

/* get ciudadesFiltradas(): string[] {
  if (!this.usuario.pais) return [];
  return [...new Set(this.entidades
      .filter(e => e.pais === this.usuario.pais)
      .map(e => e.ciudad)
  )].sort();
} */

get entidadesFiltradas() {
  return this.entidades.filter(entidad => {
      const paisOk = entidad.pais === this.usuario.pais;
      const ciudadOk = !this.usuario.ciudad || entidad.ciudad === this.usuario.ciudad;
      const rubroOk = this.selectedRubros.length === 0 || this.selectedRubros.includes(entidad.rubro);
      
      return paisOk && ciudadOk && rubroOk;
  });
}

async selectPais(pais: string) {
  this.usuario.pais = pais;
  this.usuario.ciudad = '';
  this.cargandoCiudades = true;
  this.filtroCiudad = ''; // Resetear filtro
  
  try {
    this.ciudadesDisponibles = await this.ciudadService.getCiudades(pais);
    this.ciudadesFiltradas = this.ciudadesDisponibles; // ✅ Actualizar aquí
  } catch (error) {
    console.error('Error cargando ciudades:', error);
    this.ciudadesDisponibles = [];
    this.ciudadesFiltradas = [];
  }
  
  this.cargandoCiudades = false;
}

// Nuevo método para filtrar ciudades
filtrarCiudades() {
  if (!this.filtroCiudad) {
    this.ciudadesFiltradas = this.ciudadesDisponibles;
    return;
  }
  
  this.ciudadesFiltradas = this.ciudadesDisponibles.filter(ciudad =>
    ciudad.toLowerCase().includes(this.filtroCiudad.toLowerCase())
  );
}
// Modifica el método de geolocalización
async detectarUbicacion() {
  this.detectandoUbicacion = true;
  this.errorGeolocalizacion = false;
  
  try {
    const posicion = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      });
    });
    
    const ubicacion:any = await this.ciudadService.obtenerCiudadPorCoordenadas(posicion.coords);
    
    if (ubicacion) {
      this.usuario.pais = ubicacion.pais;
      this.usuario.ciudad = ubicacion.ciudad;
      await this.selectPais(ubicacion.pais); // Forzar carga de ciudades
    }
  } catch (error) {
    console.error('Error geolocalización:', error);
    this.errorGeolocalizacion = true;
  }
  
  this.detectandoUbicacion = false;
}

toggleDesplegarCiudades() {
  this.ciudadesDesplegadas = !this.ciudadesDesplegadas;
}

}
