import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { SerialisedNote } from "../../redux/noteApi";
import { InflatedNote } from "../../redux/types";
import NoteCard, { InflatedNoteCard } from "../Note/NoteCard";
import styles from './styles/NoteEditorControls.module.css';

type LeftColumnProps = {
    search: string
    setSearch: { (s: string): void }
    isError: boolean
    isLoading: boolean
    inflatedNotes: (SerialisedNote | InflatedNote)[]
    id?: string | null
}

const NoteEditorControls: React.FC<LeftColumnProps> = ({ search, setSearch, isError, inflatedNotes, id, isLoading }) => {
    const session = useSession();
    const router = useRouter();

    return <div className={styles.left}>
        <div className={styles.leftTop}>
            <div className={styles.search}>
                <label htmlFor="search">Search</label>
                <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} id="search" />
            </div>
            <Link href="/notes">Create</Link>
        </div>
        <div className={styles.notesList}>
            {
                session.status == "loading" ?
                <Message>Loading user...</Message> :
                isError ?
                <Message>Error</Message> :
                inflatedNotes.length ?
                <NoteList notes={inflatedNotes} pathname={router.pathname} selected={typeof id == "string" ? parseInt(id) : 0} /> :
                isLoading ?
                <Message>Loading notes...</Message> :
                <Message>No notes</Message>
            }
        </div>
    </div>;
}

export default NoteEditorControls;

const Message: React.FC = ({ children }) => <div className={styles.message}><p>{children}</p></div>

type Props = {
    notes: (SerialisedNote | InflatedNote)[],
    pathname: string,
    selected?: number
}

const NoteList: React.FC<Props> = ({ notes, pathname, selected }) => {
    return (
        <>
            {notes.map(n => <Link key={n.id} href={`${pathname}?id=${n.id}`}><a><NoteListItem {...n} selected={n.id == selected} /></a></Link>) || null}
        </>
    )
}

const NoteListItem: React.FC<(SerialisedNote | InflatedNote) & { selected: boolean }> = (note) => {
    if (typeof note.title == "object") {
        return <InflatedNoteCard {...note as InflatedNote} selected={note.selected} />
    } else {
        return <NoteCard {...note as SerialisedNote} selected={note.selected} />
    }
}