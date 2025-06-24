// To parse this data:
//
//   import { Convert } from "./file";
//
//   const qrs = Convert.toQrs(json);

export interface Qrs {
    id:         string;
    qr_code:    string;
    entidad_id: string;
    is_used:    boolean;
    created_at: Date;
    used_at:    Date;
    usuario:    string;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toQrs(json: string): Qrs[] {
        return JSON.parse(json);
    }

    public static qrsToJson(value: Qrs[]): string {
        return JSON.stringify(value);
    }
}
