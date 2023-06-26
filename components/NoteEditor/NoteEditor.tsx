import styles from "./styles/NoteEditor.module.css";
import NoteEditorControls from "./NoteEditorControls";
import NoteEditorMain from "./NoteEditorMain";
import useNoteEditor from "./hooks/useNoteEditor";

const NoteEditor: React.FC = () => {
    const { search, setSearch, isError, inflatedNotes, id, note, setNote, saveNote, deleteNote, areNotesLoading } = useNoteEditor();

    return (
        <div className={styles.notes}>
            <NoteEditorControls isLoading={areNotesLoading} search={search} setSearch={setSearch} isError={isError} inflatedNotes={inflatedNotes} id={typeof id == "string" ? id : null} />
            {note && <NoteEditorMain note={note} setNote={setNote} saveNote={saveNote} deleteNote={deleteNote} />}
        </div>
    )
}

export default NoteEditor;

