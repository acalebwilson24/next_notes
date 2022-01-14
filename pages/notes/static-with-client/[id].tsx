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
    const isValidID = typeof id == "string";
    const { data: note, isLoading, isError } = useGetNoteQuery(isValidID ? id : 0, { skip: !isValidID });

    if (!isValidID) {
        router.push("/");
        return null
    }


    return (
        <div style={{ padding: "2rem 1rem" }}>
            <div style={{  maxWidth: "800px", margin: "0 auto" }}>
                {isError ? <p>Error</p> : note ? <NoteComponent {...note} /> : <p>Loading...</p>}
            </div>
        </div>
    )
}

export default NotePage;