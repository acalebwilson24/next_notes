import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { NextPage } from "next/types";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Block } from "../components/Layout/Layout";
import NoteEditor from "../components/NoteEditor/NoteEditor";
import { RootState } from "../redux/configureStore";
import "/node_modules/draft-js/dist/Draft.css";

const Notes: NextPage = () => {
    const router = useRouter();
    const { id, type } = router.query as { id?: string, type?: string };
    const mobile = useSelector((state: RootState) => state.mobile);
    const { data, status } = useSession();

    function isSuccess(id?: number) {
        if (id) {
            router.push("/?id=" + id);
        }
    }

    function isDeleted() {
        router.push("/");
    }

    if (status == "loading") {
        return <div>Loading...</div>
    } else if (status == "unauthenticated") {
        return (
            <Block>
                <p>Please <span className="text-sky-700 font-semibold underline cursor-pointer" onClick={() => signIn()}>sign in</span> to create notes</p>
            </Block>
        )
    }

    return (
        <Block noPadding={mobile ? true : false}>
            <NoteEditor id={id ? parseInt(id) : undefined} isSuccess={isSuccess} isDeleted={isDeleted} />
        </Block>
    )
}

export default Notes;

