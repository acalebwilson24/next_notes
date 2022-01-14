import { Note, PrismaClient, User } from '@prisma/client';
import type { GetServerSideProps, GetStaticProps, NextPage } from 'next'
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/dist/client/link';
import Head from 'next/head'
import Image from 'next/image'
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Header from '../components/Header';
import { Block } from '../components/Layout/Layout';
import prisma from '../prisma/client';
import { set } from '../redux/slices/titleSlice';
import styles from '../styles/Home.module.css'
import { NextSeo } from 'next-seo'


type SerialisedNote = Pick<Note, "authorID" | "content" | "id" | "title"> & { createdAt: string, updatedAt: string };

export const getStaticProps: GetStaticProps = async () => {

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

type LinkType = {
  label: string
  slug: string
};

const Home: NextPage<Props> = ({ users, notes }) => {

  const { data: session } = useSession();
  const dispatch = useDispatch();

  const linkTypes: LinkType[] = [
    {
      label: "Static",
      slug: "static"
    },
    {
      label: "Server Side",
      slug: "server-side"
    },
    {
      label: "Static With Client",
      slug: "static-with-client"
    },
    {
      label: "Client Side",
      slug: "client"
    }
  ]

  useEffect(() => {
    dispatch(set("Note App"));
  }, [])

  return (
    <>
      <NextSeo title='Home' />
      <Block width="standard">
        {session ?
          <>
            <p>Signed in as {session.user?.name}</p>
            <button onClick={() => signOut()}>Sign Out</button>
          </> :
          <button onClick={() => signIn()}>Sign In</button>
        }
      </Block>
      <Block width="standard">
        <div className={styles.home}>
          {users && users.map(u => {
            return (
              <div className={styles.userCard} key={u.id}>
                <p>Name: {u.name}</p>
                <p>Email: {u.email}</p>
                <div className='notes'>
                  {u.notes.length > 0 && <h4>Notes</h4>}
                  <ul>
                    {u.notes && u.notes.map(n => (
                      <li key={n.id}>
                        <h4>{n.title}</h4>
                        <ul>
                          {linkTypes.map(l => (
                            <li key={l.slug + l.label}>
                              <Link href={`/notes/${l.slug}/${n.id}`}>{l.label}</Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                    )
                    )}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>
      </Block>
    </>
  )
}

export default Home
