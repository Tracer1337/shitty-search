import React from "react"
import { Box, Text } from "ink"
import RootState from "../state/RootState.java"

export default function Progress({ state }: {
    state: RootState
}) {
    return (
        <Box>
            <Box width={20}>
                <Text>Progress:</Text>
            </Box>
            <Box>
                <Text>{state.amountDone} / {state.amountTotal}</Text>
            </Box>
        </Box>
    )
}
