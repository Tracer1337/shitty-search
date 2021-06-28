import React from "react"

export default function ServerError() {
    return (
        <div className="d-flex flex-column align-items-center">
            <h2 className="text-center mb-3">Congratulations! You broke the server.</h2>
            <img src="assets/images/error.gif" alt="Error" />
        </div>
    )
}
