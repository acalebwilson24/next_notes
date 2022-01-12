import { Note } from "@prisma/client";
import axios from "axios";
import useSWR from "swr";
import styles from "./Note.module.css";

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export const NoteComponent: React.FC<Note> = ({ title, content }) => {
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
    const { data, error } = useSWR(`/api/note/${id}`, fetcher);
    return error ? <p>Error</p> : data ? <NoteComponent {...data} /> : <p>Loading...</p>
}


export default NoteComponent;