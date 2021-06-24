import React from "react"
import ReactDOM from "react-dom"
import config from "./config"
import { API } from "./types"
import SearchResultList from "./components/SearchResultList"

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

async function search() {
    const query = queryInput.value
    if (query.length === 0) {
        return
    }
    const results = await getSearchResults(query)
    ReactDOM.render(
        React.createElement(SearchResultList, { results }),
        resultContainer
    )
}

async function getSearchResults(query: string) {
    const res = await fetch(`${config.API_ENDPOINT}/search?q=${query}`)
    return await res.json() as API.PageIndex[]
}
