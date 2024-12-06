import { RecordData, RecordResponse, UpdateRecordData } from "./types"; // Define types in a types file

class RecordsApi {
  private static baseUrl: string = "http://localhost:4000/api/records";

  /**
   * Create a new record for a specific table.
   * @param tableName - Name of the table.
   * @param data - The data to create the record.
   * @returns A promise resolving to the created record response.
   */
  static async createRecord(
    tableName: string,
    data: RecordData
  ): Promise<RecordResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/${tableName}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data }),
      });

      if (!response.ok) {
        throw new Error(`Error creating record: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to create record:", error);
      throw error;
    }
  }

    /**
     * Fetch all records for a specific table with optional pagination.
     * @param tableName - Name of the table.
     * @param page - The page number (default is 1).
     * @param limit - The number of records per page (default is 10).
     * @returns A promise resolving to the list of records.
     */
    static async getRecords(
    tableName: string,
    page: number = 1,
    limit: number = 10
    ): Promise<RecordResponse[]> {
    try {
        const queryParams = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
        const response = await fetch(`${this.baseUrl}/${tableName}?${queryParams}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        });

        if (!response.ok) {
        throw new Error(`Error fetching records: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to fetch records:", error);
        throw error;
    }
    }

  /**
   * Fetch a specific record by ID.
   * @param tableName - Name of the table.
   * @param id - ID of the record.
   * @returns A promise resolving to the specific record.
   */
  static async getRecordById(
    tableName: string,
    id: string | number
  ): Promise<RecordResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/${tableName}/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching record by ID: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to fetch record by ID:", error);
      throw error;
    }
  }

  /**
   * Update a specific record by ID.
   * @param tableName - Name of the table.
   * @param id - ID of the record to update.
   * @param data - The updated data for the record.
   * @returns A promise resolving to the updated record response.
   */
  static async updateRecord(
    tableName: string,
    id: string | number,
    data: UpdateRecordData
  ): Promise<RecordResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/${tableName}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data }),
      });

      if (!response.ok) {
        throw new Error(`Error updating record: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to update record:", error);
      throw error;
    }
  }
}

export default RecordsApi;
