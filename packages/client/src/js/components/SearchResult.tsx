import React from "react"
import { API } from "../types"

export default function SearchResult({ pageIndex }: {
    pageIndex: API.PageIndex
}) {
    return (
        <div className="card p-3">
            <a href={pageIndex.url}>
                <h4>{decodeURIComponent(pageIndex.title)}</h4>
            </a>
            <a href={pageIndex.url}>{pageIndex.url}</a>
        </div>
    )
}
