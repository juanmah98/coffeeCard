import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Entidades } from 'src/app/interfaces/entdidades';
import { Usuarios } from 'src/app/interfaces/usuarios';
import { AuthService } from 'src/app/services/auth.service.service';
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
  usuario!:Usuarios;
  constructor(public _interno: InternoService, private router: Router, private ngZone: NgZone, private _supabaseServices: SupabaseService, private authService:AuthService) { }

  async ngOnInit(): Promise<void> {
   await this.getEntidades()
   this.usuario= this._interno.getUser()
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

}
