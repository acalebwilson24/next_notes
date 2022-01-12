import Header from "../Header"

type Props = {
    width: "standard" | "narrow"
}

export const Block: React.FC<Props> = ({ children, width }) => (
    <div style={{ padding: "2rem 1rem" }}>
        <div style={{  maxWidth: width == "standard" ? "1200px" : "800px", margin: "0 auto" }}>
            {children}
        </div>
    </div>
)

const Layout: React.FC = ({ children }) => (
    <>
        <Header links={[ { label: "Home", link: "/" } ]} />
        { children }
    </>
)

export default Layout;