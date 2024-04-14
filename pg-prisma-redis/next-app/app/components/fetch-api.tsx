"use client"

import { useCallback, useState } from "react"

const initialState: { data: string | undefined, error: string | undefined } = { data: undefined, error: undefined }

const isSuccess = function (resp: Response) {
    return resp.status >= 200 && resp.status <= 299
}

export default function FetchApi({ route }: { route: string }) {
    const [state, setState] = useState(initialState)

    const clickHandler = useCallback(async () => {
        try {
            const resp = await fetch(route)
            if (isSuccess(resp)) {
                const { message } = await resp.json()
                setState({ data: message, error: undefined })
            }
            else throw new Error(resp.statusText)
        }
        catch (e) {
            setState({ data: undefined, error: (e as Error).message })
        }
    }, [])

    return <>
        <div className="pt-4 flex flex-row flex-wrap w-full">
            <div className="content-center">
                <p>Try fetch data from route: {route}</p>
            </div>
            <div className="">
                <button className="p-1 m-1 outline outline-1 rounded" id="fetch-public-data-btn" name="fetch-public-data" type="button" onClick={clickHandler}>
                    Fetch!
                </button>
            </div>
            {(state.data || state.error) && <div className="basis-full">
                Response:
                <pre>
                    {state.data ?? state.error}
                </pre>
            </div>}
        </div>
    </>
}