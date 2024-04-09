import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, Subject  } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const USERS_TABLE = "usuarios";
export const CONTADOR_CAFES = "contador_cafe";

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {

  private apiUrlUsers = 'https://rwttebejxwncpurszzld.supabase.co/rest/v1/usuarios';
  private apiUrlCafes = 'https://rwttebejxwncpurszzld.supabase.co/rest/v1/contador_cafe';
  private apiKey = environment.supabaseKey;


  private supabase: SupabaseClient;


 
  /* private messageSubject: Subject<any> = new Subject<any>(); */

  constructor(private http: HttpClient) { 
    
    
   
    this.supabase = createClient('https://rwttebejxwncpurszzld.supabase.co', environment.supabaseKey)
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

  async getCofess(cafe: string){
    return await this.supabase
    .from(CONTADOR_CAFES)
    .select('*')
    .match({id: cafe})
    .single()
  }

  getUsers(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(this.apiUrlUsers, { headers });
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

  getDataCard(id_card: string): Observable<any> {
    const headers = this.getHeaders();

    const queryParams = new HttpParams().set('id', `eq.${id_card}`);
    return this.http.get(this.apiUrlCafes, { headers, params: queryParams });
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

  getTablaCafesRealtime(id:string){
    console.log('getTablaCafesRealtime')
    const changes = new Subject();

    this.supabase.channel('room1').on('postgres_changes', { event: '*', schema: 'public', table: 'contador_cafe', filter: `id=eq.${id}` }, payload => {
      console.log('Change received!', payload)
      changes.next(payload);
    })
    .subscribe()

    return changes.asObservable();
  }

 
}
