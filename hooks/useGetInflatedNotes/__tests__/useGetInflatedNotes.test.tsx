import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { renderHook } from '@testing-library/react-hooks'
import "@testing-library/jest-dom";
import useGetInflatedNotes from "../useGetInflatedNotes";
import fetch from 'jest-fetch-mock';
import { Provider } from "react-redux";
import { store } from "../../../redux/configureStore";

describe("useGetInflatedNotes", () => {
    beforeEach(() => {
        fetch.resetMocks();
        fetch.mockIf(() => true, async (req) => {
            console.log(req.url);
            if (req.url.includes("/api/note")) {
                return {
                    body: JSON.stringify([
                        {
                            id: "1",
                            title: `{"blocks":[{"key":"2ldfl","text":"Hello","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}`,
                            content: `{"blocks":[{"key":"en2n8","text":"there mate","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}`,
                            tags: [],
                            createdAt: new Date(),
                            updatedAt: new Date()
                        },
                        {
                            id: "2",
                            title: `{"blocks":[{"key":"7dare","text":"Hello There","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}`,
                            content: `{"blocks":[{"key":"ckk6p","text":"mate a roodle do de","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}`,
                            tags: [],
                            createdAt: new Date(),
                            updatedAt: new Date()
                        }
                    ])
                }
            } else {
                return {
                    body: JSON.stringify({}),
                }
            }
        });
    })
    it("fetches data", async () => {
        const { result } = renderHook(() => useGetInflatedNotes(1), {
            wrapper: ({ children }) => <Provider store={store}>{children}</Provider>
        });
        await waitFor(() => {
            expect(result.current.inflatedNotes.length).toBe(2);
        })
    })
})