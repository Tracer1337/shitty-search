import React, { useEffect, useState } from "react"
import { Box } from "ink"
import { EventEmitter } from "events"
import IndexedPagesSize from "./IndexedPagesSize"
import CrawledPagesSize from "./CrawledPagesSize"
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
            <IndexedPagesSize state={state}/>
            <CrawledPagesSize state={state}/>
            <WorkerTable state={state}/>
        </Box>
    )
}
