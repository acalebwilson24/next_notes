import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/configureStore";
type LinkType = {
    label: string,
    link: string
}

type Props = {
    links: LinkType[]
}

const Header: React.FC<Props> = ({ links }) => {
    const { data: session } = useSession();
    const title = useSelector((state: RootState) => state.title);

    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>
            <div style={{ minHeight: "50px", backgroundColor: "rgb(71 131 127)", padding: "0.1rem 1rem", color: "white" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "0 auto", maxWidth: "1200px" }}>
                    <div style={{ margin: 0, fontSize: "1.5rem" }}><Link href="/">Note App</Link></div>
                    <ul style={{ listStyleType: "none", display: "flex", gap: "1rem" }}>
                        {links.map(l => <li key={l.link + l.label}><Link href={l.link}>{l.label}</Link></li>)}
                        { session ? 
                            <>
                                <li><Link href="/notes">Notes</Link></li>
                                <li><Link href="/account">Account</Link></li>
                                <li style={{cursor: "pointer"}} onClick={() => signOut()}>Sign Out</li>
                            </> :
                            <li style={{cursor: "pointer"}} onClick={() => signIn()}>Sign In</li>
                        }
                    </ul>
                </div>
            </div>
        </>
    )
}

export default Header;