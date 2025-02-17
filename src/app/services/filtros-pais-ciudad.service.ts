import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuarios } from '../interfaces/usuarios';
import { InternoService } from './interno.service';

interface GeonamesLocation {
  name: string;
  countryCode: string;
  adminName1?: string;
  population: number;
}

interface GeonamesResponse {
  geonames: GeonamesLocation[];
}

@Injectable({
  providedIn: 'root'
})


export class FiltrosPaisCiudadService {
  private readonly GEONAMES_USERNAME = 'fidelitycards '; // Regístrate en geonames.org para obtener tu usuario

  private countryCodes:any = {
    argentina: 'AR',
    españa: 'ES'
  };

  private ciudadesCache: { [key: string]: string[] } = {};

  private usuario:Usuarios
  // filtros-pais-ciudad.service.ts
public paisActual: string = '';
public ciudadActual: string = '';

  constructor(private http: HttpClient, private _internoServices: InternoService) {
    this.usuario = _internoServices.getUser();
  }

  async getCiudades(pais: string): Promise<string[]> {
    try {
        const response = await this.http.get<GeonamesResponse>('https://secure.geonames.org/searchJSON', {
            params: {
                country: this.countryCodes[pais],
                featureClass: 'P', 
                maxRows: '100',
                lang: 'es',
                username: this.GEONAMES_USERNAME,
                orderby: 'population', // Ordenar por población
                style: 'FULL',
                cities: 'cities5000' // Solo ciudades con más de 5000 habitantes
            }
        }).toPromise();

        return this.procesarCiudades(response?.geonames || []);
    } catch (error) {
        console.error('Error obteniendo ciudades:', error);
        return [];
    }
}

  private procesarCiudades(ciudades: GeonamesLocation[]): string[] {
    return ciudades
        .filter(ciudad => 
            ciudad.population > 50000 && // Solo ciudades con más de 50,000 habitantes
            !ciudad.name.match(/^(Area|Region|District)/i) // Excluir áreas administrativas
        )
        .map(ciudad => {
            // Simplificar nombres de ciudades principales
            if (ciudad.adminName1 === 'Madrid') return 'Madrid';
            if (ciudad.adminName1 === 'Barcelona') return 'Barcelona';
            return ciudad.name;
        })
        .filter((value, index, self) => self.indexOf(value) === index)
        .sort((a, b) => a.localeCompare(b, 'es'));
}

  async detectarUbicacion() {
    try {
      const posicion = await navigator.geolocation.getCurrentPosition(
        (position) => this.obtenerCiudadPorCoordenadas(position.coords),
        (error) => console.error('Error geolocalización:', error)
      );
    } catch (error) {
      console.error('Geolocalización no soportada:', error);
    }
  }
  
  public async obtenerCiudadPorCoordenadas(coords: GeolocationCoordinates) {
    try {
        const response:any = await this.http.get<GeonamesResponse>(
            'https://secure.geonames.org/findNearbyPlaceNameJSON', 
            {
                params: {
                    lat: coords.latitude.toString(),
                    lng: coords.longitude.toString(),
                    username: this.GEONAMES_USERNAME,
                    lang: 'es',
                    maxRows: '1', // Solo el resultado más cercano
                    style: 'SHORT' // Respuesta simplificada
                }
            }
        ).toPromise();

        if (response?.geonames?.length > 0) {
            const location = response.geonames[0];
            console.log('Ubicación detectada:', location);
            
            // Aquí puedes actualizar la selección
            this.usuario.pais = this.getPaisFromCode(location.countryCode);
            this.usuario.ciudad = location.name;
        }
    } catch (error) {
        console.error('Error obteniendo ubicación:', error);
    }
}

private getPaisFromCode(countryCode: string): string {
  const codeMap: { [key: string]: string } = {
      'AR': 'argentina',
      'ES': 'españa'
  };
  return codeMap[countryCode] || 'todos';
}
}
