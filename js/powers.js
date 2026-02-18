let isHintActive = false
let isSafeClickActive = false
let isSuperHintActive = false
let hints = 3
let safeClicks = 3
let exterminators = 1

function activateHintPowerUp() {
    if (hints <= 0) return

    isHintActive = !isHintActive
}

function hintPowerUp(pos = { i, j }, shouldReveal) {
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue

        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue

            if (shouldReveal) {
                document.querySelector(`.cell-${i}-${j}`).classList.remove("covered")
            } else {
                if (gBoard[i][j].isRevealed) continue

                document.querySelector(`.cell-${i}-${j}`).classList.add("covered")
            }
        }
    }

    if (shouldReveal) {
        setTimeout(() => hintPowerUp(pos, false), 1000)
        isHintActive = false
        hints--
        updateHintsCounter()
    }
}

function safeClickPowerUp() {
    if (isFirstClick) return
    if (isGameOver) return
    if (safeClicks <= 0) return

    // TODO: change to an array of safe cells
    let randomTile = pickRandomTile(gBoard)
    while (randomTile.isMine || randomTile.isRevealed) {
        randomTile = pickRandomTile(gBoard)
    }

    document.querySelector(`.cell-${randomTile.i}-${randomTile.j}`).classList.add("safe")
    safeClicks--
    updateSafeClickCounter()
}

function mineExterminatorPowerUp() {
    if (isFirstClick) return
    if (isGameOver) return

    const mines = findAllMines()
    for (let i = 0; i < 3; i++) {
        const mine = pickRandomMine(mines)
        gBoard[mine.i][mine.j].isMine = false
        setupTileNumbers()
        exterminators--
    }
}

// Undo and Redo logic
let lastMovesArray = []
let redoMovesArray = []

function addBoardToMovesList(board) {
    lastMovesArray.push(copyBoard(board))
    updateUndoButton()
    updateRedoButton()
}

function eraseMovesHistory() {
    lastMovesArray = []
    updateUndoButton()
    updateRedoButton()
}

function copyBoard(board) {
    const copiedBoard = []
    for (let i = 0; i < board.length; i++) {
        copiedBoard[i] = []
        for (let j = 0; j < board[0].length; j++) {
            copiedBoard[i][j] = { ...board[i][j] }
        }
    }

    return copiedBoard
}

function undoPowerUp() {
    if (!lastMovesArray.length) return

    redoMovesArray.push(copyBoard(gBoard))

    const lastMove = lastMovesArray.pop()

    renderUndoOrRedo(lastMove)

    updateUndoButton()
    updateRedoButton()
}

function redoPowerUp() {
    if (!redoMovesArray.length) return

    lastMovesArray.push(copyBoard(gBoard))

    const nextMove = redoMovesArray.pop()

    renderUndoOrRedo(nextMove)

    updateUndoButton()
    updateRedoButton()
}

function renderUndoOrRedo(move) {
    for (let i = 0; i < move.length; i++) {
        for (let j = 0; j < move[0].length; j++) {
            gBoard[i][j] = { ...move[i][j] }

            const elCell = document.querySelector(`.cell-${i}-${j}`)
            if (gBoard[i][j].isRevealed && !gBoard[i][j].isMine) {
                elCell.classList.remove("covered")
            } else {
                elCell.classList.add("covered")
            }
        }
    }
}

let superHintFirstPos = null
let superHintSecondPos = null

function setUpSuperHint(isFirstPos, pos) {
    if (isFirstClick) return

    if (!isSuperHintActive) {
        isSuperHintActive = true
        return
    }

    if (isFirstPos) {
        superHintFirstPos = pos
        console.log("first")
        return
    }

    if (!isFirstPos) {
        superHintSecondPos = pos
        console.log("second")
        superHintPowerUp()
    }
}

function superHintPowerUp() {
    let topLeft = {
        i: superHintFirstPos.i < superHintSecondPos.i ? superHintFirstPos.i : superHintSecondPos.i,
        j: superHintFirstPos.j < superHintSecondPos.j ? superHintFirstPos.j : superHintSecondPos.j,
    }
    let bottomRight = {
        i: superHintFirstPos.i > superHintSecondPos.i ? superHintFirstPos.i : superHintSecondPos.i,
        j: superHintFirstPos.j > superHintSecondPos.j ? superHintFirstPos.j : superHintSecondPos.j,
    }

    for (let i = topLeft.i; i <= bottomRight.i; i++) {
        for (let j = topLeft.j; j <= bottomRight.j; j++) {
            document.querySelector(`.cell-${i}-${j}`).classList.remove("covered")
        }
    }

    setTimeout(() => {
        for (let i = topLeft.i; i <= bottomRight.i; i++) {
            for (let j = topLeft.j; j <= bottomRight.j; j++) {
                // const currentItem = gBoard[i][j]
                if (!gBoard[i][j].isRevealed)
                    document.querySelector(`.cell-${i}-${j}`).classList.add("covered")
            }
        }
        superHintFirstPos = null
        superHintSecondPos = null
        isSuperHintActive = false
    }, 1500)
}
