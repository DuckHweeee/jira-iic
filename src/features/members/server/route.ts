import { createAdminClient } from "@/lib/appwrite";
import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { getMember } from "../util";
import { Query } from "node-appwrite";
import { DATABASE_ID, MEMBERS_ID } from "@/config";
import { MemberRole } from "../types";
import { error } from "console";

const app = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator("query", z.object({ workspaceId: z.string() })),
    async (c) => {
      const { users } = await createAdminClient();
      const databases = c.get("databases");
      const user = c.get("user");
      const { workspaceId } = c.req.valid("query");

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
        Query.equal("workspaceId", workspaceId),
      ]);

      const populatedMemebers = await Promise.all(
        members.documents.map(async (member) => {
          const user = await users.get(member.userId);
          return { ...member, name: user.name, email: user.email };
        })
      );

      return c.json({ ...members, documents: populatedMemebers });
    }
  )
  .delete(
    "/:memberId",
    sessionMiddleware,
    zValidator("json", z.object({ role: z.nativeEnum(MemberRole) })),
    async (c) => {
      const { memberId } = c.req.param();
      const { role } = c.req.valid("json");
      const user = c.get("user");
      const databases = c.get("databases");

      const memberToUpdate = await databases.getDocument(
        DATABASE_ID,
        MEMBERS_ID,
        memberId
      );

      const allMembersInWorkspace = await databases.listDocuments(
        DATABASE_ID,
        MEMBERS_ID,
        [Query.equal("workspaceId", memberToUpdate.workspaceId)]
      );

      const member = await getMember({
        databases,
        userId: user.$id,
        workspaceId: memberToUpdate.workspaceId,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      if (
        member.$id !== memberToUpdate.$id &&
        member.role !== MemberRole.ADMIN
      ) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      if (allMembersInWorkspace.total === 1) {
        return c.json(
          { error: "Cannot delete the last member in the workspace" },
          400
        );
      }

      await databases.updateDocument(DATABASE_ID, MEMBERS_ID, memberId, {
        role,
      });
      return c.json({ data: { $id: memberToUpdate.$id } });
    }
  )
  .patch(
    ":/memberId",
    sessionMiddleware,
    zValidator("json", z.object({ role: z.nativeEnum(MemberRole) })),
    async (c) => {
      const { memberId } = c.req.param();
      const { role } = c.req.valid("json");
      const user = c.get("user");                                            
      const databases = c.get("databases");

      const memberToUpdate = await databases.getDocument(
        DATABASE_ID,
        MEMBERS_ID,
        memberId
      );

      const member = await getMember({
        databases,
        userId: user.$id,
        workspaceId: memberToUpdate.workspaceId,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      if (
        member.$id !== memberToUpdate.$id &&
        member.role !== MemberRole.ADMIN
      ) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      await databases.updateDocument(DATABASE_ID, MEMBERS_ID, memberId, {
        role,
      });

      return c.json({ data: { $id: memberToUpdate.$id } });
    }
  );

export default app;
