export interface UsuarioChart {
    fecha_creacion: string;
    pais: 'españa' | 'argentina';
}

// Converts JSON strings to/from your types
export class Convert {
    public static toUsuarios(json: string): UsuarioChart[] {
        return JSON.parse(json);
    }

    public static usuariosToJson(value: UsuarioChart[]): string {
        return JSON.stringify(value);
    }
}
