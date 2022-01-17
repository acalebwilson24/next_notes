import { Editor } from "draft-js"
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
    return (
        <div className={styles.right}>
            <div className={styles.title}>
                <Editor editorState={note.title} onChange={(e) => setNote({ ...note, title: e })} placeholder="Title" />
            </div>
            <div className={styles.content}>
                <Editor editorState={note.content} onChange={(e) => setNote({ ...note, content: e })} placeholder="Content" />
            </div>
            <div className={styles.buttons}>
                <Button type="primary" handleClick={saveNote}>Save</Button>
                <Button type="secondary" handleClick={deleteNote}>Delete</Button>
            </div>
        </div>
    )
}

export default NoteEditorMain;