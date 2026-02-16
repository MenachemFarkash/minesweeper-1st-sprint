let isHintActive = false
let hints = 1

function activateHintPowerUp() {
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
