import { Note } from "@prisma/client";
import { EditorState } from "draft-js";

export type InflatedNote = Pick<Note, "id" | "authorID" | "createdAt" | "updatedAt"> & {
    title: EditorState,
    content: EditorState
} & { tags: string[] }

export type NoteAPIResponse = Omit<Note, "createdAt" | "updatedAt"> & { tags: string[], createdAt: string, updatedAt: string }
export type NoteAPIRequest = Omit<NoteAPIResponse, "createdAt" | "updatedAt">;
export type NoteAPICreateRequest = Omit<NoteAPIResponse, "id" | "createdAt" | "updatedAt" | "authorID">
export type TagAPIResponse = { tag: string, count: number }