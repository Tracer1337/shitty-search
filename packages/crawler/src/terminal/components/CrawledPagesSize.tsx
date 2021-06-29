import React from "react"
import { Box, Text } from "ink"
import RootState from "../state/RootState.java"

export default function CrawledPagesSize({ state }: {
    state: RootState
}) {
    return (
        <Box>
            <Box width={20}>
                <Text>Crawled Pages:</Text>
            </Box>
            <Box>
                <Text>{state.crawledPages}</Text>
            </Box>
        </Box>
    )
}
