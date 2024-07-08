import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { SupabaseService } from 'src/app/services/supabase.service';
import { CafeData } from 'src/app/interfaces/cafes_data';
import { Router } from '@angular/router';
import { InternoService } from 'src/app/services/interno.service';
import { Entidades } from 'src/app/interfaces/entdidades';
import { AuthService } from 'src/app/services/auth.service.service';

@Component({
  selector: 'app-lector-qr',
  templateUrl: './lector-qr.component.html',
  styleUrls: ['./lector-qr.component.css']
})
export class LectorQrComponent implements OnInit {
  qrResultString: string = '';
  uuidCifrado: string = '';
  data_cafe: CafeData = {
    id: "",
    usuario_id: '',
    contador: 0,
    gratis: false,
    opcion: 0,
    cantidad_gratis: 0
  };

  bgClass: string = 'bg';

  // Clave para cifrar/descifrar
  clave = 'piazzetta';
  entidad!: Entidades;
  entidadDistinta = false;
  admin = true;

  constructor(
    private cdr: ChangeDetectorRef,
    private _SupabaseService: SupabaseService,
    private router: Router,
    private _InternoServices: InternoService,
    private ngZone: NgZone,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.entidad = this._InternoServices.getEntidad();
    this.admin = this._InternoServices.getUserAdmin().soloLectura;
    this.bgClass = `bg-${this._InternoServices.getEntidad().background}-card`;
    this.cdr.detectChanges();
  }

  onCodeResult(event: any) {
    const resultString: string = event.text;  // Extrae el string del objeto de evento
    this.qrResultString = resultString;
    const uuidDescifrado = this.descifrarUUID(this.qrResultString, this.clave);
    console.log('UUID descifrado:', uuidDescifrado);

    this._SupabaseService.getDataCard(uuidDescifrado, this.entidad.tabla_contador).subscribe((data: any) => {
      if (data[0] == undefined) {
        console.log("ENTIDAD INEXISTENTE");
        this.entidadDistinta = true;
      } else {
        this.data_cafe = data[0];
        console.log(data[0]);
        this.entidadDistinta = false;
      }
    });
  }

  descifrarUUID(uuidCifrado: string, clave: string): string {
    const bytes = CryptoJS.AES.decrypt(uuidCifrado, clave);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  async sumar(): Promise<void> {
    if (this.data_cafe.contador === 10) {
      this.data_cafe.contador = 0;
      this.data_cafe.opcion = 0;
      this.data_cafe.cantidad_gratis = this.data_cafe.cantidad_gratis + 1;

      try {
        const responseOpcion: any = (await this._SupabaseService.updateOpcion(this.data_cafe.id, this.entidad.tabla_contador, 0)).data;
        console.log("Opcion set 0", responseOpcion);

        const responseContador: any = (await this._SupabaseService.updateContador(this.data_cafe.id, this.entidad.tabla_contador, 0)).data;
        console.log("Contador set 0", responseContador);

        const responseContadorGratis: any = (await this._SupabaseService.updateContadorGratis(this.data_cafe.id, this.entidad.tabla_contador, this.data_cafe.cantidad_gratis)).data;
        console.log("Contador Gratis +1", responseContadorGratis);

        this.reiniciarEscaneo();
      } catch (error) {
        console.error('Error al crear cafe', error);
      }
    } else {
      try {
        const responseContador: any = (await this._SupabaseService.updateContador(this.data_cafe.id, this.entidad.tabla_contador, this.data_cafe.contador + 1)).data;
        console.log("Contador +1 ", responseContador);
        this.reiniciarEscaneo();
      } catch (error) {
        console.error('Error al crear cafe', error);
      }
    }
  }

  reiniciarEscaneo(): void {
    this.qrResultString = '';
    this.entidadDistinta = false;
  }

  menu() {
    this.ngZone.run(() => {
      this.router.navigate(['/menu-admin'])
    });
  }

  back(): void {
    this.ngZone.run(() => {
      this.router.navigate(['/admin']);
    });
  }

  clearStorage(): void {
    const coockies = this._InternoServices.getCoockes()
    localStorage.clear();
    this._InternoServices.setCoockes(coockies)
    this.authService.logout();
    this.ngZone.run(() => {
      this.router.navigate(['/home']);
    });
  }
}
