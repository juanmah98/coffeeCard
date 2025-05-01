import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { createClient, Session, SupabaseClient } from '@supabase/supabase-js';
import { CafeData } from '../interfaces/cafes_data';
import { Horarios } from '../interfaces/horarios';
import { Empleados } from '../interfaces/empleados';
import { UsuarioChart } from '../interfaces/usuarios-chart';

export const USERS_TABLE = "usuarios";
export const CONTADOR_TABLE_CAFE = "contador_cafe";
export const CONTADOR_TABLE_SPACE = "contador_space";

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  from //rwttebejxwncpurszzld.supabase.co/rest/v1/usuarios';
    <T>(arg0: string) {
      throw new Error('Method not implemented.');
  }

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

  async getAllQrs(): Promise<any[]> {
    let allData: any[] = [];
    let from = 0;
    let to = 999; // PostgreSQL devuelve filas indexadas desde 0
    let hasMore = true;
  
    while (hasMore) {
      const { data, error } = await this.supabase
        .from('qrs')
        .select('*')
        .range(from, to); // Obtiene 1000 filas por solicitud
  
      if (error) {
        console.error('Error obteniendo QRs:', error);
        throw error;
      }
  
      if (data && data.length > 0) {
        allData = [...allData, ...data]; // Agrega datos al array
        from += 1000;
        to += 1000;
      } else {
        hasMore = false; // Si no hay más datos, detenemos el bucle
      }
    }
  
    return allData;
  }
  
  async getUsuarioName(usuarioId: string): Promise<string> {
    const { data, error } = await this.supabase
      .from('usuarios') // Reemplaza con tu tabla
      .select('name')  // Asegúrate de que 'name' sea el campo correcto
      .eq('id', usuarioId)
      .single();
  
    if (error) {
      console.error('Error al obtener nombre de la entidad:', error);
      throw error;
    }
  
    return data?.name || 'Usuario desconocido';  // Si no se encuentra nombre, retornar uno por defecto
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

  async getDataCard(id_card: string, tabla: string): Promise<{ data: any[] | null; error: any }> {
    const { data, error } = await this.supabase
      .from(tabla)
      .select('*') // Puedes especificar columnas específicas si es necesario
      .eq('id', id_card);

    return { data, error };
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

  async updateInformacion(id: string, informacion: string) {
    return await this.supabase
      .from('entidades')
      .update({ informacion: informacion},)
      .eq('id', id)
      .select();
  }

  async updateContadorNumero(id: string, numero_contador: number) {
    return await this.supabase
      .from('entidades')
      .update({ numero_contador: numero_contador},)
      .eq('id', id)
      .select();
  }

  async updateFirstCardCount(id: string, first_card_count: number) {
    return await this.supabase
      .from('entidades')
      .update({ first_card_count: first_card_count},)
      .eq('id', id)
      .select();
  }

  async updateQr_papel(id: string, qr_papel: boolean) {
    return await this.supabase
      .from('entidades')
      .update({ qr_papel: qr_papel })
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

  async deletedAdmin(id: any) {
    return await this.supabase
      .from("usuarios_admin")
      .delete()
      .eq('id', id)
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


// Generar múltiples QR para una entidad
async generateQRCodes(entidadId: string, quantity: number): Promise<any[]> {
  const qrCodes = Array.from({ length: quantity }, () => ({
    qr_code: `${entidadId}-${Math.random().toString(36).substr(2, 10)}`,
    entidad_id: entidadId,
  }));

  // Insertar los QR en la base de datos
  const { data, error } = await this.supabase.from('qrs').insert(qrCodes).select();

  if (error) {
    console.error('Error al generar QR:', error);
    throw error;
  }

  // Retornar los datos insertados (QR generados)
  return data || [];
}



  // Validar un QR al ser escaneado
  async validateQRCode(qrCode: string, entidad_id: string, usuario:string): Promise<any> {
    try {
      // Verificar si el QR existe
      const { data: qrData, error: qrError } = await this.supabase
        .from('qrs')
        .select('*')
        .match({ qr_code: qrCode, entidad_id: entidad_id })
        /* .eq('qr_code', qrCode) */
        .single(); // Obtén un único registro
  
      if (qrError) {
        console.error('Error buscando el QR:', qrError);
        return { success: false, message: 'El QR es inválido' };
      }
  
      if (!qrData) {
        return { success: false, message: 'El QR no existe en la base de datos.' };
      }
  
      // Verificar si el QR ya fue usado
      if (qrData.is_used) {
        return { success: false, message: 'El QR ya fue usado.' };
      }
  
      // Actualizar el registro del QR
      const { data: updateData, error: updateError } = await this.supabase
        .from('qrs')
        .update({ is_used: true, used_at: new Date(), usuario: usuario })
        .eq('qr_code', qrCode);
  
      if (updateError) {
        console.error('Error actualizando el QR:', updateError);
        return { success: false, message: 'No se pudo actualizar el QR.' };
      }
  
      return {
        success: true,
        message: 'Punto sumado con éxito.',
        data: updateData,
      };
    } catch (error) {
      console.error('Error en validateQRCode:', error);
      return { success: false, message: 'Ocurrió un error inesperado.' };
    }
  }
  

  async getEntidadName(entidadId: string): Promise<string> {
    const { data, error } = await this.supabase
      .from('entidades') // Reemplaza con tu tabla
      .select('nombre')  // Asegúrate de que 'name' sea el campo correcto
      .eq('id', entidadId)
      .single();
  
    if (error) {
      console.error('Error al obtener nombre de la entidad:', error);
      throw error;
    }
  
    return data?.nombre || 'Entidad desconocida';  // Si no se encuentra nombre, retornar uno por defecto
  }
  
  async getEmpleados() {
    return await this.supabase
      .from('empleados')
      .select('*');
  }

  async getHoras() {
    return await this.supabase
      .from('horarios')
      .select('*');
  }

  // Obtener todos los empleados
  async getEmployees() {
    const { data, error } = await this.supabase.from('empleados').select('*');
    if (error) {
      console.error('Error al obtener empleados:', error);
    }
    return data || [];
  }

  // Obtener todos los horarios
  async getSchedules(): Promise<Horarios[]> {
    const { data, error } = await this.supabase
      .from('horarios')
      .select('*')
      // Eliminar cualquier filtro por "activo"
      .order('date', { ascending: true });
  
    if (error) throw error;
    return data as Horarios[];
  }

  // Guardar o actualizar un horario
  // Guardar o actualizar un horario
  async saveSchedule(schedule: any): Promise<{ error: any | null; data: any | null }> {
    try {
      // Buscar si ya existe un horario para el empleado y la fecha
      const { data: existingSchedules, error: fetchError } = await this.supabase
        .from('horarios')
        .select('*')
        .eq('empleado_id', schedule.empleado_id)
        .eq('date', schedule.date);
  
      if (fetchError) {
        console.error('Error al verificar horarios existentes:', fetchError);
        return { error: fetchError, data: null };
      }
  
      if (existingSchedules && existingSchedules.length > 0) {
        // Si existe un registro, verificar si hay diferencias en entry o exit
        const existingSchedule = existingSchedules[0];
  
        const shouldUpdate =
          existingSchedule.entry !== schedule.entry ||
          existingSchedule.exit !== schedule.exit;
  
        if (shouldUpdate) {
          // Actualizar si hay diferencias
          const { error: updateError } = await this.supabase
            .from('horarios')
            .update({
              entry: schedule.entry,
              exit: schedule.exit,
            })
            .eq('id', existingSchedule.id);
          if (updateError) {
            console.error('Error al actualizar horario:', updateError);
            return { error: updateError, data: null };
          } else {
            console.log('Horario actualizado:', existingSchedule.id);
            return { error: null, data: { id: existingSchedule.id, ...schedule } };
          }
        } else {
          console.log('No se realizaron cambios, el horario es el mismo.');
          return { error: null, data: existingSchedule };
        }
      } else {
        // Si no existe un registro, crear uno nuevo
        const { data, error: insertError } = await this.supabase.from('horarios').insert(schedule).single();
        if (insertError) {
          console.error('Error al insertar nuevo horario:', insertError);
          return { error: insertError, data: null };
        } else {
          console.log('Horario creado para empleado:', schedule.empleado_id);
          return { error: null, data };
        }
      }
    } catch (error) {
      console.error('Error al guardar o actualizar horario:', error);
      return { error, data: null };
    }
  }
  
  async addEmployee(employee: Empleados) {
    return await this.supabase.from('empleados').insert(employee);
  }
  
  async updateEmployee(employee: Empleados) {
    return await this.supabase
      .from('empleados')
      .update({ name: employee.name, hourlyRate: employee.hourlyRate, activo: employee.activo })
      .eq('id', employee.id);
  }

  async deleteEmployeeById(employeeId: string): Promise<void> {
    const { error } = await this.supabase
      .from('empleados')
      .delete()
      .eq('id', employeeId);

    if (error) {
      throw new Error(error.message);
    }
  }
  
  async deleteUnusedQrs(): Promise<void> {
    try {
      const expirationDate = new Date();
      expirationDate.setUTCMonth(expirationDate.getUTCMonth() - 2);
      
      const postgresDate = expirationDate
        .toISOString()
        .replace('T', ' ')
        .replace('Z', '')
        .split('.')[0] + '.000000';
  
      // Modificar la consulta para incluir .select()
      const { data, error } = await this.supabase
        .from('qrs')
        .delete()
        .eq('is_used', false)
        .lt('created_at', postgresDate)
        .select('*'); // <- ¡Esto es clave!
  
      if (error) throw error;
      
      console.log('QRs eliminados:', data.length); // Ahora data es un array
        
    } catch (err) {
      console.error('Error:', err);
      throw new Error('Error eliminando QRs');
    }
  }


  async getUsuariosPorPais(): Promise<UsuarioChart[]> {
    const { data, error } = await this.supabase
      .from('usuarios')
      .select('fecha_creacion, pais')
      .in('pais', ['españa', 'argentina'])
      .order('fecha_creacion', { ascending: true });

    if (error) {
      console.error('Error fetching usuarios:', error);
      throw error;
    }
/*     console.log("data: ", data) */
    return data;
  }
}
