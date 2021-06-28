import React, { useEffect, useRef } from "react"
import anime from "animejs"
import { API } from "../types"
import SearchResult from "./SearchResult"

export default function SearchResultList({ results }: {
    results: API.PageIndex[]
}) {
    const listRef = useRef<HTMLDivElement>()

    useEffect(() => {
        if (!listRef.current) {
            return
        }

        listRef.current.style.display = "block"

        const items = listRef.current.querySelectorAll(
            "[data-item]"
        )

        anime({
            targets: items,
            opacity: [0, 1],
            translateY: [-16, 0],
            easing: "easeOutSine",
            duration: anime.stagger(50)
        })
    }, [results])

    return (
        <div ref={listRef} style={{ display: "none" }}>
            {results.map((pageIndex, i) => (
                <div
                    className={i === results.length - 1 ? "" : "mb-3"}
                    data-item
                    key={i}
                >
                    <SearchResult pageIndex={pageIndex} key={i}/>
                </div>
            ))}
        </div>
    )
}
