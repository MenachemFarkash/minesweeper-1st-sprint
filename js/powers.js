let isHintActive = false
let isSafeClickActive = false
let hints = 3
let safeClicks = 3
let exterminators = 1

function activateHintPowerUp() {
    if (hints <= 0) return

    isHintActive = !isHintActive
}

function hintPowerUp(pos = { i, j }, shouldReveal = true) {
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
