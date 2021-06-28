import React from "react"
import { API } from "../types"

const MAX_PAGES = 10

function PageItem({ children, onClick, active }: React.PropsWithChildren<{
    onClick?: () => void,
    active?: boolean
}>) {
    return (
        <li className={`page-item ${active ? "active" : ""}`}>
            <a className="page-link" href="#" onClick={onClick}>
                {children}
            </a>
        </li>
    )
}

export default function Pagination({ meta, onPageChange }: {
    meta: API.Paginated<any>["meta"],
    onPageChange: (page: number) => void
}) {
    let from = Math.floor(meta.currentPage / MAX_PAGES) * MAX_PAGES
    const to = Math.min(from + MAX_PAGES, meta.totalPages)
    from = from > 0 ? from - 2 : from
    const pages = to - from
    const remaining = meta.totalPages - to

    return (
        <ul className="pagination mb-0">
            {new Array(pages).fill(0).map((_, i) => {
                const page = from + i + 1
                return (
                    <PageItem
                        onClick={() => onPageChange(page)}
                        active={meta.currentPage === page}
                    >
                        {page}
                    </PageItem>
                )
            })}
            {remaining > 0 && (
                <>
                    <PageItem>...</PageItem>
                    <PageItem
                        onClick={() => onPageChange(meta.totalPages)}
                        active={meta.currentPage === meta.totalPages}
                    >
                        {meta.totalPages}
                    </PageItem>
                </>
            )}
        </ul>
    )
}
