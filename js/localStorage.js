const user = { name: "manechem", time: 5 }
const records = []

function uploadToLocalStorage(name, time) {
    let oldRecords = JSON.parse(localStorage.getItem("records"))
    oldRecords.push({ name, time })
    localStorage.setItem("records", JSON.stringify(oldRecords))
}

function getFromLocalStorage() {
    let recievedRecords = JSON.parse(localStorage.getItem("records"))
    return recievedRecords
}
