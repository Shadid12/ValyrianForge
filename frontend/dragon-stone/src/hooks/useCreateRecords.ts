import { useMutation, useQueryClient } from "@tanstack/react-query";
import RecordsApi from "../apis/RecordsApi";

interface UseCreateRecordsProps {
  tableName: string;
  onSuccess: () => void; // Callback to close the drawer on success
  onError?: (error: any) => void; // Optional error callback
}

const useCreateRecords = ({ tableName, onSuccess, onError }: UseCreateRecordsProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { [key: string]: string | number | boolean }) => {
      return RecordsApi.createRecord(tableName, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["records", tableName] });
      onSuccess();
    },
    onError,
  });
};

export default useCreateRecords;
