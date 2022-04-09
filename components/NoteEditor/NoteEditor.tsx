import NoteEditorControls from "./NoteEditorControls";
import NoteEditorMain from "./NoteEditorMain";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/configureStore";
import { SerialisedNote, useCreateNoteMutation, useDeleteNoteMutation, useGetNoteQuery, useUpdateNoteMutation } from "../../redux/noteApi";
import { InflatedNote, NoteAPIRequest } from "../../redux/types";
import { getDefaultInflatedNote, inflateNote, serialiseNote } from "../../utils/note";
import { motion } from "framer-motion";
import { Descendant, Node } from "slate";
import { Note } from "@prisma/client";
import MoonLoader from 'react-spinners/MoonLoader'
import { original } from "@reduxjs/toolkit";


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

// need to break up logic into custom hooks
const NoteEditor: React.FC<{ id?: number, isSuccess: { (id?: number): void }, isDeleted: { (): void } }> = ({ id, isSuccess, isDeleted }) => {
    const [noteID, setNoteID] = useState<number>()
    const [noteToEdit, _setNote] = useState<InflatedNote>()
    const [originalNote, setOriginalNote] = useState<InflatedNote>();
    const [showEditor, setShowEditor] = useState(false);
    const mobile = useSelector((state: RootState) => state.mobile);

    const { data: note, isLoading, isFetching } = useGetNoteQuery(noteID, { skip: !noteID })

    // handles note selection
    useEffect(() => {
        if (note && noteID) {
            const inflatedNote = inflateNote(note);
            // prevents error where tying to set an old copy of the note
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

    const duration = mobile ? 200 : 0;

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

    const createNewNote = () => {
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

    const animateState = () => {
        if (mobile) {
            if (showEditor) {
                return "note"
            } else {
                return "menu"
            }
        } else {
            return "desktop"
        }
    }

    return (
        <div
            className="h-full w-full absolute bg-white dark:bg-slate-900 flex overflow-hidden"
        >
            <motion.div className="flex-grow md:relative grid grid-cols-[400px_auto] divide-x divide-slate-300 dark:divide-slate-600 shadow-lg shadow-slate-700/5" animate={animateState()} >
                <motion.div className="absolute w-full h-full md:relative md:w-auto md:h-auto left-0 top-0 " variants={noteMenuVariants} transition={{ x: { type: "just", duration: duration / 1000 } }}>
                    <NoteEditorControls id={noteID} mobile={mobile ? true : false} setNoteID={openNote} createNewNote={createNewNote} />
                </motion.div>
                <motion.div className="absolute overflow-auto flex flex-col w-full h-full md:relative md:w-auto md:h-auto left-0 top-0 bg-white dark:bg-slate-900 py-4 md:py-0" variants={noteMainVariants} transition={{ x: { type: "just", duration: duration / 1000 } }}  >
                    {mobile && <button className="mx-4 px-2 py-1 text-white rounded-md min-w-[80px] mb-2 bg-sky-600 self-start " onClick={closeNote}>Back</button>}
                    <div className="flex justify-center w-full flex-grow overflow-auto">
                        <div className="w-full max-w-5xl relative">
                            {noteToEdit && <NoteEditorMain
                                note={noteToEdit}
                                addTag={(t) => setNote({ ...noteToEdit, tags: [...noteToEdit.tags, t] })}
                                deleteNote={() => deleteNote(serialiseNote(noteToEdit))}
                                removeTag={(t) => setNote({ ...noteToEdit, tags: noteToEdit.tags.filter(tag => tag !== t) })}
                                saveNote={() => noteToEdit.id == -1 ? createNote(serialiseNote(noteToEdit)) : updateNote(serialiseNote(noteToEdit))}
                                setNote={setNote}
                            />}
                            {noteToEdit && noteID !== noteToEdit.id && (isLoading || isFetching) && (
                                <div className="absolute top-0 left-0 w-full h-full bg-white flex items-center justify-center">
                                    <MoonLoader loading={true} />
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    )
}

function serialise(content: Descendant[]) {
    return content.map(n => Node.string(n)).join('\n')
}


function areNotesEqual(note: InflatedNote, other: InflatedNote) {
    const areEqual = areSlateStatesEqual(note.title, other.title) && areSlateStatesEqual(note.content, other.content) && areArraysEqual(note.tags, other.tags)
    return areEqual
}

function areSlateStatesEqual(state1: Descendant[], state2: Descendant[]) {
    return serialise(state1) === serialise(state2)
}

function isBlankNote(note: InflatedNote) {
    return serialise(note.title).length === 0 && serialise(note.content).length === 0
}

const noteMenuVariants = {
    menu: {
        x: "0%"
    },
    note: {
        x: "-100%"
    },
    desktop: {
        x: "0%"
    }
}

const noteMainVariants = {
    menu: {
        x: "100%"
    },
    note: {
        x: "0%"
    },
    desktop: {
        x: "0%"
    }
}

export default NoteEditor;

