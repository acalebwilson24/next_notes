import { Note } from "@prisma/client";
import axios from "axios";
import Link from "next/dist/client/link";
import { useRouter } from "next/router";
import { NextPage } from "next/types"
import useSWR from "swr";
import Button from "../../components/Button";
import { Block } from "../../components/Layout";
import { useCreateNoteMutation, useGetNotesQuery } from "../../redux/noteApi";
import fetcher from "../../swr/fetcher";

const NotesPage: NextPage = () => {
    const router = useRouter();
    const [createNote, { isLoading, isSuccess, data: newNote }] = useCreateNoteMutation()

    const { data, isError } = useGetNotesQuery(undefined);
    const notes = data as Note[];

    if (isSuccess && newNote) {
        router.push(`/notes/${newNote.id}`)
    }

    if (isSuccess) {
        // prevent flash of untitled showing
        return <p>Hello...</p>
    }

    return (
        <Block width="standard">
            <Button type="primary" handleClick={(e) => { e.preventDefault(); createNote("") }}>+ New</Button>
            {
                isError ?
                    <p>error</p> :
                    notes ?
                        <ul>
                            {notes.map(n => <NoteCard key={n.id} {...n} />)}
                        </ul> :
                        <p>Loading...</p>
            }
        </Block>
    )
}

const NoteCard: React.FC<Note> = ({ title, content, id }) => {
    return (
        <div>
            <h3>{title}</h3>
            <div style={{display: "flex", gap: "1rem"}}>
                <Button type="primary"><Link href={`/notes/${id}`}>View</Link></Button>
                <Button type="secondary"><Link href={`/notes/${id}/edit`}>Edit</Link></Button>
            </div>
        </div>
    )
}

export default NotesPage;