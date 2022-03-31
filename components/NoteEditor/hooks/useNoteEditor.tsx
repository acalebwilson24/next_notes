import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import useGetInflatedNotes from "../../../hooks/useGetInflatedNotes/useGetInflatedNotes";
import useRedirectAnon from "../../../hooks/useRedirectAnon";
import { useCreateNoteMutation, useUpdateNoteMutation, useGetNoteQuery, useDeleteNoteMutation, useGetNotesQuery } from "../../../redux/noteApi";
import { InflatedNote } from "../../../redux/types";
import { getDefaultInflatedNote, inflateNote, inflateNotes, serialiseNote } from "../../../utils/note";

// on navigate to desktop, create new note for editor, unless id is set in which case fetch note
// on navigate to mobile, create no note, wait for selection or new note button, or id is set in which case fetch note and switch to editor

export function useNoteSearch() {
    const [search, setSearch] = useState("")
    const [tags, setTags] = useState<string[]>([]);

    return {
        search,
        setSearch,
        tags,
        setTags
    }
}

type UseNoteEditorParams = {
    id?: number,
    newNote?: boolean,
    queryTags?: string[],
    search?: string
}

function useNoteEditor(params: UseNoteEditorParams) {
    const { id, newNote, queryTags, search } = params;

    // data
    const { data: notes, isLoading, isError } = useGetNotesQuery({ tags: queryTags, search });
    const { data: serialisedNote, isError: isNoteError } = useGetNoteQuery(id ? id : 0, { skip: !id });

    // mutations
    const [createNote, { isLoading: isCreating, isSuccess: isCreated, data: createdNote }] = useCreateNoteMutation();
    const [updateNote, { isLoading: isUpdating, isSuccess: isUpdated, data: updatedNote }] = useUpdateNoteMutation();
    const [deleteNoteAction, { isSuccess: isDeleted }] = useDeleteNoteMutation();

    // local note
    const [note, setNote] = useState<InflatedNote>();

    function createNewNote() {
        setNote(getDefaultInflatedNote());
    }

    function clearNote() {
        setNote(undefined);
    }

    // turns fetch data into inflated note
    useEffect(() => {
        if (!id && note && note.id !== -1) {
            clearNote();
            return
        }

        if (serialisedNote) {
            const inflatedNote = inflateNote(serialisedNote);
            if (inflatedNote) {
                setNote(inflatedNote)
            }
        } 
    }, [serialisedNote, isLoading, id])


    function saveNote() {
        if (!note) {
            return
        }
        const noteToSave = serialiseNote(note);
        if (note.id == -1) {
            return createNote(noteToSave);
        }
        updateNote(noteToSave);
    }

    function deleteNote() {
        if (!note) {
            return
        }
        
        const noteToDelete = serialiseNote(note);
        deleteNoteAction(noteToDelete);
    }

    function addTag(tag: string) {
        if (!note) {
            return
        }
        const newNote = { ...note, tags: [...note.tags, tag] };
        newNote.tags.sort();

        setNote(newNote);
    }

    function removeTag(tag: string) {
        if (!note) {
            return
        }

        const newNote = { ...note, tags: note.tags.filter(t => t !== tag) };
        newNote.tags.sort();

        setNote({ ...note, tags: note.tags.filter(t => t !== tag) })
    }

    return {
        isError,
        inflatedNotes: notes ? inflateNotes(notes) : [],
        areNotesLoading: isLoading,
        id,
        note,
        setNote,
        saveNote,
        deleteNote,
        createdNote,
        isDeleted,
        createNewNote,
        clearNote,
        isLoading,
        addTag,
        removeTag
    }
}

export default useNoteEditor;