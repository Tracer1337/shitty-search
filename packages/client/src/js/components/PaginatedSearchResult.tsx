import React from "react"
import { API } from "../types"
import SearchResultList from "./SearchResultList"
import Pagination from "./Pagination"

export default function PaginatedSearchResult({ result, onPageChange }: {
    result: API.Paginated<API.PageIndex>,
    onPageChange: (page: number) => void
}) {
    return (
        <>
            <div className="mb-4">
                <SearchResultList results={result.items}/>
            </div>

            <div className="mb-4 d-flex justify-content-center">
                <Pagination meta={result.meta} onPageChange={onPageChange}/>
            </div>
        </>
    )
}
