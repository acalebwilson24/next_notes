import { PrismaClient, Note } from '@prisma/client';
import Link from 'next/dist/client/link';
import { useRouter } from 'next/router';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next/types';
import { ParsedUrlQuery } from 'querystring';

interface IParams extends ParsedUrlQuery {
    id: string
}

export const getStaticPaths: GetStaticPaths = async () => {
    const prisma = new PrismaClient();
    const notes = await prisma.note.findMany({ select: { id: true } });



    return {
        paths: notes.map(n => ({ params: { id: n.id.toString() } })),
        fallback: true
    }
}

export const getStaticProps: GetStaticProps = async (context) => {
    const prisma = new PrismaClient();

    const { id } = context.params as IParams;
    const note = await prisma.note.findUnique({
        where: {
            id: parseInt(id)
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
        <>
            <Link href="/">Back</Link>
            <h1>{note.title}</h1>
            <p>{note.content}</p>
        </>
    )
}

export default NotePage;