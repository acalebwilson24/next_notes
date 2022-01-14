import { Note } from "@prisma/client";
import { Editor } from "draft-js";
import { SerialisedNote } from "../../redux/noteApi";
import { InflatedNote } from "../../redux/types";
import styles from "./NoteCard.module.css";

const NoteCard: React.FC<SerialisedNote & { selected?: boolean }> = ({ title, content, ...props }) => {
    const updatedAt = new Date(props.updatedAt);
    return (
        <div className={`${styles.noteCard} ${props.selected && styles.selected}`}>
            <h3>{title}</h3>
            <p>{content && content.length > 50 ? content?.slice(0, 50).trim() + "..." : content}</p>
            <p className={styles.updated}>
                Last updated: {updatedAt.toDateString()}
            </p>
        </div>
    )
}

export const InflatedNoteCard: React.FC<InflatedNote & { selected?: boolean }> = ({ title, content, updatedAt, ...props }) => {
    return (
        <div className={`${styles.noteCard} ${props.selected && styles.selected}`}>
            <h3>{title.getCurrentContent().getPlainText("\u0001")}</h3>
            <p>{content.getCurrentContent().getPlainText("\u00001").slice(0, 50).trim()}...</p>
            <p className={styles.updated}>
                Last updated: {updatedAt.toDateString()}
            </p>
        </div>
    )
}

export default NoteCard;