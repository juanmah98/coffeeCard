// To parse this data:
//
//   import { Convert } from "./file";
//
//   const usuarios = Convert.toUsuarios(json);

export interface Usuarios {
    id:               string;
    email:            string;
    name: string;
    fecha_creacion: Date;
    pais:string;
    waitlist: boolean;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toUsuarios(json: string): Usuarios[] {
        return JSON.parse(json);
    }

    public static usuariosToJson(value: Usuarios[]): string {
        return JSON.stringify(value);
    }
}
