class Llm {
  private static baseUrl: string = "http://localhost:4000/api/llm";

  static async executePrompt({ q }: { q: string }): Promise<{ data: string[] }> {
    try {
      const payload = { q };
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Error executing query: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to execute query:", error);
      throw error;
    }
  }
}

export default Llm;
