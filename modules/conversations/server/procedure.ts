import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import prisma from "@/lib/prisma";

export const conversationsRouter = createTRPCRouter({
  // Get all conversations for the authenticated user
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.auth.user.id;

    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: { userId },
        },
      },
      orderBy: {
        lastMessageAt: "desc",
      },
      select: {
        id: true,
        title: true,
        type: true,
        createdAt: true,
        updatedAt: true,
        lastMessageAt: true,

        // creator
        createdBy: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },

        // participants + each user data
        participants: {
          select: {
            id: true,
            role: true,
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },

        // latest message
        messages: {
          take: 1,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            content: true,
            createdAt: true,
            sender: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },

        // number of messages (optional but useful)
        _count: {
          select: {
            messages: true,
          },
        },
      },
    });

    return conversations;
  }),

  createDirect: protectedProcedure
    .input(
      z.object({
        targetUserId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.auth.user.id;
      const { targetUserId } = input;

      if (userId === targetUserId) {
        throw new Error("You cannot create a conversation with yourself.");
      }

      // 1️⃣ Check if a direct conversation already exists
      const existing = await prisma.conversation.findFirst({
        where: {
          type: "DIRECT",
          participants: {
            every: {
              userId: { in: [userId, targetUserId] },
            },
          },
        },
        select: { id: true },
      });

      if (existing) {
        return existing;
      }

      // 2️⃣ Create a new direct conversation
      const conversation = await prisma.conversation.create({
        data: {
          type: "DIRECT",
          createdById: userId,
          lastMessageAt: new Date(),

          participants: {
            create: [
              {
                userId,
                role: "MEMBER",
              },
              {
                userId: targetUserId,
                role: "MEMBER",
              },
            ],
          },
        },
        select: {
          id: true,
        },
      });

      return conversation;
    }),

    getById: protectedProcedure
  .input(
    z.object({
      conversationId: z.string(),
    })
  )
  .query(async ({ ctx, input }) => {
    
    const userId = ctx.auth.user.id;

    // Check if the user is part of the conversation
    const isParticipant = await prisma.participant.findFirst({
      where: {
        conversationId: input.conversationId,
        userId,
      },
    });

    if (!isParticipant) {
      throw new Error("You are not allowed to access this conversation");
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: input.conversationId },
      include: {
        participants: {
          include: {
            user: true,
          },
        },
        messages: {
          include: {
            sender: true,
          },
          orderBy: { createdAt: "desc" },
          take: 30,
        },
      },
    });

    return conversation;
  }),
});
