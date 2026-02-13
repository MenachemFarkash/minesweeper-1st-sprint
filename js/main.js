"use strict"

console.log("hi from script")

let SIZE = 4
let numberOfMines = 2
const BOMB = "💣"
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

let gBoard
function onInit() {
    gBoard = createBoard(SIZE)
    placeMines(numberOfMines)
    setupTileNumbers()
    renderBoard()
}

function createBoard(size) {
    const newBoard = []
    for (let i = 0; i < size; i++) {
        newBoard[i] = []
        for (let j = 0; j < size; j++) {
            newBoard[i].push({ minesAround: 0, isRevealed: false, isMine: false, isFlagged: false, i, j })
        }
    }

    return newBoard
}

function renderBoard() {
    console.table(gBoard)
    let boardHtml = ""
    for (let i = 0; i < gBoard.length; i++) {
        boardHtml += "<tr>"
        for (let j = 0; j < gBoard[0].length; j++) {
            boardHtml += `
      <td class="cell cell-${i}-${j} covered" style="color:${COLORS[gBoard[i][j].minesAround]};" onclick="handleCellClick(this,${i},${j})" oncontextmenu="handleFlagTile(this, ${i},${j})">
      ${gBoard[i][j].isMine ? BOMB : gBoard[i][j].minesAround > 0 ? gBoard[i][j].minesAround : ""}
      </td>`
        }
        boardHtml += "</tr>"
    }

    document.querySelector("tbody").innerHTML = boardHtml
}

function placeMines(count) {
    for (let i = 0; i < count; i++) {
        let randomTile = pickRandomTile(gBoard)
        while (randomTile.isMine) {
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
            currentItem.minesAround = countBombsAround({ i, j })
        }
    }
}

function countBombsAround(pos) {
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
    el.classList.remove("covered")
    if (gBoard[i][j].isMine) gameOver()
}

function handleFlagTile(el, i, j) {
    console.log("flagging")
    el.classList.remove("covered")

    gBoard[i][j].isFlagged = true
    el.classList.add("flagged")
    el.innerText = "🚩"
}

function gameOver() {
    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard[0].length; j++) {
            const currentItem = gBoard[i][j]
            if (currentItem.isMine) {
                currentItem.isRevealed = true
                document.querySelector(`.cell-${i}-${j}`).classList.remove("covered")
            }
        }
    }
    console.log("the game is indeed over")
}

function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min)
    const maxFloored = Math.floor(max)
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled)
}
