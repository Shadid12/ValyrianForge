import { useQuery } from "@tanstack/react-query";
import { RecordResponse } from "../apis/types";
import RecordsApi from "../apis/RecordsApi";

/**
 * Custom hook to fetch records for a specific table using React Query with pagination.
 * @param tableName - The name of the table to fetch records from.
 * @param page - The page number for pagination (default is 1).
 * @param limit - The number of records per page (default is 10).
 * @returns A React Query result containing the fetched records and pagination data.
 */
export const useGetRecords = (
  tableName: string | undefined,
  page: number = 1,
  limit: number = 10
) => {
  // Ensure tableName is valid
  if (!tableName) {
    throw new Error("Table name is required.");
  }

  return useQuery<RecordResponse[], Error>({
    queryKey: ["records", tableName, page, limit], // Unique query key with pagination
    queryFn: () => RecordsApi.getRecords(tableName, page, limit), // Fetch function with pagination
    staleTime: 300000, // Cache results for 5 minutes
    retry: 2, // Retry failed queries twice
  });
};
