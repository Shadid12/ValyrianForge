import { QueryResponse } from "./types";

class QueriesApi {
  private static baseUrl: string = "http://localhost:4000/api/query";

  static async getQuery(query: string): Promise<QueryResponse> {
    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`Error fetching query: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to fetch query:", error);
      throw error;
    }
  }
}

export default QueriesApi;
