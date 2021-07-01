import React from "react"
import { render } from "ink"
import { EventEmitter } from "events"
import PageIndexRepository from "shared/dist/database/repositories/PageIndexRepository.java"
import App from "./components/App"
import WorkerState from "./state/WorkerState.java"
import RootState from "./state/RootState.java"

export default class TerminalUI {
    private static readonly UPDATE_INTERVAL = 500
    private bridge = new EventEmitter()
    private state = new RootState({
        workers: []
    })

    constructor() {
        render(React.createElement(App, {
            bridge: this.bridge,
            initialState: this.state
        }))

        this.update()
    }

    private async update() {
        const indexedPages = await PageIndexRepository.getIndexSize()
        const crawledPages = await PageIndexRepository.getCrawledPagesSize()

        const newState = this.state.clone()
        newState.indexedPages = indexedPages
        newState.crawledPages = crawledPages
        this.setState(newState)

        setTimeout(this.update.bind(this), TerminalUI.UPDATE_INTERVAL)
    }

    private setState(state: RootState) {
        this.state = state
        this.bridge.emit("setState", state)
    }

    public setWorkerState(workerState: WorkerState[]) {
        const newState = this.state.clone()
        newState.workers = workerState
        this.setState(newState)
    }
}
