import { NextPage } from "next/types";
import React from "react";
import { Block } from "../../components/Layout/Layout";
import NoteEditor from "../../components/NoteEditor/NoteEditor";
import "/node_modules/draft-js/dist/Draft.css";

const Notes: NextPage = () => {

    return (
        <Block width="standard">
            <NoteEditor />
        </Block>
    )
}

export default Notes;

