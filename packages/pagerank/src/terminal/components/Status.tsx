import React from "react"
import { Box, Text } from "ink"
import RootState from "../state/RootState.java"

export default function Status({ state }: {
    state: RootState
}) {
    return (
        <Box>
            <Box width={20}>
                <Text>Status:</Text>
            </Box>
            <Box>
                <Text>{state.status}</Text>
            </Box>
        </Box>
    )
}
