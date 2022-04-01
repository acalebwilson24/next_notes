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
        <div className="bg-slate-50 dark:bg-slate-900 fixed top-0 left-0 w-full h-full flex flex-col">
            <Header links={[ ]} />
            <main className="flex-grow flex flex-col">
                { children }
            </main>
        </div>
    )
}



export default Layout;