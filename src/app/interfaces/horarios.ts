// To parse this data:
//
//   import { Convert } from "./file";
//
//   const horarios = Convert.toHorarios(json);

export interface Horarios {
    id:          string;
    empleado_id: string;
    date:        string;
    entry:       string;
    exit:        string;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toHorarios(json: string): Horarios[] {
        return JSON.parse(json);
    }

    public static horariosToJson(value: Horarios[]): string {
        return JSON.stringify(value);
    }
}
