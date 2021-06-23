import config from "./config"

type PageIndex = {
    url: string
}

const queryInput = document.getElementById("input-query") as HTMLInputElement
const searchButton = document.getElementById("button-search") as HTMLButtonElement

searchButton.addEventListener("click", search)

async function search() {
    const query = queryInput.value

    if (query.length === 0) {
        return
    }

    const results = await getSearchResults(query)
}

async function getSearchResults(query: string) {
    const res = await fetch(`${config.API_ENDPOINT}/search?q=${query}`)
    return await res.json() as PageIndex[]
}
