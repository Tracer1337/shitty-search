import React from "react"
import ReactDOM from "react-dom"
import config from "./config"
import { API } from "./types"
import SearchResultList from "./components/SearchResultList"
import LoadingAnimation from "./components/LoadingAnimation"
import ServerError from "./components/ServerError"

const queryInput = document.getElementById("input-query") as HTMLInputElement
const searchButton = document.getElementById("button-search") as HTMLButtonElement
const resultContainer = document.getElementById("results")

queryInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        queryInput.blur()
        search()
    }
})

searchButton.addEventListener("click", search)

function render<T extends React.FunctionComponent<any>>(
    component: T,
    props?: React.ComponentProps<T>
) {
    ReactDOM.render(React.createElement(component, props), resultContainer)
}

async function search() {
    const query = queryInput.value
    if (query.length === 0) {
        return
    }
    render(LoadingAnimation)
    try {
        const results = await getSearchResults(query)
        render(SearchResultList, { results })
    } catch {
        render(ServerError)
    }
}

async function getSearchResults(query: string) {
    const res = await fetch(`${config.API_ENDPOINT}/search?q=${query}`)
    return await res.json() as API.PageIndex[]
}
