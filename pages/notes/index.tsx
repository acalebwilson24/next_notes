import { Note } from "@prisma/client";
import axios from "axios";
import Link from "next/dist/client/link";
import { useRouter } from "next/router";
import { NextPage } from "next/types"
import useSWR from "swr";
import Button from "../../components/Button";
import { Block } from "../../components/Layout";
import { useGetNotesQuery } from "../../redux/noteApi";
import fetcher from "../../swr/fetcher";

const NotesPage: NextPage = () => {
    const router = useRouter();

    const { data, isError } = useGetNotesQuery(undefined);
    const notes = data as Note[];

    async function createNote() {
        const note = await axios.post("/api/user/notes").then(res => res.data as Note);
        router.push(`/notes/${note.id}`);
    }

    return (
        <Block width="standard">
            <Button type="primary" handleClick={(e) => {e.preventDefault(); createNote()}}>+ New</Button>
            {isError ? <p>error</p> : notes ? <ul>{notes.map(n => <li key={n.id}><Link href={`/notes/${n.id}`}>{n.title}</Link></li>)}</ul> : <p>Loading...</p>}
        </Block>
    )
}

export default NotesPage;