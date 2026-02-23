let isDarkMode = true

function handleTimer() {
    const startTime = new Date()
    let elTimer = document.querySelector(".timer")
    gTimer = setInterval(() => {
        let elapsedTime = Date.now() - startTime
        elTimer.innerText = (elapsedTime / 1000).toFixed(0)
    }, 46)
}

function minesLeftCounter() {
    let elCounter = document.querySelector(".mines-left-counter")
    let totalFlags = 0
    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard[0].length; j++) {
            const currentItem = gBoard[i][j]
            if (currentItem.isFlagged) {
                totalFlags++
            }
        }
    }

    elCounter.innerText = numberOfMines - totalFlags
}

function changeSmiley(newState) {
    if (newState === gSmileyState) return
    const elSmiley = document.querySelector(".smiley-guy")

    if (newState === "playing") elSmiley.innerText = "😊"
    if (newState === "lose") elSmiley.innerText = "🤯"
    if (newState === "win") elSmiley.innerText = "😆"

    gSmileyState = newState
}

function updateLivesCounter() {
    let newLivesSTR = ""
    for (let i = 0; i < lives; i++) {
        newLivesSTR += "❤️"
    }
    document.querySelector(".lives").innerText = newLivesSTR
}
function updateHintsCounter() {
    let newHintsStr = ""
    for (let i = 0; i <= powers.hint.uses - 1; i++) {
        newHintsStr += "💡"
    }
    document.querySelector(".hints").innerText = newHintsStr
}
function updateSuperHintsCounter() {
    let newSuperHintsStr = ""
    for (let i = 0; i <= powers.superHint.uses - 1; i++) {
        newSuperHintsStr += "👑"
    }
    document.querySelector(".super-hint").innerText = newSuperHintsStr
}

function updateSafeClickCounter() {
    let newSafeClickStr = ""
    for (let i = 0; i < safeClicks; i++) {
        newSafeClickStr += "🔍"
    }
    document.querySelector(".safe-click").innerText = newSafeClickStr
}

function renderLeaderBoard() {
    let records = getFromLocalStorage()
    let recordsHtmlStr = ""

    if (!records) return
    records.forEach((record) => {
        recordsHtmlStr += `<div class="record">
                    NAME: <span class="highscore-name">${record.name}</span></br> TIME:
                    <span class="highscore-time">${record.time}</span>
                </div>`
    })

    document.querySelector(".leader-board-content").innerHTML = recordsHtmlStr
}

function toggleDarkMode() {
    if (isDarkMode) {
        document.querySelector("body").style.setProperty("--text-color", "black")
        document.querySelector("body").style.setProperty("--background-color", "white")
        document.querySelector(".dark-mode-toggle").innerText = "🌑"
        isDarkMode = false
    } else {
        document.querySelector("body").style.setProperty("--text-color", "white")
        document.querySelector("body").style.setProperty("--background-color", "black")
        document.querySelector(".dark-mode-toggle").innerText = "☀️"
        isDarkMode = true
    }
}

function updateUndoButton() {
    const undoButton = document.querySelector(".undo-button")
    if (lastMovesArray.length <= 0) {
        undoButton.disabled = true
    } else {
        undoButton.disabled = false
    }
}

function updateRedoButton() {
    const redoButton = document.querySelector(".redo-button")
    if (redoMovesArray.length <= 0) {
        redoButton.disabled = true
    } else {
        redoButton.disabled = false
    }
}

const powersSelectors = ["hints", "safe-click", "exterminator", "super-hint", "menaul-place-mode"]

function togglePowersHighlight() {
    Object.entries(powers).forEach((power) => {
        if (currentActivePower !== power[1].name) {
            document.querySelector(`.${power[1].name}`).classList.remove("highlight-power")
        }

        if (currentActivePower === null) return

        document.querySelector(`.${currentActivePower}`).classList.add("highlight-power")
    })
}

function hightlightSuperHint(pos) {
    if (currentActivePower !== powers.superHint.name) return
    if (!superHintFirstPos) return

    let topLeft = {
        i: superHintFirstPos.i < pos.i ? superHintFirstPos.i : pos.i,
        j: superHintFirstPos.j < pos.j ? superHintFirstPos.j : pos.j,
    }
    let bottomRight = {
        i: superHintFirstPos.i > pos.i ? superHintFirstPos.i : pos.i,
        j: superHintFirstPos.j > pos.j ? superHintFirstPos.j : pos.j,
    }

    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard[0].length; j++) {
            const currentItem = document.querySelector(`.cell-${i}-${j}`)
            currentItem.classList.remove("super-hint-highlight-preview")
        }
    }

    for (let i = topLeft.i; i <= bottomRight.i; i++) {
        for (let j = topLeft.j; j <= bottomRight.j; j++) {
            document.querySelector(`.cell-${i}-${j}`).classList.add("super-hint-highlight-preview")
        }
    }
}

function showSeedModal(ev) {
    if (ev.key === "s") {
        document.querySelector(".seed-modal-container").classList.toggle("hidden")
    }
}
