import { Note, PrismaClient, User } from '@prisma/client';
import type { GetStaticProps, NextPage } from 'next'
import Link from 'next/dist/client/link';
import Head from 'next/head'
import Image from 'next/image'
import { useEffect } from 'react';
import styles from '../styles/Home.module.css'


type SerialisedNote = Pick<Note, "authorID" | "content" | "id" | "title"> & { createdAt: string, updatedAt: string };

export const getStaticProps: GetStaticProps = async () => {
  const prisma = new PrismaClient();

  const users = await prisma.user.findMany({
    include: {
      notes: true
    }
  });

  const notes = await prisma.note.findMany();

  return {
    props: {
      users,
      notes
    }
  }
}

type Props = {
  users: (User & { notes: Note[] })[]
  notes: Note[]
}

const Home: NextPage<Props> = ({ users, notes }) => {

  return (
    <div style={{ display: "flex", gap: "1rem", width: "100%", height: "100vh", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
      {users && users.map(u => {
        return (
          <div style={{ border: "1px solid black", padding: "1rem", width: "300px" }} key={u.id}>
            <p>Name: {u.name}</p>
            <p>Email: {u.email}</p>
            <div className='notes'>
              {u.notes.length > 0 && <h4>Notes</h4>}
              <ul>
                {u.notes && u.notes.map(n => <li key={n.id}><Link href={`/note/${n.id}`}>{n.title}</Link></li>)}
              </ul>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Home
