
import { useRouter } from 'next/router';
import { NextPage } from 'next/types';
import { useEffect } from 'react';
import NoteComponent from '../../../components/Note/Note';
import { useGetNoteQuery } from '../../../redux/noteApi';
import { inflateNote } from '../../../utils/note';



const NotePage: NextPage = () => {
    const router = useRouter()
    const { id } = router.query;
    const isValidID = typeof id == "string";
    const { data: note, isLoading, isError } = useGetNoteQuery(isValidID ? id : 0, { skip: !isValidID });

    
    useEffect(() => {
        if (!isValidID) {
            router.push("/");
        }
    }, [isValidID])


    return (
        <div style={{ padding: "2rem 1rem" }}>
            <div style={{  maxWidth: "800px", margin: "0 auto" }}>
                {isError ? <p>Error</p> : note ? <NoteComponent {...inflateNote(note)} /> : <p>Loading...</p>}
            </div>
        </div>
    )
}

export default NotePage;