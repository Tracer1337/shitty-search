import React from "react"
import { Box, Text } from "ink"
import RootState from "../state/RootState.java"

export default function WorkerTable({ state }: {
    state: RootState
}) {
    return (
        <Box flexDirection="column">
            {state.workers.map((worker, i) => (
                <Box key={i}>
                    <Box width={20}>
                        <Text>{worker.id}:</Text>
                    </Box>
                    <Box>
                        <Text>{worker.tasks}</Text>
                    </Box>
                </Box>
            ))}
        </Box>
    )
}
