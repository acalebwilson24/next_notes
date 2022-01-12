import { PrismaClient, Note } from '@prisma/client';
import Link from 'next/dist/client/link';
import { useRouter } from 'next/router';
import { GetServerSideProps, GetStaticPaths, GetStaticProps, NextPage } from 'next/types';
import { ParsedUrlQuery } from 'querystring';
import Header from '../../../components/Header/Header';
import NoteComponent from '../../../components/Note/Note';
import prisma from '../../../prisma/client';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { id } = context.query

    if (!(typeof id == "string")) {
        return {
            props: {}
        }
    }

    const noteID = parseInt(id);
    if (!noteID) {
        return {
            props: {}
        }
    }

    const note = await prisma.note.findUnique({
        where: {
            id: noteID
        }
    })

    return {
        props: {
            note
        }
    }
}

type Props = {
    note: Note
}

const NotePage: NextPage<Props> = ({ note }) => {
    return (
        <div style={{ padding: "2rem 1rem" }}>
            <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                {note ? <NoteComponent {...note} /> : <p>No Note</p>}
            </div>
        </div>
    )
}

export default NotePage;