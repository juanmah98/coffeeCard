import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Bebidas } from 'src/app/interfaces/bebidas';
import { CafeMenus } from 'src/app/interfaces/cafe_menus';
import { Extras } from 'src/app/interfaces/extras';
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
  bebidas:Bebidas[]=[]
  nuevaBebida: string = ""; 
  nuevaBebidaPrecio: string = ""; 
  vistaBebida:boolean=false
  vistaCafe:boolean=false

  caldito: boolean = false;
  gazpacho: boolean = false;
  savedData: any;
  extras:Extras[]=[]
  constructor(private _SupabasMenuServices: MenuService, private router: Router, private ngZone: NgZone) { }

  async ngOnInit(): Promise<void> {
    this.cafes = await this._SupabasMenuServices.getCafes()
    console.log("cafes: ", this.cafes)
    this.cafes.sort((a, b) => a.id - b.id);
    this.cafesUpdate = this.cafes;

    this.menus = await this._SupabasMenuServices.getMenu()
    console.log("cafes: ", this.menus)
    this.menus.sort((a, b) => a.id - b.id);

    this.bebidas = await this._SupabasMenuServices.getBebidas()
    console.log("bebidas: ", this.bebidas)
    this.bebidas.sort((a, b) => a.id - b.id);
    
    this.extras = await this._SupabasMenuServices.getExtras()
    console.log("extras: ", this.extras)
    this.extras.sort((a, b) => a.id - b.id);


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
    const fechaActual: Date = this.obtenerFechaActual();

    const responseOpcion:any = (await this._SupabasMenuServices.upDateMenu(item.id, item.menu, fechaActual)).data;
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



  async inputChangedBebida(item:Bebidas) {
    console.log("Se ha detectado un cambio en un input", item);

    const responseOpcion:any = (await this._SupabasMenuServices.upDateBebidas(item.id, item.precio, item.bebida)).data;
    console.log("Cambio efectuado", responseOpcion);

  }

  async borrarBebida(item:Bebidas){
    const responseOpcion:any = (await this._SupabasMenuServices.DeletedBebidas(item.id)).data;
    console.log("Bebida borrado", responseOpcion);
    this.ngOnInit();
  }

  async newBebida(nuevabebida:string, precio:string){
    const dataBebida:any = {       
      bebida:nuevabebida,
      precio:precio
  };

    const response:any = (await this._SupabasMenuServices.postBebidas(dataBebida));
    console.log("Bebida creado", response);
    this.ngOnInit();
  }

  bebidaCambios(){
    console.log("Creando bebida");
    console.log("bebida:" ,this.nuevaBebida, this.nuevaBebidaPrecio)
  }

  cafeTrue(){
    this.vistaCafe = !this.vistaCafe
  }

  bebidaTrue(){
    this.vistaBebida = !this.vistaBebida
  }

  async onCheckboxChange(item:Extras) {
      console.log("Se ha detectado un cambio en un input", item);
      const responseOpcion:any = (await this._SupabasMenuServices.upDateExtras(item.id, item.estado, item.precio)).data;
      console.log("Cambio efectuado", responseOpcion);
      // Limpiar la variable cuando el checkbox está desmarcado
      
    
  }

  qrscaner(){
   

    this.ngZone.run(() => {   
      this.router.navigate(['/qrscan'])
      }); 
  }

  obtenerFechaActual(): Date {
    return new Date();
  }


}

