// To parse this data:
//
//   import { Convert } from "./file";
//
//   const cafeMenus = Convert.toCafeMenus(json);

export interface Extras {
    id:       number;
    nombre:   string;
    estado:   boolean;
    precio:   string;

}

// Converts JSON strings to/from your types
export class Convert {
    public static toCafeMenus(json: string): Extras[] {
        return JSON.parse(json);
    }

    public static cafeMenusToJson(value: Extras[]): string {
        return JSON.stringify(value);
    }
}
