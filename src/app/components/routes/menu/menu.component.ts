import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Bebidas } from 'src/app/interfaces/bebidas';
import { CafeMenus } from 'src/app/interfaces/cafe_menus';
import { Extras } from 'src/app/interfaces/extras';
import { Menu } from 'src/app/interfaces/menu';
import { MenuService } from 'src/app/services/menu.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  private subscriptions = new Subscription();
  caldito:boolean=false
  gazpacho:boolean=true
  cafes:CafeMenus[]=[]
  menus:Menu[]=[]
  bebidas:Bebidas[]=[]
  extras:Extras[]=[]
  precioMenu: string ='';
  constructor(private _SupabasMenuServices: MenuService, private router: Router, private ngZone: NgZone) { }

  async ngOnInit(): Promise<void> {
    this.cafes = await this._SupabasMenuServices.getCafes()
    /* console.log("cafes: ", this.cafes) */
    this.cafes.sort((a, b) => a.id - b.id);

    this.menus = await this._SupabasMenuServices.getMenu()
   /*  console.log("menus: ", this.menus) */
    this.menus.sort((a, b) => a.id - b.id);

    this.bebidas = await this._SupabasMenuServices.getBebidas()
   /*  console.log("bebidas: ", this.bebidas) */
    this.bebidas.sort((a, b) => a.id - b.id);

    this.extras = await this._SupabasMenuServices.getExtras()
    /* console.log("extras: ", this.extras) */
    this.extras.sort((a, b) => a.id - b.id);

    this.extras.forEach(valor => {
      if(valor.nombre=='menu'){
        this.precioMenu=valor.precio
      }
    })

    this.subscriptions.add(this._SupabasMenuServices.gazpacho$.subscribe(data => {
      this.gazpacho = data;
    }));

  }

  accion(){
    this.ngZone.run(() => {   
      this.router.navigate(['/home'])
      }); 
  }
}
