import { Note } from "@prisma/client";
import { EditorState, convertFromRaw, RawDraftContentState, convertToRaw } from "draft-js";
import { Descendant, Node } from "slate";
import { SerialisedNote } from "../redux/noteApi";
import { InflatedNote, NoteAPIRequest, NoteAPIResponse } from "../redux/types";

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

export function inflateNote(note: NoteAPIResponse): InflatedNote {
    let newNote: InflatedNote;
    newNote = {
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt),
        title: note.title ? JSON.parse(note.title) as Descendant[] : [],
        content: note.content ? JSON.parse(note.content) : [],
    }
    return newNote;
}

export function serialiseNote(note: InflatedNote): NoteAPIRequest {
    let newNote: NoteAPIRequest = {
        ...note,
        title: JSON.stringify(note.title),
        content: JSON.stringify(note.content)
    }
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
        title: [{ type: "paragraph", children: [{ text: "" }] }],
        content: [{ type: "paragraph", children: [{ text: "" }] }],
        tags: []
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

export function inflateNotes(notes: NoteAPIResponse[]) {
    return notes.filter(n => n.title && isJSONStr(n.title)).map(n => inflateNote(n));
}

export function serialiseDescendants(descendants: Descendant[]) {
    return descendants.map(n => Node.string(n)).join('\n');
}

export function serialise(content: Descendant[]) {
    return content.map(n => Node.string(n)).join('\n')
}


export function areNotesEqual(note: InflatedNote, other: InflatedNote) {
    const areEqual = areSlateStatesEqual(note.title, other.title) && areSlateStatesEqual(note.content, other.content) && areArraysEqual(note.tags, other.tags)
    return areEqual
}

export function areSlateStatesEqual(state1: Descendant[], state2: Descendant[]) {
    return serialise(state1) === serialise(state2)
}

export function isBlankNote(note: InflatedNote) {
    return serialise(note.title).length === 0 && serialise(note.content).length === 0
}

function areArraysEqual(array1: string[] | undefined, array2: string[] | undefined) {
    if (!array1 || !array2) {
        return false;
    }
    const arr1 = [...array1];
    const arr2 = [...array2]
    if (arr1.sort().join(',') === arr2.sort().join(',')) {
        return true
    }
    return false
}