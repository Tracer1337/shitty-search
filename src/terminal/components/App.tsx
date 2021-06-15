import React, { useEffect, useState } from "react"
import { EventEmitter } from "events"
import WorkerTable from "./WorkerTable"
import RootState from "../state/RootState.java"
import Utils from "../Utils.java"

export default function App({ bridge, initialState }: {
    bridge: EventEmitter,
    initialState: RootState
}) {
    const [state, setState] = useState(initialState)

    useEffect(() => {
        return Utils.createListeners(bridge, [
            ["setState", setState]
        ])
    })

    return (
        <WorkerTable state={state}/>
    )
}
