import { FC, useState, useRef, useEffect } from "react"
import { TagAPIResponse } from "../../redux/types"

type AutoCompleteProps = {
    suggestions: TagAPIResponse[]
    value: string
    onChange: { (value: string): void }
    placeholder?: string
    onSubmit: (value: string) => void
    isFetching?: boolean
}


// need to add keyboard select options
// return { name: string, count: number } from tags endpoint 
// to allow ordering suggestions by frequency
export const TagAutoComplete: FC<AutoCompleteProps> = ({ suggestions, placeholder, onChange, value, onSubmit, isFetching }) => {
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        window.addEventListener('click', handleClickOutside);
    })

    function handleClickOutside(e: MouseEvent) {
        if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
            setShowSuggestions(false);
        }
    }

    function handleEnter(e: React.KeyboardEvent<HTMLInputElement>) {
        // e.preventDefault();
        if (e.key == "Enter") {
            onSubmit(value);
        }
    }


    function handleSelectSuggestion(suggestion: string) {
        onChange(suggestion);
        setTimeout(() => {
            onSubmit(suggestion);
        }, 10)
        setShowSuggestions(false);
    }

    function handleEnterSuggestion(e: React.KeyboardEvent<HTMLElement>, value: string) {
        if (e.key == "Enter") {
            handleSelectSuggestion(value);
        }
    }

    return (
        <div className="relative w-full" ref={inputRef}>
            <input 
                type="text" 
                onClick={() => setShowSuggestions(true)} 
                onFocus={() => setShowSuggestions(true)} 
                value={value} 
                onKeyDown={handleEnter} 
                onChange={(e) => onChange(e.target.value)} 
                className="py-1 px-2 border-b outline-none dark:bg-slate-700 dark:border-slate-700 border-slate-300 w-full" 
                placeholder={placeholder} 
            />
            {
                showSuggestions && suggestions.length > 0 &&
                (
                    <ul className="absolute z-20 flex flex-col w-full border border-slate-300 divide-y divide-slate-300 bg-white dark:bg-slate-700 dark:divide-slate-600 dark:border-slate-600" >
                        {isFetching ? <li className="py-2 px-2">Loading tags...</li> : suggestions.map((s, i) => (
                            <li
                                tabIndex={0}
                                className=" py-2 px-2 cursor-pointer hover:bg-sky-50 dark:hover:bg-slate-600"
                                key={i}
                                onClick={() => handleSelectSuggestion(s.tag)}
                                onKeyDown={(e) => handleEnterSuggestion(e, s.tag)}
                            >{s.tag} - {s.count}</li>
                        ))}
                    </ul>
                )
            }
        </div>
    )
}

export default TagAutoComplete;