import { Component, OnInit } from '@angular/core';
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
  constructor(private _SupabasMenuServices: MenuService) { }

  async ngOnInit(): Promise<void> {
    this.cafes = await this._SupabasMenuServices.getCafes()
    console.log("cafes: ", this.cafes)
    this.cafes.sort((a, b) => a.id - b.id);

    this.menus = await this._SupabasMenuServices.getMenu()
    console.log("menus: ", this.menus)
    this.menus.sort((a, b) => a.id - b.id);

    this.bebidas = await this._SupabasMenuServices.getBebidas()
    console.log("bebidas: ", this.bebidas)
    this.bebidas.sort((a, b) => a.id - b.id);

    this.extras = await this._SupabasMenuServices.getExtras()
    console.log("extras: ", this.extras)
    this.extras.sort((a, b) => a.id - b.id);

    this.subscriptions.add(this._SupabasMenuServices.caldito$.subscribe(data => {
      this.caldito = data;
    }));

    this.subscriptions.add(this._SupabasMenuServices.gazpacho$.subscribe(data => {
      this.gazpacho = data;
    }));

  }

}
