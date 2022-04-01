import NoteEditorControls from "./NoteEditorControls";
import NoteEditorMain from "./NoteEditorMain";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/configureStore";
import { useCreateNoteMutation, useDeleteNoteMutation, useGetNoteQuery, useUpdateNoteMutation } from "../../redux/noteApi";
import { InflatedNote } from "../../redux/types";
import { getDefaultInflatedNote, inflateNote, serialiseNote } from "../../utils/note";
import { motion } from "framer-motion";

const NoteEditor: React.FC<{ id?: number, isSuccess: { (id?: number): void }, isDeleted: { (): void } }> = ({ id, isSuccess, isDeleted }) => {
    const [noteID, setNoteID] = useState<number>()
    const [noteToEdit, setNote] = useState<InflatedNote>()
    const [showEditor, setShowEditor] = useState(false);
    const mobile = useSelector((state: RootState) => state.mobile);

    const { data: note } = useGetNoteQuery(noteID, { skip: !noteID })

    useEffect(() => {
        if (note && noteID) {
            setNote(inflateNote(note))
            setShowEditor(true);
        }
    }, [note, noteID])

    const [createNote] = useCreateNoteMutation();
    const [updateNote] = useUpdateNoteMutation();
    const [deleteNote] = useDeleteNoteMutation();

    const duration = mobile ? 200 : 0;

    const backToMenuMobile = () => {
        setNoteID(undefined);
        setShowEditor(false);
        setTimeout(() => {
            setNote(undefined);
        }, duration)
    }

    const createNewNote = () => {
        setNoteID(undefined);
        setNote(getDefaultInflatedNote());
        setShowEditor(true);
    }

    const animateState = () => {
        console.log(mobile, showEditor);
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

    console.log(noteToEdit);

    return (
        <div
            className="h-full w-full absolute bg-white dark:bg-slate-900 flex overflow-hidden"
        >
            <motion.div className="flex-grow md:relative grid grid-cols-[400px_auto] divide-x divide-slate-300 dark:divide-slate-600 shadow-lg shadow-slate-700/5" animate={animateState()} >
                <motion.div className="absolute w-full h-full md:relative md:w-auto md:h-auto left-0 top-0 " variants={noteMenuVariants} transition={{ x: { type: "just", duration: duration/1000 } }}>
                    <NoteEditorControls id={noteID} mobile={mobile ? true : false} setNoteID={setNoteID} createNewNote={createNewNote} />
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

