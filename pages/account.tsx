import axios from "axios";
import { getSession, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import Button from "../components/Button";
import Form, { FormInput, FormSection } from "../components/Form";
import { Block } from "../components/Layout";

const Account: React.FC = () => {
    const { data: session, status } = useSession();
    const [ name, setName ] = useState("")
    const router = useRouter();

    useEffect(() => {
        if (status == "unauthenticated") {
            signIn()
        }
    }, [session])

    if (!session) return <p>Loading...</p>
    return (
        <Block width="standard">
            <p>Name: {session.user?.name}</p>
            <p>Email: {session.user?.email}</p>
            <img src={`${session.user.image}`}></img>
        </Block>
    )
}

export default Account;