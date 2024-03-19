import { Component, OnInit } from '@angular/core';
import { CafeData } from 'src/app/interfaces/cafes_data';
import { Usuarios } from 'src/app/interfaces/usuarios';
import { InternoService } from 'src/app/services/interno.service';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-card-selection',
  templateUrl: './card-selection.component.html',
  styleUrls: ['./card-selection.component.css']
})
export class CardSelectionComponent implements OnInit {
  imagen = '';
  

  upload:boolean = false;
  nombre:any = '';
  foto:any='';
  contadorArray: number[] = Array(10).fill(0).map((x, i) => i);

  dataUser:Usuarios = {
      id: "",
      email: '',
      contador_cafe_id: '',
  };

  data_cafe:CafeData = 
    {
      id: "",
      contador: 0,
      gratis: false,
      opcion: 0,
      cantidad_gratis: 0
  }
  constructor(private _SupabaseService:SupabaseService, private _dataInterna: InternoService) { }

  ngOnInit(): void {
    this.dataUser = this._dataInterna.getUser();
    this.nombre = localStorage.getItem("name");
    this.foto = localStorage.getItem("photo");
    console.log("this.foto")
    console.log(this.foto)
    this._SupabaseService.getDataCard(this.dataUser.contador_cafe_id).subscribe((data: any) => {
      this.data_cafe = data[0]; 
      console.log(data[0]);
    });

    setTimeout(() => {
      this.upload = true;
    }, 2000)

  }

  op1(){
    this._SupabaseService.postOpcion(this.dataUser.contador_cafe_id,1).subscribe(
      (response) => {
        console.log('cafe creado con éxito', response);
        /* this.router.navigate(['/user']); */
      },
      (error) => {
        console.error('Error al crear cafe', error);
      }
    );

    this.ngOnInit();
  }

  op2(){
    this._SupabaseService.postOpcion(this.dataUser.contador_cafe_id,2).subscribe(
      (response) => {
        console.log('cafe creado con éxito', response);
        /* this.router.navigate(['/user']); */
      },
      (error) => {
        console.error('Error al crear cafe', error);
      }
    );

    this.ngOnInit();

  }

  op3(){
    this._SupabaseService.postOpcion(this.dataUser.contador_cafe_id,3).subscribe(
      (response) => {
        console.log('cafe creado con éxito', response);
        /* this.router.navigate(['/user']); */
      },
      (error) => {
        console.error('Error al crear cafe', error);
      }
    );

    this.ngOnInit();

  }

}
