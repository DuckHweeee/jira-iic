import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { toast } from "sonner";
import { client } from "@/lib/rpc";
import { MemberRole } from "../types";

type ResponseType = InferResponseType<
  (typeof client.api.members)[":memberId"]["$delete"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.members)[":memberId"]["$delete"]
>;

export const useDeleteMember = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const respone = await client.api.members[":memberId"]["$delete"]({
        param,
        json: { role: MemberRole.MEMBER }, // Adjust the role value as needed
      });

      if (!respone.ok) {
        throw new Error("Failed to delete member");
      }

      return await respone.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Member deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["members"] });
      queryClient.invalidateQueries({ queryKey: ["member", data.$id] });
    },
    onError: () => {
      toast.error("Failed to delete member");
    },
  });

  return mutation;
};
