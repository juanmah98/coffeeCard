// To parse this data:
//
//   import { Convert } from "./file";
//
//   const entidades = Convert.toEntidades(json);

export interface Entidades {
    id:             string;
    nombre:         string;
    email:          string;
    background:     string;
    tabla_contador: string;
    fecha_creacion: Date;
    pais:string;
    informacion: string;
    direccion: string;
    logo: string;
    numero_contador: number;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toEntidades(json: string): Entidades[] {
        return JSON.parse(json);
    }

    public static entidadesToJson(value: Entidades[]): string {
        return JSON.stringify(value);
    }
}
