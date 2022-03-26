import { Note } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/router";
import { GetServerSideProps, NextPage } from "next/types"
import { FormEvent, useEffect, useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import Button from "../../../components/Button";
import Form, { FormInput, FormSection, FormTextArea } from "../../../components/Form/Form";
import { Block } from "../../../components/Layout";
import { prisma } from "../../../prisma/client";
import { useDeleteNoteMutation, useUpdateNoteMutation } from "../../../redux/noteApi";

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { id } = context.query;
    if (!id || !(typeof id === "string")) {
        return {
            props: {}
        }
    }

    const note = await prisma.note.findUnique({ where: { id: parseInt(id) }})
    return {
        props: {
            note
        }
    }
}

type Props = {
    note: Note
}

const NotesPage: NextPage<Props> = ({ note }) => {
    const router = useRouter();
    const [ updatedNote, setUpdatedNote ] = useState(note);

    const [ updateNote, { data: newNote, isSuccess } ] = useUpdateNoteMutation()
    const [ deleteNote, { data: deletedNote, isSuccess: isDeleted}] = useDeleteNoteMutation();

    useEffect(() => {
        if (isSuccess || isDeleted) {
            router.push("/");
        }
    }, [isSuccess, isDeleted])

    return (
        <Block width="standard">
            <Form onSubmit={(e) => { e.preventDefault(); updateNote(updatedNote) }}>
                <FormSection>
                    <FormInput type="text" label="Title" id="title" value={updatedNote.title || ""} handleChange={(e) => setUpdatedNote({ ...updatedNote, title: e.target.value })} required />
                </FormSection>
                <FormSection>
                    <FormTextArea label="Content" id="content" value={updatedNote.content || ""} handleChange={(e) => setUpdatedNote({ ...updatedNote, content: e.target.value })} />
                </FormSection>
                <div style={{display: "flex", gap: "1rem"}}>
                    <Button type="primary">Save</Button>
                    <Button type="secondary" handleClick={(e) => {e.preventDefault(); deleteNote(note)}}>Delete</Button>
                </div>
            </Form>
        </Block>
    )
}

export default NotesPage;