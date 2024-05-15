import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';
import { Menu } from '../interfaces/menu';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {


  private apiURLCafe = 'https://rwttebejxwncpurszzld.supabase.co/rest/v1/cafes';
  private apiURLMenu = 'https://rwttebejxwncpurszzld.supabase.co/rest/v1/menu';
  private apiKey = environment.supabaseKey;
  private supabase: SupabaseClient;
  

  private caldito = new BehaviorSubject<boolean>(false);
  caldito$ = this.caldito.asObservable();

  private gazpacho = new BehaviorSubject<boolean>(false);
  gazpacho$ = this.gazpacho.asObservable();

  constructor() { 
    this.supabase = createClient('https://rwttebejxwncpurszzld.supabase.co', environment.supabaseKey)
    
  }


  async getCafes(){
    const cafe = await this.supabase
    .from('cafes').
    select('*');
    return cafe.data || [];
  }

  async upDateCafe(id: number, precio: string) {
    return await this.supabase
    .from("cafes")
    .update({ precio: precio })
    .eq('id', id)
    .select()
  }

  async upDateCafeM(id: number, precio: any) {
    return await this.supabase
    .from("cafes")
    .update({ precio_m: precio })
    .eq('id', id)
    .select()
  }

  async upDateCafeG(id: number, precio: any) {
    return await this.supabase
    .from("cafes")
    .update({ precio_g: precio })
    .eq('id', id)
    .select()
  }

  async getMenu(){
    const cafe = await this.supabase
    .from('menu').
    select('*');
    return cafe.data || [];
  }

  async upDateMenu(id: number, menu: string, fecha: Date) {
    return await this.supabase
    .from("menu")
    .update({ menu: menu, fecha: fecha})
    .eq('id', id)
    .select()
  }

  async DeletedMenu(id: number) {
    return await this.supabase
    .from("menu")
    .delete()
    .eq('id', id)
    .select()
  }

  async postMenu(data: any) {
    return await this.supabase
    .from("menu")
    .insert(data)
    .select()
  }

  async getBebidas(){
    const cafe = await this.supabase
    .from('bebidas').
    select('*');
    return cafe.data || [];
  }

  async upDateBebidas(id: number, precio: string, bebida: string) {
    return await this.supabase
    .from("bebidas")
    .update({ precio: precio, bebida: bebida })
    .eq('id', id)
    .select()
  }

  async DeletedBebidas(id: number) {
    return await this.supabase
    .from("bebidas")
    .delete()
    .eq('id', id)
    .select()
  }

  async postBebidas(data: any) {
    return await this.supabase
    .from("bebidas")
    .insert(data)
    .select()
  }

  async getExtras(){
    const extras = await this.supabase
    .from('extras').
    select('*');
    return extras.data || [];
  }

  async upDateExtras(id: number, estado: boolean) {
    return await this.supabase
    .from("extras")
    .update({ estado: estado })
    .eq('id', id)
    .select()
  }

  getCaldito(): boolean {
    return this.caldito.value;
  }

  setCaldito(valor: boolean): void {
    this.caldito.next(valor);
    localStorage.setItem('caldito', JSON.stringify(valor));
  }
  getGazpacho(): boolean {
    return this.gazpacho.value;
  }

  setGazpacho(valor: boolean): void {
    this.gazpacho.next(valor);
    localStorage.setItem('gazpacho', JSON.stringify(valor));
  }
}
