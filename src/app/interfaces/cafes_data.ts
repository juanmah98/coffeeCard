// To parse this data:
//
//   import { Convert } from "./file";
//
//   const cafeData = Convert.toCafeData(json);

export interface CafeData {
    id:              string;
    contador:        number;
    gratis:          boolean;
    opcion:          number;
    cantidad_gratis: number;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toCafeData(json: string): CafeData[] {
        return JSON.parse(json);
    }

    public static cafeDataToJson(value: CafeData[]): string {
        return JSON.stringify(value);
    }
}
