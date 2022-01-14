import { PrismaClient, Note } from '@prisma/client';
import Link from 'next/dist/client/link';
import { useRouter } from 'next/router';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next/types';
import { ParsedUrlQuery } from 'querystring';
import Header from '../../../components/Header/Header';
import NoteComponent from '../../../components/Note/Note';
import prisma from '../../../prisma/client';
import { SerialisedNote } from '../../../redux/noteApi';
import { serialiseNoteFromDB } from '../../../utils/note';

interface IParams extends ParsedUrlQuery {
    id: string
}

export const getStaticPaths: GetStaticPaths = async () => {
    const notes = await prisma.note.findMany({ select: { id: true } });

    return {
        paths: notes.map(n => ({ params: { id: n.id.toString() } })),
        fallback: true
    }
}

export const getStaticProps: GetStaticProps = async (context) => {

    const { id } = context.params as IParams;
    const note = await prisma.note.findUnique({
        where: {
            id: parseInt(id)
        }
    })

    return {
        props: {
            note: note && serialiseNoteFromDB(note)
        }
    }
}

type Props = {
    note: SerialisedNote
}

const NotePage: NextPage<Props> = ({ note }) => {

    if (!note) {
        return <p>No Note</p>
    }

    return (
        <div style={{ padding: "2rem 1rem" }}>
            <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                <NoteComponent {...note} />
            </div>
        </div>
    )
}

export default NotePage;