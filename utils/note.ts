import { Note } from "@prisma/client";
import { EditorState, convertFromRaw, RawDraftContentState, convertToRaw } from "draft-js";
import { SerialisedNote } from "../redux/noteApi";
import { InflatedNote } from "../redux/types";

export function createEditorStateFromString(state: string) {
    try {
        return EditorState.createWithContent(convertFromRaw(JSON.parse(state) as RawDraftContentState))
    } catch (error) {
        console.error(error);
    }
}

export function convertEditorStateToString(state: EditorState) {
    return JSON.stringify(convertToRaw(state.getCurrentContent()));
}

export function inflateNote(note: SerialisedNote) {
    let newNote: InflatedNote;
    newNote = {
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt),
        title: note.title ? createEditorStateFromString(note.title) || EditorState.createEmpty() : EditorState.createEmpty(),
        content: note.content ? createEditorStateFromString(note.content) || EditorState.createEmpty() : EditorState.createEmpty(),
    }
    return newNote;
}

export function serialiseNote(note: InflatedNote) {
    let newNote = {
        ...note,
        title: convertEditorStateToString(note.title),
        content: convertEditorStateToString(note.content)
    } as Note
    return newNote;
}

export function serialiseNoteFromDB(note: Note) {
    return {
        ...note,
        createdAt: note.createdAt.toString(),
        updatedAt: note.createdAt.toString()
    };
}

export function getDefaultInflatedNote() {
    return {
        id: -1,
        authorID: -1,
        createdAt: new Date(),
        updatedAt: new Date(),
        title: EditorState.createEmpty(),
        content: EditorState.createEmpty()
    } as InflatedNote
}

export function isJSONStr(str: string) {
    try {
        JSON.parse(str);
    } catch (error) {
        return false
    }
    return true;
}

export function inflateNotes(notes: SerialisedNote[]) {
    return notes.filter(n => n.title && isJSONStr(n.title)).map(n => inflateNote(n));
}