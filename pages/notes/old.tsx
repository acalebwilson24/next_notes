import { Note } from "@prisma/client";
import axios from "axios";
import Link from "next/dist/client/link";
import { useRouter } from "next/router";
import { NextPage } from "next/types"
import Button from "../../components/Button/Button";
import { Block } from "../../components/Layout/Layout";
import { SerialisedNote, useCreateNoteMutation, useGetNotesQuery } from "../../redux/noteApi";
import { NextSeo } from 'next-seo'
import styles from "../../styles/Notes.module.css";

const NotesPage: NextPage = () => {
    const router = useRouter();
    const [createNote, { isLoading, isSuccess, data: newNote }] = useCreateNoteMutation()

    const { data, isError } = useGetNotesQuery(undefined);
    const notes = data as SerialisedNote[];

    if (isSuccess && newNote) {
        router.push(`/notes/${newNote.id}/edit`)
    }

    if (isSuccess) {
        // prevent flash of untitled showing
        return <p>Hello...</p>
    }

    return (
        <>
            <NextSeo title='Notes' />
            <Block width="narrow">
                <div className={styles.notes}>
                    <h1>Notes</h1>
                    <Button type="primary" handleClick={(e) => { e.preventDefault(); createNote(null) }}>+ New</Button>
                    {
                        isError ?
                            <p>error</p> :
                            notes ?
                                <ul className={styles.noteList}>
                                    {notes.map(n => <li key={n.id}><NoteCard {...n} /></li>)}
                                </ul> :
                                <p>Loading...</p>
                    }
                </div>
            </Block>
        </>
    )
}

const NoteCard: React.FC<SerialisedNote> = ({ title, content, id }) => {
    return (
        <div>
            <h3>{title}</h3>
            <p>{content}</p>
            <div style={{ display: "flex", gap: "1rem" }}>
                <Button type="primary"><Link href={`/notes/${id}`}>View</Link></Button>
                <Button type="secondary"><Link href={`/notes/${id}/edit`}>Edit</Link></Button>
            </div>
        </div>
    )
}

export default NotesPage;