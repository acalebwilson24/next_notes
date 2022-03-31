import { useState, useEffect } from "react";

function useDelaySearch(setSearch: (s: string) => void, delay = 150) {
    const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | undefined>(undefined);
    const [searchValue, setSearchValue] = useState<string>("");

    useEffect(() => {
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        setSearchTimeout(setTimeout(() => {
            setSearch(searchValue);
        }, delay));

        return () => {
            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }
        }
    }, [searchValue]);

    return { searchValue, setSearchValue };
}

export default useDelaySearch;