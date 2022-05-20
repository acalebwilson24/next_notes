import { useState, useEffect } from "react";
import { useGetNoteQuery, useCreateNoteMutation, useUpdateNoteMutation, useDeleteNoteMutation } from "../../../redux/noteApi";
import { InflatedNote } from "../../../redux/types";
import { inflateNote, serialiseNote, getDefaultInflatedNote, areNotesEqual, isBlankNote } from "../../../utils/note";

function useNoteEditor() {
    const [noteID, setNoteID] = useState<number>()
    const [noteToEdit, _setNote] = useState<InflatedNote>()
    const [originalNote, setOriginalNote] = useState<InflatedNote>();
    const [showEditor, setShowEditor] = useState(false);
    const { data: note, isLoading, isFetching } = useGetNoteQuery(noteID, { skip: !noteID })

    // handles note selection
    useEffect(() => {
        if (note && noteID) {
            const inflatedNote = inflateNote(note);
            // prevents error when tying to set an old copy of the note
            // if the update request was slow
            if (!noteToEdit || inflatedNote.id !== noteToEdit.id) {
                _setNote(inflatedNote);
            }
            setOriginalNote(inflatedNote)
            setShowEditor(true);
        }
    }, [note, noteID])


    const [createNote, { isSuccess: noteCreated, data: newNote }] = useCreateNoteMutation();
    const [updateNote, { isLoading: isUpdating, isSuccess: isUpdated, data: updatedNote }] = useUpdateNoteMutation();
    const [deleteNote] = useDeleteNoteMutation();

    // automatic saving
    const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);

    function saveNoteWithTimeout(noteToSave: InflatedNote) {
        if (saveTimeout) {
            clearTimeout(saveTimeout);
        }

        if (!originalNote || !areNotesEqual(noteToSave, originalNote)) {
            const timeout = setTimeout(() => {
                updateNote(serialiseNote(noteToSave));
            }, 1000);
            setSaveTimeout(timeout);
        }
    }

    useEffect(() => {
        if (updatedNote) {
            setOriginalNote(inflateNote(updatedNote));
        }
    }, [updatedNote])

    // wrapper for _setNote with automatic saving
    const setNote = (note: InflatedNote | undefined) => {
        // update note
        _setNote(note);
        note && saveNoteWithTimeout({ ...note });
    }

    const createBlankNote = () => {
        if (noteToEdit && isBlankNote(noteToEdit)) {
            setShowEditor(true);
            return;
        }
        setNoteID(undefined);
        const newNote = {
            ...getDefaultInflatedNote()
        }
        createNote(serialiseNote(newNote));
        setShowEditor(true);
    }

    function openNote(noteID: number) {
        // check if a note is already open
        if (noteID) {
            closeNote();
        }
        setNoteID(noteID);
    }

    function closeNote() {
        if (noteToEdit && isBlankNote(noteToEdit)) {
            console.log("deleting")
            deleteNote(serialiseNote(noteToEdit))
        } else if (noteID && noteToEdit) {
            saveTimeout && clearTimeout(saveTimeout);
            // checks if note has actually changed
            if (originalNote && !areNotesEqual(originalNote, noteToEdit)) {
                noteToEdit && updateNote(serialiseNote(noteToEdit));
            }
        }

        setNoteID(undefined);
        showEditor && setShowEditor(false);
    }

    // checks if not is created then opens note
    useEffect(() => {
        if (noteCreated && newNote) {
            setNoteID(newNote.id);
        }
    }, [noteCreated, newNote])

    return {
        showEditor,
        noteID,
        openNote,
        createBlankNote,
        closeNote,
        noteToEdit,
        setNote,
        deleteNote,
        updateNote,
        isLoading,
        isFetching
    }
}

export default useNoteEditor;