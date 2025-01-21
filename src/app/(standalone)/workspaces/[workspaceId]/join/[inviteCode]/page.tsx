import { getCurrent } from "@/features/auth/queries";
import { JoinWorkespaceForm } from "@/features/workspaces/components/join-workspaces-form";
import { getWorkspaceInfo } from "@/features/workspaces/queries";
import { redirect } from "next/navigation";

interface WorkspaceIdJoinPageProps {
  params: {
    workspaceId: string;
    inviteCode: string;
  };
}

const WorkspaceIdJoinPage = async ({ params }: WorkspaceIdJoinPageProps) => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  const initialValues = await getWorkspaceInfo({
    workspaceId: params.workspaceId,
    inviteCode: params.inviteCode,
  });

  if (!initialValues) {
    redirect("/");
  }

  return (
    <div className="w-full lg:max-w-xl">
      <JoinWorkespaceForm initialValues={initialValues} />
    </div>
  );
};

export default WorkspaceIdJoinPage;
