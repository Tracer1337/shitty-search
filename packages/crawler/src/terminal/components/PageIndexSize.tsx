import React from "react"
import { Box, Text } from "ink"
import RootState from "../state/RootState.java"

export default function PageIndexSize({ state }: {
    state: RootState
}) {
    return (
        <Box>
            <Box width={20}>
                <Text>Indexed Pages:</Text>
            </Box>
            <Box>
                <Text>{state.indexSize}</Text>
            </Box>
        </Box>
    )
}
