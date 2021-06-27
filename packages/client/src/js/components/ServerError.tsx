import React from "react"

export default function ServerError() {
    return (
        <div className="centered">
            <h2 className="text">Congratulations! You broke the server.</h2>
            <img src="assets/images/error.gif" alt="Error" />
        </div>
    )
}
