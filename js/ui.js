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
    for (let i = 0; i < hints; i++) {
        newHintsStr += "💡"
    }
    document.querySelector(".hints").innerText = newHintsStr
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
