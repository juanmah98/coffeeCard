import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, Subject  } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { createClient, Session, SupabaseClient } from '@supabase/supabase-js';
import { CafeData } from '../interfaces/cafes_data';

export const USERS_TABLE = "usuarios";
export const CONTADOR_TABLE_CAFE = "contador_cafe";
export const CONTADOR_TABLE_SPACE = "contador_space";

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {

  private apiUrlUsers = 'https://rwttebejxwncpurszzld.supabase.co/rest/v1/usuarios';
  private apiUrlCafes = 'https://rwttebejxwncpurszzld.supabase.co/rest/v1/contador_cafe';
  private apiUrl = 'https://rwttebejxwncpurszzld.supabase.co/rest/v1';
  private apiKey = environment.supabaseKey;


  private supabase: SupabaseClient;
  private session!: BehaviorSubject<Session | null>;

 
  /* private messageSubject: Subject<any> = new Subject<any>(); */

  constructor(private http: HttpClient) { 
    
    
   
    this.supabase = createClient('https://rwttebejxwncpurszzld.supabase.co', environment.supabaseKey);

    // Recuperar la sesión actual, si existe
    this.supabase.auth.getSession().then(({ data }) => {
      this.session.next(data.session);
    });

    // Escuchar cambios de autenticación
    this.supabase.auth.onAuthStateChange((_event, session) => {
      this.session.next(session);
    });
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'apikey': this.apiKey,
      'Authorization': 'Bearer ' + this.apiKey,
      'Prefer': 'return=minimal',
    });
  }


  async getUs(){
    const user = await this.supabase.from(USERS_TABLE).select('*');
    return user.data || [];
  }

  async getCofess(id: string, tabla: string){
    return await this.supabase
    .from(tabla)
    .select('*')
    .match({id: id})
    .single()
  }

  async getTablaContador(id: string, tabla: string){
    return await this.supabase
    .from(tabla)
    .select('*')
    .match({usuario_id: id})
    .single()
  }
  
  async postNewCoffe(data: any, tabla: string) {
    return await this.supabase
      .from(tabla)
      .insert(data)
      .select();
}

async postNewUser(data: any) {
  return await this.supabase
      .from("usuarios")
      .insert(data)
      .select();
}

async updateOpcion(id: string, tabla: string, opcion: number) {
  return await this.supabase
  .from(tabla)
  .update({ opcion: opcion })
  .eq('id', id)
  .select()
}

async updateContador(id: string, tabla: string, contador: number) {
  return await this.supabase
  .from(tabla)
  .update({ contador: contador })
  .eq('id', id)
  .select()
}
async updateContadorGratis(id: string, tabla: string, cantidad_gratis: number) {
  return await this.supabase
  .from(tabla)
  .update({ cantidad_gratis: cantidad_gratis })
  .eq('id', id)
  .select()
}

  getUsers(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(this.apiUrlUsers, { headers });
  }

  async getUsersTable(){
    return await this.supabase
    .from('usuarios')
    .select('*')
  }
  async getUsersAdminTable(){
    return await this.supabase
    .from('usuarios_admin')
    .select('*')
  }

  postUser(data: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(this.apiUrlUsers, data, { headers });
  }

  getCafes(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(this.apiUrlCafes, { headers });
  }

  postCafes(data: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(this.apiUrlCafes, data, { headers });
  }

  getDataCard(id_card: string, tabla: string): Observable<any> {
    const headers = this.getHeaders();
    const api = `${this.apiUrl}/${tabla}`
    const queryParams = new HttpParams().set('id', `eq.${id_card}`);
    return this.http.get(api, { headers, params: queryParams });
  }

  postOpcion(someValue: string, otherValue: number): Observable<any> {
    const headers = this.getHeaders();

    const updateData = {
      opcion: otherValue,
    };

    const queryParams = new HttpParams().set('id', `eq.${someValue}`);

    return this.http.patch(this.apiUrlCafes, updateData, { headers, params: queryParams });
  }
  

  postContador(someValue: string, otherValue: number): Observable<any> {
    const headers = this.getHeaders();

    const updateData = {
      contador: otherValue,
    };

    const queryParams = new HttpParams().set('id', `eq.${someValue}`);

    return this.http.patch(this.apiUrlCafes, updateData, { headers, params: queryParams });
  }

  postGratis(someValue: string, otherValue: number): Observable<any> {
    const headers = this.getHeaders();

    const updateData = {
      cantidad_gratis: otherValue,
    };

    const queryParams = new HttpParams().set('id', `eq.${someValue}`);

    return this.http.patch(this.apiUrlCafes, updateData, { headers, params: queryParams });
  }

  getTablaCafesRealtime(id:string, tabla:string){
    console.log('getTablaCafesRealtime')
    const changes = new Subject();

    this.supabase.channel('room1').on('postgres_changes', { event: '*', schema: 'public', table: tabla, filter: `id=eq.${id}` }, payload => {
      console.log('Change received!', payload)
      changes.next(payload);
    })
    .subscribe()

    return changes.asObservable();
  }

  /* ENTIDADES */
  async getEntidades(){
    return await this.supabase
    .from('entidades')
    .select('*')
  }

 
}
