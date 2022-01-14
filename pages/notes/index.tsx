import { Note } from "@prisma/client";
import { convertFromRaw, Editor, EditorState, RawDraftContentState, ContentState, convertToRaw } from "draft-js";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Button from "../../components/Button/Button";
import { Block } from "../../components/Layout/Layout";
import NoteCard, { InflatedNoteCard } from "../../components/Note/NoteCard";
import { SerialisedNote, useCreateNoteMutation, useGetNoteQuery, useGetNotesQuery, useUpdateNoteMutation } from "../../redux/noteApi";
import { InflatedNote } from "../../redux/types";
import styles from "../../styles/NewNotes.module.css";
import "/node_modules/draft-js/dist/Draft.css";

function createEditorStateFromString(state: string) {
    try {
        return EditorState.createWithContent(convertFromRaw(JSON.parse(state) as RawDraftContentState))
    } catch (error) {
        console.error(error);
    }
}

function convertEditorStateToString(state: EditorState) {
    return JSON.stringify(convertToRaw(state.getCurrentContent()));
}

function inflateNote(note: SerialisedNote) {
    let newNote: InflatedNote;
    try {
        newNote = {
            ...note,
            createdAt: new Date(note.createdAt),
            updatedAt: new Date(note.updatedAt),
            title: note.title ? createEditorStateFromString(note.title) || EditorState.createEmpty() : EditorState.createEmpty(),
            content: note.content ? createEditorStateFromString(note.content) || EditorState.createEmpty() : EditorState.createEmpty(),
        }
        return newNote;
    } catch (error) {
        console.error(error);
    }
}

function serialiseNote(note: InflatedNote) {
    let newNote = {
        ...note,
        title: convertEditorStateToString(note.title),
        content: convertEditorStateToString(note.content)
    } as Note
    return newNote;
}

function getDefaultInflatedNote() {
    return {
        id: -1,
        authorID: -1,
        createdAt: new Date(),
        updatedAt: new Date(),
        title: EditorState.createEmpty(),
        content: EditorState.createEmpty()
    } as InflatedNote
}

function isJSONStr(str: string) {
    try {
        JSON.parse(str);
    } catch (error) {
        return false
    }
    return true;
}

function inflateValidNotes(notes: SerialisedNote[]) {
    return notes.map(n => {
        if (n.title && isJSONStr(n.title)) {
            const inflatedNote = inflateNote(n);
            if (inflatedNote) return inflatedNote;
        }
        return n;
    })
}

const NewNotes: React.FC = () => {
    const session = useSession();
    const router = useRouter();
    const [search, setSearch] = useState("")
    const { data: notes, isLoading, isError } = useGetNotesQuery(undefined, { skip: !session.data?.user })
    const [ createNote, { isLoading: isCreating, isSuccess: isCreated, data: createdNote } ] = useCreateNoteMutation();
    const [ updateNote, { isLoading: isUpdating, isSuccess: isUpdated, data: updatedNote } ] = useUpdateNoteMutation();

    const { id } = router.query;
    const { data: serialisedNote, isError: isNoteError } = useGetNoteQuery(typeof id == "string" ? id : 0, { skip: !session.data?.user })

    // inflate note if present

    const [note, setNote] = useState<InflatedNote>();
    const [ inflatedNotes, setInflatedNotes ] = useState<(SerialisedNote | InflatedNote)[]>([])

    useEffect(() => {
        if (!id) {
            return setNote(getDefaultInflatedNote())
        }

        if (serialisedNote) {
            const inflatedNote = inflateNote(serialisedNote);
            if (inflatedNote) {
                setNote(inflatedNote)
            }
        }
    }, [serialisedNote, isLoading, id])

    useEffect(() => {
        if (notes) {
            setInflatedNotes(inflateValidNotes(notes));
        }
    }, [notes])

    useEffect(() => {
        if (session.status == "unauthenticated") {
            router.push("/");
        }
    }, [session.status])

    useEffect(() => {
        if (createdNote) {
            router.push(`${router.pathname}?id=${createdNote.id}`)
        }
    }, [createdNote])

    function save() {
        if (!note) {
            return
        }
        const noteToSave = serialiseNote(note);
        if (note.id == -1) {
            createNote(noteToSave);
        }
        updateNote(noteToSave);
    }

    return (
        <Block width="standard">
            <div className={styles.notes}>
                <div className={styles.left}>
                    <div className={styles.leftTop}>
                        <div className={styles.search}>
                            <label htmlFor="search">Search</label>
                            <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} id="search" />
                        </div>
                        <Link href="/notes">Create</Link>
                    </div>
                    <div className={styles.notesList}>
                        {
                            session.status == "loading" ?
                            <p>Loading user...</p> :
                            isError ?
                            <p>Error</p> :
                            inflatedNotes.length ?
                            <NoteList notes={inflatedNotes} pathname={router.pathname} selected={typeof id == "string" ? parseInt(id) : 0} /> :
                            <p>Loading notes...</p>
                        }
                    </div>
                </div>
                <div className={styles.right}>
                    <div className={styles.title}>
                        {note && <Editor editorState={note.title} onChange={(e) => setNote({ ...note, title: e })} placeholder="Title" />}
                    </div>
                    <div className={styles.content}>
                        {note && <Editor editorState={note.content} onChange={(e) => setNote({ ...note, content: e })} placeholder="Content" />}
                    </div>
                    <Button type="primary" handleClick={save}>Save</Button>
                </div>
            </div>
        </Block>
    )
}

type Props = {
    notes: (SerialisedNote | InflatedNote)[],
    pathname: string,
    selected?: number
}

const NoteList: React.FC<Props> = ({ notes, pathname, selected }) => {
    return (
        <>
            {notes.map(n => <Link key={n.id} href={`${pathname}?id=${n.id}`}><a><NoteListItem {...n} selected={n.id == selected} /></a></Link>) || null}
        </>
    ) 
}

const NoteListItem: React.FC<(SerialisedNote | InflatedNote) & { selected: boolean }> = (note) => {
    if (typeof note.title == "object") {
        return <InflatedNoteCard {...note as InflatedNote} selected={note.selected} />
    } else {
        return <NoteCard {...note as SerialisedNote} selected={note.selected} />
    }
}

export default NewNotes;