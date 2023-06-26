import axios from "axios";
import { getSession, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { FormEvent, useEffect, useState } from "react";
import { Block } from "../components/Layout";
import Image from 'next/image'
import styles from "../styles/Account.module.css";
import { useDispatch } from "react-redux";
import { set } from "../redux/slices/titleSlice";
import { NextSeo } from 'next-seo'

const Account: React.FC = () => {
    const { data: session, status } = useSession();
    const [ name, setName ] = useState("")
    const [ file, setFile ] = useState<File | null>();
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(set("Account"));
    }, [])

    useEffect(() => {
        if (status == "unauthenticated") {
            signIn()
        }
    }, [session])

    useEffect(() => {
        if (file) {
            console.log(file)
        }
    }, [file])

    function handleUpload(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        const data = new FormData;
        if (!file) {
            return null;
        }

        data.append("profilePicture", file);
        axios.post("/api/user/upload/profile-picture", data).then(res => {
            console.log(res.data);
        })
    }

    if (!session) return <p>Loading...</p>
    return (
        <>
            <NextSeo title='Account' titleTemplate="NoteApp | %s" defaultTitle="Home" />
            <Block width="standard" backgroundColor="whitesmoke" >
                <div className={styles.account}>
                    <h1>Account</h1>
                    <div className={styles.user}>
                        <div className={styles.userImage}>
                            <div className={styles.imageContainer}>
                                <Image src={`${session.user.image}`} width={100} height={100} quality={50} objectFit="cover" />
                            </div>
                            <input type="file" onChange={(e) => e.target.files ? setFile(e.target.files[0]) : setFile(null)} />
                            <button onClick={handleUpload}>Upload</button>
                        </div>
                        <div>
                            <p><span style={{ opacity: 0.4 }}>Name:</span> {session.user?.name}</p>
                            <p><span style={{ opacity: 0.4 }}>Email:</span> {session.user?.email}</p>
                        </div>
                    </div>
                </div>
            </Block>
        </>
    )
}

export default Account;