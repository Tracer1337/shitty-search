import React from "react"
import { Box, Text } from "ink"
import RootState from "../state/RootState.java"

export default function StorageQueueSize({ state }: {
    state: RootState
}) {
    return (
        <Box>
            <Box width={20}>
                <Text>Storage Queue:</Text>
            </Box>
            <Box>
                <Text>{state.storageQueueSize}</Text>
            </Box>
        </Box>
    )
}
