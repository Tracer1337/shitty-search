import React from "react"
import { API } from "../types"

function round(number: number) {
    return Math.floor(number * 100) / 100
}

export default function Performance({ meta }: {
    meta: API.PerformanceResponse<any>["meta"]
}) {
    const seconds = round(meta.duration / 1000)

    return (
        <>
            {meta.size} results in {seconds}s
        </>
    )
}
