import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Entidades } from 'src/app/interfaces/entdidades';
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

  constructor(public _interno: InternoService, private router: Router, private _supabaseServices: SupabaseService) { }

  async ngOnInit(): Promise<void> {
  this.entidadesArre =  await this._supabaseServices.getEntidades()
  this.entidades = this.entidadesArre.data;
  console.log(this.entidades)
  }

  run(valor: number){
    this._interno.setEntidad(this.entidades[valor]);

    this.router.navigate(['/home']);
  }

}
