import React from "react"
import ReactDOM from "react-dom"
import config from "./config"
import { API } from "./types"
import PaginatedSearchResult from "./components/PaginatedSearchResult"
import LoadingAnimation from "./components/LoadingAnimation"
import ServerError from "./components/ServerError"

const queryInput = document.getElementById("input-query") as HTMLInputElement
const searchButton = document.getElementById("button-search") as HTMLButtonElement
const renderContainer = document.getElementById("root")

queryInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        queryInput.blur()
        search()
    }
})

searchButton.addEventListener("click", () => search())

function render<T extends React.FunctionComponent<any>>(
    component: T,
    props?: React.ComponentProps<T>
) {
    ReactDOM.render(React.createElement(component, props), renderContainer)
}

async function search(page = 0) {
    const query = queryInput.value
    if (query.length === 0) {
        return
    }
    render(LoadingAnimation)
    try {
        const result = await getSearchResults(query, page)
        render(PaginatedSearchResult, {
            result,
            onPageChange: search
        })
    } catch {
        render(ServerError)
    }
}

async function getSearchResults(query: string, page: number) {
    const res = await fetch(`${config.API_ENDPOINT}/search?q=${query}&page=${page}`)
    return await res.json() as API.Paginated<API.PageIndex>
}
