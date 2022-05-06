import { initBoard, mapHeight, mapWidth } from "./constants"
import { BORN, DEAD, LIVE, createBoard, iterate, Board } from "./game-of-life"
import { cellBorn, cellDie, cellLive } from "./world"

const setCell = (board: Board, x: number, y: number, state: number) => {
  if (state !== DEAD) {
    cellBorn(x, y)
  }
  board.cells[x][y] = state
}

const board = createBoard(mapWidth, mapHeight)

for (let y = 0; y < board.height; y++) {
  for (let x = 0; x < board.width; x++) {
    setCell(board, x, y, initBoard[x][y])
  }
}

const updateGame = () => {
  iterate(board, (lastState: number, newState: number, x: number, y: number) => {
    if (newState === DEAD && lastState !== DEAD) {
      // DELETE
      cellDie(x, y)
    } else if (lastState === DEAD && newState === BORN) {
      // SPAWN
      cellBorn(x, y)
    } else if (lastState === BORN && newState === LIVE) {
      // UPGRADE
      log("LIVE")

      cellLive(x, y)
    }
  })
}

let ticks: number = 0
let updateEachMs: number = 0.1
engine.addSystem({
  update: (dt: number) => {
    if (updateEachMs == 0.0) {
      updateGame()
    } else {
      ticks += dt
      if (ticks >= updateEachMs) {
        updateGame()
        ticks -= updateEachMs
      }
    }
  }
})