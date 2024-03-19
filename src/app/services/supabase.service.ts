import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {

  private apiUrlUsers = 'https://rwttebejxwncpurszzld.supabase.co/rest/v1/usuarios';
  private apiUrlCafes = 'https://rwttebejxwncpurszzld.supabase.co/rest/v1/contador_cafe';
  private apiKey = environment.supabaseKey;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'apikey': this.apiKey,
      'Authorization': 'Bearer ' + this.apiKey,
      'Prefer': 'return=minimal',
    });
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
}
