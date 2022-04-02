// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Note, Prisma, PrismaClient, Tag, User } from '@prisma/client'
import { convertFromRaw } from 'draft-js';
import type { NextApiRequest, NextApiResponse } from 'next'
import { Session } from 'next-auth';
import { getSession } from 'next-auth/react';
import { prisma } from '../../../prisma/client';
import { NoteAPIRequest, NoteAPIResponse } from '../../../redux/types';

export async function getAuth(req: NextApiRequest) {
    if (req.headers.postman_token == process.env.POSTMAN_TOKEN) {
        console.log("postman")
        const userID = 1;
        const user = await prisma.user.findUnique({
            where: { id: userID }
        });

        if (!user) {
            return { session: null, userID: null }
        }
        const session: Session = {
            user: {
                ...user,
                name: user.name || "",
                email: user.email || ""
            },
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString()
        }

        return { userID, session }
    }


    let userID;
    const session = await getSession({ req });

    if (!session) {
        return { session: null, userID: null }
    }

    userID = session.user.id
    return { userID, session }
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<NoteAPIResponse[] | NoteAPIResponse | { error: string }>
) {
    const { userID, session } = await getAuth(req);
    if (!userID) {
        return res.status(401).json({ error: "Unauthorised" })
    }

    if (req.method === "GET") {
        // return a users notes
        const notes = await getNotes(userID, {
            search: (req.query.search as string || "").toLowerCase(),
            tags: parseTags(req.query.tag)
        });

        if (!notes) {
            return res.status(404).json({ error: "No notes found" })
        }

        return res.send(notes);
    }

    if (req.method === "POST") {
        // create new note

        const noteData = req.body as NoteAPIRequest;

        try {
            checkNoteBody(noteData);
        } catch (error) {
            return res.status(400).json({ error: (error as Error).message })
        }

        const note = await createNote(noteData, userID);
        if (note) {
            return res.status(201).json(note);
        } else {
            return res.status(500).json({ error: "Error creating note" })
        }
    }

    return res.status(400).json({ error: "Bad request" })
}

type GetNotesOptions = {
    search?: string
    tags?: string[]
}

const notesOptionsDefault: GetNotesOptions = {
    search: "",
    tags: []
}

async function getNotes(userID: number, options = notesOptionsDefault): Promise<NoteAPIResponse[] | undefined> {
    const { search, tags } = options;

    const where: Prisma.NoteWhereInput = {
        authorID: userID,
        AND: tags ? [
            ...tags.map(tag => ({
                tags: {
                    some: {
                        name: tag
                    }
                }
            })) 
        ] : undefined
    }

    const unsearchedNotes = await prisma.note.findMany({
        where,
        include: {
            tags: getPrismaTagNames()
        },
        orderBy: [
            {
                createdAt: "desc"
            }
        ]
    }).then(notes => notes.filter(n => (tags && tags.length > 0) ? n.tags.length > 0 : true).map(n => mapNoteToResponse(n)));

    return searchNotes(unsearchedNotes, search || "");
}

async function createNote(note: NoteAPIRequest, userID: number): Promise<NoteAPIResponse | undefined> {
    // find which tags exists, and which need creating
    const { tags } = note;
    const currentTags = (await Promise.all(tags.map(mapTags))).filter(tag => tag !== undefined) as Tag[];
    const newTags = tags.filter(tag => !currentTags.some(currentTag => currentTag.name === tag));

    const { title, content } = note;
    const author = await prisma.user.findUnique({ where: { id: userID } });
    if (!author) {
        return;
    }

    const noteData: Prisma.NoteCreateInput = {
        author: {
            connect: { id: userID }
        },
        title,
        content,
        tags: {
            connect: currentTags.map(tag => ({ id: tag.id })),
            create: [
                ...newTags.map(tag => ({ name: tag }))
            ]
        }
    }
    const newNote = await prisma.note.create({
        data: noteData,
        include: {
            tags: getPrismaTagNames()
        }
    }).then(res => {
        if (res) {
            return mapNoteToResponse(res);
        }
    })

    return newNote;
}

// Utils

export function parseTags(tags: string | string[]) {
    if (typeof tags === "string") {
        return [tags];
    }

    return tags;
}

export function mapNoteToResponse(note: Note & { tags: { name: string }[] }): NoteAPIResponse {
    return {
        ...note,
        tags: note.tags.map(t => t.name),
        updatedAt: note.updatedAt.toISOString(),
        createdAt: note.createdAt.toISOString()
    }
}

export function searchNotes(notes: NoteAPIResponse[], search: string) {
    return notes.filter(note => {
        return searchNote(note, search);
    })
}

export function searchNote(note: NoteAPIResponse, search: string) {
    if (!search) {
        return true;
    }
    const title = note.title ? convertFromRaw(JSON.parse(note.title || "")).getPlainText().toLowerCase() : "";
    const content = note.title ? convertFromRaw(JSON.parse(note.content || "")).getPlainText().toLowerCase() : "";
    if (title && content) {
        return title.includes(search) || content.includes(search);
    } else if (title) {
        return title.includes(search)
    } else if (content) {
        return content.includes(search)
    } else {
        return false;
    }
}

export function getPrismaTagNames() {
    const selectTags: Prisma.TagFindManyArgs = {
        select: {
            name: true
        },
        orderBy: {
            name: "asc"
        }
    }
    return selectTags;
}

export async function mapTags(tag: string) {
    const currentTag = await prisma.tag.findUnique({
        where: { name: tag }
    })
    if (currentTag) {
        return currentTag;
    }
}

export function checkNoteBody(note: NoteAPIRequest) {
    if (!note.title) {
        throw new Error("Title is required");
    }
    if (!note.content) {
        throw new Error("Content is required");
    }
    return note;
}