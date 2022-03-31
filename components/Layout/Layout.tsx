import { useSelector } from "react-redux";
import { RootState } from "../../redux/configureStore";
import Header from "../Header"

type Props = {
    width?: "standard" | "narrow",
    backgroundColor?: "primary" | "secondary" | string,
    color?: "white" | "black"
    noPadding?: boolean,
}

export const PageBlock: React.FC<Props> = ({ children, width = "standard", backgroundColor, color, noPadding }) => {

    return (
        <div className={noPadding ? "p-0" : "p-4"}>
            <div className="max-w-7xl mx-auto">
                {children}
            </div>
        </div>
    )

}

const Layout: React.FC = ({ children }) => {
    return (
        <div className="bg-slate-50 dark:bg-slate-900 min-h-screen flex flex-col">
            <Header links={[ { label: "Home", link: "/" } ]} />
            <main className="flex-grow flex flex-col">
                { children }
            </main>
        </div>
    )
}



export default Layout;