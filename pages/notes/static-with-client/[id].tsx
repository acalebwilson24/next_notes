import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import Router, { useRouter } from 'next/router';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next/types';
import useSWR from 'swr';
import NoteComponent, { NoteByID } from '../../../components/Note/Note';
import { useGetNoteQuery } from '../../../redux/noteApi';



const NotePage: NextPage = () => {
    const router = useRouter()
    const { id } = router.query;

    if (!(typeof id == "string")) {
        router.push("/");
        return null
    }

    const { data: note, isLoading, isError } = useGetNoteQuery(id);

    return (
        <div style={{ padding: "2rem 1rem" }}>
            <div style={{  maxWidth: "800px", margin: "0 auto" }}>
                {isError ? <p>Error</p> : note ? <NoteComponent {...note} /> : <p>Loading...</p>}
            </div>
        </div>
    )
}

export default NotePage;