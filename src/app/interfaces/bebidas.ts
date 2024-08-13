// To parse this data:
//
//   import { Convert } from "./file";
//
//   const cafeMenus = Convert.toCafeMenus(json);

export interface Bebidas {
    id:       number;
    bebida:   string;
    precio:   string;

}

// Converts JSON strings to/from your types
export class Convert {
    public static toCafeMenus(json: string): Bebidas[] {
        return JSON.parse(json);
    }

    public static cafeMenusToJson(value: Bebidas[]): string {
        return JSON.stringify(value);
    }
}
