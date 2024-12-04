import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { GetTablesResponse } from "../apis/types";
import CollectionsApi from "../apis/CollectionsApi";

export const useGetCollections = (): UseQueryResult<GetTablesResponse, Error> => {
  const fetchCollections = async (): Promise<GetTablesResponse> => {
    return await CollectionsApi.getTables();
  };

  return useQuery<GetTablesResponse, Error>({
    queryKey: ["collections"],
    queryFn: fetchCollections,
  });
};
