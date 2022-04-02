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

function areArraysEqual(array1: string[], array2: string[]) {
    if(array1.sort().join(',') === array2.sort().join(',')){
        return true
    }
    return false
}

// need to break up logic into custom hooks
const NoteEditor: React.FC<{ id?: number, isSuccess: { (id?: number): void }, isDeleted: { (): void } }> = ({ id, isSuccess, isDeleted }) => {
    const [noteID, _setNoteID] = useState<number>()
    const [noteToEdit, _setNote] = useState<InflatedNote>()
    const [originalNote, setOriginalNote] = useState<InflatedNote>();
    const [showEditor, setShowEditor] = useState(false);
    const mobile = useSelector((state: RootState) => state.mobile);

    const { data: note } = useGetNoteQuery(noteID, { skip: !noteID })

    // handles note selection
    useEffect(() => {
        if (note && noteID) {
            const inflatedNote = inflateNote(note);
            _setNote(inflatedNote)
            setOriginalNote(inflatedNote)
            setShowEditor(true);
        }
    }, [note, noteID])

    
    const [createNote, { isSuccess: noteCreated, data: newNote }] = useCreateNoteMutation();
    const [updateNote, { isLoading: isUpdating, isSuccess: isUpdated }] = useUpdateNoteMutation();
    const [deleteNote] = useDeleteNoteMutation();
    
    const duration = mobile ? 200 : 0;
    
    function serialise(content: Descendant[]) {
        return content.map(n => Node.string(n)).join('\n')
    }

    // automatic saving
    const [shouldSave, setShouldSave] = useState(false);
    const [shouldSaveTimeout, setShouldSaveTimeout] = useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (shouldSave) {
            setShouldSave(false);
            if (shouldSaveTimeout) {
                clearTimeout(shouldSaveTimeout);
            }
            noteToEdit && console.log(noteToEdit.tags);
            const timeout = setTimeout(() => {
                updateCurrentNote();
            }, 1000);
            setShouldSaveTimeout(timeout);
        }

        return () => {
            if (shouldSaveTimeout) {
                clearTimeout(shouldSaveTimeout)
            }
        }
    }, [shouldSave])

    function updateCurrentNote() {
        noteToEdit && updateNote(serialiseNote(noteToEdit));
    }
    
    // wrapper for _setNote with automatic saving
    const setNote = (note: InflatedNote | undefined) => {
        // update note
        _setNote(note);
        setShouldSave(true);
    }

    // wrapper for _setNoteID to ensure that the note is saved
    const setNoteID = (id: number | undefined) => {
        // need to check note has actually changed
        if (noteID && noteToEdit) {
            shouldSaveTimeout && clearTimeout(shouldSaveTimeout);
            const original = originalNote && serialiseNote(originalNote)
            const current = serialiseNote(noteToEdit)
            if (original?.title !== current.title || original?.content !== current.content || areArraysEqual(original?.tags, current.tags)) {
                noteToEdit && updateNote(serialiseNote(noteToEdit));
            }
        }
        _setNoteID(id);
    }

    const backToMenuMobile = () => {
        if (noteToEdit && serialise(noteToEdit.title).length == 0 && serialise(noteToEdit.content).length == 0) {
            deleteNote(serialiseNote(noteToEdit))
        } 
        setNoteID(undefined);
        setShowEditor(false);
        setTimeout(() => {
            _setNote(undefined);
        }, duration)
    }

    const createNewNote = () => {
        setNoteID(undefined);
        const newNote = {
            ...getDefaultInflatedNote()
        }
        createNote(serialiseNote(newNote));
        setShowEditor(true);
    }

    useEffect(() => {
        if (noteCreated && newNote) {
            setNoteID(newNote.id);
        }
    }, [noteCreated, newNote])

    const [savedTimeout, setSavedTimeout] = useState<NodeJS.Timeout | null>(null);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (isUpdated) {
            setSaved(true);
            if (savedTimeout) {
                clearTimeout(savedTimeout)
            }
            const newTimeout = setTimeout(() => {
                setSaved(false);
            }, 1000);
            setSavedTimeout(newTimeout);
        }
        return () => {
            if (savedTimeout) {
                clearTimeout(savedTimeout)
            }
        }
    }, [isUpdated])

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
                <motion.div className="absolute w-full h-full md:relative md:w-auto md:h-auto left-0 top-0 " variants={noteMenuVariants} transition={{ x: { type: "just", duration: duration/1000 } }}>
                    <NoteEditorControls id={noteID} mobile={mobile ? true : false} setNoteID={(id) => {
                        // save current note
                        // if (noteToEdit) {
                        //     updateNote(serialiseNote(noteToEdit))
                        // }
                        setNoteID(id);
                    }} createNewNote={createNewNote} />
                </motion.div>
                <motion.div className="absolute overflow-auto flex flex-col w-full h-full md:relative md:w-auto md:h-auto left-0 top-0 bg-white py-4 md:py-0" variants={noteMainVariants} transition={{ x: { type: "just", duration: duration/1000 } }}  >
                    {mobile && <button className="mx-4 px-2 py-1 text-white rounded-md min-w-[80px] mb-2 bg-sky-600 self-start " onClick={backToMenuMobile}>Back</button>}
                    <div className="flex justify-center w-full flex-grow overflow-auto">
                        <div className="w-full max-w-5xl">
                            {noteToEdit && <NoteEditorMain
                                note={noteToEdit}
                                addTag={(t) => setNote({ ...noteToEdit, tags: [...noteToEdit.tags, t] })}
                                deleteNote={() => deleteNote(serialiseNote(noteToEdit))}
                                removeTag={(t) => setNote({ ...noteToEdit, tags: noteToEdit.tags.filter(tag => tag !== t) })}
                                saveNote={() => noteToEdit.id == -1 ? createNote(serialiseNote(noteToEdit)) : updateNote(serialiseNote(noteToEdit))}
                                setNote={setNote}
                            />}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    )
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

