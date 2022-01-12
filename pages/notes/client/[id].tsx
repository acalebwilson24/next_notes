import axios from 'axios';
import { useRouter } from 'next/router';
import { NextPage } from 'next/types';
import useSWR from 'swr';
import Header from '../../../components/Header/Header';
import NoteComponent, { NoteByID } from '../../../components/Note/Note';


const NotePage: NextPage = () => {
    const { id } = useRouter().query;

    return (
        <div style={{ padding: "2rem 1rem" }}>
            <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                {typeof id == "string" && <NoteByID id={id} />}
            </div>
        </div>
    )
}

export default NotePage;