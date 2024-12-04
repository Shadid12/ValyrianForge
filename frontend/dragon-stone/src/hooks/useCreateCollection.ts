import { useMutation, useQueryClient, UseMutationResult } from "@tanstack/react-query";
import { Payload } from "../apis/types";
import CollectionsApi from "../apis/CollectionsApi";

export const useCreateCollection = (): UseMutationResult<
  { message: string }, // Success response type
  Error,               // Error type
  Payload              // Variables (Payload type)
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Payload) => {
      return await CollectionsApi.createTable(payload);
    },
    onSuccess: () => {
      // Invalidate the `collections` query to refetch updated data
      queryClient.invalidateQueries({ queryKey: ["collections"] });
    },
  });
};
