import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { NextPage } from "next/types";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { PageBlock } from "../components/Layout/Layout";
import NoteEditor from "../components/NoteEditor/NoteEditor";
import { RootState } from "../redux/configureStore";
import "/node_modules/draft-js/dist/Draft.css";

const Notes: NextPage = () => {
    const { data, status } = useSession();

    if (status == "loading") {
        return <div>Loading...</div>
    } else if (status == "unauthenticated") {
        return (
            <PageBlock>
                <p>Please <span className="text-sky-700 font-semibold underline cursor-pointer" onClick={() => signIn()}>sign in</span> to create notes</p>
            </PageBlock>
        )
    }

    return (
        <div className="h-full flex-grow relative">
            <NoteEditor />
        </div>
    )
}

export default Notes;

