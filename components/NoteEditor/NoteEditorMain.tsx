import { Editor, EditorState } from "draft-js"
import { SerialisedNote } from "../../redux/noteApi"
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
    // for verifying if an object is of a certain type, allows typescript to recognise
    // a type 
    function isInflatedNote(note: InflatedNote | SerialisedNote): note is InflatedNote {
        // perform a check which determines whether it is valid
        return typeof (note as InflatedNote).title == "object";
    }

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