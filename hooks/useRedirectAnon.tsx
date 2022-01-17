import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

const useRedirectAnon = (url = "/") => {
    const session = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session.status == "unauthenticated") {
            router.push(url);
        }
    }, [session.status])
}

export default useRedirectAnon;