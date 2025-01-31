import { Button } from "@/components/ui/button";
import { getCurrent } from "@/features/auth/queries";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { getProject } from "@/features/projects/queries";
import { PenIcon } from "lucide-react";
import Link from "next/link";

import { redirect } from "next/navigation";

interface ProjectIdPageProps {
  params: {
    projectId: string;
  };
}

const ProjectIdPage = async ({ params }: ProjectIdPageProps) => {
  const user = getCurrent();
  if (!user) redirect("/sign-in");

  const intialValues = await getProject({ projectId: params.projectId });

  if (!intialValues) {
    throw new Error("Project not found");
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ProjectAvatar
            name={intialValues.name}
            image={intialValues.imageUrl}
            className="szie-8"
          />
          <p className="text-lg font-semibold">{intialValues.name}</p>
        </div>
        <div>
          <Button variant="secondary" size="sm" asChild>
            <Link
              href={`/workspaces/${intialValues.workspaceId}/projects/${intialValues.$id}/setting`}
            >
              <PenIcon className="size-4 mr-2" />
              Edit Project
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectIdPage;
