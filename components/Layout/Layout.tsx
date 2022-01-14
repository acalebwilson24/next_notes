import Header from "../Header"

type Props = {
    width: "standard" | "narrow",
    backgroundColor?: "primary" | "secondary" | string,
    color?: "white" | "black"
}

export const Block: React.FC<Props> = ({ children, width, backgroundColor, color }) => {
    let background = "";
    switch (backgroundColor) {
        case "primary":
            background = "rgb(71 131 127)";
            break;
        case "secondary":
            background = "whitesmoke";
            break;
        default: 
            background = backgroundColor || ""; 
    }

    return (
        <div style={{ padding: "2rem 1rem", backgroundColor: background, color: color ? color : "black" }}>
            <div style={
                {  
                    maxWidth: width == "standard" ? "1200px" : "800px", 
                    margin: "0 auto", 
                    display: "flex", 
                    flexDirection: "column",
                }}>
                {children}
            </div>
        </div>
    )

}

const Layout: React.FC = ({ children }) => (
    <div style={{ backgroundColor: "whitesmoke", minHeight: "100vh" }}>
        <Header links={[ { label: "Home", link: "/" } ]} />
        { children }
    </div>
)

export default Layout;