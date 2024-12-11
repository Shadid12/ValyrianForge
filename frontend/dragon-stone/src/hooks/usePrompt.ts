import { useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import Llm from '../apis/LlmApi';

type CollectionDetails = {
  columns: Array<{ name: string; type: string }>;
};

type ApiResponse = {
  data: string[];
};

type UsePromptArgs = {
  prompt: string;
  collectionDetails: CollectionDetails;
};

type PurifiedResponse = string;

const purifyResponse = (response: ApiResponse): PurifiedResponse => {
  const rawSql = response.data[0] || "";
  const match = rawSql.match(/```sql\n([\s\S]*?)\n```/);
  return match ? match[1].trim() : "";
};

const usePrompt = ({ onSuccess, onError }: { onSuccess: (response: PurifiedResponse) => void; onError?: (error: any) => void }): UseMutationResult<PurifiedResponse, Error, UsePromptArgs> => {
  const queryClient = useQueryClient();

  return useMutation<PurifiedResponse, Error, UsePromptArgs>({
    mutationFn: async ({ prompt, collectionDetails }: UsePromptArgs) => {
      const tableInfo = collectionDetails?.columns
        .map((col) => `${col.name} (${col.type})`)
        .join(', ');

      const enhancedPrompt = `Based on the following table structure: ${tableInfo}, ${prompt}`;
      const response = await Llm.executePrompt({ q: enhancedPrompt });
      return purifyResponse(response);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['promptResults'] });
      onSuccess(response);
    },
    onError,
  });
};

export default usePrompt;