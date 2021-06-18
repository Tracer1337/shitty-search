import React from "react"
import { render } from "ink"
import { EventEmitter } from "events"
import App from "./components/App"
import WorkerState from "./state/WorkerState.java"
import RootState from "./state/RootState.java"
import PageIndexRepository from "../database/repositories/PageIndexRepository.java"

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

        this.startUpdateLoop()
    }

    private startUpdateLoop() {
        this.update().then(() => {
            setTimeout(this.startUpdateLoop.bind(this), TerminalUI.UPDATE_INTERVAL)
        })
    }

    private async update() {
        const indexSize = await PageIndexRepository.getIndexSize()
        this.setIndexSizeState(indexSize)
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

    public setIndexSizeState(indexSizeState: number) {
        const newState = this.state.clone()
        newState.indexSize = indexSizeState
        this.setState(newState)
    }
}