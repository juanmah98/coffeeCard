import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  images = [
    { url: '../../../../assets/imagenes/guia_de_uso/1.png', titulo: 'Home'},
    { url: '../../../../assets/imagenes/guia_de_uso/2.png', titulo: 'Principal'},
    { url: '../../../../assets/imagenes/guia_de_uso/3.png', titulo: 'Tarjeta <strong>(usuario)</strong>'},
    { url: '../../../../assets/imagenes/guia_de_uso/4.png', titulo: 'Boton información'},
    { url: '../../../../assets/imagenes/guia_de_uso/3-2.png', titulo: 'Tarjeta <strong>(usuario)</strong>'},
    { url: '../../../../assets/imagenes/guia_de_uso/5.png', titulo: 'Boton sumar punto'},
    { url: '../../../../assets/imagenes/guia_de_uso/6-2.png', titulo: 'Escaner <strong>(admin)</strong>'},
    { url: '../../../../assets/imagenes/guia_de_uso/5-2.png', titulo: 'Sumar punto <strong>(admin)</strong>'},
    { url: '../../../../assets/imagenes/guia_de_uso/6.png', titulo: 'Tarjeta <strong>(usuario)</strong>'},
    { url: '../../../../assets/imagenes/guia_de_uso/7.png', titulo: 'Tarjeta completa <strong>(usuario)</strong>'},
    { url: '../../../../assets/imagenes/guia_de_uso/8.png', titulo: 'Boton reclamar premio'},
    { url: '../../../../assets/imagenes/guia_de_uso/9.png', titulo: 'Reseteo de puntos'},
    { url: '../../../../assets/imagenes/guia_de_uso/10.png', titulo: 'Panel administrador'},
    { url: '../../../../assets/imagenes/guia_de_uso/11.png', titulo: 'Panel administrador'},
    { url: '../../../../assets/imagenes/guia_de_uso/12.png', titulo: 'Panel administrador'},
    { url: '../../../../assets/imagenes/guia_de_uso/13.png', titulo: 'Panel administrador'},
    
  ];
  constructor(private router: Router, private ngZone: NgZone) { }

  ngOnInit(): void {
  }

  accion(){
    this.ngZone.run(() => {   
      this.router.navigate(['/home'])
      }); 
  }

  accionComercio(){
    this.ngZone.run(() => {   
      this.router.navigate(['/registro'])
      }); 
  }
}
