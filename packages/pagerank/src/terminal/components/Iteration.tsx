import React from "react"
import { Box, Text } from "ink"
import RootState from "../state/RootState.java"

export default function Iteration({ state }: {
    state: RootState
}) {
    return (
        <Box>
            <Box width={20}>
                <Text>Iteration:</Text>
            </Box>
            <Box>
                <Text>{state.iteration}</Text>
            </Box>
        </Box>
    )
}
