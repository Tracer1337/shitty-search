import React from "react"
import { render } from "ink"
import { EventEmitter } from "events"
import App from "./components/App"
import WorkerState from "./state/WorkerState.java"
import RootState from "./state/RootState.java"

export default class TerminalUI {
    private bridge = new EventEmitter()
    private state = new RootState({
        workers: []
    })

    constructor() {
        render(React.createElement(App, {
            bridge: this.bridge,
            initialState: this.state
        }))
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
