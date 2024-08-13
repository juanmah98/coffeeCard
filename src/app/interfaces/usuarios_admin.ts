// To parse this data:
//
//   import { Convert } from "./file";
//
//   const usuarios = Convert.toUsuarios(json);

export interface Usuarios_admins {
    id: string;
    entidad_id: string;
    email: string;
    nombre: string;
    soloLectura: boolean;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toUsuarios(json: string): Usuarios_admins[] {
        return JSON.parse(json);
    }

    public static usuariosToJson(value: Usuarios_admins[]): string {
        return JSON.stringify(value);
    }
}
