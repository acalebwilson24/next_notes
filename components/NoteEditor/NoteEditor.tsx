import NoteEditorControls from "./NoteEditorControls";
import NoteEditorMain from "./NoteEditorMain";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/configureStore";
import { useCreateNoteMutation, useDeleteNoteMutation, useGetNoteQuery, useUpdateNoteMutation } from "../../redux/noteApi";
import { InflatedNote } from "../../redux/types";
import { getDefaultInflatedNote, inflateNote, serialiseNote } from "../../utils/note";

const NoteEditor: React.FC<{ id?: number, isSuccess: { (id?: number): void }, isDeleted: { (): void } }> = ({ id, isSuccess, isDeleted }) => {
    const [ noteID, setNoteID ] = useState<number>()
    const [ noteToEdit, setNote ] = useState<InflatedNote>()

    const { data: note } = useGetNoteQuery(noteID, { skip: !noteID })

    useEffect(() => {
        if (note && noteID) {
            setNote(inflateNote(note))
        }
    }, [note, noteID])

    const [ createNote ] = useCreateNoteMutation();
    const [ updateNote ] = useUpdateNoteMutation();
    const [ deleteNote ] = useDeleteNoteMutation();

    return (
        <div className="h-full w-full grid grid-cols-[400px_auto] absolute bg-white dark:bg-slate-800 rounded-lg divide-x divide-slate-300 dark:divide-slate-600 shadow-lg shadow-slate-700/5 overflow-hidden">
            <div>
                <NoteEditorControls id={noteID} mobile={false} setNoteID={setNoteID} createNewNote={() => { setNoteID(undefined); setNote(getDefaultInflatedNote()); } } />
            </div>
            <div className="flex justify-center overflow-auto">
                <div className="w-full max-w-5xl">
                    {noteToEdit && <NoteEditorMain 
                                note={noteToEdit} 
                                addTag={(t) => setNote({ ...noteToEdit, tags: [...noteToEdit.tags, t]})} 
                                deleteNote={() => deleteNote(serialiseNote(noteToEdit))}
                                removeTag={(t) => setNote({ ...noteToEdit, tags: noteToEdit.tags.filter(tag => tag !== t)})}
                                saveNote={() => noteToEdit.id == -1 ? createNote(serialiseNote(noteToEdit)) : updateNote(serialiseNote(noteToEdit))}
                                setNote={setNote}
                            />}
                </div>
            </div>
        </div>
    )
}

export default NoteEditor;

