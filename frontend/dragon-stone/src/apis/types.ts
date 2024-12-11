// Type for `getTables` response
export interface Table {
  name: string;
}

export interface GetTablesResponse {
  data: Table[];
}

// Type for `getTableByName` response
export interface Column {
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


// Types for record data
export interface RecordData {
  [key: string]: string | number | boolean; // Example dynamic input fields
}

export interface UpdateRecordData {
  [key: string]: string | number | boolean; // Example updated fields
}

// Response type for records
export interface RecordResponse {
  id: string | number;
  [key: string]: any; // Flexible for table-specific data
}

export interface QueryResponse {
  data: Array<Record<string, any>>; // Dynamic key-value pairs for each record
};

export interface PromptResponse {
  data: string[];
};