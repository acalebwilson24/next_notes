import { Note } from "@prisma/client";
import { EditorState } from "draft-js";

export type InflatedNote = Pick<Note, "id" | "authorID" | "createdAt" | "updatedAt"> & {
    title: EditorState,
    content: EditorState
}