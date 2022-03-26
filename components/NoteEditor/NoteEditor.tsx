import styles from "./styles/NoteEditor.module.css";
import NoteEditorControls from "./NoteEditorControls";
import NoteEditorMain from "./NoteEditorMain";
import useNoteEditor from "./hooks/useNoteEditor";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/configureStore";
import Link from "next/link";
import Button from "../Button/Button";
import { useRouter } from "next/router";

const NoteEditor: React.FC<{ id?: number, isSuccess: { (id?: number): void }, isDeleted: { (): void } }> = ({ id, isSuccess, isDeleted }) => {
    const { createdNote, isDeleted: noteDeleted, note, ...noteActions } = useNoteEditor(id);
    const mobile = useSelector((state: RootState) => state.mobile);
    const router = useRouter();

    useEffect(() => {
        if (createdNote) {
            isSuccess(createdNote.id);
        }
    }, [createdNote])

    useEffect(() => {
        if (noteDeleted) {
            isDeleted();
        }
    }, [noteDeleted]);

    useEffect(() => {
        if (mobile === null) {
            return
        }
        if (!mobile && !id && !note) {
            noteActions.createNewNote();
        }
    }, [mobile, note, id])

    if (mobile) {
        if (id || note) {
            return (
                <>
                    <div className="p-4 pb-0">
                        <Button handleClick={(e) => {
                            router.push("/");
                            // works but a bit weird
                            setTimeout(() => {
                                noteActions.clearNote();
                            }, 10)
                        }}>Back</Button>
                    </div>
                    {note && <NoteEditorMain note={note} {...noteActions} />}
                </>
            )
        } else {
            return (
                <div className="h-full">
                    <NoteEditorControls {...noteActions} id={id} mobile={true} />
                </div>
            )
        }
    }

    return (
        <div className="max-h-[700px] bg-white dark:bg-slate-800 rounded-lg grid grid-cols-12 divide-x divide-slate-300 dark:divide-slate-600 shadow-lg shadow-slate-700/5 overflow-hidden">
            <div className="col-span-3 h-full">
                <NoteEditorControls {...noteActions} id={id} mobile={false} />
            </div>
            <div className="col-span-9">
                {note && <NoteEditorMain note={note} {...noteActions} />}
            </div>
        </div>
    )
}

export default NoteEditor;

