import { Editor } from "draft-js"
import { InflatedNote } from "../../redux/types"
import Button from "../Button/Button"
import styles from './styles/NoteEditorMain.module.css'

type RightColumnProps = {
    note: InflatedNote
    setNote: {(note: InflatedNote): void},
    save: {(): void}
}

const NoteEditorMain: React.FC<RightColumnProps> = ({ note, setNote, save }) => {
    return (
        <div className={styles.right}>
            <div className={styles.title}>
                <Editor editorState={note.title} onChange={(e) => setNote({ ...note, title: e })} placeholder="Title" />
            </div>
            <div className={styles.content}>
                <Editor editorState={note.content} onChange={(e) => setNote({ ...note, content: e })} placeholder="Content" />
            </div>
            <Button type="primary" handleClick={save}>Save</Button>
        </div>
    )
}

export default NoteEditorMain;