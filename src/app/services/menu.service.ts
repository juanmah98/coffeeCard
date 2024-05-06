import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';

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

  async getMenu(){
    const cafe = await this.supabase
    .from('menu').
    select('*');
    return cafe.data || [];
  }
}
