console.log("hi from menual mines placing mode")

let isManualPlaceModeActive = false
let wasMinesManuallyPlaced = false

function prepareBoardForPlacing() {
    if (!isFirstClick) return
    isManualPlaceModeActive = !isManualPlaceModeActive
    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard[0].length; j++) {
            const currentItem = document.querySelector(`.cell-${i}-${j}`)
            if (isManualPlaceModeActive) {
                currentItem.classList.remove("covered")
            } else {
                currentItem.classList.add("covered")
            }
        }
    }
}

function placeMine(pos = { i, j }) {
    wasMinesManuallyPlaced = true
    gBoard[pos.i][pos.j].isMine = true

    const currentItem = document.querySelector(`.cell-${pos.i}-${pos.j}`)
    currentItem.innerText = MINE

    setupCellNumbers()
}
