// ---------------------------------------------------------------------
// The rules
/*
  -  Any live cell with fewer than two live neighbours dies, as if caused by underpopulation.
  -  Any live cell with two or three live neighbours lives on to the next generation.
  -  Any live cell with more than three live neighbours dies, as if by overpopulation.
  -  Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.  
*/

export type Board = {
  cells: Array<Array<number>>
  width: number
  height: number
}
export const DEAD = 0
export const BORN = 1
export const LIVE = 2

const FEW = 2
const MANY = 3
const PLENTY = 3

const isLive = (c: number) => c !== DEAD
const isUnderPopulated = (n: number) => n < FEW
const isOverPopulated = (n: number) => n > MANY
const canReproduce = (n: number) => n === PLENTY
const willContinue = (n: number) => !isUnderPopulated(n) && !isOverPopulated(n)

const areWithinBounds = (board: Board, x: number, y: number): boolean => {
  return x >= 0 && y >= 0 && x < board.width && y < board.height
}

type Coord = { x: number; y: number }
const neighborCoordinates = (x: number, y: number): Coord[] =>
  [
    { x: x - 1, y: y - 1 },
    { x: x, y: y - 1 },
    { x: x + 1, y: y - 1 },
    { x: x - 1, y: y },
    { x: x + 1, y: y },
    { x: x - 1, y: y + 1 },
    { x: x, y: y + 1 },
    { x: x + 1, y: y + 1 },
  ]

/*const neighborInBound = (board: Board, x: number, y: number) => {
  return neighborCoordinates(x, y).filter((coord) => areWithinBounds(board, coord.x, coord.y))
}*/

const neighborMirror = (board: Board, x: number, y: number) => {
  return neighborCoordinates(x, y).map((coord) => {
    if (coord.x < 0) {
      coord.x += board.width
    } else if (coord.x >= board.width) {
      coord.x -= board.width
    }

    if (coord.y < 0) {
      coord.y += board.height
    } else if (coord.y >= board.height) {
      coord.y -= board.height
    }
    if (!areWithinBounds(board, coord.x, coord.y)) {
      log(`BAAAD ${JSON.stringify(coord)}`)
    }
    return coord
  })
}

const countNeightboards = (board: Board, x: number, y: number) => {
  const coords = neighborMirror(board, x, y)
  return coords.filter((coord: Coord) => board.cells[coord.x][coord.y] !== DEAD)
    .length
}

// Given a live neighbor count and a cell, calculate the cell's next state.
const getNextGenerationState = (neighbours: number, state: number): number => {
  if (isLive(state)) {
    if (isUnderPopulated(neighbours)) {
      return DEAD
    } else if (isOverPopulated(neighbours)) {
      return DEAD
    } else if (willContinue(neighbours)) {
      return LIVE // from BORN to LIVE
    }
  } else if (canReproduce(neighbours)) {
    return BORN
  }

  return DEAD
}

export function create2DArray<T>(width: number, height: number, defaultValue: T): Array<Array<T>> {
  const array = new Array<Array<T>>(width)
  for (let x = 0; x < width; x++) {
    array[x] = new Array<T>(height)
    for (let y = 0; y < height; y++) {
      array[x][y] = defaultValue
    }
  }
  return array
}

export const createBoard = (width: number, height: number) => {
  // es5 way
  const board: Board = { cells: create2DArray(width, height, 0), width, height }

  for (let x = 0; x < width; x++) {
    board.cells[x] = new Array<number>(height)
    for (let y = 0; y < height; y++) {
      board.cells[x][y] = 0
    }
  }

  return board
}

export const iterate = (board: Board, onChange: (lastState: number, newState: number, x: number, y: number) => void) => {
  const newCells: Array<Array<number>> = create2DArray(board.width, board.height, 0)
  for (let y = 0; y < board.height; y++) {
    for (let x = 0; x < board.width; x++) {
      const neightboards = countNeightboards(board, x, y)
      const newValue = getNextGenerationState(neightboards, board.cells[x][y])

      if (board.cells[x][y] !== newValue) {
        onChange(board.cells[x][y], newValue, x, y)
      }

      newCells[x][y] = newValue
    }
  }

  board.cells = newCells
}