// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Note, PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../prisma/client';

type Data = {
  note: Note
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Note | string>
) {
    const { id } = req.query;

    if (!(typeof id == "string")) {
        return res.send("Invalid ID")
    }

    const note = await prisma.note.findUnique({
        where: {
            id: parseInt(id)
        }
    })

    if (note) {
        return res.send(note);
    }
    return res.send("No Note");
}
