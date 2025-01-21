import Image from "next/image";

import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface WorkspaceAvatarProps {
  image?: string;
  name: string;
  className?: string;
}

export const WorkspaceAvatar = ({
  image,
  name,
  className,
}: WorkspaceAvatarProps) => {
  if (image) {
    <div
      className={cn("size-10 relative rounded-full overflow-hidden", className)}
    >
      <Image src={image} alt={name} fill className="object-cover" />
    </div>;
  }
  return (
    <Avatar>
      <AvatarFallback className="text-white bg-blue-600 font-semibold text-lg uppercase">
        {name[0]}
      </AvatarFallback>
    </Avatar>
  );
};
