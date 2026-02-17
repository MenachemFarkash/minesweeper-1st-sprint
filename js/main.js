"use strict"

let SIZE = 12
let numberOfMines = 32
const MINE = "💣"
const COLORS = {
    1: "#0100f8",
    2: "#007e02",
    3: "#fc0003",
    4: "#00007f",
    5: "#7c0201",
    6: "#027e7d",
    7: "#000000",
    8: "#808080",
}
let isFirstClick = true
let isGameOver = false
let gTimer
let bombRevealTimeout
let gSmileyState = "playing"
let lives = 1
let gBoard

function onInit() {
    // Board
    renderLeaderBoard()
    gBoard = createBoard(SIZE)
    renderBoard()

    // Intervals
    clearInterval(gTimer)

    // Stats UI
    minesLeftCounter()
    changeSmiley("playing")
    resetStats()

    // Powers UI
    updateSafeClickCounter()
    updateHintsCounter()
    updateLivesCounter()

    // Global Booleans
    isGameOver = false
    isFirstClick = true
}

function createBoard(size) {
    const newBoard = []
    for (let i = 0; i < size; i++) {
        newBoard[i] = []
        for (let j = 0; j < size; j++) {
            newBoard[i].push({
                minesAround: 0,
                isRevealed: false,
                isMine: false,
                isFlagged: false,
                i,
                j,
            })
        }
    }

    return newBoard
}

function renderBoard() {
    let boardHtml = ""
    for (let i = 0; i < gBoard.length; i++) {
        boardHtml += "<tr>"
        for (let j = 0; j < gBoard[0].length; j++) {
            boardHtml += `
      <td class="cell cell-${i}-${j} covered" style="color:${COLORS[gBoard[i][j].minesAround]};" onclick="handleCellClick(this,${i},${j})" oncontextmenu="handleFlagTile(this, ${i},${j})">
      ${gBoard[i][j].isMine ? MINE : gBoard[i][j].minesAround > 0 ? gBoard[i][j].minesAround : ""}
      </td>`
        }
        boardHtml += "</tr>"
    }

    document.querySelector("tbody").innerHTML = boardHtml
}

function placeMines(count, pos) {
    for (let i = 0; i < count; i++) {
        let randomTile = pickRandomTile(gBoard)
        while (randomTile.isMine || (pos.i === randomTile.i && pos.j === randomTile.j)) {
            randomTile = pickRandomTile(gBoard)
        }
        gBoard[randomTile.i][randomTile.j].isMine = true
    }
}

function pickRandomTile(board) {
    let tile
    tile = gBoard[getRandomInt(0, board.length)][getRandomInt(0, board[0].length)]
    return tile
}

function setupTileNumbers() {
    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard[0].length; j++) {
            const currentItem = gBoard[i][j]
            if (currentItem.isMine) continue
            currentItem.minesAround = countMinesAround({ i, j })
            document.querySelector(`.cell-${i}-${j}`).innerText =
                currentItem.minesAround > 0 ? currentItem.minesAround : ""
        }
    }
}

function countMinesAround(pos) {
    let count = 0

    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue

        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue
            if (i === pos.i && j === pos.j) continue

            if (gBoard[i][j].isMine) count++
        }
    }

    return count
}

function handleCellClick(el, i, j) {
    if (isGameOver) return
    if (isFirstClick) {
        handleFirstClick({ i, j })
        handleTimer()
        //calling this since the el does not exist enymore
        document.querySelector(`.cell-${i}-${j}`).classList.remove("covered")
    }

    if (isHintActive) {
        hintPowerUp({ i, j }, true)
        return
    }

    if (gBoard[i][j].isMine) {
        el.classList.remove("covered")
        gBoard[i][j].isRevealed = true
        eraseMovesHistory()
        bombRevealTimeout = setTimeout(() => {
            document.querySelector(`.cell-${i}-${j}`).classList.add("covered")
            gBoard[i][j].isRevealed = false
        }, 1000)
        gameOver()
        return
    }

    addBoardToMovesList(gBoard)
    updateUndoButton()
    el.classList.remove("covered")
    gBoard[i][j].isRevealed = true

    revealeSafeNegTiles({ i, j })
    checkGameWon()
}

function handleFirstClick(pos) {
    placeMines(numberOfMines, { i: pos.i, j: pos.j })
    setupTileNumbers()
    isFirstClick = false
    renderBoard()
}

function handleFlagTile(el, i, j) {
    if (isGameOver) return
    if (gBoard[i][j].isFlagged === true) {
        el.classList.remove("flagged")
        gBoard[i][j].isFlagged = false
        minesLeftCounter()
        return
    }

    if (gBoard[i][j].isRevealed) return

    gBoard[i][j].isFlagged = true
    el.classList.add("flagged")
    minesLeftCounter()
    checkGameWon()
}

function gameOver() {
    // checking if lives is 1 so we can perform the last ui change and lose
    // if it was lives === 0 the player would have 4 lives
    if (lives === 1) {
        for (let i = 0; i < gBoard.length; i++) {
            for (let j = 0; j < gBoard[0].length; j++) {
                const currentCell = gBoard[i][j]
                if (currentCell.isMine) {
                    currentCell.isRevealed = true
                    document.querySelector(`.cell-${i}-${j}`).classList.remove("covered")
                }
            }
        }

        isGameOver = true
        changeSmiley("lose")
        clearInterval(gTimer)
        clearTimeout(bombRevealTimeout)
        lives--
        updateLivesCounter()
    } else {
        lives--
        updateLivesCounter()
    }
}

function checkGameWon() {
    let completedTilesCount = 0
    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard[0].length; j++) {
            const currentCell = gBoard[i][j]

            //if a mine is not flagged
            if (currentCell.isMine && !currentCell.isFlagged) {
                return
            }

            // if not all tiles are revealed
            if (!currentCell.isRevealed && !currentCell.isMine) {
                return
            }

            completedTilesCount++
            if (completedTilesCount === SIZE * SIZE) {
                clearInterval(gTimer)
                changeSmiley("win")
            }
        }
    }
}

function revealeSafeNegTiles(pos) {
    if (gBoard[pos.i][pos.j].isMine) return

    if (gBoard[pos.i][pos.j].minesAround === 0) {
        for (var i = pos.i - 1; i <= pos.i + 1; i++) {
            if (i < 0 || i >= gBoard.length) continue

            for (var j = pos.j - 1; j <= pos.j + 1; j++) {
                if (j < 0 || j >= gBoard[i].length) continue
                if (i === pos.i && j === pos.j) continue

                if (!gBoard[i][j].isMine && !gBoard[i][j].isRevealed) {
                    const elTile = document.querySelector(`.cell-${i}-${j}`)
                    elTile.classList.remove("covered")
                    gBoard[i][j].isRevealed = true
                    revealeSafeNegTiles({ i, j })
                }
            }
        }
    }
}

function resetStats() {
    if (SIZE === 4) {
        lives = 1
        hints = 1
        safeClicks = 1
    }
    if (SIZE === 8) {
        lives = 2
        hints = 2
        safeClicks = 2
    }
    if (SIZE === 12) {
        lives = 3
        hints = 3
        safeClicks = 3
    }

    updateSafeClickCounter()
    updateLivesCounter()
    updateHintsCounter()
}

function changeGameSize(newSize) {
    SIZE = newSize
    if (newSize === 4) {
        numberOfMines = 2
    }
    if (newSize === 8) {
        numberOfMines = 14
    }
    if (newSize === 12) {
        numberOfMines = 32
    }
    onInit()
}
