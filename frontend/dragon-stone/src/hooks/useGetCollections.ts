import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { Table } from "../apis/types";
import CollectionsApi from "../apis/CollectionsApi";

export const useGetCollections = (): UseQueryResult<Table[], Error> => {
  const fetchCollections = async (): Promise<Table[]> => {
    const { data } = await CollectionsApi.getTables();
    return data;
  };

  return useQuery<Table[], Error>({
    queryKey: ["collections"],
    queryFn: fetchCollections,
  });
};
