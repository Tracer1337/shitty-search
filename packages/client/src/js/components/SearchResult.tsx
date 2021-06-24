import React from "react"
import { API } from "../types"

export default function SearchResult({ pageIndex }: {
    pageIndex: API.PageIndex
}) {
    return (
        <div className="search-result-list-item">
            <a href={pageIndex.url}>{ pageIndex.url }</a>
        </div>
    )
}
