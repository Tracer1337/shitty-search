import React, { useEffect, useState } from "react"
import { Box } from "ink"
import { EventEmitter } from "events"
import PageIndexSize from "./PageIndexSize"
import StorageQueueSize from "./StorageQueueSize"
import WorkerTable from "./WorkerTable"
import RootState from "../state/RootState.java"
import Utils from "shared/dist/Utils.java"

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
        <Box flexDirection="column">
            <PageIndexSize state={state}/>
            <StorageQueueSize state={state}/>
            <WorkerTable state={state}/>
        </Box>
    )
}
