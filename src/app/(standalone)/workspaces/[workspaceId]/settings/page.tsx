import { getCurrent } from "@/features/auth/actions";
import { EditWorkspaceForm } from "@/features/workspaces/components/edit-workspace-form";
import { redirect } from "next/navigation";

interface WorkspaceSettingPageProps {
  params: {
    workspaceId: string;
  };
}

const WorkspaceSettingPage = async ({ params }: WorkspaceSettingPageProps) => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  return (
    <div>
      <EditWorkspaceForm initalValue={undefined} />
    </div>
  );
};

export default WorkspaceSettingPage;
