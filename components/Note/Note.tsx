import { Note } from "@prisma/client";
import axios from "axios";
import useSWR from "swr";
import { SerialisedNote, useGetNoteQuery } from "../../redux/noteApi";
import styles from "./Note.module.css";

export const NoteComponent: React.FC<SerialisedNote> = ({ title, content }) => {
    return (
        <div className={styles.note}>
            <h3 className={styles.title}>{title}</h3>
            <p>{content}</p>
        </div>
    )
}

type NoteByIDProps = {
    id: string
}

export const NoteByID: React.FC<NoteByIDProps> = ({ id }) => {
    const { data: note, isLoading, isError } = useGetNoteQuery(id);
    return isError ? <p>Error</p> : note ? <NoteComponent {...note} /> : <p>Loading...</p>
}


export default NoteComponent;