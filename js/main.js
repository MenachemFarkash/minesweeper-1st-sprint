"use strict"

console.log("hi from script")

let SIZE = 4
let numberOfMines = 2
const BOMB = "💣"
const COLORS = { 1: "#0100f8", 2: "#007e02" }

let gBoard = createBoard(SIZE)
placeMines(numberOfMines)
setupTileNumbers()
renderBoard()

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
      <td class="cell cell-${i}-${j}" style="color:${COLORS[gBoard[i][j].minesAround]};">
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

function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min)
  const maxFloored = Math.floor(max)
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled)
}
