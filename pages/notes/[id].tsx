import { Note } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/router";
import { GetServerSideProps, NextPage } from "next/types"
import { FormEvent, useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import Button from "../../components/Button";
import Form, { FormInput, FormSection, FormTextArea } from "../../components/Form/Form";
import { Block } from "../../components/Layout";
import prisma from "../../prisma/client";
import fetcher from "../../swr/fetcher";

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
    const { mutate } = useSWRConfig();

    async function save(e: FormEvent) {
        e.preventDefault();
        const result = await axios.put("/api/user/notes", updatedNote).then(res => res.data);
        mutate("/api/notes");
        router.push("/notes");
        console.log(result);
    }

    return (
        <Block width="standard">
            <Form onSubmit={save}>
                <FormSection>
                    <FormInput type="text" label="Title" id="title" value={updatedNote.title || ""} handleChange={(e) => setUpdatedNote({ ...updatedNote, title: e.target.value })} required />
                </FormSection>
                <FormSection>
                    <FormTextArea label="Content" id="content" value={updatedNote.content || ""} handleChange={(e) => setUpdatedNote({ ...updatedNote, content: e.target.value })} />
                </FormSection>
                <Button type="primary">Save</Button>
            </Form>
        </Block>
    )
}

export default NotesPage;