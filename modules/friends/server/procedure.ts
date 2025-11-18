import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import prisma from "@/lib/prisma";
import { FriendStatus } from "@/lib/generated/prisma/enums";
import { TRPCError } from "@trpc/server";

export const friendsRouter = createTRPCRouter({
  search: protectedProcedure
    .input(z.object({ q: z.string().min(1) }))
    .query(async ({ input, ctx }) => {
      const { q } = input;
      const currentUserId = ctx.auth.user.id;

      const users = await prisma.user.findMany({
        where: {
          AND: [
            {
              OR: [
                {
                  name: {
                    contains: q,
                    mode: "insensitive",
                  },
                },
                {
                  email: {
                    contains: q,
                    mode: "insensitive",
                  },
                },
              ],
            },
            {
              id: {
                not: currentUserId, // Exclude yourself
              },
            },
            {
              // Exclude users who have any friendship relationship with you
              NOT: {
                OR: [
                  {
                    // Where you sent them a friend request (you're the requester)
                    friendshipsReceived: {
                      some: {
                        requesterId: currentUserId,
                      },
                    },
                  },
                  {
                    // Where they sent you a friend request (you're the addressee)
                    friendshipsSent: {
                      some: {
                        addresseeId: currentUserId,
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        select: {
          id: true,
          name: true,
          image: true,
        },
      });

      return users;
    }),

  addFriend: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const requesterId = ctx.auth.user.id;
      const addresseeId = input.userId;

      if (requesterId === addresseeId) {
        throw new Error("You cannot add yourself.");
      }

      const existing = await prisma.friendship.findUnique({
        where: {
          requesterId_addresseeId: {
            requesterId,
            addresseeId,
          },
        },
      });

      const reverseExisting = await prisma.friendship.findUnique({
        where: {
          requesterId_addresseeId: {
            requesterId: addresseeId,
            addresseeId: requesterId,
          },
        },
      });

      if (
        (existing && existing.status === "ACCEPTED") ||
        (reverseExisting && reverseExisting.status === "ACCEPTED")
      ) {
        throw new Error("You are already friends.");
      }

      if (
        (existing && existing.status === "PENDING") ||
        (reverseExisting && reverseExisting.status === "PENDING")
      ) {
        throw new Error("Friend request already pending.");
      }

      const friendRequest = await prisma.friendship.create({
        data: {
          requesterId,
          addresseeId,
          status: "PENDING",
        },
      });

      return { success: true, friendRequest };
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.auth.user.id;

    const received = await prisma.friendship.findMany({
      where: {
        addresseeId: userId,
        status: FriendStatus.PENDING,
      },
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return received;
  }),

  acceptInvitation: protectedProcedure
    .input(z.object({ requestId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.auth.user.id;

      const invitation = await prisma.friendship.findUnique({
        where: { id: input.requestId },
      });

      console.log(invitation, "dkldl");

      if (!invitation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invitation not found",
        });
      }

      if (invitation.addresseeId !== userId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Not allowed" });
      }

      const updated = await prisma.friendship.update({
        where: { id: input.requestId },
        data: {
          status: "ACCEPTED",
        },
      });
      return {
        success: true,
        invitation: updated,
      };
    }),

  rejectInvitation: protectedProcedure
    .input(z.object({ requestId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.auth.user.id;
      const invitation = await prisma.friendship.findUnique({
        where: { id: input.requestId },
      });
      if (!invitation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invitation not found",
        });
      }

      if (invitation.addresseeId !== userId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Not allowed" });
      }

      const updated = await prisma.friendship.delete({
        where: { id: input.requestId },
      });

      return {
        success: true,
        invitation: updated,
      };
    }),

    getAllFriends: protectedProcedure
  .query(async ({ ctx }) => {
    const currentUserId = ctx.auth.user.id;

    const friendships = await prisma.friendship.findMany({
      where: {
        AND: [
          {
            OR: [
              { requesterId: currentUserId },
              { addresseeId: currentUserId },
            ],
          },
          {
            status: "ACCEPTED", // Only accepted friendships
          },
        ],
      },
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          },
        },
        addressee: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          },
        },
      },
    });

    // Transform to return only the friend (not yourself)
    const friends = friendships.map((friendship) => {
      const isSender = friendship.requesterId === currentUserId;
      return isSender ? friendship.addressee : friendship.requester;
    });

    return friends;
  }),
});
