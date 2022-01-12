// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Note, PrismaClient, User } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';
import prisma from '../../../../prisma/client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Note | string>
) {
    const session = getSession({ req });
    if (!session) {
        res.send("No session")
    }

    const { id } = req.query;

    if (!(typeof id === "string")) {
        return res.send("Invalid id")
    }
    const note = await prisma.note.findUnique({
        where: {
            id: parseInt(id)
        }
    })

    if (!note) {
        return res.send("No Note");
    }

    return res.send(note);
}
