import React from "react"
import { API } from "../types"
import SearchResultList from "./SearchResultList"
import Pagination from "./Pagination"
import Performance from "./Performance"

export default function PaginatedSearchResult({ result, onPageChange }: {
    result: API.SearchResponse,
    onPageChange: (page: number) => void
}) {
    return (
        <>
            <div className="mb-4">
                <Performance meta={result.meta}/>
            </div>

            <div className="mb-4">
                <SearchResultList results={result.data.data}/>
            </div>

            <div className="mb-4 d-flex justify-content-center">
                <Pagination meta={result.data.meta} onPageChange={onPageChange}/>
            </div>
        </>
    )
}
