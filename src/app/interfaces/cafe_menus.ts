// To parse this data:
//
//   import { Convert } from "./file";
//
//   const cafeMenus = Convert.toCafeMenus(json);

export interface CafeMenus {
    id:       number;
    nombre:   string;
    precio:   string;
    precio_m: null | string;
    precio_g: null | string;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toCafeMenus(json: string): CafeMenus[] {
        return JSON.parse(json);
    }

    public static cafeMenusToJson(value: CafeMenus[]): string {
        return JSON.stringify(value);
    }
}
