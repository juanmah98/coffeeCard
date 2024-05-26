import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InternoService } from 'src/app/services/interno.service';


@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {

  constructor(public _interno: InternoService, private router: Router) { }

  ngOnInit(): void {
  }

  run(valor:string){
    this._interno.setEntidad(valor);

    this.router.navigate(['/home']);
  }

}
