import { useSelector } from "react-redux";
import { RootState } from "../../redux/configureStore";
import Header from "../Header"

type Props = {
    width?: "standard" | "narrow",
    backgroundColor?: "primary" | "secondary" | string,
    color?: "white" | "black"
    noPadding?: boolean,
}

export const Block: React.FC<Props> = ({ children, width = "standard", backgroundColor, color, noPadding }) => {

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
        <div className="bg-slate-50 dark:bg-slate-900 min-h-screen">
            <Header links={[ { label: "Home", link: "/" } ]} />
            { children }
        </div>
    )
}

export const ScrollView: React.FC = ({ children }) => {
    return (
        <div className="h-full relative" >
            <div className="top-0 left-0 w-full h-full absolute overflow-y-auto">
                {children}
            </div>
        </div>
    )
}



export default Layout;