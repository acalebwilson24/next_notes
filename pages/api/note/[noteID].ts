// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Note, Prisma, PrismaClient, User } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';
import { checkNoteBody, getAuth, getPrismaTagNames, mapNoteToResponse } from '.';
import { prisma } from '../../../prisma/client';
import { NoteAPIRequest, NoteAPIResponse } from '../../../redux/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<NoteAPIResponse | Note | { error: string }>
) {
    const { userID, session } = await getAuth(req);
    if (!userID) {
        return res.status(401).json({ error: "Unauthorised" })
    }

    if (req.method == "GET") {
        const noteID = parseInt(req.query.noteID as string);
        const note = await prisma.note.findUnique({
            where: { id: noteID },
            include: {
                tags: getPrismaTagNames()
            }
        }).then(note => note && mapNoteToResponse(note));

        if (note) {
            return res.status(200).json(note);
        } 
        return res.status(404).json({ error: "Note not found" });
    }

    if (req.method == "PUT") {
        const note: NoteAPIRequest = req.body;

        try {
            checkNoteBody(note);
        } catch (error) {
            return res.status(400).json({ error: (error as Error).message });   
        }

        const updatedNote = await updateNote(note, userID);

        if (updatedNote) {
            return res.status(200).json(updatedNote);
        } else {
            return res.status(500).json({ error: "Error updating note" });
        }
    }

    if (req.method == "DELETE") {
        const noteID = parseInt(req.query.noteID as string);

        const note = await prisma.note.delete({
            where: {
                id: noteID
            }
        });

        return res.status(200).json(note);
    }

    return res.status(400).json({ error: "Bad request" });
}

async function updateNote(note: NoteAPIRequest, userID: number): Promise<NoteAPIResponse | undefined | void> {
    const { id, title, content, tags } = note;

    const currentTags = await prisma.tag.findMany({ 
        where: {
            name: {
                in: tags
            }
        }
    });
    const prevTags = await prisma.tag.findMany({
        where: {
            notes: {
                some: {
                    id
                }
            }
        }
    });
    const tagsToRemove = prevTags.filter(tag => !currentTags.some(t => t.id == tag.id));
    const newTags = tags.filter(tag => !currentTags.find(t => t.name == tag));

    const noteData: Prisma.NoteUpdateInput = {
        title,
        content,
        tags: {
            connect: currentTags.map(tag => ({ id: tag.id })),
            disconnect: tagsToRemove.map(tag => ({ id: tag.id })),
            create: newTags.map(tag => ({ name: tag }))
        }
    }

    const updatedNote = await prisma.note.update({
        where: {
            id
        },
        data: noteData,
        include: {
            tags: getPrismaTagNames()
        }
    }).then(mapNoteToResponse)

    return updatedNote;
}
