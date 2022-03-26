import { Editor } from "draft-js"
import { useRef } from "react"
import { useSelector } from "react-redux"
import { RootState } from "../../redux/configureStore"
import { InflatedNote } from "../../redux/types"
import Button from "../Button/Button"
import styles from './styles/NoteEditorMain.module.css'

type RightColumnProps = {
    note: InflatedNote
    setNote: {(note: InflatedNote): void}
    saveNote: {(): void}
    deleteNote: {(): void}
}

const NoteEditorMain: React.FC<RightColumnProps> = ({ note, setNote, saveNote, deleteNote }) => {
    const buttonsRef = useRef<HTMLDivElement | null>(null);
    const mobile = useSelector((state: RootState) => state.mobile);

    return (
        <div className="flex flex-col md:min-h-[700px] p-4 pt-0 md:pt-4">
            <div className={styles.title}>
                <Editor editorState={note.title} onChange={(e) => setNote({ ...note, title: e })} placeholder="Title" />
            </div>
            <div className={styles.content}>
                <Editor editorState={note.content} onChange={(e) => setNote({ ...note, content: e })} placeholder="Content" />
            </div>
            <div className="flex gap-4 fixed bottom-0 w-full mb-4 z-10 md:static md:mt-auto" ref={buttonsRef}>
                <Button type="primary" handleClick={(e) => { e.preventDefault(); saveNote(); }}>Save</Button>
                <Button type="secondary" handleClick={deleteNote}>Delete</Button>
            </div>
            {mobile && buttonsRef.current && <div style={{ height: buttonsRef.current.offsetHeight }} />}
        </div>
    )
}

export default NoteEditorMain;