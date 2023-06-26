// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Note, PrismaClient, User } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';
import { prisma } from '../../../../prisma/client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Note[] | Note | string>
) {
    if (req.method === "GET") {
        // return a users notes
        const session = await getSession({ req });
        if (!session) {
            return res.status(401).send("Not logged in")
        }
        const notes = await prisma.note.findMany({
            where: {
                authorID: session.user.id
            },
            orderBy: [
                {
                    updatedAt: "desc"
                }
            ]
        })

        res.send(notes);
    } else if (req.method === "POST") {
        // create new note
        const session = await getSession({ req });

        if (!session) {
            return res.send("no");
        }

        const note = await prisma.note.create({
            data: {
                title: req.body.title || "",
                content: req.body.content || "",
                authorID: session.user.id
            }
        })

        res.send(note);
    } else if (req.method === "PUT") {
        // update note
        // check if user owns note
        const session = await getSession({ req })
        if (!session) {
            return res.send("no");
        }

        const oldNote = await prisma.note.findUnique({
            where: {
                id: parseInt(req.body.id)
            }
        })

        if (!oldNote) {
            return res.send("no")
        }

        if (oldNote.authorID !== session.user.id) {
            return res.send("unauthorised");
        }

        const newNote = await prisma.note.update({
            where: {
                id: parseInt(req.body.id)
            },
            data: req.body
        })

        res.send(newNote);
    } else if (req.method === "DELETE") {
        const session = await getSession({ req })
        if (!session) {
            return res.send("no");
        }

        const note = await prisma.note.findUnique({
            where: {
                id: parseInt(req.body.id)
            }
        });

        if (!note) {
            return res.send("No Note")
        }

        if (note.authorID !== session.user.id) {
            return res.send("Unauthorised");
        }

        const deletedNote = await prisma.note.delete({
            where: {
                id: parseInt(req.body.id)
            }
        })

        return res.send(deletedNote);

    }
}
