import { Component, OnInit } from '@angular/core';
import { CafeMenus } from 'src/app/interfaces/cafe_menus';
import { Menu } from 'src/app/interfaces/menu';
import { MenuService } from 'src/app/services/menu.service';

@Component({
  selector: 'app-menu-admin',
  templateUrl: './menu-admin.component.html',
  styleUrls: ['./menu-admin.component.css']
})
export class MenuAdminComponent implements OnInit {

  cafes:CafeMenus[]=[]
  cafesUpdate:CafeMenus[]=[]
  menus:Menu[]=[]

  nuevoMenu: string = ""; 
  constructor(private _SupabasMenuServices: MenuService) { }

  async ngOnInit(): Promise<void> {
    this.cafes = await this._SupabasMenuServices.getCafes()
    console.log("cafes: ", this.cafes)
    this.cafes.sort((a, b) => a.id - b.id);
    this.cafesUpdate = this.cafes;

    this.menus = await this._SupabasMenuServices.getMenu()
    console.log("cafes: ", this.menus)
    this.menus.sort((a, b) => a.id - b.id);
    

  }


  async inputChanged(item:CafeMenus) {
    console.log("Se ha detectado un cambio en un input", item);

    const responseOpcion:any = (await this._SupabasMenuServices.upDateCafe(item.id, item.precio)).data;
    console.log("Cambio efectuado", responseOpcion);
    if(item.precio_m!=null || item.precio_g!=null)
      {
        const responseOpcion1:any = (await this._SupabasMenuServices.upDateCafeM(item.id, item.precio_m)).data;
        console.log("Cambio efectuadoM", responseOpcion1);
      
        const responseOpcion2:any = (await this._SupabasMenuServices.upDateCafeG(item.id, item.precio_g)).data;
        console.log("Cambio efectuadoG", responseOpcion2);
      }  

  }

  async inputChangedMenu(item:Menu) {
    console.log("Se ha detectado un cambio en un input", item);

    const responseOpcion:any = (await this._SupabasMenuServices.upDateMenu(item.id, item.menu)).data;
    console.log("Cambio efectuado", responseOpcion);

  }

  async borrarMenu(item:Menu){
    const responseOpcion:any = (await this._SupabasMenuServices.DeletedMenu(item.id)).data;
    console.log("Menu borrado", responseOpcion);
    this.ngOnInit();
  }

  async newMenu(nuevoMenu:string){
    const dataCafe:any = {       
      menu:nuevoMenu
  };

    const response:any = (await this._SupabasMenuServices.postMenu(dataCafe));
    console.log("Menu creado", response);
    this.ngOnInit();
  }

  menuCambios(){
    console.log("Creando menu");
    console.log("menu:" ,this.nuevoMenu)
  }


}

