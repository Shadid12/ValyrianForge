import { CreateCollectionsPayload, GetTableByNameResponse, GetTablesResponse } from "./types";

class CollectionsApi {
  private static baseUrl: string = "http://localhost:4000/api/tables";

  /**
   * Fetch all tables.
   * @returns List of tables with their names.
   */
  static async getTables(): Promise<GetTablesResponse> {
    try {
      const response = await fetch(CollectionsApi.baseUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching tables: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to fetch tables:", error);
      throw error;
    }
  }

  /**
   * Fetch a specific table by name.
   * @param name - Name of the table to fetch.
   * @returns Table details, including columns and table name.
   */
  static async getTableByName(name: string): Promise<GetTableByNameResponse> {
    try {
      const response = await fetch(`${CollectionsApi.baseUrl}/${name}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching table "${name}": ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Failed to fetch table "${name}":`, error);
      throw error;
    }
  }

  /**
   * Create a new table with the predefined payload.
   */
  static async createTable(): Promise<{message: string } > {
    const payload: CreateCollectionsPayload = {
      table_name: "Doo",
      relationships: {},
      columns: {
        id: "INTEGER",
        name: "TEXT",
        description: "TEXT",
      },
    };

    try {
      const response = await fetch(CollectionsApi.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Error creating table: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to create table:", error);
      throw error;
    }
  }
}

export default CollectionsApi;
