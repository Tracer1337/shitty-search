import config from "./config"
import { API } from "./types"

const output = document.getElementById("input-query") as HTMLInputElement

fetch(config.API_ENDPOINT + "/index-size")
    .then((res) => res.json())
    .then((res: API.IndexSizeResponse) => {
        output.placeholder = output.placeholder.replace("...", res.size.toString())
    })
