// To parse this data:
//
//   import { Convert } from "./file";
//
//   const empleados = Convert.toEmpleados(json);

export interface Empleados {
    id:     string;
    name: string;
    hourlyRate: number;
    activo: boolean;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toEmpleados(json: string): Empleados[] {
        return JSON.parse(json);
    }

    public static empleadosToJson(value: Empleados[]): string {
        return JSON.stringify(value);
    }
}
