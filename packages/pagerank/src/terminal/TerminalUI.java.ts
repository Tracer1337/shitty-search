import React from "react"
import { render } from "ink"
import { EventEmitter } from "events"
import App from "./components/App"
import RootState from "./state/RootState.java"

export default class TerminalUI {
    private static readonly UPDATE_INTERVAL = 500
    private bridge = new EventEmitter()
    private state = new RootState({})

    constructor() {
        render(React.createElement(App, {
            bridge: this.bridge,
            initialState: this.state
        }))

        this.update()
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

    public setAmountDoneState(amountDoneState: number) {
        const state = this.state.clone()
        state.amountDone = amountDoneState
        this.setState(state)
    }

    public setAmountTotalState(amountTotalState: number) {
        const state = this.state.clone()
        state.amountTotal = amountTotalState
        this.setState(state)
    }
}
