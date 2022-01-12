import { useRouter } from "next/dist/client/router";
import { Block } from "../../../components/Layout/Layout";
import { useGetNoteQuery } from "../../../redux/noteApi";

const NotePage: React.FC = () => {
    const { id } = useRouter().query;
    const { data: note, isLoading, isError } = useGetNoteQuery((typeof id == "string") ? id : 0);

    if (isError) return <p>Error</p>
    if (!note || isLoading) {
        <p>Loading...</p>
    }

    return (
        <Block width="narrow">
            <h1>{note?.title}</h1>
            <p>{note?.content}</p>
        </Block>
    )
}

export default NotePage;