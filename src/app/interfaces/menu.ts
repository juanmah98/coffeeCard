// To parse this data:
//
//   import { Convert } from "./file";
//
//   const menu = Convert.toMenu(json);

export interface Menu {
    id:   number;
    menu: string;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toMenu(json: string): Menu[] {
        return JSON.parse(json);
    }

    public static menuToJson(value: Menu[]): string {
        return JSON.stringify(value);
    }
}
