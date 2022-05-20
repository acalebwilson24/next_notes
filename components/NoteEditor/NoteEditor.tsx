import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import MoonLoader from 'react-spinners/MoonLoader';
import { RootState } from "../../redux/configureStore";
import { serialiseNote } from "../../utils/note";
import useNoteEditor from "./hooks/useNoteEditor";
import NoteEditorControls from "./NoteEditorControls";
import NoteEditorMain from "./NoteEditorMain";

const NoteEditor: React.FC = () => {
    const { showEditor, noteID, openNote, createBlankNote, closeNote, noteToEdit, setNote, deleteNote, updateNote, isLoading, isFetching } = useNoteEditor()
    const mobile = useSelector((state: RootState) => state.mobile);
    const duration = mobile ? 200 : 0;

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
                    <NoteEditorControls id={noteID} mobile={mobile ? true : false} openNote={openNote} createBlankNote={createBlankNote} />
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
                                saveNote={() => updateNote(serialiseNote(noteToEdit))}
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

