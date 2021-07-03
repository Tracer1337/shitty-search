import React from "react"
import { render, Instance } from "ink"
import { EventEmitter } from "events"
import App from "./components/App"
import RootState from "./state/RootState.java"

export default class TerminalUI {
    private static readonly UPDATE_INTERVAL = 500
    private bridge = new EventEmitter()
    private state = new RootState({})
    private instance: Instance

    constructor() {
        this.instance = render(React.createElement(App, {
            bridge: this.bridge,
            initialState: this.state
        }))

        this.update()
    }

    public destroy() {
        this.instance.unmount()
    }

    private async update() {
        const newState = this.state.clone()
        this.setState(newState)

        setTimeout(this.update.bind(this), TerminalUI.UPDATE_INTERVAL)
    }

    private setState(state: RootState) {
        this.state = state
        this.bridge.emit("setState", state)
    }

    public setIterationState(iterationState: number) {
        const state = this.state.clone()
        state.iteration = iterationState
        this.setState(state)
    }

    public setTargetIterationsState(targetIterationsState: number) {
        const state = this.state.clone()
        state.targetIterations = targetIterationsState
        this.setState(state)
    }
    
    public setStatusState(statusState: RootState["status"]) {
        const state = this.state.clone()
        state.status = statusState
        this.setState(state)
    }
}
