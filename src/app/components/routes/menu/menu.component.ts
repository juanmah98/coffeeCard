import { Component, OnInit } from '@angular/core';
import { CafeMenus } from 'src/app/interfaces/cafe_menus';
import { Menu } from 'src/app/interfaces/menu';
import { MenuService } from 'src/app/services/menu.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {


  cafes:CafeMenus[]=[]
  menus:Menu[]=[]
  constructor(private _SupabasMenuServices: MenuService) { }

  async ngOnInit(): Promise<void> {
    this.cafes = await this._SupabasMenuServices.getCafes()
    console.log("cafes: ", this.cafes)
    this.cafes.sort((a, b) => a.id - b.id);

    this.menus = await this._SupabasMenuServices.getMenu()
    console.log("cafes: ", this.menus)
    this.menus.sort((a, b) => a.id - b.id);

  }

}
