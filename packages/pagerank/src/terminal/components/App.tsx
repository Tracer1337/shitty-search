import React, { useEffect, useState } from "react"
import { Box } from "ink"
import { EventEmitter } from "events"
import Utils from "shared/dist/Utils.java"
import RootState from "../state/RootState.java"
import Iteration from "./Iteration"
import Progress from "./Progress"

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
            <Iteration state={state}/>
            <Progress state={state}/>
        </Box>
    )
}
