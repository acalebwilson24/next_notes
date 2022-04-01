import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/configureStore";
import { toggleDarkMode } from "../../redux/slices/darkModeSlice";
import Button from "../Button/Button";
import { motion } from 'framer-motion'
import { closeMenu, openMenu } from "../../redux/slices/menuSlice";
import { useEffect, useRef } from "react";
import { setHeaderHeight } from "../../redux/slices/headerSlice";

type LinkType = {
    label: string,
    link: string
}

type Props = {
    links: LinkType[]
}

const Header: React.FC<Props> = ({ links }) => {
    const { data: session } = useSession();
    const dispatch = useDispatch();
    const darkMode = useSelector((state: RootState) => state.darkMode);
    const mobile = useSelector((state: RootState) => state.mobile);
    const menu = useSelector((state: RootState) => state.menu);
    const headerHeight = useSelector((state: RootState) => state.header);

    const headerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (headerRef) {
            dispatch(setHeaderHeight(headerRef.current?.offsetHeight || 0));
            window.addEventListener("resize", handleResize);
            return () => {
                window.removeEventListener("resize", handleResize);
            }
        }
    }, [headerRef])

    function handleResize() {
        dispatch(setHeaderHeight(headerRef.current?.offsetHeight || 0));
    }

    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>
            <div ref={headerRef} className="bg-white px-4 py-4 shadow-lg shadow-slate-700/5 dark:bg-slate-800 fixed md:static w-full z-40">
                <div className="mx-auto flex justify-between">
                    <Link href="/" passHref><a className="block text-lg font-semibold">Note App</a></Link>
                    {mobile && <MenuButton open={() => dispatch(openMenu())} />}
                    <Menu show={menu} mobile={mobile || false}>
                        <button className="bg-sky-600 text-white py-1 px-3" onClick={() => dispatch(toggleDarkMode())} >{darkMode ? "Dark Mode" : "Light Mode"}</button>
                        <ul className="flex gap-4 md:flex-row flex-col text-right">
                            {links.map(l => <li key={l.link + l.label}><Link href={l.link}>{l.label}</Link></li>)}
                            {session ?
                                <>
                                    <li style={{ cursor: "pointer" }} onClick={() => signOut()}>Sign Out</li>
                                </> :
                                <li style={{ cursor: "pointer" }} onClick={() => signIn()}>Sign In</li>
                            }
                        </ul>
                        {mobile &&<button onClick={() => dispatch(closeMenu())}>Close</button>}
                    </Menu>
                </div>
            </div>
            {mobile && <div style={{ height: `${headerHeight}px` }} />}
        </>
    )
}

const Menu: React.FC<{ show: boolean, mobile: boolean }> = ({ show, mobile, children }) => {

    return (
        <motion.div
            className="
            md:flex md:gap-4 md:items-center md:static md:h-auto md:bg-inherit md:flex-row md:p-0 md:shadow-none md:dark:bg-inherit md:justify-end
            fixed top-0 right-0 h-screen bg-white z-50 flex flex-col gap-4 p-6 min-w-[250px] items-end shadow-lg shadow-slate-700/5 dark:bg-slate-800"

            initial={{ x: "100%" }}
            animate={show ? { x: 0 } : { x: mobile ? "100%" : "0" }}
            transition={{ ease: "easeOut", duration: 0.3 }}
        >
            {children}
        </motion.div>
    )
}

const MenuButton: React.FC<{ open: {(): void} }> = ({ open }) => {
    return <button onClick={open}>Menu</button>
}

export default Header;