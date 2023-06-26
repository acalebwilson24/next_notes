import { Note } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { SerialisedNote, useGetNoteQuery } from "../../redux/noteApi";
import { InflatedNote } from "../../redux/types";
import { inflateNote } from "../../utils/note";
import styles from "./Note.module.css";

export const NoteComponent: React.FC<InflatedNote> = ({ title, content }) => {
    return (
        <div className={styles.note}>
            <h3 className={styles.title}>{title.getCurrentContent().getPlainText()}</h3>
            <p>{content.getCurrentContent().getPlainText()}</p>
        </div>
    )
}

type NoteByIDProps = {
    id: string
}

export const NoteByID: React.FC<NoteByIDProps> = ({ id }) => {
    const { data: note, isLoading, isError } = useGetNoteQuery(id);
    const [inflatedNote, setInflatedNote] = useState<InflatedNote>();

    useEffect(() => {
        if (note) {
            setInflatedNote(inflateNote(note))
        }
    }, [note])

    return isError ? <p>Error</p> : inflatedNote ? <NoteComponent {...inflatedNote} /> : <p>Loading...</p>
}


export default NoteComponent;