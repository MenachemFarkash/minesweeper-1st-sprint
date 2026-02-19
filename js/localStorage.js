function setupUserName() {
    let inputContent = document.querySelector(".player-name-input").value
    localStorage.setItem("playerName", inputContent)
    document.querySelector(".player-name-modal-container").classList.add("hidden")
}

function checkForPlayerName() {
    return localStorage.getItem("playerName") ? true : false
}

function uploadToLocalStorage(name, time) {
    let oldRecords = JSON.parse(localStorage.getItem("records"))
    if (!oldRecords) {
        oldRecords = []
    }

    oldRecords.push({ name, time })
    localStorage.setItem("records", JSON.stringify(oldRecords))
}

function getFromLocalStorage() {
    let recievedRecords = JSON.parse(localStorage.getItem("records"))
    return recievedRecords
}
