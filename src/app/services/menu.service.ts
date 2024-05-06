import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';
import { Menu } from '../interfaces/menu';

@Injectable({
  providedIn: 'root'
})
export class MenuService {


  private apiURLCafe = 'https://rwttebejxwncpurszzld.supabase.co/rest/v1/cafes';
  private apiURLMenu = 'https://rwttebejxwncpurszzld.supabase.co/rest/v1/menu';
  private apiKey = environment.supabaseKey;
  private supabase: SupabaseClient;
  
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

  async upDateMenu(id: number, menu: string) {
    return await this.supabase
    .from("menu")
    .update({ menu: menu })
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
}
