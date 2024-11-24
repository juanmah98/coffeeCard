import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
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
  private functionUrl = 'https://rwttebejxwncpurszzld.supabase.co/functions/v1';
  private apiKey = environment.supabaseKey;

  private supabase: SupabaseClient;
  private session: BehaviorSubject<Session | null>;

  constructor(private http: HttpClient) { 
    this.supabase = createClient('https://rwttebejxwncpurszzld.supabase.co', environment.supabaseKey);
    this.session = new BehaviorSubject<Session | null>(null); // Inicializa el BehaviorSubject

    // Recuperar la sesión actual, si existe
    this.supabase.auth.getSession().then(({ data }) => {
      if (this.session) {
        this.session.next(data.session);
      }
    });

    // Escuchar cambios de autenticación
    this.supabase.auth.onAuthStateChange((_event, session) => {
      if (this.session) {
        this.session.next(session);
      }
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

  async getUs() {
    const user = await this.supabase.
    from(USERS_TABLE).
    select('*');
    return user|| [];
  }

  async getCofess(id: string, tabla: string) {
    return await this.supabase
      .from(tabla)
      .select('*')
      .match({ id: id })
      .single();
  }

  async getTablaContador(id: string, tabla: string) {
    return await this.supabase
      .from(tabla)
      .select('*')
      .match({ usuario_id: id })
      .single();
  }

  async getTablaContadorData(column: string, tabla: string) {
    return await this.supabase
      .from(tabla)
      .select(column);
  }

  async getTablasTotalUsuarios(tabla: string) {
    return await this.supabase
      .from(tabla)
      .select('*')
  }

  async getUsuariosId(id: string) {
    return await this.supabase
      .from(USERS_TABLE)
      .select('*')
      .match({ id: id })
      .single();
  }

  async getUsuariosDataTable(id: string, tabla: string) {
    return await this.supabase
      .from(USERS_TABLE)
      .select('*')
      .match({ id: id })
      .single();
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

  async postNewEntity(data: any) {
    return await this.supabase
      .from("entidades")
      .insert(data)
      .select();
  }

  async updateOpcion(id: string, tabla: string, opcion: number) {
    return await this.supabase
      .from(tabla)
      .update({ opcion: opcion })
      .eq('id', id)
      .select();
  }

  async updateContador(id: string, tabla: string, contador: number) {
    return await this.supabase
      .from(tabla)
      .update({ contador: contador })
      .eq('id', id)
      .select();
  }

  async updateContadorGratis(id: string, tabla: string, cantidad_gratis: number) {
    return await this.supabase
      .from(tabla)
      .update({ cantidad_gratis: cantidad_gratis })
      .eq('id', id)
      .select();
  }

  getUsers(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(this.apiUrlUsers, { headers });
  }

  async getUsersTable() {
    return await this.supabase
      .from('usuarios')
      .select('*');
  }

  async getUsersAdminTable() {
    return await this.supabase
      .from('usuarios_admin')
      .select('*');
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
    const api = `${this.apiUrl}/${tabla}`;
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

  getTablaCafesRealtime(id: string, tabla: string) {
    /* console.log('getTablaCafesRealtime'); */
    const changes = new Subject();

    this.supabase.channel('room1').on('postgres_changes', { event: '*', schema: 'public', table: tabla, filter: `id=eq.${id}` }, payload => {
     /*  console.log('Change received!', payload); */
      changes.next(payload);
    })
    .subscribe();

    return changes.asObservable();
  }

  /* ENTIDADES */
  async getEntidades() {
    return await this.supabase
      .from('entidades')
      .select('*');
  }

  async getEntidadesTrue() {
    return await this.supabase
      .from('entidades')
      .select('*')
      .is('is_active', true)
  }

  async activateEntityViaEdgeFunction(token: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.functionUrl}/entidadToken?token=${token}`); // Llama a la Edge Function
      if (!response.ok) {
        console.error('Activation request failed with status:', response.status);
        return false; // Indica al componente que la activación falló
      }
      return true; // Activación exitosa
    } catch (error) {
      console.error('Error during activation request:', error);
      return false; // Indica un error en la activación
    }
  }
  
  getEntidadRealtime(id: string): Observable<any> {
    const changes = new Subject<any>();
    this.supabase.channel('room1').on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'entidades',
        filter: `id=eq.${id}` // Filtrar por el ID de la entidad
      },
      payload => {
        changes.next(payload);
      }
    ).subscribe();
    return changes.asObservable();
  }
  /* async activateEntity(token: string): Promise<any> {
    const { data, error } = await this.supabase
      .from('entidades')  // Asegúrate de que esta es la tabla correcta
      .update({ is_active: true })  // Actualizamos el campo 'activo' a true
      .eq('activation_token', token);  // Aseguramos que el 'token' coincida con el proporcionado

    if (error) {
      console.error('Error al activar la entidad:', error);
      return { error: 'Activación fallida' };
    }

    return { data };
  } */
  

  async updateAdmin(id: string, soloLectura: boolean) {
    return await this.supabase
      .from('usuarios_admin')
      .update({ soloLectura: soloLectura })
      .eq('id', id)
      .select();
  }

  async updateInformacion(id: string, informacion: string, text_card: string) {
    return await this.supabase
      .from('entidades')
      .update({ informacion: informacion, text_card: text_card},)
      .eq('id', id)
      .select();
  }

  async updateLogoEntidad(id: string, logo:string) {
    return await this.supabase
      .from('entidades')
      .update({ logo:logo},)
      .eq('id', id)
      .select();
  }

  async updateBackgroundEntidad(id: string, background:string) {
    return await this.supabase
      .from('entidades')
      .update({ background:background},)
      .eq('id', id)
      .select();
  }

  async postNewAdmin(data: any) {
    return await this.supabase
      .from("usuarios_admin")
      .insert(data)
      .select();
  }


  /* METODO DE IMAGENES */

  async uploadImage(file: File, folderName: string, fileName: string): Promise<any> {
    try {
      // Crear una ruta dentro del bucket
      const filePath = `${folderName}/${fileName}`;
      
      // Subir la imagen
      const { data, error } = await this.supabase.storage
        .from('logos') // Nombre del bucket
        .upload(filePath, file, {
          cacheControl: '3600', // Opcional
          upsert: false // Evitar sobrescribir archivos existentes
        });
      
      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error al subir la imagen: ', error);
      throw error;
    }
  }

  // Método para obtener la URL pública de la imagen
  async getPublicImageUrl(filePath: string): Promise<string> {
    const { data } = this.supabase.storage
      .from('logos/logos_fidelity')
      .getPublicUrl(filePath);

    return data?.publicUrl || '';
  }

  async updateImage(file: File, folderName: string, fileName: string): Promise<any> {
    try {
      // Crear una ruta dentro del bucket
      const filePath = `${folderName}/${fileName}`;
      
      // Subir la imagen
      const { data, error } = await this.supabase.storage
        .from('logos') // Nombre del bucket
        .update(filePath, file, {
          cacheControl: '3600', // Opcional
          upsert: false // Evitar sobrescribir archivos existentes
        });
      
      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error al subir la imagen: ', error);
      throw error;
    }
  }

  
  
  
}
