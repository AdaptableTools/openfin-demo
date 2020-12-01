import type { Price } from "../data/prices";
import type { Trade } from "../data/trades";
import type { Position } from "../data/position";

export type CellEditAudit<T extends Price | Position | Trade> = {
    audit_trigger: string;
    username: string;
    client_timestamp: string;
    data_change_details: {
        column_id: string,
        new_value: string;
        previous_value: string;
        row_data: T
    }

}