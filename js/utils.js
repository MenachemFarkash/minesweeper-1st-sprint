function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min)
    const maxFloored = Math.floor(max)
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled)
}

function findAllMines() {
    const allMinesPoss = []
    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard[0].length; j++) {
            const currentCell = gBoard[i][j]
            if (currentCell.isMine) {
                allMinesPoss.push({ i, j })
            }
        }
    }
    return allMinesPoss
}

// function findAllSafeCells() {
//     const allMinesPoss = []
//     for (let i = 0; i < gBoard.length; i++) {
//         for (let j = 0; j < gBoard[0].length; j++) {
//             const currentCell = gBoard[i][j]
//             if (!currentCell.isMine || currentCell.isRevealed) {
//                 allMinesPoss.push({ i, j })
//             }
//         }
//     }
//     return allMinesPoss
// }

function pickRandomMine(minesArr = []) {
    return minesArr.splice(getRandomInt(0, minesArr.length), 1)[0]
}
