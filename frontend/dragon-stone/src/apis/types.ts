// Type for `getTables` response
export interface Table {
  name: string;
}

export interface GetTablesResponse {
  data: Table[];
}

// Type for `getTableByName` response
interface Column {
  name: string;
  type: string;
}

export interface GetTableByNameResponse {
  columns: Column[];
  table_name: string;
}

// Type for the payload when creating a table
export type Payload = {
  table_name: string;
  relationships: Record<string, unknown>;
  columns: Record<string, string>;
};
