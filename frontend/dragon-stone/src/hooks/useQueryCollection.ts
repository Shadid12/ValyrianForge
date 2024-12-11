import { useQuery, UseQueryResult } from '@tanstack/react-query';
import QueriesApi from '../apis/QueriesApi';
import { QueryResponse } from '../apis/types';

export const useQueryCollection = (query: string): UseQueryResult<QueryResponse, Error> => {
  const fetchQuery = async (): Promise<QueryResponse> => {
    return await QueriesApi.getQuery(query);
  };

  return useQuery<QueryResponse, Error>({
    queryKey: ['queryCollection', query],
    queryFn: fetchQuery,
  });
};
