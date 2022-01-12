import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/router';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next/types';
import useSWR from 'swr';
import NoteComponent, { NoteByID } from '../../../components/Note/Note';
import fetcher from "../../../swr/fetcher"



const NotePage: NextPage = () => {
    const { id } = useRouter().query;
    console.log(id);
    const { data, error } = useSWR(`/api/note/${id}`, fetcher, {
        isPaused: () => id ? false : true
    })

    return (
        <div style={{ padding: "2rem 1rem" }}>
            <div style={{  maxWidth: "800px", margin: "0 auto" }}>
                {error ? <p>Error</p> : data ? <NoteComponent {...data} /> : <p>Loading...</p>}
            </div>
        </div>
    )
}

export default NotePage;