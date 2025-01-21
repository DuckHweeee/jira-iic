import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { toast } from "sonner";
import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<(typeof client.api.projects)["$post"], 200>;
type RequestType = InferRequestType<(typeof client.api.projects)["$post"]>;

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form }) => {
      const respone = await client.api.projects["$post"]({
        form,
      });

      if (!respone.ok) {
        throw new Error("Failed to create project");
      }

      return await respone.json();
    },
    onSuccess: () => {
      toast.success("Project created successfully");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: () => {
      toast.error("Failed to create project");
    },
  });

  return mutation;
};
